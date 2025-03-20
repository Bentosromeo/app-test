import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import {
  DetectionService,
  SensitivityLevel,
  BlurType,
} from "../../utils/detection";
import { OverlayService } from "../../services/OverlayService";
import { saveDetectionConfig } from "../../utils/storage";

// Mock components - would be implemented with actual UI components
const SensitivityControlsNative = ({ value, onChange }) => (
  <View style={styles.controlSection}>
    <Text style={styles.sectionTitle}>Sensitivity</Text>
    <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={[styles.optionButton, value === "low" && styles.selectedButton]}
        onPress={() => onChange("low")}
      >
        <Text style={styles.buttonText}>Low</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          value === "medium" && styles.selectedButton,
        ]}
        onPress={() => onChange("medium")}
      >
        <Text style={styles.buttonText}>Medium</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, value === "high" && styles.selectedButton]}
        onPress={() => onChange("high")}
      >
        <Text style={styles.buttonText}>High</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const BlurSettingsNative = ({
  intensity,
  type,
  onIntensityChange,
  onTypeChange,
}) => (
  <View style={styles.controlSection}>
    <Text style={styles.sectionTitle}>Blur Settings</Text>

    <Text style={styles.label}>Intensity: {intensity}</Text>
    <View style={styles.sliderContainer}>
      <Text>5</Text>
      <View style={styles.slider}>
        <View
          style={[
            styles.sliderFill,
            { width: `${((intensity - 5) / 20) * 100}%` },
          ]}
        />
      </View>
      <Text>25</Text>
    </View>

    <Text style={styles.label}>Blur Type</Text>
    <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={[
          styles.optionButton,
          type === "gaussian" && styles.selectedButton,
        ]}
        onPress={() => onTypeChange("gaussian")}
      >
        <Text style={styles.buttonText}>Gaussian</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          type === "pixelate" && styles.selectedButton,
        ]}
        onPress={() => onTypeChange("pixelate")}
      >
        <Text style={styles.buttonText}>Pixelate</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          type === "blackbar" && styles.selectedButton,
        ]}
        onPress={() => onTypeChange("blackbar")}
      >
        <Text style={styles.buttonText}>Black Bar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const BatterySettingsNative = ({ enabled, onToggle }) => (
  <View style={styles.controlSection}>
    <Text style={styles.sectionTitle}>Battery Optimization</Text>
    <View style={styles.switchRow}>
      <Text>Enable Battery Saver</Text>
      <TouchableOpacity
        style={[styles.switch, enabled && styles.switchOn]}
        onPress={() => onToggle(!enabled)}
      >
        <View style={[styles.switchThumb, enabled && styles.switchThumbOn]} />
      </TouchableOpacity>
    </View>
  </View>
);

interface FloatingPanelNativeProps {
  onMinimize: () => void;
  onClose: () => void;
}

const FloatingPanelNative: React.FC<FloatingPanelNativeProps> = ({
  onMinimize,
  onClose,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>("medium");
  const [blurIntensity, setBlurIntensity] = useState(15);
  const [blurType, setBlurType] = useState<BlurType>("gaussian");
  const [batteryOptimization, setBatteryOptimization] = useState(false);

  const [pan] = useState(new Animated.ValueXY());
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const overlayService = OverlayService.getInstance();
  const detectionService = DetectionService.getInstance();

  // Set up pan responder for dragging
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gesture) => {
      // Keep panel within screen bounds
      let newX = gesture.moveX - 150; // Adjust based on touch position
      let newY = gesture.moveY - 30; // Adjust based on touch position

      // Boundary checks
      if (newX < 0) newX = 0;
      if (newX > screenWidth - 300) newX = screenWidth - 300;
      if (newY < 0) newY = 0;
      if (newY > screenHeight - 400) newY = screenHeight - 400;

      Animated.spring(pan, {
        toValue: { x: newX, y: newY },
        useNativeDriver: false,
      }).start();
    },
  });

  useEffect(() => {
    // Initialize with saved config if available
    const config = detectionService.getConfig();
    setIsActive(config.isActive);
    setSensitivity(config.sensitivity);
    setBlurIntensity(config.blurIntensity);
    setBlurType(config.blurType);
    setBatteryOptimization(config.batteryOptimization);
  }, []);

  const handleToggleActive = async (active: boolean) => {
    setIsActive(active);

    const config = {
      isActive: active,
      sensitivity,
      blurIntensity,
      blurType,
      batteryOptimization,
    };

    if (active) {
      await overlayService.startOverlay(config);
    } else {
      await overlayService.stopOverlay();
    }

    // Save config
    saveDetectionConfig(config);
  };

  const handleSensitivityChange = async (value: SensitivityLevel) => {
    setSensitivity(value);
    if (isActive) {
      await overlayService.updateConfig({ sensitivity: value });
    }
    saveDetectionConfig({
      ...detectionService.getConfig(),
      sensitivity: value,
    });
  };

  const handleBlurIntensityChange = async (value: number) => {
    setBlurIntensity(value);
    if (isActive) {
      await overlayService.updateConfig({ blurIntensity: value });
    }
    saveDetectionConfig({
      ...detectionService.getConfig(),
      blurIntensity: value,
    });
  };

  const handleBlurTypeChange = async (value: BlurType) => {
    setBlurType(value);
    if (isActive) {
      await overlayService.updateConfig({ blurType: value });
    }
    saveDetectionConfig({ ...detectionService.getConfig(), blurType: value });
  };

  const handleBatteryOptimizationToggle = async (enabled: boolean) => {
    setBatteryOptimization(enabled);
    if (isActive) {
      await overlayService.updateConfig({ batteryOptimization: enabled });
    }
    saveDetectionConfig({
      ...detectionService.getConfig(),
      batteryOptimization: enabled,
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Female Blur Overlay</Text>
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => handleToggleActive(!isActive)}
          >
            <View style={[styles.switch, isActive && styles.switchOn]}>
              <View
                style={[styles.switchThumb, isActive && styles.switchThumbOn]}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onMinimize}>
            <Text>_</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <Text>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <SensitivityControlsNative
          value={sensitivity}
          onChange={handleSensitivityChange}
        />

        <View style={styles.divider} />

        <BlurSettingsNative
          intensity={blurIntensity}
          type={blurType}
          onIntensityChange={handleBlurIntensityChange}
          onTypeChange={handleBlurTypeChange}
        />

        <View style={styles.divider} />

        <BatterySettingsNative
          enabled={batteryOptimization}
          onToggle={handleBatteryOptimizationToggle}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Female Full Body Blur Overlay v1.1
          </Text>
          <Text style={styles.footerText}>
            Tap the minimize button to collapse to bubble mode
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    top: 50,
    left: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f8f8f8",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchContainer: {
    marginRight: 8,
  },
  iconButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  controlSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#3b82f6",
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
    color: "#555",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  slider: {
    flex: 1,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginHorizontal: 8,
  },
  sliderFill: {
    height: 6,
    backgroundColor: "#3b82f6",
    borderRadius: 3,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  switch: {
    width: 50,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    padding: 2,
  },
  switchOn: {
    backgroundColor: "#3b82f6",
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  switchThumbOn: {
    transform: [{ translateX: 26 }],
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 4,
  },
});

export default FloatingPanelNative;
