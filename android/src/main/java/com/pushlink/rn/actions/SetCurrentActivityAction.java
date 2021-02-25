package com.pushlink.rn.actions;

import android.app.Activity;
import android.util.Log;

import org.json.JSONObject;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;
import com.pushlink.rn.PushLinkManager;

public class SetCurrentActivityAction implements PushLinkPluginAction {

    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) {
        Log.i(PushLinkManager.TAG, "Setting PushLink currentActivity after resume");
        PushLink.setCurrentActivity(activity);
        callbackContext.invoke(true);
    }
}