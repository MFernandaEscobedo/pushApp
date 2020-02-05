import { Injectable } from '@angular/core';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: any[] = [
    {
      title: 'Titulo de push',
      body: 'Body del push',
      date: new Date()
    }
  ];

  constructor(private oneSignal: OneSignal) { }

  configuracionInicial() {
    this.oneSignal.startInit('1d714519-205c-4a73-bece-b8fc4e5962ad', '75497119727');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
     // do something when notification is received
     console.log('notif recibida', noti);
     this.notifRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });
    this.oneSignal.endInit();
  }

  notifRecibida(notif: OSNotification) {

    const payload = notif.payload;
    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);

    if (existePush) {
      return;
    }

    this.mensajes.unshift(payload);

  }
}
