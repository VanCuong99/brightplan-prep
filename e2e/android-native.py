#!/usr/bin/env python3
"""Bounded native Android smoke checks. Requires a running authorized AVD and Expo Go."""
import argparse
import hashlib
import struct
import json
import os
import re
import subprocess
import time
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--serial', default=os.environ.get('ANDROID_SERIAL', 'emulator-5554'))
parser.add_argument('--metro-url', default='http://localhost:8083')
parser.add_argument('--output', default='native-test-results/android-native')
args = parser.parse_args()
adb_binary = os.environ.get('ADB', 'adb')
output = Path(args.output)
output.mkdir(parents=True, exist_ok=True)
results = []
source_files = ['apps/mobile/App.tsx', 'apps/mobile/index.ts', 'shared/directory.ts',
                'apps/mobile/package.json', 'apps/mobile/app.json',
                'apps/mobile/metro.config.js', 'package.json', 'package-lock.json',
                'e2e/android-native.py']
source_hashes = {name: hashlib.sha256(Path(name).read_bytes()).hexdigest()
                 for name in source_files}
source_base = subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
(output/'results.json').write_text(json.dumps({'status':'RUNNING',
    'source_base':source_base, 'source_hashes':source_hashes},indent=2)+'\n')
original_settings = {}
payload = None
build_marker = 'native-scroll-v1'
launch_url = 'exp://127.0.0.1:8083'


def adb(*parts, binary=False):
    result = subprocess.run([adb_binary, '-s', args.serial, *parts], check=True,
                            capture_output=True, timeout=30)
    return result.stdout if binary else result.stdout.decode().strip()


def hierarchy():
    adb('shell', 'uiautomator', 'dump', '--compressed', '/sdcard/brightplan-native-test.xml')
    return ET.fromstring(adb('exec-out', 'cat', '/sdcard/brightplan-native-test.xml'))


def has_text(tree, value):
    return any(value == node.get('text') or value == node.get('content-desc')
               for node in tree.iter('node'))


def wait_text(value, expected=True):
    deadline = time.monotonic() + 18
    while True:
        tree = hierarchy()
        if has_text(tree, value) == expected:
            return tree
        if time.monotonic() >= deadline:
            raise AssertionError(f'Expected text {value!r} present={expected}')
        time.sleep(.4)


