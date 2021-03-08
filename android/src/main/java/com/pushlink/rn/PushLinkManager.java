package com.pushlink.rn;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.pushlink.rn.actions.AddExceptionMetadataAction;
import com.pushlink.rn.actions.AddMetadataAction;
import com.pushlink.rn.actions.DisableExceptionNotificationAction;
import com.pushlink.rn.actions.EnableExceptionNotificationAction;
import com.pushlink.rn.actions.GetCurrentStrategyAction;
import com.pushlink.rn.actions.GetDeviceId;
import com.pushlink.rn.actions.HasPendingUpdateAction;
import com.pushlink.rn.actions.InstallAPK;
import com.pushlink.rn.actions.PushLinkPluginAction;
import com.pushlink.rn.actions.SendAsyncExceptionReactNative;
import com.pushlink.rn.actions.SetCurrentActivityAction;
import com.pushlink.rn.actions.SetCurrentStrategyAction;
import com.pushlink.rn.actions.SetIdleAction;
import com.pushlink.rn.actions.StartAction;
import com.pushlink.rn.actions.Utils;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class PushLinkManager extends ReactContextBaseJavaModule implements LifecycleEventListener {

    public static final String TAG = "PushLinkPlugin";

    private final ReactApplicationContext reactContext;

    private Toast mToast;

    public static final String REACT_CLASS = "RNPushLink";

    public static final String START_ACTION = "start";
    public static final String ADD_EXCEPTION_METADATA = "addExceptionMetadata";
    public static final String ADD_METADATA = "addMetadata";
    public static final String DISABLE_EXCEPTION_NOTIFICATION = "disableExceptionNotification";
    public static final String ENABLE_EXCEPTION_NOTIFICATION = "enableExceptionNotification";
    public static final String SET_CURRENT_STRATEGY = "setCurrentStrategy";
    public static final String GET_CURRENT_STRATEGY = "getCurrentStrategy";
    public static final String SET_CURRENT_ACTIVITY = "setCurrentActivity";
    public static final String HAS_PENDING_UPDATE = "hasPendingUpdate";
    public static final String SET_IDLE = "idle";
    public static final String GET_DEVICE_ID = "getDeviceId";
    public static final String INSTALL_APK = "installApk";
    public static final String SEND_EXCEPTION_REACT_NATIVE = "SendAsyncExceptionReactNative";

    Utils utils = new Utils();

    public PushLinkManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        Log.i(PushLinkManager.TAG, "Initializing " + TAG + " v:" + Version.pluginVersion);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    private static final Map<String, PushLinkPluginAction> actions;

    static {
        actions = new HashMap<>();
        actions.put(START_ACTION, new StartAction());
        actions.put(ADD_EXCEPTION_METADATA, new AddExceptionMetadataAction());
        actions.put(ADD_METADATA, new AddMetadataAction());
        actions.put(DISABLE_EXCEPTION_NOTIFICATION, new DisableExceptionNotificationAction());
        actions.put(ENABLE_EXCEPTION_NOTIFICATION, new EnableExceptionNotificationAction());
        actions.put(SET_CURRENT_STRATEGY, new SetCurrentStrategyAction());
        actions.put(GET_CURRENT_STRATEGY, new GetCurrentStrategyAction());
        actions.put(HAS_PENDING_UPDATE, new HasPendingUpdateAction());
        actions.put(SET_IDLE, new SetIdleAction());
        actions.put(SET_CURRENT_ACTIVITY, new SetCurrentActivityAction());
        actions.put(GET_DEVICE_ID, new GetDeviceId());
        actions.put(INSTALL_APK, new InstallAPK());
        actions.put(SEND_EXCEPTION_REACT_NATIVE, new SendAsyncExceptionReactNative());
    }

    @ReactMethod
    public void execute(String action, ReadableArray actionArgs, Callback callbackContext) {
        try {
            final Activity activity = getCurrentActivity();

            JSONObject arg = new JSONObject();

            try {
                if (actionArgs != null && actionArgs.size() > 0 && !actionArgs.isNull(0)) {

                    JSONArray jsonArray = convertArrayToJson(actionArgs);

                    if (jsonArray != null && jsonArray.length() > 0) {
                        arg = jsonArray.getJSONObject(0);
                    }

                }
            } catch (Exception e) {
                Log.e(PushLinkManager.TAG, "Exception actionArgs convertArrayToJson: " + e.getMessage(), e);
            }

            if (actions.containsKey(action)) {

                PushLinkPluginAction pluginAction = actions.get(action);
                assert pluginAction != null;
                pluginAction.execute(activity, reactContext, arg, callbackContext);

            } else if ("set_msg_update_apk".equals(action)) {

                Utils.setMsgUpdateApk(reactContext, arg.getString("message"));
                callbackContext.invoke(true);

            } else if ("version".equals(action)) {

                JSONObject returnValue = new JSONObject();
                returnValue.put("version", Version.pluginVersion);
                callbackContext.invoke(returnValue.toString());

            } else if (action.equals("toast") && arg.getString("message") != null) {

                if (mToast != null) {
                    mToast.cancel();
                }
                mToast = Toast.makeText(reactContext, "", Toast.LENGTH_LONG);
                mToast.setText(arg.getString("message"));
                mToast.show();

            } else {

                callbackContext.invoke(utils.returnErrorInvoke("Invalid action: " + action));

            }

        } catch (Exception e) {
            Log.e(PushLinkManager.TAG, "Exception execut action: " + e.getMessage(), e);
            callbackContext.invoke(utils.returnErrorInvoke(e.getMessage()));
        }
    }

    private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    private static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }

    @Override
    public void onHostResume() {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("androidActivityResumed", true);
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {

    }

}
