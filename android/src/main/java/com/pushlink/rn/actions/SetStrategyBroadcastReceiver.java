package com.pushlink.rn.actions;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.net.Uri;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.pushlink.rn.PushLinkManager;

public class SetStrategyBroadcastReceiver extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final ReactApplicationContext reactContext;
    private final Callback callbackContext;
    private final Utils utils = new Utils();

    private TypeBroadcastReceiver typeBroadcastReceiver;

    public enum TypeBroadcastReceiver {
        APPLY,
        GIVEUP
    }

    private final BroadcastReceiver newVersionApkReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {

            try {

                Uri apkUri = (Uri) intent.getExtras().get("uri");
                int apkIcon = (int) intent.getExtras().get("icon");
                String apkHash = (String) intent.getExtras().get("hash");

                SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(reactContext);

                prefs.edit().putString("uri_apk", apkUri.toString()).apply();
                prefs.edit().putInt("icon_apk", apkIcon).apply();
                prefs.edit().putString("hash_apk", apkHash).apply();

                WritableMap params = Arguments.createMap();
                params.putString("new_apk", apkUri.toString());
                params.putInt("iconId_apk", apkIcon);
                params.putString("hash_apk", apkHash);

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onReceiverStrategyCustom", params);

            } catch (Exception e) {
                Log.e(PushLinkManager.TAG, "Exception: " + e.getMessage(), e);
                callbackContext.invoke(utils.returnErrorInvoke(e.getMessage()));
            }

        }
    };

    public SetStrategyBroadcastReceiver(ReactApplicationContext reactContext, Callback callbackContext, TypeBroadcastReceiver typeBroadcastReceiver) {
        super(reactContext);

        this.reactContext = reactContext;
        this.callbackContext = callbackContext;
        this.typeBroadcastReceiver = typeBroadcastReceiver;

        if (newVersionApkReceiver.isOrderedBroadcast())
            reactContext.unregisterReceiver(newVersionApkReceiver);

        registerBroadcastReceiver();
    }

    private void registerBroadcastReceiver() {
        if (typeBroadcastReceiver == null) typeBroadcastReceiver = TypeBroadcastReceiver.APPLY;

        String PUSHLINK_APPLY = "%s.pushlink.APPLY";
        String PUSHLINK_GIVEUP = "%s.pushlink.GIVEUP";

        String intent = typeBroadcastReceiver.equals(TypeBroadcastReceiver.GIVEUP) ? String.format(PUSHLINK_GIVEUP, reactContext.getPackageName()) : String.format(PUSHLINK_APPLY, reactContext.getPackageName());
        IntentFilter filter = new IntentFilter(intent);

        reactContext.registerReceiver(newVersionApkReceiver, filter);
    }

    @NonNull
    @Override
    public String getName() {
        return "SetStrategyBroadcastReceiver";
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        if (newVersionApkReceiver.isOrderedBroadcast())
            reactContext.unregisterReceiver(newVersionApkReceiver);
    }

}
