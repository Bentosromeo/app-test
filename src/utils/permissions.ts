import { Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

export type PermissionStatus =
  | "granted"
  | "denied"
  | "unavailable"
  | "blocked"
  | "limited";

// Required permissions for overlay and camera access
export const requiredPermissions = Platform.select({
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW,
    // For Android 10+ (API 29+)
    ...(parseInt(Platform.Version as string, 10) >= 29
      ? [PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION]
      : []),
    // For Android 11+ (API 30+)
    ...(parseInt(Platform.Version as string, 10) >= 30
      ? [PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE]
      : []),
  ],
  default: [],
});

// Check if all required permissions are granted
export const checkPermissions = async (): Promise<PermissionStatus> => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return "unavailable";
  }

  const results = await Promise.all(
    requiredPermissions.map((permission) => check(permission)),
  );

  if (results.every((result) => result === RESULTS.GRANTED)) {
    return "granted";
  } else if (results.some((result) => result === RESULTS.BLOCKED)) {
    return "blocked";
  } else if (results.some((result) => result === RESULTS.DENIED)) {
    return "denied";
  } else {
    return "unavailable";
  }
};

// Request all required permissions
export const requestPermissions = async (): Promise<PermissionStatus> => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return "unavailable";
  }

  const results = await Promise.all(
    requiredPermissions.map((permission) => request(permission)),
  );

  if (results.every((result) => result === RESULTS.GRANTED)) {
    return "granted";
  } else if (results.some((result) => result === RESULTS.BLOCKED)) {
    return "blocked";
  } else if (results.some((result) => result === RESULTS.DENIED)) {
    return "denied";
  } else {
    return "unavailable";
  }
};