def tap_label(label):
    tree = hierarchy()
    nodes = [node for node in tree.iter('node') if node.get('content-desc') == label]
    if not nodes:
        nodes = [node for node in tree.iter('node') if node.get('text') == label]
    if not nodes:
        raise AssertionError(f'Control not visible: {label}')
    x1, y1, x2, y2 = map(int, re.findall(r'\d+', nodes[0].get('bounds', '')))
    adb('shell', 'input', 'tap', str((x1+x2)//2), str((y1+y2)//2))


def keyboard_visible():
    state = adb('shell', 'dumpsys', 'input_method')
    # System-server visibility is authoritative; the IME service may retain its view.
    current = re.search(r'\bmInputShown\s*[=:]\s*(true|false)', state)
    if current:
        return current.group(1) == 'true'
    raise RuntimeError('Current system input visibility is unavailable')


def screenshot(name):
    data = adb('exec-out', 'screencap', '-p', binary=True)
    if not data.startswith(b'\x89PNG\r\n\x1a\n'):
        raise AssertionError('Native screencap did not return PNG')
    (output/name).write_bytes(data)


def record(name, expected, observed, image):
    results.append({'check':name, 'expected':expected, 'observed':observed,
                    'status':'PASS', 'image':image})
    print('PASS: '+name, flush=True)


def swipe(direction):
    pixels = adb('exec-out', 'screencap', '-p', binary=True)
    width, height = struct.unpack('>II', pixels[16:24])
    x = str(width//2)
    bottom, top = str(int(height*.80)), str(int(height*.40))
    start, end = (bottom, top) if direction == 'up' else (top, bottom)
    adb('shell','input','swipe',x,start,x,end,'400')


def scroll_until(value, direction='up'):
    for attempt in range(7):
        tree = hierarchy()
        if has_text(tree, value):
            return tree
        if attempt < 6:
            swipe(direction)
    raise AssertionError(f'Could not reach {value!r} by bounded native scrolling')


def set_setting(name, value):
    if name not in original_settings:
        original_settings[name] = adb('shell','settings','get','system',name)
    adb('shell','settings','put','system',name,value)


try:
    if adb('shell', 'getprop', 'ro.kernel.qemu') != '1':
        raise RuntimeError('This smoke command is scoped to the explicitly selected emulator.')
    if urllib.request.urlopen(args.metro_url.rstrip('/')+'/status', timeout=10).read() != b'packager-status:running':
        raise RuntimeError('Expected the existing Brightplan Metro server on port 8083')
    adb('reverse', 'tcp:8083', 'tcp:8083')
    adb('shell','am','force-stop','host.exp.exponent')
    adb('shell','am','start','-a','android.intent.action.VIEW','-d',launch_url,'host.exp.exponent')
    time.sleep(3)
    runtime_label = None
    for attempt in range(9):
        tree = hierarchy()
        runtime_label = next((node.get('text') for node in tree.iter('node')
                              if build_marker in node.get('text','')), None)
        if runtime_label:
            break
        swipe('up')
    if not runtime_label or 'Runtime: android' not in runtime_label:
        raise AssertionError('Current native source marker was not observed after project launch')
    platform = {'sdk':adb('shell','getprop','ro.build.version.sdk'),
                'release':adb('shell','getprop','ro.build.version.release'),
                'abi':adb('shell','getprop','ro.product.cpu.abi'),
                'model':adb('shell','getprop','ro.product.model'),
                'screen':adb('shell','wm','size'), 'density':adb('shell','wm','density')}
    if keyboard_visible():
        adb('shell','input','keyevent','KEYCODE_BACK')
    scroll_until('Search by name', 'down')
    tree = wait_text('5 people found')
    if any(node.get('class') == 'android.webkit.WebView' for node in tree.iter('node')):
        raise AssertionError('Expected native RN UI, found WebView')
    if not any(node.get('class') == 'android.widget.EditText' for node in tree.iter('node')):
        raise AssertionError('Native Android EditText not found')
    screenshot('initial.png')
    record('initial native screen', 'Five people and Android native input',
           '5 people found; native EditText present; no WebView in app hierarchy', 'initial.png')

    tap_label('Search by name')
    adb('shell','input','text','SaM')
    wait_text('1 person found')
    wait_text('Sam Rivera')
    if not keyboard_visible():
        raise AssertionError('Software keyboard not observed after native input focus')
    screenshot('filtered-keyboard.png')
    record('name filter with keyboard', 'SaM matches Sam with software keyboard open',
           'Sam Rivera; 1 person found; input-method state shows keyboard', 'filtered-keyboard.png')

    tap_label('Clear search')
    wait_text('5 people found')
    screenshot('cleared-keyboard.png')
    record('clear with keyboard open', 'Clear remains usable and restores five people',
           '5 people found after native tap', 'cleared-keyboard.png')

    tap_label('Search by name')
    adb('shell','input','text','nobody')
    wait_text('No people found')
    wait_text('0 people found')
    screenshot('empty-keyboard.png')
    record('empty state', 'Unknown name produces zero matches',
           'No people found and 0 people found', 'empty-keyboard.png')

    tap_label('Clear search')
    wait_text('5 people found')
    if keyboard_visible():
        adb('shell','input','keyevent','KEYCODE_BACK')
    wait_text('5 people found')
    deadline = time.monotonic() + 5
    while keyboard_visible():
        if time.monotonic() >= deadline:
            raise AssertionError('Keyboard remained visible after dismissal')
        time.sleep(.2)
    screenshot('restored.png')
    record('dismiss keyboard and restore', 'Five people after clear and keyboard dismissal',
           '5 people found on native screen', 'restored.png')


    scroll_until('Engineering Manager')
    swipe('up')
    tree = hierarchy()
    if not has_text(tree, 'Jordan Lee') or not has_text(tree, 'Engineering Manager'):
        raise AssertionError('Last person is not reachable by native scrolling')
    screenshot('scrolled-last-person.png')
    record('portrait list scrolling', 'Last person and role are reachable',
           'Jordan Lee and Engineering Manager visible after native swipe', 'scrolled-last-person.png')

    set_setting('accelerometer_rotation', '0')
    set_setting('user_rotation', '1')
    time.sleep(1)
    scroll_until('Search by name', 'down')
    scroll_until('Clear search')
    tap_label('Clear search')
    scroll_until('Engineering Manager')
    swipe('up')
    tree = hierarchy()
    if not has_text(tree, 'Engineering Manager'):
        raise AssertionError('Last role is inaccessible in landscape')
    width, height = struct.unpack('>II', adb('exec-out','screencap','-p',binary=True)[16:24])
    if width <= height:
        raise AssertionError('Landscape orientation did not take effect')
    screenshot('landscape.png')
    record('landscape layout', 'Search/clear and all rows remain reachable via scrolling',
           'Native landscape controls reached; final person role visible', 'landscape.png')

    set_setting('user_rotation', '0')
    set_setting('font_scale', '1.3')
    time.sleep(1)
    scroll_until('Search by name', 'down')
    scroll_until('Clear search')
    tap_label('Clear search')
    scroll_until('Engineering Manager')
    swipe('up')
    tree = hierarchy()
    if not has_text(tree, 'Engineering Manager'):
        raise AssertionError('Last role is inaccessible with large font')
    width, height = struct.unpack('>II', adb('exec-out','screencap','-p',binary=True)[16:24])
    config = adb('shell','dumpsys','activity','top')
    if width >= height or adb('shell','settings','get','system','font_scale') != '1.3':
        raise AssertionError('Portrait/font scale configuration did not take effect')
    if not re.search(r'(?:mConfiguration|mCurrentConfig|mGlobalConfig|mConfig)\s*[=:]\s*\{1\.3\b', config):
        raise AssertionError('Running activity configuration does not confirm font scale 1.3')
    screenshot('large-font.png')
    record('font scale 1.3', 'Controls and last row reachable at font scale 1.3; clipping reviewed in images',
           'Search/clear reached and final role visible at font scale 1.3', 'large-font.png')

    for name, digest in source_hashes.items():
        if hashlib.sha256(Path(name).read_bytes()).hexdigest() != digest:
            raise AssertionError('Source changed during native run: '+name)
    payload = {'status':'PASS', 'platform':platform,
         'runtime_build_marker':build_marker, 'launch_url':launch_url,
         'client':'host.exp.exponent',
         'source_base':source_base, 'source_hashes':source_hashes, 'checks':results,
         'limits':['Expo Go on an emulator; not a standalone release or physical-device run',
                   'No navigation or role-filter feature exists in the mobile app',
                   'iOS device/runtime remains unverified']}

except Exception as error:
    try:
        screenshot('failure.png')
    except Exception:
        pass
    failure = {'status':'FAIL', 'completed_checks':results, 'error':str(error)}
    (output/'failure.json').write_text(json.dumps(failure,indent=2)+'\n')
    (output/'results.json').write_text(json.dumps(failure,indent=2)+'\n')
    raise

finally:
    restoration_errors = []
    for name, value in original_settings.items():
        command = ['delete','system',name] if value == 'null' else ['put','system',name,value]
        try:
            adb('shell','settings',*command)
            if adb('shell','settings','get','system',name) != value:
                raise AssertionError('Restored setting readback differs')
        except Exception:
            restoration_errors.append(name)
    if restoration_errors:
        failure = {'status':'FAIL','error':'Settings restoration failed',
                   'settings':restoration_errors,'completed_checks':results}
        (output/'results.json').write_text(json.dumps(failure,indent=2)+'\n')
        raise RuntimeError('Settings restoration failed: '+', '.join(restoration_errors))

if payload is not None:
    payload['settings_restoration'] = 'PASS: original settings read back after restoration'
    (output/'results.json').write_text(json.dumps(payload,indent=2)+'\n')
    print(json.dumps({'platform':platform,'passed':len(results),'output':str(output)},indent=2))
