package com.practera.appv2;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.pusher.pushnotifications.PushNotifications;
import com.practera.capacitor.pusherbeams.PusherBeams;
import com.practera.capacitor.custom.CustomNativePlugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      //PushNotifications.start(getApplicationContext(), "c0ba349e-66c6-440d-8ac7-fe229709d088");
      PushNotifications.start(getApplicationContext(), "bbc6d8fe-9e50-4bec-865f-4adc1cef05b5");
      PushNotifications.addDeviceInterest("hello");
      add(PusherBeams.class);
      add(CustomNativePlugin.class);
      
    }});
  }
}
