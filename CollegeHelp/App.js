import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import Navigation from "./navigation.js";
import { NavigationContainer } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
//import Todo from "./Todo.js";
import { ThemeToggle, ThemeContext } from "./theme.js";

export default function App() {
  const theme = useContext(ThemeContext);
  return (
    //   <Todo />
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
