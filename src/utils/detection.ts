import { Platform } from "react-native";

// Detection sensitivity levels
export type SensitivityLevel = "low" | "medium" | "high";

// Blur types
export type BlurType = "gaussian" | "pixelate" | "blackbar";

// Detection service configuration
export interface DetectionConfig {
  isActive: boolean;
  sensitivity: SensitivityLevel;
  blurIntensity: number;
  blurType: BlurType;
  batteryOptimization: boolean;
}

// Mock detection service for now - would be replaced with actual ML implementation
export class DetectionService {
  private static instance: DetectionService;
  private config: DetectionConfig = {
    isActive: false,
    sensitivity: "medium",
    blurIntensity: 15,
    blurType: "gaussian",
    batteryOptimization: false,
  };
  private detectionInterval: NodeJS.Timeout | null = null;
  private detectionCallback: ((detected: boolean) => void) | null = null;

  private constructor() {}

  public static getInstance(): DetectionService {
    if (!DetectionService.instance) {
      DetectionService.instance = new DetectionService();
    }
    return DetectionService.instance;
  }

  public startDetection(callback: (detected: boolean) => void): void {
    this.detectionCallback = callback;

    if (this.config.isActive && !this.detectionInterval) {
      // Adjust interval based on battery optimization
      const interval = this.config.batteryOptimization ? 1000 : 500;

      this.detectionInterval = setInterval(() => {
        // This would be replaced with actual ML detection
        // For now, just simulate random detections
        const detected = Math.random() > 0.7;
        if (this.detectionCallback) {
          this.detectionCallback(detected);
        }
      }, interval);
    }
  }

  public stopDetection(): void {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }

  public updateConfig(newConfig: Partial<DetectionConfig>): void {
    const wasActive = this.config.isActive;
    this.config = { ...this.config, ...newConfig };

    // Restart detection if active state changed
    if (wasActive !== this.config.isActive) {
      if (this.config.isActive && this.detectionCallback) {
        this.startDetection(this.detectionCallback);
      } else {
        this.stopDetection();
      }
    }
  }

  public getConfig(): DetectionConfig {
    return { ...this.config };
  }

  // Check if the device supports ML detection
  public static isSupported(): boolean {
    if (Platform.OS !== "android") return false;

    // Check Android version (7.0 is API level 24)
    const androidVersion = parseInt(Platform.Version as string, 10);
    return androidVersion >= 24;
  }
}
