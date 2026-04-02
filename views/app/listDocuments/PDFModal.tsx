import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Dimensions,
  Modal,
  View,
  TouchableOpacity,
} from "react-native";
import Pdf from "react-native-pdf";

const PDFModal = ({
  uri,
  modalVisible,
  setModalVisible,
}: {
  uri: string;
  modalVisible: boolean;
  setModalVisible: ({
    visible,
    uri,
  }: {
    visible: boolean;
    uri: string;
  }) => void;
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible({ visible: false, uri: "" });
      }}
    >
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          right: 10,
          top: 50,
        }}
      >
        <TouchableOpacity
          style={{
            marginBottom: 10,
            width: 40,
            height: 40,
            borderRadius: 50,
            backgroundColor: "rgba(140, 140, 140, 1)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setModalVisible({ visible: false, uri: "" })}
        >
          <Ionicons name="close" color="white" size={32} />
        </TouchableOpacity>
      </View>
      <Pdf
        trustAllCerts={false}
        source={{
          uri,
          cache: true,
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default PDFModal;
