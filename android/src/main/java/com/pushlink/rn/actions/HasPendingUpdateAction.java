package com.pushlink.rn.actions;

import android.app.Activity;

import java.util.Map;
import java.util.HashMap;

import org.json.JSONObject;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;

public class HasPendingUpdateAction implements PushLinkPluginAction {
    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) {
        Boolean hasPendingUpdate = PushLink.hasPengingUpdate();
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("hasPendingUpdate", hasPendingUpdate);

        callbackContext.invoke(new JSONObject(result).toString());
    }
}