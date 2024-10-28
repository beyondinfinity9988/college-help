import { Link } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useState } from "react";
import env from "./env";
import TimeTable from "./timetable";
import HomeNotification from "./home_notification";
import { Icon } from "react-native-elements";
import AdvertisementBanner from "./AdvertisementBanner";

const HomeScreen = () => {
  const [isTimeTableOpen, setIsTimeTableOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  //const url = "https://mercykknight.github.io";
  const DISCORD_WEBHOOK_URL = env.DISCORD_WEBHOOK_API;

  const sendMessageToDiscord = async () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const discordMessage = {
      content: `New contact message:\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`,
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordMessage),
      });

      if (response.ok) {
        Alert.alert("Success", "Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleLinkPress = (url) => {
    if (url === env.API_URL) {
      Alert.alert(
        "Thankyou for Donating to us 😊!!",
        "You are the reason this app is alive.🙋‍♂️"
      );
    }
    Linking.openURL(url);
  };
  return (
    <ScrollView style={styles.homebody}>
      {/* <View
        style={{
          flexShrink: 1,
          flexDirection: "column",
          alignItems: "center",
          margin: 15,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 600, marginBottom: 10 }}>
          Welcome To College Help!{" "}
        </Text>
        <Text>One stop for all your college needs.</Text>
        <Text>Simplify your college experience with us.</Text>
      </View> */}
      <View style={{ padding: 20, marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#000",
            alignSelf: "center",
            marginBottom: 8,
          }}
        >
          Welcome To College Help!
        </Text>
        {/* <Text style={{ fontSize: 18, color: "#000", fontStyle: "italic" }}>
          {"> "}One stop for all your college needs.
        </Text> */}
        <Text
          style={{
            fontSize: 18,
            color: "#000",
            fontStyle: "italic",
            alignSelf: "center",
          }}
        >
          {" "}
          Simplify your college experience with us.
        </Text>
      </View>
      <AdvertisementBanner />

      {/*Notification Bar for CLass notification: */}
      <Text
        style={{
          alignItems: "right",
          marginLeft: 20,
          fontSize: 20,
          fontWeight: 500,
        }}
      >
        Notifications / Events :-
      </Text>
      <View style={{ height: 3, backgroundColor: "#ccc", width: "100%" }} />
      <HomeNotification style={styles.Notification} />

      {/* TimeTable Drawer */}
      <TouchableOpacity
        onPress={() => setIsTimeTableOpen(!isTimeTableOpen)}
        style={{
          marginLeft: 20,
          fontSize: 40,
          fontWeight: 500,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon
          name={isTimeTableOpen ? "arrow-drop-up" : "arrow-drop-down"}
          type="material"
          size={40}
        />
        <Text
          style={{
            marginLeft: 10,
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          TimeTable :-{" "}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 3, backgroundColor: "#ccc", width: "100%" }} />

      {isTimeTableOpen && <TimeTable />}

      {/* Websits to visit */}

      <Text
        style={{
          alignItems: "right",
          marginLeft: 20,
          fontSize: 20,
          fontWeight: 500,
          marginTop: 35,
        }}
      >
        Dtu College Websites:-
      </Text>
      <View style={{ height: 3, backgroundColor: "#ccc", width: "100%" }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          padding: 20,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <TouchableOpacity onPress={() => handleLinkPress("https://dtu.ac.in")}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Image
              source={require("./assets/DTU_logo.jpg")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>DTU Website</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLinkPress("https://rm.dtu.ac.in/")}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Image
              source={require("./assets/dtuRm.jpg")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>Rm Portal</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLinkPress("https://www.exam.dtu.ac.in/")}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Image
              source={require("./assets/exam.png")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>Dtu Result</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLinkPress("https://reg.exam.dtu.ac.in/")}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Image
              source={require("./assets/dtubag.jpeg")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>Dtu Portal</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Another Section for webiste view*/}

      <Text
        style={{
          alignItems: "right",
          marginLeft: 20,
          fontSize: 20,
          fontWeight: 500,
          marginTop: 20,
        }}
      >
        App Website:-
      </Text>
      <View style={{ height: 3, backgroundColor: "#ccc", width: "100%" }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          padding: 20,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {/* Contact Us Button */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Image
              source={require("./assets/contribute.png")} // Replace with an appropriate image
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>Contact Us</Text>
          </View>
        </TouchableOpacity>

        {/* Contact Us Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 20,
                width: "90%",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 20 }}>Contact Us</Text>
              <TextInput
                placeholder="Name"
                style={{
                  width: "100%",
                  borderBottomWidth: 1,
                  marginBottom: 20,
                  padding: 10,
                }}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                placeholder="Email/Number"
                style={{
                  width: "100%",
                  borderBottomWidth: 1,
                  marginBottom: 20,
                  padding: 10,
                }}
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                placeholder="Message"
                multiline
                numberOfLines={4}
                style={{
                  width: "100%",
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 10,
                  textAlignVertical: "top",
                  marginBottom: 20,
                }}
                value={message}
                onChangeText={setMessage}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#4CAF50", // Green color
                    padding: 10,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={sendMessageToDiscord}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>
                    Send Message
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#f44336", // Red color
                    padding: 10,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => handleLinkPress(env.API_URL)}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Image
              source={require("./assets/public-sponsor.png")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>
              Sponsor Project
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer view */}
      <Text
        style={{
          opacity: 0.4,
          flexGrow: 0,
          alignSelf: "center",
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        This App is Created by @Prathamu200
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  homebody: {
    flex: 1,
    margin: 0,
    //justifyContent: "space-around",
    backgroundColor: "#E8EAED",
    flexDirection: "column",
    //alignItems: "center",
  },
  Notification: {
    flex: 1,
  },
});

export default HomeScreen;
