import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import {
  checkPermissions,
  requestPermissions,
  PermissionStatus,
} from "../../utils/permissions";
import { savePermissionStatus } from "../../utils/storage";

interface PermissionRequestNativeProps {
  onGrantPermission: () => void;
  onDenyPermission: () => void;
}

const PermissionRequestNative: React.FC<PermissionRequestNativeProps> = ({
  onGrantPermission,
  onDenyPermission,
}) => {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>("denied");

  useEffect(() => {
    checkCurrentPermissions();
  }, []);

  const checkCurrentPermissions = async () => {
    const status = await checkPermissions();
    setPermissionStatus(status);

    if (status === "granted") {
      savePermissionStatus(true);
      onGrantPermission();
    }
  };

  const handleRequestPermissions = async () => {
    try {
      const status = await requestPermissions();
      setPermissionStatus(status);

      if (status === "granted") {
        savePermissionStatus(true);
        onGrantPermission();
      } else if (status === "blocked") {
        Alert.alert(
          "Permissions Required",
          "Please enable permissions in your device settings to use this app.",
          [
            { text: "Cancel", onPress: onDenyPermission },
            { text: "Open Settings", onPress: openSettings },
          ],
        );
      } else {
        onDenyPermission();
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      onDenyPermission();
    }
  };

  const openSettings = () => {
    // This would open device settings
    // For a real implementation, use Linking.openSettings()
    onDenyPermission();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Permissions Required</Text>

        <Text style={styles.description}>
          Female Blur Overlay needs the following permissions to function
          properly:
        </Text>

        <View style={styles.permissionList}>
          <Text style={styles.permissionItem}>• Camera access</Text>
          <Text style={styles.permissionItem}>• Display over other apps</Text>
          <Text style={styles.permissionItem}>• Run in background</Text>
        </View>

        <Text style={styles.privacyNote}>
          Your privacy is important to us. All processing happens on-device and
          no images are stored or transmitted.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.denyButton]}
            onPress={onDenyPermission}
          >
            <Text style={styles.denyButtonText}>Deny</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.grantButton]}
            onPress={handleRequestPermissions}
          >
            <Text style={styles.grantButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
    lineHeight: 22,
  },
  permissionList: {
    marginBottom: 16,
  },
  permissionItem: {
    fontSize: 15,
    marginBottom: 8,
    color: "#444",
    paddingLeft: 8,
  },
  privacyNote: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  denyButton: {
    backgroundColor: "#f1f1f1",
  },
  grantButton: {
    backgroundColor: "#3b82f6",
  },
  denyButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  grantButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default PermissionRequestNative;
