import React from "react";
import { Icon } from "react-native-elements";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

const Task = (props) => {
  return (
    <TouchableOpacity
      style={[styles.item, props.item.completed && { opacity: 0.5 }]}
      onPress={() => props.CompletedTask(props.item.id)}
    >
      <View style={styles.square}>
        <Icon
          name="check"
          type="FontAwesome"
          style={!props.item.completed && styles.checkBoxComplete}
        />
      </View>
      <Text
        style={[
          styles.itemText,
          props.item.completed && { textDecorationLine: "line-through" },
        ]}
      >
        {" "}
        {props.item.title}{" "}
      </Text>
      <TouchableOpacity
        style={styles.circle}
        onPress={() => props.DeleteTask(props.item.id)}
      >
        <Icon name="delete" color="#e60000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    shadowRadius: 5,
    shadowColor: "#000",
    alignItems: "center",
    //flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    opacity: (props) => (props.item.completed ? 0.5 : 1),
  },
  square: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: "#55BCF6",
    opacity: 0.4,
  },
  circle: {
    width: 50,
    height: 55,
    marginVertical: -20,
    marginRight: -15,
    borderRadius: 4,
    //borderWidth: 0.1,
    borderColor: "black",

    justifyContent: "center",
  },
  itemText: {
    flexShrink: 1,
    marginLeft: 7,
  },
  checkBoxComplete: {
    display: "none",
  },
});

export default Task;
