package com.pushlink.rn.actions;

import android.app.Activity;
import android.os.Build;
import android.util.Log;

import org.json.JSONObject;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.PushLink;
import com.pushlink.android.StrategyEnum;
import com.pushlink.android.AnnoyingPopUpStrategy;
import com.pushlink.android.FriendlyPopUpStrategy;
import com.pushlink.android.StatusBarStrategy;
import com.pushlink.rn.PushLinkManager;

public class SetCurrentStrategyAction implements PushLinkPluginAction {
    private static final String STRATEGY = "strategy";
    private static final String PROPERTIES = "properties";

    private static final String REMINDER_TIME = "reminderTimeInSeconds";
    private static final String POPUP_MESSAGE = "popUpMessage";
    private static final String UPDATE_BUTTON = "updateButton";
    private static final String NOT_NOW_BUTTON = "notNowButton";
    private static final String STATUS_BAR_TITLE = "statusBarTitle";
    private static final String STATUS_BAR_DESCRIPTION = "statusBarDescription";

    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, final Callback callbackContext) throws Exception {

        Utils utils = new Utils();
        boolean error = false;
        int minSdkCustomStrategy = 23;

        String strategyName = arg.getString(STRATEGY);
        JSONObject properties = arg.getJSONObject(PROPERTIES);

        StrategyEnum se = Enum.valueOf(StrategyEnum.class, strategyName);

        if (se.equals(StrategyEnum.CUSTOM)) {

            if (Build.VERSION.SDK_INT < minSdkCustomStrategy) {

                error = true;
                callbackContext.invoke(utils.returnErrorInvoke("Strategy CUSTOM required SDK >= " + minSdkCustomStrategy));

            } else if (!utils.isDeviceOwner(reactContext)) {

                error = true;
                callbackContext.invoke(utils.returnErrorInvoke("Device Owner not enabled. Strategy CUSTOM required Device Owner!"));

            }

        }


        if (!error)
            PushLink.setCurrentStrategy(se);


        switch (se) {
            case ANNOYING_POPUP:
                AnnoyingPopUpStrategy annoyingPopUpStrategy = (AnnoyingPopUpStrategy) PushLink.getCurrentStrategy();
                if (properties.has(POPUP_MESSAGE)) {
                    annoyingPopUpStrategy.setPopUpMessage(properties.getString(POPUP_MESSAGE));
                }

                if (properties.has(UPDATE_BUTTON)) {
                    annoyingPopUpStrategy.setUpdateButton(properties.getString(UPDATE_BUTTON));
                }
                break;

            case FRIENDLY_POPUP:
                FriendlyPopUpStrategy friendlyPopUpStrategy = (FriendlyPopUpStrategy) PushLink.getCurrentStrategy();

                if (properties.has(REMINDER_TIME)) {
                    friendlyPopUpStrategy.setReminderTimeInSeconds(properties.getInt(REMINDER_TIME));
                }

                if (properties.has(POPUP_MESSAGE)) {
                    friendlyPopUpStrategy.setPopUpMessage(properties.getString(POPUP_MESSAGE));
                }

                if (properties.has(UPDATE_BUTTON)) {
                    friendlyPopUpStrategy.setUpdateButton(properties.getString(UPDATE_BUTTON));
                }

                if (properties.has(NOT_NOW_BUTTON)) {
                    friendlyPopUpStrategy.setNotNowButton(properties.getString(NOT_NOW_BUTTON));
                }
                break;

            case STATUS_BAR:
                StatusBarStrategy statusBarStrategy = (StatusBarStrategy) PushLink.getCurrentStrategy();
                if (properties.has(STATUS_BAR_TITLE)) {
                    statusBarStrategy.setStatusBarTitle(properties.getString(STATUS_BAR_TITLE));
                }

                if (properties.has(STATUS_BAR_DESCRIPTION)) {
                    statusBarStrategy.setStatusBarDescription(properties.getString(STATUS_BAR_DESCRIPTION));
                }
                break;

            case NINJA:

                // no options properties

                break;
            case CUSTOM:

                SetStrategyBroadcastReceiver.TypeBroadcastReceiver typeBroadcastReceiver = null;

                try {
                    typeBroadcastReceiver = SetStrategyBroadcastReceiver.TypeBroadcastReceiver.valueOf(properties.getString("TypeBroadcastReceiver"));
                } catch (Exception e) {
                    Log.e(PushLinkManager.TAG, "SetStrategyBroadcastReceiver.TypeBroadcastReceiver from properties.getString", e);
                }

                new SetStrategyBroadcastReceiver((ReactApplicationContext) reactContext, callbackContext, typeBroadcastReceiver);

                break;
        }

        if (!error)
            callbackContext.invoke(true);

    }

}