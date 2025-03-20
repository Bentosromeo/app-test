import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import {
  loadPermissionStatus,
  savePermissionStatus,
} from "../../utils/storage";
import PermissionRequestNative from "./PermissionRequestNative";
import FloatingPanelNative from "./FloatingPanelNative";
import MinimizedBubbleNative from "./MinimizedBubbleNative";
import { DetectionService } from "../../utils/detection";

const HomeNative: React.FC = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if device supports the feature
    const supported = DetectionService.isSupported();
    setIsSupported(supported);

    if (!supported) {
      return;
    }

    // Load saved permission status
    const checkPermissions = async () => {
      const granted = await loadPermissionStatus();
      setPermissionGranted(granted);

      if (!granted) {
        setShowPermissionDialog(true);
      }
    };

    checkPermissions();
  }, []);

  const handleGrantPermission = () => {
    setPermissionGranted(true);
    setShowPermissionDialog(false);
    savePermissionStatus(true);
  };

  const handleDenyPermission = () => {
    setShowPermissionDialog(false);
  };

  const handleRequestPermissionsAgain = () => {
    setShowPermissionDialog(true);
  };

  const handleMinimizePanel = () => {
    setIsPanelMinimized(true);
  };

  const handleExpandPanel = () => {
    setIsPanelMinimized(false);
  };

  const handleClosePanel = () => {
    setIsActive(false);
  };

  if (!isSupported) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <View style={styles.unsupportedContainer}>
          <Text style={styles.unsupportedTitle}>Device Not Supported</Text>
          <Text style={styles.unsupportedText}>
            Your device does not meet the minimum requirements for this app.
            Female Blur Overlay requires Android 7.0 (API level 24) or higher.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Female Full Body Blur Overlay</Text>
        </View>

        {permissionGranted ? (
          <View style={styles.content}>
            <Text style={styles.statusText}>
              The overlay is {isActive ? "active" : "inactive"}. You can
              minimize the control panel to a floating bubble or adjust settings
              as needed.
            </Text>

            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>How to use:</Text>
              <View style={styles.instructionsList}>
                <Text style={styles.instructionItem}>
                  1. Toggle the app on using the switch in the control panel
                </Text>
                <Text style={styles.instructionItem}>
                  2. Adjust sensitivity based on detection needs
                </Text>
                <Text style={styles.instructionItem}>
                  3. Customize blur settings to your preference
                </Text>
                <Text style={styles.instructionItem}>
                  4. Enable battery optimization if needed
                </Text>
                <Text style={styles.instructionItem}>
                  5. Minimize to bubble mode when not adjusting settings
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.permissionButton}
              onPress={handleRequestPermissionsAgain}
            >
              <Text style={styles.permissionButtonText}>
                Manage permissions
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.statusText}>
              This app provides real-time blurring of full female bodies across
              your device. Please grant the necessary permissions to get
              started.
            </Text>

            <TouchableOpacity
              style={styles.requestPermissionButton}
              onPress={handleRequestPermissionsAgain}
            >
              <Text style={styles.requestPermissionButtonText}>
                Request Permissions
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Permission request dialog */}
      {showPermissionDialog && (
        <PermissionRequestNative
          onGrantPermission={handleGrantPermission}
          onDenyPermission={handleDenyPermission}
        />
      )}

      {/* Floating panel or minimized bubble */}
      {permissionGranted && !isPanelMinimized && (
        <FloatingPanelNative
          onMinimize={handleMinimizePanel}
          onClose={handleClosePanel}
        />
      )}

      {permissionGranted && isPanelMinimized && (
        <MinimizedBubbleNative
          isActive={isActive}
          onExpand={handleExpandPanel}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  content: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  instructionsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  instructionsList: {
    marginLeft: 8,
  },
  instructionItem: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: 8,
  },
  permissionButtonText: {
    color: "#3b82f6",
    fontSize: 16,
  },
  requestPermissionButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  requestPermissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  unsupportedTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e11d48",
    marginBottom: 16,
  },
  unsupportedText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 24,
  },
});

export default HomeNative;
