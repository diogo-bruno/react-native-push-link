package com.pushlink.rn.actions;

import android.app.Activity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class SendAsyncExceptionReactNative implements PushLinkPluginAction {

    public class ReactNativeException extends Exception {
        public ReactNativeException(String message) {
            super(message);
        }
    }

    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) throws Exception {
        String error = arg.getString("error");
        ReactNativeException t = new ReactNativeException(error);
        PushLink.sendAsyncException(t);
        callbackContext.invoke(true);
    }
}