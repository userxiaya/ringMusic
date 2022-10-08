package com.tsapp.tools;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;

import androidx.palette.graphics.Palette;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;

public class tools {
    public static void getBackgroundByUrl(String url, Callback successCallback, Callback errorCallback) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Bitmap bm = null;
                    URL iconUrl = new URL(url);
                    URLConnection conn = iconUrl.openConnection();
                    HttpURLConnection http = (HttpURLConnection) conn;

                    int length = http.getContentLength();

                    conn.connect();
                    // 获得图像的字符流
                    InputStream is = conn.getInputStream();
                    BufferedInputStream bis = new BufferedInputStream(is, length);
                    bm = BitmapFactory.decodeStream(bis);
                    getBackground(bm, successCallback, errorCallback);
                    bis.close();
                    is.close();// 关闭流
                }
                catch (Exception e) {
                    errorCallback.invoke(e.getMessage());
                    e.printStackTrace();
                }
            }
        }).start();
    }
    public static String toRgb(int color) {
        int red = (color & 0xff0000) >> 16;
        int green = (color & 0x00ff00) >> 8;
        int blue = (color & 0x0000ff);
        return red+","+green+","+blue;
    }
    public static void getBackground(Bitmap resource, Callback successCallback, Callback errorCallback) {
        Palette.from(resource).generate(new Palette.PaletteAsyncListener() {
            @Override
            public void onGenerated(Palette palette) {
                WritableMap result = Arguments.createMap();
                //记得判空
                if (palette!=null) {
                    if (palette.getDarkVibrantColor(Color.TRANSPARENT) != Color.TRANSPARENT) {
                        result.putString("startColor", toRgb(palette.getDarkVibrantColor(Color.TRANSPARENT)));
                        result.putString("endColor", toRgb(palette.getVibrantColor(Color.TRANSPARENT)));
                    } else if (palette.getDarkMutedColor(Color.TRANSPARENT) != Color.TRANSPARENT) {
                        result.putString("startColor", toRgb(palette.getDarkMutedColor(Color.TRANSPARENT)));
                        result.putString("endColor", toRgb(palette.getMutedColor(Color.TRANSPARENT)));
                    } else {
                        result.putString("startColor", toRgb(palette.getLightMutedColor(Color.TRANSPARENT)));
                        result.putString("endColor", toRgb(palette.getLightVibrantColor(Color.TRANSPARENT)));
                    }
                    successCallback.invoke(result);
                }
            }
        });
    }
}
