package com.pushlink.rn.actions;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.provider.Settings;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;

import org.json.JSONObject;

import static android.provider.Settings.Secure.getString;

public class GetDeviceId implements PushLinkPluginAction {

    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) {
        @SuppressLint("HardwareIds") String yourDeviceID = getString(reactContext.getContentResolver(), Settings.Secure.ANDROID_ID);
        callbackContext.invoke(yourDeviceID);
    }
}