package com.tsapp.tools;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class appTools extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public appTools(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "appTools";
    }
    @ReactMethod
    public void getBackGroundByImage(String image, Callback successCallback, Callback errorCallback) {
        tools.getBackgroundByUrl(image,successCallback, errorCallback);
    }
}
