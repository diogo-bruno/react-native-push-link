package com.pushlink.rn.actions;

import android.app.Activity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;

import org.json.JSONObject;

public interface PushLinkPluginAction {
    void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) throws Exception;
}