import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TimeTable = () => {
  const [tableData, setTableData] = useState({
    Monday: {
      8: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      9: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      10: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      11: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      12: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      13: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      14: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      15: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      16: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      17: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      18: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
    },
    Tuesday: {
      8: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      9: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      10: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      11: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      12: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      13: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      14: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      15: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      16: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      17: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      18: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
    },
    Wednesday: {
      8: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      9: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      10: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      11: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      12: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      13: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      14: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      15: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      16: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      17: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      18: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
    },
    Thursday: {
      8: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      9: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      10: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      11: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      12: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      13: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      14: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      15: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      16: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      17: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      18: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
    },
    Friday: {
      8: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      9: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      10: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      11: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      12: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      13: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      14: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      15: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      16: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      17: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
      18: { classType: "", subjectCode: "", subjectTitle: "", location: "" },
    },
  });

  const storeTimetable = async () => {
    try {
      await AsyncStorage.setItem("timetable", JSON.stringify(tableData));
    } catch (error) {
      console.error(error);
    }
  };

  const loadTimetable = async () => {
    try {
      const storedTimetable = await AsyncStorage.getItem("timetable");
      if (storedTimetable !== null) {
        setTableData(JSON.parse(storedTimetable));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call loadTimetable when the component mounts
  useEffect(() => {
    loadTimetable();
  }, []);

  // Call storeTimetable when the timetable changes
  useEffect(() => {
    storeTimetable();
  }, [tableData]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [classType, setClassType] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectTitle, setSubjectTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleTouch1 = (day, hour) => {
    const newData = { ...tableData };
    newData[day][hour] = "Filled";
    setTableData(newData);
  };

  const handleTouch = (day, hour) => {
    setSelectedDay(day);
    setSelectedHour(hour);
    if (
      tableData[day][hour].classType === "" ||
      tableData[day][hour].subjectCode === ""
    ) {
      setClassType("");
      setSubjectCode("");
      setSubjectTitle("");
      setLocation("");
    } else {
      const existingData = tableData[day][hour];
      setClassType(existingData.classType);
      setSubjectCode(existingData.subjectCode);
      setSubjectTitle(existingData.subjectTitle);
      setLocation(existingData.location);
    }
    setModalVisible(true);
  };
  const handleSubmit = () => {
    if (
      classType !== "" &&
      subjectCode !== "" &&
      subjectTitle !== "" &&
      location !== ""
    ) {
      setTableData((prevData) => ({
        ...prevData,
        [selectedDay]: {
          ...prevData[selectedDay],
          [selectedHour]: { classType, subjectCode, subjectTitle, location },
        },
      }));
      console.log(
        `Class added: ${classType} - ${subjectCode} - ${subjectTitle} - ${location}`
      );
      setModalVisible(false);
      setClassType("");
      setSubjectCode("");
      setSubjectTitle("");
      setLocation("");
    } else {
      Alert.alert("Invalid input", "Please fill in all fields");
    }
  };

  const handleDelete = () => {
    setTableData((prevData) => ({
      ...prevData,
      [selectedDay]: {
        ...prevData[selectedDay],
        [selectedHour]: {
          classType: "",
          subjectCode: "",
          subjectTitle: "",
          location: "",
        },
      },
    }));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Time</Text>
        <Text>Monday</Text>
        <Text>Tuesday</Text>
        <Text>Wednesday</Text>
        <Text>Thursday</Text>
        <Text>Friday</Text>
      </View>
      <View style={styles.body}>
        {Object.keys(tableData.Monday).map((hour) => (
          <View key={hour} style={styles.row}>
            <Text>{hour}:00</Text>
            {Object.keys(tableData).map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.cell,
                  tableData[day][hour].classType !== ""
                    ? tableData[day][hour].classType === "Practical"
                      ? styles.filled_Practical
                      : tableData[day][hour].classType === "Lecture"
                      ? styles.filled_Lecture
                      : styles.filled
                    : null,
                ]}
                onPress={() => handleTouch(day, hour)}
              >
                {tableData[day][hour].classType !== "" && (
                  <Text style={styles.classTypeText}>
                    {tableData[day][hour].classType === "Practical"
                      ? "P"
                      : tableData[day][hour].classType === "Lecture"
                      ? "L"
                      : "T"}
                  </Text>
                )}
                {/* <Text> {tableData[day][hour].classType === "" ? "" : "F"}</Text> */}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              paddingVertical: 30,
              borderRadius: 10,
              width: "90%",
              height: "auto",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 24, flex: 1, textAlign: "center" }}>
                Enter Details :
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Class Type:</Text>
              <Picker
                selectedValue={classType}
                style={{ height: 50, width: 170 }}
                onValueChange={(itemValue) => setClassType(itemValue)}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Practical" value="Practical" />
                <Picker.Item label="Lecture" value="Lecture" />
                <Picker.Item label="Tutorial" value="Tutorial" />
              </Picker>
            </View>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                width: "80%",
                marginTop: 20,
                paddingHorizontal: 15,
              }}
              value={subjectCode}
              onChangeText={(text) => setSubjectCode(text)}
              placeholder="Subject Code"
            />
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                width: "80%",
                marginTop: 20,
                paddingHorizontal: 15,
              }}
              value={subjectTitle}
              onChangeText={(text) => setSubjectTitle(text)}
              placeholder="Subject Title"
            />
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                width: "80%",
                marginTop: 20,
                paddingHorizontal: 15,
              }}
              value={location}
              onChangeText={(text) => setLocation(text)}
              placeholder="Location"
            />
            <View
              style={{
                flexDirection: "row",
                columnGap: 25,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  elevation: 2,
                  borderRadius: 20,
                  borderColor: "blue",
                  padding: 10,
                  paddingHorizontal: 20,
                }}
                onPress={handleSubmit}
              >
                <Text>Submit</Text>
              </TouchableOpacity>
              {tableData[selectedDay] &&
                tableData[selectedDay][selectedHour].classType !== "" && (
                  <TouchableOpacity
                    style={{
                      marginTop: 20,
                      elevation: 2,
                      borderRadius: 20,
                      borderColor: "red",
                      padding: 10,
                      paddingHorizontal: 20,
                    }}
                    onPress={handleDelete}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  body: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cell: {
    width: 50,
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  filled: {
    backgroundColor: "#007aff",
  },
  filled_Practical: {
    backgroundColor: "#2fd614",
  },
  filled_Lecture: {
    backgroundColor: "#decf1a",
  },
  classTypeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3a414e", //"#fff",
    textAlign: "center",
    justifyContent: "center",
  },
});

export default TimeTable;
