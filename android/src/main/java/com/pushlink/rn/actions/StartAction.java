package com.pushlink.rn.actions;

import android.app.Activity;
import android.content.pm.PackageManager;
import android.util.Log;

import org.json.JSONObject;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;
import com.pushlink.rn.PushLinkManager;

public class StartAction implements PushLinkPluginAction {
    private static final String API_KEY = "apiKey";
    private static final String DEVICE_ID = "deviceId";
    private static final String ICON = "icon";

    private static final String RESOURCE_DRAWABLE = "drawable";
    private static final String RESOURCE_MIPMAP = "mipmap";

    final Utils utils = new Utils();

    @Override
    public void execute(final Activity activity, final ReactApplicationContext reactContext, JSONObject arg, final Callback callbackContext) {

        try {

            final String apiKey = arg.getString(API_KEY);

            final String deviceId = arg.getString(DEVICE_ID);

            final String packageName = activity.getApplicationContext().getPackageName();

            int iconId = activity.getResources().getIdentifier(ICON, RESOURCE_DRAWABLE, packageName);

            if (iconId == 0) {
                iconId = activity.getResources().getIdentifier(ICON, RESOURCE_MIPMAP, packageName);
            }

            if (iconId == 0) {
                iconId = reactContext.getResources().getIdentifier(ICON, RESOURCE_MIPMAP, packageName);
            }

            if (iconId == 0) {
                iconId = reactContext.getApplicationInfo().icon;
            }

            if (iconId == 0) {
                iconId = reactContext.getPackageManager().getApplicationInfo(packageName, PackageManager.GET_META_DATA).icon;
            }

            final int appIconId = iconId;

            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        PushLink.start(activity, appIconId, apiKey, deviceId);
                        Log.i(PushLinkManager.TAG, "PushLink started");
                        callbackContext.invoke(true);
                    } catch (Exception e) {
                        callbackContext.invoke(utils.returnErrorInvoke(e.getMessage()));
                    }
                }
            });

        } catch (Exception e) {

            callbackContext.invoke(utils.returnErrorInvoke("Error PushLink.start -> " + e.getMessage()));

        }

    }
}