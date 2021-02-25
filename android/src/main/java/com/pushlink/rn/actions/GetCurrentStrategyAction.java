package com.pushlink.rn.actions;

import java.util.Map;
import java.util.HashMap;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.util.Log;

import org.json.JSONObject;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pushlink.android.CustomStrategy;
import com.pushlink.android.PushLink;
import com.pushlink.android.Strategy;
import com.pushlink.android.StrategyEnum;
import com.pushlink.android.AnnoyingPopUpStrategy;
import com.pushlink.android.FriendlyPopUpStrategy;
import com.pushlink.android.NinjaStrategy;
import com.pushlink.android.StatusBarStrategy;
import com.pushlink.rn.PushLinkManager;

public class GetCurrentStrategyAction implements PushLinkPluginAction {

    private final Utils utils = new Utils();

    @Override
    public void execute(Activity activity, ReactApplicationContext reactContext, JSONObject arg, Callback callbackContext) {

        try {

            Strategy strategy = PushLink.getCurrentStrategy();
            Map<String, Object> properties = beanToMap(strategy);

            if (strategy instanceof AnnoyingPopUpStrategy) {
                properties.put("type", StrategyEnum.ANNOYING_POPUP.name());
            } else if (strategy instanceof FriendlyPopUpStrategy) {
                properties.put("type", StrategyEnum.FRIENDLY_POPUP.name());
            } else if (strategy instanceof NinjaStrategy) {
                properties.put("type", StrategyEnum.NINJA.name());
            } else if (strategy instanceof StatusBarStrategy) {
                properties.put("type", StrategyEnum.STATUS_BAR.name());
            } else if (strategy instanceof CustomStrategy) {
                properties.put("type", StrategyEnum.CUSTOM.name());
            } else {
                properties.put("error", "Unknown strategy");
            }

            JSONObject returnValue = new JSONObject(properties);
            callbackContext.invoke(returnValue.toString());

        } catch (Exception e) {

            callbackContext.invoke(utils.returnErrorInvoke("Device Owner not enabled. Strategy CUSTOM required Device Owner!"));

        }

    }

    private Map<String, Object> beanToMap(Object bean) throws SecurityException, IllegalAccessException {
        Map<String, Object> map = new HashMap<>();

        Method[] methods = bean.getClass().getMethods();
        for (Method m : methods) {
            if (m.getName().startsWith("get") && m.getParameterTypes().length == 0 && !m.isVarArgs()) {
                try {
                    String key = m.getName().substring(3, 4).toLowerCase() + m.getName().substring(4);
                    map.put(key, m.invoke(bean));
                } catch (InvocationTargetException e) {
                    Log.e(PushLinkManager.TAG, "Exception trying to invoke method " + m.getName(), e);
                }
            }
        }

        return map;
    }
}