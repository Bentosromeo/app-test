package com.femaleblur;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;
import org.json.JSONObject;

public class OverlayModule extends ReactContextBaseJavaModule {
    private static final String TAG = "OverlayModule";
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1234;
    private final ReactApplicationContext reactContext;
    private Promise permissionPromise;

    public OverlayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "OverlayModule";
    }

    @ReactMethod
    public void checkOverlayPermission(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            promise.resolve(Settings.canDrawOverlays(reactContext));
        } else {
            // For Android versions below 6.0, overlay permission is granted by default
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void requestOverlayPermission(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(reactContext)) {
                this.permissionPromise = promise;
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + reactContext.getPackageName()));
                Activity currentActivity = getCurrentActivity();
                if (currentActivity != null) {
                    currentActivity.startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
                } else {
                    promise.reject("ACTIVITY_NULL", "Current activity is null");
                }
            } else {
                promise.resolve(true);
            }
        } else {
            // For Android versions below 6.0, overlay permission is granted by default
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void startOverlayService(String configJson, Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactContext)) {
                promise.reject("OVERLAY_PERMISSION_DENIED", "Overlay permission not granted");
                return;
            }

            // Parse the config
            JSONObject config = new JSONObject(configJson);
            
            // Start the overlay service
            Intent intent = new Intent(reactContext, OverlayService.class);
            intent.putExtra("config", configJson);
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(intent);
            } else {
                reactContext.startService(intent);
            }
            
            promise.resolve(true);
        } catch (JSONException e) {
            Log.e(TAG, "Failed to parse config JSON", e);
            promise.reject("INVALID_CONFIG", "Failed to parse config JSON", e);
        } catch (Exception e) {
            Log.e(TAG, "Failed to start overlay service", e);
            promise.reject("SERVICE_START_FAILED", "Failed to start overlay service", e);
        }
    }

    @ReactMethod
    public void stopOverlayService(Promise promise) {
        try {
            Intent intent = new Intent(reactContext, OverlayService.class);
            reactContext.stopService(intent);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to stop overlay service", e);
            promise.reject("SERVICE_STOP_FAILED", "Failed to stop overlay service", e);
        }
    }

    @ReactMethod
    public void updateOverlayConfig(String configJson, Promise promise) {
        try {
            // Parse the config
            JSONObject config = new JSONObject(configJson);
            
            // Update the overlay service config
            Intent intent = new Intent(reactContext, OverlayService.class);
            intent.setAction(OverlayService.ACTION_UPDATE_CONFIG);
            intent.putExtra("config", configJson);
            reactContext.startService(intent);
            
            promise.resolve(true);
        } catch (JSONException e) {
            Log.e(TAG, "Failed to parse config JSON", e);
            promise.reject("INVALID_CONFIG", "Failed to parse config JSON", e);
        } catch (Exception e) {
            Log.e(TAG, "Failed to update overlay config", e);
            promise.reject("CONFIG_UPDATE_FAILED", "Failed to update overlay config", e);
        }
    }
}
