import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PanelHeader from "./PanelHeader";
import SensitivityControls from "./SensitivityControls";
import BlurSettings from "./BlurSettings";
import BatterySettings from "./BatterySettings";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface FloatingPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  position?: { x: number; y: number };
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  isOpen = true,
  onClose = () => {},
  onMinimize = () => {},
  position = { x: 20, y: 20 },
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [sensitivity, setSensitivity] = useState("medium");
  const [blurIntensity, setBlurIntensity] = useState(15);
  const [blurType, setBlurType] = useState<
    "gaussian" | "pixelate" | "blackbar"
  >("gaussian");
  const [batteryOptimizationEnabled, setBatteryOptimizationEnabled] =
    useState(false);

  const handleToggleActive = (active: boolean) => {
    setIsActive(active);
  };

  const handleSensitivityChange = (value: string) => {
    setSensitivity(value);
  };

  const handleBlurIntensityChange = (value: number) => {
    setBlurIntensity(value);
  };

  const handleBlurTypeChange = (
    value: "gaussian" | "pixelate" | "blackbar",
  ) => {
    setBlurType(value);
  };

  const handleBatteryOptimizationToggle = (enabled: boolean) => {
    setBatteryOptimizationEnabled(enabled);
  };

  const handlePreviewClick = () => {
    // This would trigger the preview functionality
    console.log("Preview requested with settings:", {
      blurIntensity,
      blurType,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 bg-white rounded-lg shadow-lg overflow-hidden w-[350px]"
          style={{
            top: currentPosition.y,
            left: currentPosition.x,
            backgroundColor: "white", // Explicit background color
          }}
          drag
          dragConstraints={{
            left: 0,
            right: window.innerWidth - 350,
            top: 0,
            bottom: window.innerHeight - 500,
          }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, info) => {
            setIsDragging(false);
            setCurrentPosition((prev) => ({
              x: prev.x + info.offset.x,
              y: prev.y + info.offset.y,
            }));
          }}
        >
          <PanelHeader
            isActive={isActive}
            onToggleActive={handleToggleActive}
            onMinimize={onMinimize}
            onClose={onClose}
          />

          <ScrollArea className="h-[440px] p-4">
            <div className="space-y-4">
              <SensitivityControls
                defaultSensitivity={sensitivity}
                onSensitivityChange={handleSensitivityChange}
              />

              <Separator className="my-4" />

              <BlurSettings
                blurIntensity={blurIntensity}
                blurType={blurType}
                onBlurIntensityChange={handleBlurIntensityChange}
                onBlurTypeChange={handleBlurTypeChange}
                onPreviewClick={handlePreviewClick}
              />

              <Separator className="my-4" />

              <BatterySettings
                enabled={batteryOptimizationEnabled}
                onToggle={handleBatteryOptimizationToggle}
                batteryLevel={75}
              />

              <div className="py-2 text-center text-xs text-gray-500">
                <p>Female Full Body Blur Overlay v1.1</p>
                <p>Tap the minimize button to collapse to bubble mode</p>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingPanel;
