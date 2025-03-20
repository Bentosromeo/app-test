import { Platform, NativeModules } from "react-native";
import { DetectionConfig, DetectionService } from "../utils/detection";

// Interface for the native module
interface OverlayModuleInterface {
  startOverlayService(config: string): Promise<boolean>;
  stopOverlayService(): Promise<boolean>;
  updateOverlayConfig(config: string): Promise<boolean>;
}

// Get the native module (would be implemented in Java/Kotlin)
const OverlayModule =
  Platform.OS === "android"
    ? (NativeModules.OverlayModule as OverlayModuleInterface)
    : null;

export class OverlayService {
  private static instance: OverlayService;
  private isRunning: boolean = false;
  private detectionService: DetectionService;

  private constructor() {
    this.detectionService = DetectionService.getInstance();
  }

  public static getInstance(): OverlayService {
    if (!OverlayService.instance) {
      OverlayService.instance = new OverlayService();
    }
    return OverlayService.instance;
  }

  public async startOverlay(config: DetectionConfig): Promise<boolean> {
    if (!OverlayModule) {
      console.error("Overlay module not available");
      return false;
    }

    try {
      // Start the native overlay service
      const success = await OverlayModule.startOverlayService(
        JSON.stringify(config),
      );

      if (success) {
        this.isRunning = true;
        // Update detection service config
        this.detectionService.updateConfig(config);
      }

      return success;
    } catch (error) {
      console.error("Failed to start overlay service:", error);
      return false;
    }
  }

  public async stopOverlay(): Promise<boolean> {
    if (!OverlayModule) {
      console.error("Overlay module not available");
      return false;
    }

    try {
      // Stop the native overlay service
      const success = await OverlayModule.stopOverlayService();

      if (success) {
        this.isRunning = false;
        // Stop detection service
        this.detectionService.updateConfig({ isActive: false });
      }

      return success;
    } catch (error) {
      console.error("Failed to stop overlay service:", error);
      return false;
    }
  }

  public async updateConfig(
    config: Partial<DetectionConfig>,
  ): Promise<boolean> {
    if (!OverlayModule || !this.isRunning) {
      return false;
    }

    try {
      // Update the native overlay service config
      const currentConfig = this.detectionService.getConfig();
      const newConfig = { ...currentConfig, ...config };

      const success = await OverlayModule.updateOverlayConfig(
        JSON.stringify(newConfig),
      );

      if (success) {
        // Update detection service config
        this.detectionService.updateConfig(config);
      }

      return success;
    } catch (error) {
      console.error("Failed to update overlay config:", error);
      return false;
    }
  }

  public isOverlayRunning(): boolean {
    return this.isRunning;
  }
}
