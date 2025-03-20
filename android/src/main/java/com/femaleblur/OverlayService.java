package com.femaleblur;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import org.json.JSONException;
import org.json.JSONObject;

public class OverlayService extends Service {
    private static final String TAG = "OverlayService";
    private static final int NOTIFICATION_ID = 1001;
    private static final String CHANNEL_ID = "FemaleBlurOverlay";
    
    public static final String ACTION_UPDATE_CONFIG = "com.femaleblur.UPDATE_CONFIG";
    
    private WindowManager windowManager;
    private View overlayView;
    private JSONObject config;
    private boolean isDetectionRunning = false;
    
    @Override
    public void onCreate() {
        super.onCreate();
        windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            stopSelf();
            return START_NOT_STICKY;
        }
        
        String action = intent.getAction();
        String configJson = intent.getStringExtra("config");
        
        if (configJson != null) {
            try {
                config = new JSONObject(configJson);
                
                if (ACTION_UPDATE_CONFIG.equals(action)) {
                    updateOverlayConfig();
                } else {
                    startOverlay();
                }
            } catch (JSONException e) {
                Log.e(TAG, "Failed to parse config JSON", e);
                stopSelf();
            }
        } else {
            stopSelf();
        }
        
        return START_STICKY;
    }

    private void startOverlay() {
        createNotificationChannel();
        startForeground(NOTIFICATION_ID, createNotification());
        
        try {
            // Create and add the overlay view
            if (overlayView == null) {
                FrameLayout overlayLayout = new FrameLayout(this);
                
                // This would be replaced with actual blur view implementation
                View blurView = LayoutInflater.from(this).inflate(R.layout.overlay_view, overlayLayout, false);
                overlayLayout.addView(blurView);
                
                WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                        WindowManager.LayoutParams.MATCH_PARENT,
                        WindowManager.LayoutParams.MATCH_PARENT,
                        getOverlayType(),
                        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                        WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
                        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                        PixelFormat.TRANSLUCENT);
                params.gravity = Gravity.TOP | Gravity.START;
                
                windowManager.addView(overlayLayout, params);
                overlayView = overlayLayout;
            }
            
            // Start detection
            startDetection();
            
        } catch (Exception e) {
            Log.e(TAG, "Failed to create overlay", e);
            stopSelf();
        }
    }

    private void updateOverlayConfig() {
        // Update the overlay based on new config
        if (overlayView != null) {
            try {
                boolean isActive = config.getBoolean("isActive");
                String blurType = config.getString("blurType");
                int blurIntensity = config.getInt("blurIntensity");
                
                // Update overlay visibility
                overlayView.setVisibility(isActive ? View.VISIBLE : View.GONE);
                
                // Update blur settings
                // This would be implemented with actual blur view code
                
                // Update detection status
                if (isActive && !isDetectionRunning) {
                    startDetection();
                } else if (!isActive && isDetectionRunning) {
                    stopDetection();
                }
                
            } catch (JSONException e) {
                Log.e(TAG, "Failed to parse config values", e);
            }
        }
    }

    private void startDetection() {
        if (!isDetectionRunning) {
            isDetectionRunning = true;
            // This would be implemented with actual ML detection code
            Log.d(TAG, "Detection started");
        }
    }

    private void stopDetection() {
        if (isDetectionRunning) {
            isDetectionRunning = false;
            // This would stop the ML detection
            Log.d(TAG, "Detection stopped");
        }
    }

    private int getOverlayType() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            return WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Female Blur Overlay",
                    NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Shows when the female blur overlay is active");
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);
        
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Female Blur Overlay")
                .setContentText("Overlay is active")
                .setSmallIcon(R.drawable.ic_notification)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    @Override
    public void onDestroy() {
        stopDetection();
        
        if (overlayView != null) {
            windowManager.removeView(overlayView);
            overlayView = null;
        }
        
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
