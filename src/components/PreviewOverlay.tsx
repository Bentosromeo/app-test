import React, { useState } from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface PreviewOverlayProps {
  blurIntensity?: number;
  blurType?: "gaussian" | "pixelate" | "blackbar";
  onBlurIntensityChange?: (value: number) => void;
  onBlurTypeChange?: (type: "gaussian" | "pixelate" | "blackbar") => void;
}

const PreviewOverlay = ({
  blurIntensity = 15,
  blurType = "gaussian",
  onBlurIntensityChange = () => {},
  onBlurTypeChange = () => {},
}: PreviewOverlayProps) => {
  const [localBlurIntensity, setLocalBlurIntensity] = useState(blurIntensity);

  // Apply different blur effects based on the selected type
  const getBlurStyle = () => {
    switch (blurType) {
      case "gaussian":
        return { filter: `blur(${localBlurIntensity}px)` };
      case "pixelate":
        // Simulating pixelation effect with a combination of blur and low resolution
        return {
          filter: `blur(${localBlurIntensity / 5}px)`,
          imageRendering: "pixelated",
          transform: `scale(${1 - localBlurIntensity / 100})`,
        };
      case "blackbar":
        return { backgroundColor: "black" };
      default:
        return { filter: `blur(${localBlurIntensity}px)` };
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setLocalBlurIntensity(newValue);
    onBlurIntensityChange(newValue);
  };

  return (
    <Card className="w-full max-w-[300px] p-4 bg-white shadow-md rounded-lg">
      <div className="space-y-4">
        <div className="text-lg font-medium">Preview</div>

        <div className="relative h-[150px] w-full bg-gray-100 rounded-md overflow-hidden">
          {/* Original image (placeholder) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
              alt="Full body preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Blurred overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={getBlurStyle()}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
              alt="Blurred full body preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="blur-intensity">
              Blur Intensity: {localBlurIntensity}px
            </Label>
          </div>
          <Slider
            id="blur-intensity"
            min={5}
            max={25}
            step={1}
            value={[localBlurIntensity]}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};

export default PreviewOverlay;
