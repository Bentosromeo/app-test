import React from "react";
import { X, Minimize2, Power } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface PanelHeaderProps {
  title?: string;
  isActive?: boolean;
  onToggleActive?: (active: boolean) => void;
  onMinimize?: () => void;
  onClose?: () => void;
}

const PanelHeader = ({
  title = "Female Blur Overlay",
  isActive = false,
  onToggleActive = () => {},
  onMinimize = () => {},
  onClose = () => {},
}: PanelHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800 text-white rounded-t-lg">
      <div className="flex items-center gap-2">
        <Power
          className={`h-5 w-5 ${isActive ? "text-green-400" : "text-gray-400"}`}
        />
        <h2 className="text-lg font-medium">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <span className="text-sm">{isActive ? "On" : "Off"}</span>
                <Switch
                  checked={isActive}
                  onCheckedChange={onToggleActive}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Turn overlay {isActive ? "off" : "on"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onMinimize}
                className="h-8 w-8 text-gray-300 hover:text-white hover:bg-slate-700"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Minimize to bubble</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-gray-300 hover:text-white hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Close overlay</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PanelHeader;
