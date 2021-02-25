package com.pushlink.rn.actions;

import android.app.Activity;

import org.json.JSONObject;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;

public class SetIdleAction implements PushLinkPluginAction {
    private static final String IDLE = "idle";

    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) throws Exception {
        PushLink.idle(arg.getBoolean(IDLE));
        callbackContext.invoke(true);
    }
}