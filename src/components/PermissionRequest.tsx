import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Shield, Eye, MonitorSmartphone } from "lucide-react";

interface PermissionRequestProps {
  open?: boolean;
  onGrantPermission?: () => void;
  onDenyPermission?: () => void;
}

const PermissionRequest = ({
  open = true,
  onGrantPermission = () => console.log("Permission granted"),
  onDenyPermission = () => console.log("Permission denied"),
}: PermissionRequestProps) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleGrant = () => {
    onGrantPermission();
    setIsOpen(false);
  };

  const handleDeny = () => {
    onDenyPermission();
    setIsOpen(false);
  };

  return (
    <div className="bg-background">
      <AlertDialog open={isOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Permission Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Female Blur Overlay needs the following permissions to function
              properly:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 my-4">
            <div className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/50">
              <MonitorSmartphone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Screen Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Required for detecting female figures on screen in real-time
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/50">
              <Eye className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Display Over Other Apps</h4>
                <p className="text-sm text-muted-foreground">
                  Required to apply blur effects on detected content across
                  applications
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mb-4">
            We respect your privacy. These permissions are only used for the
            blur functionality and no data is stored or shared.
          </p>

          <AlertDialogFooter className="flex-col sm:flex-col space-y-2">
            <AlertDialogAction asChild>
              <Button className="w-full" onClick={handleGrant}>
                Grant Permissions
              </Button>
            </AlertDialogAction>
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full" onClick={handleDeny}>
                Not Now
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PermissionRequest;
