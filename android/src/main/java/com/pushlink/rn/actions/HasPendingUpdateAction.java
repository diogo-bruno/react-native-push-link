package com.pushlink.rn.actions;

import android.app.Activity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;

import org.json.JSONObject;

public class HasPendingUpdateAction implements PushLinkPluginAction {
    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) {
        Boolean hasPendingUpdate = PushLink.hasPengingUpdate();
        callbackContext.invoke(hasPendingUpdate);
    }
}