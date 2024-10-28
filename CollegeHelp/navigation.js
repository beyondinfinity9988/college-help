import React, { useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./homescreen";
import Todo from "./Todo";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import DriveScreen from "./drivescreen";
const Tab = createBottomTabNavigator();

const Navigation = () => {
  const [numNavigation, setNumNavigation] = useState(0);

  const loadTodoLength = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        setNumNavigation(todos.length);
      }
    } catch (error) {
      console.error("Error loading todo length:", error);
    }
  };

  const handleTodoLengthChange = (length) => {
    setNumNavigation(() => length);
    console.log(length);
  };

  useFocusEffect(
    useCallback(() => {
      loadTodoLength();
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Todo List") {
            iconName = focused ? "list" : "list";
          } else if (route.name === "Your Gallary") {
            iconName = "photo";
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          elevation: 20, // Elevation for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          elevation: 20, // Elevation for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen
        name="Todo List"
        // component={Todo}
        options={{ tabBarBadge: numNavigation }}
      >
        {() => <Todo onTodoLengthChange={setNumNavigation} />}
      </Tab.Screen>

      <Tab.Screen name="Your Gallary" component={DriveScreen} />
      {/* <Tab.Screen name="DTU MAP" component={DTUMap} /> */}
    </Tab.Navigator>
  );
};

export default Navigation;
