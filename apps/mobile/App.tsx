import { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { filterPeople, people } from "../../shared/directory";
export default function App() {
  return (
    <SafeAreaProvider>
      <DirectoryScreen />
    </SafeAreaProvider>
  );
}
function DirectoryScreen() {
  const [query, setQuery] = useState("");
  const visible = filterPeople(people, query);
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={s.container}>
        <Text style={s.brand}>brightplan · practice</Text>
        <Text style={s.eyebrow}>BUILD · EXPLAIN · VERIFY</Text>
        <Text style={s.title} accessibilityRole="header">
          People directory
        </Text>
        <Text style={s.subtitle}>Five fictional people. One shared model.</Text>
        <Text style={s.label} nativeID="search-label">
          Search by name
        </Text>
        <TextInput
          accessibilityLabel="Search by name"
          placeholder="Try Alex or Jamie…"
          value={query}
          onChangeText={setQuery}
          style={s.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => setQuery("")}
          style={s.button}
        >
          <Text style={s.buttonText}>Clear search</Text>
        </Pressable>
        <Text accessibilityLiveRegion="polite" style={s.result}>
          {visible.length} {visible.length === 1 ? "person" : "people"} found
        </Text>
        <FlatList
          data={visible}
          keyExtractor={(p) => p.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <View style={s.row}>
              <View style={s.avatar}>
                <Text style={s.initials}>
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <View style={s.person}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.role}>{item.role}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.name}>No people found</Text>
              <Text style={s.role}>
                Try another name, or clear your search.
              </Text>
            </View>
          }
        />
        <Text style={s.environment}>
          Runtime: {Platform.OS} · Width: {Math.round(width)} · Local fixture
        </Text>
      </View>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f7f4" },
  container: {
    flex: 1,
    padding: 24,
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#153e35",
    marginBottom: 36,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#68826c",
    marginBottom: 12,
  },
  title: { fontSize: 30, fontWeight: "700", color: "#153e35" },
  subtitle: { color: "#6b7d73", marginTop: 8, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: "600", color: "#153e35", marginBottom: 8 },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#dce3da",
    fontSize: 16,
    color: "#153e35",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#174c3d",
    padding: 14,
    borderRadius: 9,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "600" },
  result: { fontSize: 12, color: "#728372", marginVertical: 20 },
  list: { paddingBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#e0e6da",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e5ecd8",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { color: "#5d7245", fontWeight: "700" },
  person: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#153e35" },
  role: { fontSize: 13, color: "#728372", marginTop: 5 },
  empty: { padding: 28, backgroundColor: "white", borderRadius: 10 },
  environment: { fontSize: 11, color: "#728372", paddingTop: 12 },
});
