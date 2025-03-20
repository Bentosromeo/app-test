import React, { useState } from "react";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";

interface BlurSettingsProps {
  blurIntensity?: number;
  blurType?: "gaussian" | "pixelate" | "blackbar";
  onBlurIntensityChange?: (value: number) => void;
  onBlurTypeChange?: (value: "gaussian" | "pixelate" | "blackbar") => void;
  onPreviewClick?: () => void;
}

const BlurSettings = ({
  blurIntensity = 15,
  blurType = "gaussian",
  onBlurIntensityChange = () => {},
  onBlurTypeChange = () => {},
  onPreviewClick = () => {},
}: BlurSettingsProps) => {
  const [intensity, setIntensity] = useState(blurIntensity);
  const [type, setType] = useState(blurType);

  const handleIntensityChange = (value: number[]) => {
    const newValue = value[0];
    setIntensity(newValue);
    onBlurIntensityChange(newValue);
  };

  const handleTypeChange = (value: string) => {
    const newValue = value as "gaussian" | "pixelate" | "blackbar";
    setType(newValue);
    onBlurTypeChange(newValue);
  };

  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg">
      <h3 className="text-lg font-medium mb-4">Blur Settings</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="blur-intensity">Blur Intensity</Label>
            <span className="text-sm text-gray-500">{intensity}px</span>
          </div>
          <Slider
            id="blur-intensity"
            min={5}
            max={25}
            step={1}
            value={[intensity]}
            onValueChange={handleIntensityChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5px</span>
            <span>25px</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label>Blur Type</Label>
          <RadioGroup
            value={type}
            onValueChange={handleTypeChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gaussian" id="gaussian" />
              <Label htmlFor="gaussian" className="cursor-pointer">
                Gaussian Blur
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pixelate" id="pixelate" />
              <Label htmlFor="pixelate" className="cursor-pointer">
                Pixelate
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blackbar" id="blackbar" />
              <Label htmlFor="blackbar" className="cursor-pointer">
                Black Bar
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={onPreviewClick}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          Preview Changes
        </Button>
      </div>
    </Card>
  );
};

export default BlurSettings;
