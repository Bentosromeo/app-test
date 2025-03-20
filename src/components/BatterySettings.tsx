import React, { useState } from "react";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
} from "lucide-react";

interface BatterySettingsProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  batteryLevel?: number;
}

const BatterySettings: React.FC<BatterySettingsProps> = ({
  enabled = false,
  onToggle = () => {},
  batteryLevel = 75,
}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    onToggle(checked);
  };

  const getBatteryIcon = () => {
    if (batteryLevel <= 20)
      return <BatteryLow className="h-5 w-5 text-red-500" />;
    if (batteryLevel >= 80)
      return <BatteryFull className="h-5 w-5 text-green-500" />;
    return <Battery className="h-5 w-5 text-amber-500" />;
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getBatteryIcon()}
            <CardTitle className="text-lg font-medium">
              Battery Optimization
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="battery-saver"
              checked={isEnabled}
              onCheckedChange={handleToggle}
            />
            <Label
              htmlFor="battery-saver"
              className="text-sm font-medium cursor-pointer"
            >
              {isEnabled ? "On" : "Off"}
            </Label>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-500">
          Reduce processing frequency to save battery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current battery level</span>
            <span className="text-sm font-medium">{batteryLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${batteryLevel <= 20 ? "bg-red-500" : batteryLevel >= 80 ? "bg-green-500" : "bg-amber-500"}`}
              style={{ width: `${batteryLevel}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {isEnabled
              ? "Battery saver mode is active. Detection processing will be reduced to conserve power."
              : "Enable battery saver mode to extend battery life during detection."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatterySettings;
