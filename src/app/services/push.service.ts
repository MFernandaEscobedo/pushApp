import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

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

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.cargarNotif();
  }

  async configuracionInicial() {
    await this.cargarNotif();

    this.oneSignal.startInit('1d714519-205c-4a73-bece-b8fc4e5962ad', '75497119727');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
     console.log('notif recibida', noti);
     this.notifRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      // do something when a notification is opened
      await this.notifRecibida(noti.notification);
    });
    this.oneSignal.endInit();
  }

  async notifRecibida(notif: OSNotification) {

    const payload = notif.payload;
    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);

    if (existePush) {
      return;
    }

    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);
    await this.guardarNotif();
  }

  async guardarNotif() {
    this.storage.set('notificaciones', this.mensajes);
  }

  async obtenerNotif() {
    await this.cargarNotif();
    return [...this.mensajes];
  }

  async cargarNotif() {
    this.mensajes = await this.storage.get('notificaciones') || [] ;
    return this.mensajes;
  }
}
