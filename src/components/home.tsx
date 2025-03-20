import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import PermissionRequest from "./PermissionRequest";
import FloatingPanel from "./FloatingPanel";
import MinimizedBubble from "./MinimizedBubble";
import PreviewOverlay from "./PreviewOverlay";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/use-toast";

const Home = () => {
  const { toast } = useToast();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [blurSettings, setBlurSettings] = useState({
    intensity: 15,
    type: "gaussian" as "gaussian" | "pixelate" | "blackbar",
  });

  // Handle permission request result
  const handleGrantPermission = () => {
    setPermissionGranted(true);
    setShowPermissionDialog(false);
    toast({
      title: "Permissions Granted",
      description:
        "Female Full Body Blur Overlay is now active and ready to use.",
      duration: 3000,
    });
  };

  const handleDenyPermission = () => {
    setShowPermissionDialog(false);
    toast({
      title: "Permissions Required",
      description:
        "Female Full Body Blur Overlay needs permissions to function properly.",
      variant: "destructive",
      duration: 3000,
    });
  };

  // Handle panel state
  const handleMinimizePanel = () => {
    setIsPanelMinimized(true);
  };

  const handleExpandPanel = () => {
    setIsPanelMinimized(false);
  };

  const handleToggleActive = (active: boolean) => {
    setIsActive(active);
    toast({
      title: active ? "Detection Active" : "Detection Paused",
      description: active
        ? "Female full body blur overlay is now running"
        : "Female full body blur overlay is now paused",
      duration: 2000,
    });
  };

  // Handle preview
  const handlePreviewClick = () => {
    setShowPreview(!showPreview);
  };

  const handleBlurSettingsChange = (settings: {
    intensity?: number;
    type?: "gaussian" | "pixelate" | "blackbar";
  }) => {
    setBlurSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  // Request permissions again if denied
  const handleRequestPermissionsAgain = () => {
    setShowPermissionDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
      {/* Main content when permissions are granted */}
      {permissionGranted ? (
        <div className="w-full max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            Female Full Body Blur Overlay
          </h1>
          <p className="text-gray-600 mb-8">
            The overlay is {isActive ? "active" : "inactive"}. You can minimize
            the control panel to a floating bubble or adjust settings as needed.
          </p>

          {/* Preview section (conditionally rendered) */}
          {showPreview && (
            <div className="mb-8 flex justify-center">
              <PreviewOverlay
                blurIntensity={blurSettings.intensity}
                blurType={blurSettings.type}
                onBlurIntensityChange={(value) =>
                  handleBlurSettingsChange({ intensity: value })
                }
                onBlurTypeChange={(type) => handleBlurSettingsChange({ type })}
              />
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-2">How to use:</h2>
            <ol className="text-left text-gray-700 space-y-2">
              <li>
                1. Toggle the app on using the switch in the control panel
              </li>
              <li>2. Adjust sensitivity based on detection needs</li>
              <li>3. Customize blur settings to your preference</li>
              <li>4. Enable battery optimization if needed</li>
              <li>5. Minimize to bubble mode when not adjusting settings</li>
            </ol>
          </div>

          <button
            onClick={handleRequestPermissionsAgain}
            className="text-primary underline text-sm"
          >
            Manage permissions
          </button>
        </div>
      ) : (
        /* Content when permissions are not granted */
        <div className="w-full max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            Female Full Body Blur Overlay
          </h1>
          <p className="text-gray-600 mb-8">
            This app provides real-time blurring of full female bodies across
            your device. Please grant the necessary permissions to get started.
          </p>

          <button
            onClick={handleRequestPermissionsAgain}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Request Permissions
          </button>
        </div>
      )}

      {/* Permission request dialog */}
      {showPermissionDialog && (
        <PermissionRequest
          open={showPermissionDialog}
          onGrantPermission={handleGrantPermission}
          onDenyPermission={handleDenyPermission}
        />
      )}

      {/* Floating panel or minimized bubble */}
      <AnimatePresence>
        {permissionGranted && !isPanelMinimized && (
          <FloatingPanel
            isOpen={true}
            onMinimize={handleMinimizePanel}
            onClose={() => setIsActive(false)}
            position={{ x: 20, y: 20 }}
          />
        )}

        {permissionGranted && isPanelMinimized && (
          <MinimizedBubble
            isActive={isActive}
            onExpand={handleExpandPanel}
            position={{ x: 20, y: 100 }}
          />
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
};

export default Home;
