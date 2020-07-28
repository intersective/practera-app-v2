package com.practera.appv2;

import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.google.firebase.messaging.RemoteMessage;
import com.pusher.pushnotifications.PushNotificationReceivedListener;
import com.pusher.pushnotifications.PushNotifications;

import com.trtshen.pusherbeamsauth.CapacitorPusherBeamsAuth;
import com.cesarbarone.pusherbeams.PusherBeams;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);

      PushNotifications.start(getApplicationContext(), "f5df7283-144c-458c-ac23-622b2d47eed9");
      PushNotifications.addDeviceInterest("general");

      add(CapacitorPusherBeamsAuth.class);
      add(PusherBeams.class);
    }});
  }

  @Override
  public void onResume() {
    super.onResume();

    PushNotifications.setOnMessageReceivedListenerForVisibleActivity(this, new PushNotificationReceivedListener() {
      @Override
      public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.d("PusherBeamsOnResume", remoteMessage.toString());
      }
    });
  }
}
