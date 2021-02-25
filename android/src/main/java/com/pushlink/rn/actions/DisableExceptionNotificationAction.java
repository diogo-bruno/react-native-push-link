package com.pushlink.rn.actions;

import android.app.Activity;

import org.json.JSONObject;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;

public class DisableExceptionNotificationAction implements PushLinkPluginAction {
    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) {
        PushLink.disableExceptionNotification();
        callbackContext.invoke(true);
    }
}