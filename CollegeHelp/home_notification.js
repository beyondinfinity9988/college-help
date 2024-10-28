import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Notification Bar:-
const NotificationBar = ({ timetable, hour }) => {
  return (
    <View style={[styles.Notification_bar, { flexDirection: "row" }]}>
      <View
        style={[
          styles.square,
          {
            backgroundColor:
              timetable.classType === "Lecture"
                ? "#faea29"
                : timetable.classType === "Practical"
                ? "#2fd614"
                : "#55BCF6",
          },
        ]}
      >
        <Text>{timetable.classType}</Text>
      </View>
      <Text>
        {timetable.startTime}:00 - {timetable.endTime}:00
      </Text>
      <Text style={{ flex: 1, flexWrap: "wrap" }}>
        {timetable.subjectCode} - {timetable.subjectTitle}
      </Text>
      <Text style={{ flex: 1, flexWrap: "wrap" }}>{timetable.location}</Text>
    </View>
  );
};

const HomeNotification = ({ onScroll }) => {
  const time = new Date();

  const [currentTimetable, setCurrentTimetable] = useState([]);
  const [upcomingTimetable, setUpcomingTimetable] = useState([]);
  const [completedTimetable, setCompletedTimetable] = useState([]);
  const [tableData, setTableData] = useState({});

  const loadTimetable = async () => {
    try {
      const storedTimetable = await AsyncStorage.getItem("timetable");

      if (storedTimetable !== null) {
        setTableData(JSON.parse(storedTimetable));
        //console.log("talbledata :", tableData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  useEffect(() => {
    if (tableData !== null && Object.keys(tableData).length > 0) {
      const currentTime = new Date().getHours();
      const currentDay = new Date().toLocaleString("en-us", {
        weekday: "long",
      });

      const currentTimetable =
        tableData[currentDay] !== undefined
          ? Object.keys(tableData[currentDay])
              .filter((hour) => {
                const startTime = parseInt(hour);
                const endTime = parseInt(hour) + 1;
                return currentTime >= startTime && currentTime < endTime;
              })
              .map((hour) => ({
                ...tableData[currentDay][hour],
                startTime: hour,
                endTime: parseInt(hour) + 1,
              }))
          : "";

      const upcomingTimetable =
        tableData[currentDay] !== undefined
          ? Object.keys(tableData[currentDay])
              .filter((hour) => {
                const startTime = parseInt(hour);
                return currentTime < startTime;
              })
              .map((hour) => ({
                ...tableData[currentDay][hour],
                startTime: hour,
                endTime: parseInt(hour) + 1,
              }))
          : "";

      const completedTimetable =
        tableData[currentDay] !== undefined
          ? Object.keys(tableData[currentDay])
              .filter((hour) => {
                const endTime = parseInt(hour) + 1;
                return currentTime >= endTime;
              })
              .map((hour) => ({
                ...tableData[currentDay][hour],
                startTime: hour,
                endTime: parseInt(hour) + 1,
              }))
          : "";

      setCurrentTimetable(currentTimetable);
      setUpcomingTimetable(upcomingTimetable);
      setCompletedTimetable(completedTimetable);
    }
  }, [tableData]);

  return (
    <ScrollView
      style={styles.Notification_Home_View}
      nestedScrollEnabled={true}
    >
      <Text style={styles.head}>Current: -</Text>
      {currentTimetable && currentTimetable.length > 0 ? (
        currentTimetable
          .filter((timetable) => timetable.classType !== "")
          .map((timetable, index) => (
            <NotificationBar key={index} timetable={timetable} />
          ))
      ) : (
        <Text style={{ fontStyle: "italic", marginHorizontal: 20 }}>
          --- Empty ---
        </Text>
      )}
      <Text style={styles.head}>Upcoming: -</Text>
      {upcomingTimetable && upcomingTimetable.length > 0 ? (
        upcomingTimetable
          .filter((timetable) => timetable.classType !== "")
          .map((timetable, index) => (
            <NotificationBar key={index} timetable={timetable} />
          ))
      ) : (
        <Text style={{ fontStyle: "italic", marginHorizontal: 20 }}>
          --- Empty ---
        </Text>
      )}
      <Text style={styles.head}>Complete: -</Text>
      {completedTimetable && completedTimetable.length > 0 ? (
        completedTimetable
          .filter((timetable) => timetable.classType !== "")
          .map((timetable, index) => (
            <NotificationBar key={index} timetable={timetable} />
          ))
      ) : (
        <Text style={{ fontStyle: "italic", marginHorizontal: 20 }}>
          --- Empty ---
        </Text>
      )}
      <View style={{ height: 48, width: "100%" }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Notification_Home_View: {
    height: 200,
    marginHorizontal: 15,
    marginBottom: 30,
    marginTop: 15,
    padding: 15,
    paddingBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 10,
    flex: 1,
    flexDirection: "column",
  },
  Notification_bar: {
    height: 50,
    backgroundColor: "#cfecfc",
    opacity: 1,
    borderRadius: 10,
    margin: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    elevation: 10,
    gap: 10,
    overflow: "visible",
  },
  head: {
    fontSize: 20,
    fontWeight: "600",
    fontStyle: "italic",
  },
  square: {
    width: 60,
    height: "auto",
    borderRadius: 5,
    //backgroundColor: {timeData.classType === "Lecture" ? "#ffe680" : "#55BCF6"}, //"#55BCF6",
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
});

export default HomeNotification;
