import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface SensitivityControlsProps {
  onSensitivityChange?: (value: string) => void;
  defaultSensitivity?: string;
}

const SensitivityControls: React.FC<SensitivityControlsProps> = ({
  onSensitivityChange = () => {},
  defaultSensitivity = "medium",
}) => {
  const [sensitivity, setSensitivity] = useState<string>(defaultSensitivity);

  const handleSensitivityChange = (value: string) => {
    setSensitivity(value);
    onSensitivityChange(value);
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-900">
            Detection Sensitivity
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-500 hover:text-gray-700">
                  <Info size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  Higher sensitivity detects more full bodies but may increase
                  false positives and battery usage
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={sensitivity}
          onValueChange={handleSensitivityChange}
          className="flex justify-between space-x-2 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="text-sm font-normal cursor-pointer">
              Low
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label
              htmlFor="medium"
              className="text-sm font-normal cursor-pointer"
            >
              Medium
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label
              htmlFor="high"
              className="text-sm font-normal cursor-pointer"
            >
              High
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default SensitivityControls;
