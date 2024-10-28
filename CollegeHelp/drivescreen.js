import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Sharing from "expo-sharing"; // Import the library
import FileViewer from "react-native-file-viewer";
import { Icon } from "react-native-elements";
import * as FileSystem from "expo-file-system";
import ImageViewer from "react-native-image-zoom-viewer";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const { height, width } = Dimensions.get("window");

const DriveScreen = () => {
  const [files, setFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [renameItem, setRenameItem] = useState(null);
  const [newName, setNewName] = useState("");
  const [renameModalVisible, setRenameModalVisible] = useState(false);

  const rootPath = `${FileSystem.documentDirectory}CollegeHelpDrive`; // Update this line
  const [currentPath, setCurrentPath] = useState(rootPath); // Add this line

  useEffect(() => {
    loadFilesAndFolders();
  }, [currentPath]);

  useEffect(() => {
    const setupFileSystem = async () => {
      const folderInfo = await FileSystem.getInfoAsync(rootPath);
      if (!folderInfo.exists) {
        try {
          await FileSystem.makeDirectoryAsync(rootPath, {
            intermediates: true,
          });
          console.log("Root folder created");
        } catch (error) {
          console.log("Error creating root folder:", error);
        }
      }

      loadFilesAndFolders();
    };

    setupFileSystem();
  }, []);

  const loadFilesAndFolders = async () => {
    try {
      const directoryContents = await FileSystem.readDirectoryAsync(
        currentPath
      );
      const filesData = await Promise.all(
        directoryContents.map(async (fileName) => {
          const fileInfo = await FileSystem.getInfoAsync(
            `${currentPath}/${fileName}`
          );
          return { ...fileInfo, name: fileName };
        })
      );
      // Sort files by type (folders first) and then by date in descending order
      filesData.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) {
          return -1; // Folders come before files
        } else if (!a.isDirectory && b.isDirectory) {
          return 1; // Files come after folders
        } else {
          return b.modificationTime - a.modificationTime; // Sort by date in descending order
        }
      });
      setFiles(filesData);
    } catch (error) {
      console.log("Error loading files:", error);
    }
  };

  const handleCreateFolder = async () => {
    const newFolderName = "NewFolder";
    const newFolderPath = `${currentPath}/${newFolderName}`; // Update this line

    try {
      const folderInfo = await FileSystem.getInfoAsync(newFolderPath);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(newFolderPath, {
          intermediates: true,
        });
        console.log("Folder created:", newFolderName);
        setModalVisible(false);
        loadFilesAndFolders();
      } else {
        alert(`${newFolderName} already exists:`);
        console.log("Folder already exists:", newFolderName);
      }
    } catch (error) {
      console.log("Error creating folder:", error);
    }
  };

  const handleFileClick = async (file) => {
    if (file.isDirectory) {
      setCurrentPath(`${currentPath}/${file.name}`);
      console.log(
        "Navigating to directory:",
        file.uri,
        `${currentPath}/${file.name}`
      );
    } else {
      try {
        const fileUri = file.uri;
        const fileType = file.name.split(".").pop().toLowerCase();

        // Remove extra "file://" prefix if present
        const cleanedUri = fileUri.replace(/^file:\/\/\//, "file:///");

        if (["jpg", "jpeg", "png"].includes(fileType)) {
          // For image files, display them in the app
          setSelectedFileContent(cleanedUri);
          setSelectedFileName(file.name);
        } else {
          alert("Could not open the file!!");
        }
      } catch (error) {
        console.log("Error opening file:", error);
      }
    }
  };

  const handleAddFile = () => {
    setModalVisible(true);
  };

  const handleFileUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Media library permissions are required to upload files."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets;
        const imageUris = selectedImages.map((image) => image.uri);

        // Filter out non-image files (jpg, jpeg, png)
        const filteredImageUris = imageUris.filter((uri) => {
          const fileType = uri.split(".").pop().toLowerCase();
          return ["jpg", "jpeg", "png"].includes(fileType);
        });

        // Upload the selected images to the current directory
        const uploadPromises = filteredImageUris.map((uri) => {
          const fileName = uri.split("/").pop();
          const destinationUri = `${currentPath}/${fileName}`;
          return FileSystem.copyAsync({ from: uri, to: destinationUri });
        });

        await Promise.all(uploadPromises);
        loadFilesAndFolders(); // Refresh the file list
        setModalVisible(false);
      } else {
        console.log("Image picker was canceled.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      Alert.alert("Error", "An error occurred while uploading files.");
    }
  };

  const handleCameraImage = async () => {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      if (status !== "granted") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Camera permissions are required to take a photo."
          );
          return;
        }
      }

      // Launch the camera to take a photo
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];

        // Allow the user to crop the photo
        const croppedResult = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800 } }], // Resize image if necessary (optional)
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        // Define the path to save the cropped image
        const fileName = uri.split("/").pop();
        const destinationUri = `${currentPath}/${fileName}`;

        // Copy the cropped image to the currentPath
        await FileSystem.copyAsync({
          from: croppedResult.uri,
          to: destinationUri,
        });

        console.log(`Image uploaded successfully: ${fileName}`);
        loadFilesAndFolders(); // Refresh the file list
        setModalVisible(false);
      } else {
        console.log("Image picker was canceled.");
      }
    } catch (error) {
      console.error("Error taking or processing image:", error);
      Alert.alert(
        "Error",
        "An error occurred while taking or processing the image."
      );
    }
  };

  const handleLongPress = (item) => {
    Alert.alert(
      "Options",
      `What would you like to do with "${item.name}"?`,
      [
        { text: "Rename", onPress: () => handleRename(item) },
        { text: "Share", onPress: () => shareFile(item) },
        { text: "Delete", onPress: () => handleDelete(item) },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const openFile = async (fileUri) => {
    try {
      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        // Open the file using the native file viewer
        await FileViewer.open(fileUri);
      } else {
        alert("File does not exist");
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const handleDelete = async (item) => {
    try {
      await FileSystem.deleteAsync(item.uri);
      loadFilesAndFolders(); // Refresh the list after deletion
    } catch (error) {
      console.log("Error deleting file/folder:", error);
      Alert.alert("Error", "Cannot delete this file/folder.");
    }
  };

  const handleRename = (item) => {
    setRenameItem(item);
    setNewName(item.name); // Pre-fill with current name
    setRenameModalVisible(true);
  };

  const shareFile = async (file) => {
    try {
      const shareOptions = {
        title: file.name,
        url: file.uri,
        type: file.type, // Specify the MIME type if needed
      };
      await Sharing.shareAsync(shareOptions.url); // And share your file !
    } catch (error) {
      console.error("Error sharing file:", error);
      Alert.alert("Error", "Unable to share this file.");
    }
  };

  const handleGoBack = () => {
    // Check if the currentPath is the root path
    if (currentPath !== rootPath) {
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
      setCurrentPath(parentPath || rootPath); // Navigate up one level or stay at root if at top level
      loadFilesAndFolders(); // Reload files and folders in the new directory
    }
    loadFilesAndFolders();
    console.log(currentPath);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pathContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          {/* <Text style={styles.goBackButtonText}>Go Back</Text> */}
          <Icon name="arrow-back" type="material" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.pathText}>{currentPath.replace(rootPath, "")}</Text>
      </View>

      {files.length === 0 ? (
        <View style={styles.emptyScreen}>
          <Text>No files or folders</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.fileItem}
              onPress={() => handleFileClick(item)}
              onLongPress={() => handleLongPress(item)}
            >
              <View style={styles.fileContent}>
                {item.isDirectory ? (
                  <View style={styles.folderPreview}>
                    <Icon name="folder" size={40} color="#FFD700" />
                    <Text style={styles.fileName}>{item.name}</Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.imagePreview}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.uri}
          numColumns={3}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddFile}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onDismiss={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleCreateFolder}>
              <View style={styles.modalItem}>
                <Icon name="folder" type="material" size={24} color="#666" />
                <Text style={styles.modalText}>Create folder</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFileUpload}>
              <View style={styles.modalItem}>
                <Icon name="upload" size={24} color="#666" />
                <Text style={styles.modalText}>Upload Image</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCameraImage}>
              <View style={styles.modalItem}>
                <Icon
                  name="camera"
                  type="font-awesome"
                  size={24}
                  color="#666"
                />
                <Text style={styles.modalText}>Scan Image</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {/* Modal to display file content */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={selectedFileContent !== null}
        onRequestClose={() => setSelectedFileContent(null)}
      >
        <View style={styles.imageViewerContainer}>
          {selectedFileContent &&
          (selectedFileName.endsWith(".jpg") ||
            selectedFileName.endsWith(".jpeg") ||
            selectedFileName.endsWith(".png")) ? (
            <ImageViewer
              imageUrls={[{ url: selectedFileContent }]}
              enableImageZoom={true}
              enableSwipeDown={true}
              onSwipeDown={() => setSelectedFileContent(null)}
              style={styles.imageViewer}
            />
          ) : (
            <Text style={styles.unsupportedText}>Unsupported file format.</Text>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedFileContent(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Rename diloag*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={renameModalVisible}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.renameModalContent}>
            <Text style={styles.renameModalTitle}>Rename Folder/File</Text>
            <TextInput
              style={styles.renameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                style={styles.renameButton}
                onPress={async () => {
                  if (renameItem) {
                    const newUri = `${currentPath}/${newName}`;

                    try {
                      // Check if the new file/folder name already exists
                      const newItemInfo = await FileSystem.getInfoAsync(newUri);

                      if (newItemInfo.exists) {
                        // If the file/folder already exists, show an alert
                        Alert.alert(
                          "Error",
                          "A file or folder with this name already exists."
                        );
                      } else {
                        // If the new name is unique, proceed with renaming
                        await FileSystem.moveAsync({
                          from: renameItem.uri,
                          to: newUri,
                        });
                        loadFilesAndFolders(); // Refresh the file list
                        setRenameModalVisible(false);
                      }
                    } catch (error) {
                      console.error("Error renaming file/folder:", error);
                      Alert.alert("Error", "Cannot rename this file/folder.");
                    }
                  }
                }}
              >
                <Text style={styles.renameButtonText}>Rename</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
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
    // backgroundColor: "#fff",
    backgroundColor: "#E8EAED",
    padding: 10,
  },
  emptyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4CAF50",
    width: 70,
    height: 70,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 38,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 16,
    marginLeft: 10,
  },
  fileContentImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },

  fileName: {
    fontSize: 18, // Increase text size
    marginLeft: 15,
    color: "#333", // Darker text color
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  renameModalContent: {
    width: width - 40,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  renameModalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  renameInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
  },
  renameButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  renameButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: "#000", // Dark background for better contrast
    justifyContent: "center",
  },
  imageViewer: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  pathContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    columnGap: 18,
    marginLeft: 5,
  },
  pathText: {
    fontSize: 16,
    color: "black", //"#333",
  },
  goBackButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  goBackButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  fileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileName: {
    fontSize: 18,
    color: "#333",
  },
  fileItem: {
    flex: 1,
    padding: 5,
    margin: 5,
    borderRadius: 10,
  },
  fileContent: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },
  imagePreview: {
    width: width / 3 - 20, // Adjust width to fit 3 items per row with margin
    height: width / 3 - 20, // Adjust height to fit 3 items per row with margin
    borderRadius: 10,
    resizeMode: "cover",
    elevation: 10,
  },
  folderPreview: {
    width: width / 3 - 20,
    height: width / 3 - 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Optional background color for folders
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 20,
  },
});

export default DriveScreen;
