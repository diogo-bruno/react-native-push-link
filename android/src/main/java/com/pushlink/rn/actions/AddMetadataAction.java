package com.pushlink.rn.actions;

import android.app.Activity;

import com.facebook.react.bridge.Callback;

import org.json.JSONObject;

import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;

public class AddMetadataAction implements PushLinkPluginAction {
    private static final String KEY = "key";
    private static final String VALUE = "value";

    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) throws Exception {
        PushLink.addMetadata(arg.getString(KEY), arg.getString(VALUE));
        callbackContext.invoke(true);
    }
}