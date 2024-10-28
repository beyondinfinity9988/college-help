import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Linking,
} from "react-native";
import fetchAdvertisement from "./api";
import { Icon } from "react-native-elements";

const AdvertisementBanner = () => {
  const [advertisement, setAdvertisement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchAdvertisement().then((data) => {
      setAdvertisement(data);
      setLoading(false);
    });
  }, []);

  const handleClose = () => {
    setVisible(false);
    console.log("button");
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!advertisement || !advertisement.advertisement.show) {
    console.log("No data");
    return null;
  }
  const { width, height, image, text, url, buttonText } =
    advertisement.advertisement;
  const modalWidth = width || Dimensions.get("window").width - 40;
  const modalHeight = height || 400;
  const modalButtonText = buttonText || "Click Here";
  return (
    <Modal visible={visible} transparent={true} onRequestClose={handleClose}>
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
            width: modalWidth,
            height: modalHeight, // Apply the height here
            backgroundColor: "white",
            borderRadius: 10,
            overflow: "hidden", // Ensures the content stays within the borders
            position: "relative",
          }}
        >
          {/* Background Image */}
          <Image
            source={{ uri: image }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute", // Ensures the image stays in the background
              top: 0,
              left: 0,
              resizeMode: "cover",
            }}
          />

          {/* Close Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 2, // Ensures the button stays above the image
            }}
            onPress={handleClose}
          >
            <Icon name="close" type="material" size={35} />
          </TouchableOpacity>

          {/* Content */}
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end", // Pushes the text and button to the bottom
              padding: 20,
              zIndex: 1, // Ensures the content stays above the image
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "white", // White text to contrast with the image
                marginBottom: 0,
                alignSelf: "center",
              }}
            >
              {text}
            </Text>
            {/* Updated Button */}
            <TouchableOpacity
              onPress={() => Linking.openURL(url)}
              style={{
                alignSelf: "center", // Centers the button horizontally
                backgroundColor: "lightblue", // Box background color
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                marginTop: 20, // Adds spacing between the button and the text
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white", // Text color inside the box
                  fontWeight: "bold",
                }}
              >
                {modalButtonText || "Learn more"}{" "}
                {/* Uses buttonText from API */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AdvertisementBanner;
