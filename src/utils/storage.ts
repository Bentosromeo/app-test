import AsyncStorage from "@react-native-async-storage/async-storage";
import { DetectionConfig } from "./detection";

// Keys for AsyncStorage
const STORAGE_KEYS = {
  DETECTION_CONFIG: "female_blur_detection_config",
  PERMISSION_GRANTED: "female_blur_permission_granted",
};

// Save detection configuration to persistent storage
export const saveDetectionConfig = async (
  config: DetectionConfig,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.DETECTION_CONFIG,
      JSON.stringify(config),
    );
  } catch (error) {
    console.error("Error saving detection config:", error);
  }
};

// Load detection configuration from persistent storage
export const loadDetectionConfig =
  async (): Promise<DetectionConfig | null> => {
    try {
      const configJson = await AsyncStorage.getItem(
        STORAGE_KEYS.DETECTION_CONFIG,
      );
      return configJson ? JSON.parse(configJson) : null;
    } catch (error) {
      console.error("Error loading detection config:", error);
      return null;
    }
  };

// Save permission status to persistent storage
export const savePermissionStatus = async (granted: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PERMISSION_GRANTED,
      JSON.stringify(granted),
    );
  } catch (error) {
    console.error("Error saving permission status:", error);
  }
};

// Load permission status from persistent storage
export const loadPermissionStatus = async (): Promise<boolean> => {
  try {
    const status = await AsyncStorage.getItem(STORAGE_KEYS.PERMISSION_GRANTED);
    return status ? JSON.parse(status) : false;
  } catch (error) {
    console.error("Error loading permission status:", error);
    return false;
  }
};
