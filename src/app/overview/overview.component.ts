import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrowserStorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { combineLatest, Observable, of } from 'rxjs';
import { FastFeedbackService } from '../fast-feedback/fast-feedback.service';
import { NotificationService } from '@shared/notification/notification.service';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  isMobile: boolean;
  programName: string;
  initiator$ = this.route.params;

  constructor(
    private storage: BrowserStorageService,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private fastFeedbackService: FastFeedbackService,
    private notificationService: NotificationService
  ) {
    this.isMobile = this.utils.isMobile();
  }

  ngOnInit() {
    this.initiator$.subscribe(() => {
      this.programName = this.storage.getUser().programName;
      this.fastFeedbackService.pullFastFeedback().subscribe();
    });

    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
        console.log('requestpermissions::error::', result);
      }
    });

    PushNotifications.addListener('registration',
                                  (token: PushNotificationToken) => {
        console.log('Token:', token.value);
      }
    );

    PushNotifications.addListener('registrationError',
                                  (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
                                  (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
        this.storage.set('pn-test', notification);
        this.notificationService.alert({
          header: 'pushNotificationReceived',
          message: JSON.stringify(notification),
          buttons: [{
            text: 'OK',
            role: 'close'
          }]
        });
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
                                  (pusherNotification: PushNotificationActionPerformed) => {

        const { notification } = pusherNotification;
        console.log(notification);

        let { data } = notification;
        console.log('Push action performed: ' + JSON.stringify(data));

        this.storage.set('pn-test-actioned', data);

        if (data.data) {
          data = data.data;
        }
        this.notificationService.alert({
          header: 'pushNotificationActionPerformed',
          message: JSON.stringify(data.customMessage || data),
          buttons: [{
            text: 'OK',
            role: 'close'
          }]
        });
      }
    );
  }
}
