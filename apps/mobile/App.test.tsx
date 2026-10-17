import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react-native";
import App from "./App";
import { people } from "../../shared/directory";

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  act(() => jest.runOnlyPendingTimers());
  cleanup();
  jest.useRealTimers();
});

function expectAllPeople() {
  for (const person of people)
    expect(screen.getByText(person.name)).toBeTruthy();
  expect(screen.getByText("5 people found")).toBeTruthy();
}

describe("React Native directory component behavior (mocked native environment)", () => {
  it("renders the five fictional people with accessible search and clear controls", () => {
    render(<App />);
    expectAllPeople();
    expect(
      screen.getByRole("header", { name: "People directory" }),
    ).toBeTruthy();
    expect(screen.getByLabelText("Search by name")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Clear search" })).toBeTruthy();
  });

  it("matches a normalized name and excludes other people", () => {
    render(<App />);
    fireEvent.changeText(screen.getByLabelText("Search by name"), "  sAM ");
    expect(screen.getByText("Sam Rivera")).toBeTruthy();
    expect(screen.getByText("1 person found")).toBeTruthy();
    expect(screen.queryByText("Jamie Chen")).toBeNull();
    expect(screen.queryByText("Alex Morgan")).toBeNull();
  });

  it("shows a no-match empty state and restores all people when cleared", () => {
    render(<App />);
    const input = screen.getByLabelText("Search by name");
    fireEvent.changeText(input, "nobody");
    expect(screen.getByText("No people found")).toBeTruthy();
    expect(screen.getByText("0 people found")).toBeTruthy();
    for (const person of people)
      expect(screen.queryByText(person.name)).toBeNull();
    fireEvent.press(screen.getByRole("button", { name: "Clear search" }));
    expect(input.props.value).toBe("");
    expect(screen.queryByText("No people found")).toBeNull();
    expectAllPeople();
  });

  it("searches names rather than accidentally searching roles", () => {
    render(<App />);
    fireEvent.changeText(screen.getByLabelText("Search by name"), "Engineer");
    expect(screen.getByText("No people found")).toBeTruthy();
    expect(screen.getByText("0 people found")).toBeTruthy();
  });

  it("treats whitespace as no name restriction", () => {
    render(<App />);
    fireEvent.changeText(screen.getByLabelText("Search by name"), "   ");
    expectAllPeople();
  });

  it("updates subsequent queries without keeping stale results", () => {
    render(<App />);
    const input = screen.getByLabelText("Search by name");
    fireEvent.changeText(input, "Sam");
    expect(screen.getByText("Sam Rivera")).toBeTruthy();
    fireEvent.changeText(input, "Jamie");
    expect(screen.queryByText("Sam Rivera")).toBeNull();
    expect(screen.getByText("Jamie Chen")).toBeTruthy();
    expect(screen.getByText("1 person found")).toBeTruthy();
  });
});
