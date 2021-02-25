package com.pushlink.rn.actions;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.SharedPreferences;
import android.net.Uri;
import android.preference.PreferenceManager;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.rn.PushLinkManager;

import org.json.JSONObject;

public class InstallAPK implements PushLinkPluginAction {

    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) {

        Utils utils = new Utils();

        if (!utils.isDeviceOwner(reactContext)) {

            callbackContext.invoke(utils.returnErrorInvoke("Device Owner not enabled. Install APK required Device Owner!"));

        } else {

            SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(reactContext);

            Uri uriApk = Uri.parse(prefs.getString("uri_apk", ""));

            Log.e(PushLinkManager.TAG, "URI Apk Install: " + uriApk.toString());

            if (uriApk == null || uriApk.toString().equals("")) {

                callbackContext.invoke(utils.returnErrorInvoke("No apk file for installation!"));

            } else {
                Toast.makeText(reactContext, "Installation APK started...", Toast.LENGTH_SHORT).show();

                Boolean success = utils.installAPK(reactContext, uriApk, callbackContext);

                if (success) {
                    Utils.resetCacheLastUriDownloadApk(reactContext);
                    callbackContext.invoke(true);
                }

            }

        }


    }
}