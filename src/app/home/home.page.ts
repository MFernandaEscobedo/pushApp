import { Component, OnInit, ApplicationRef } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  constructor(private pushService: PushService, private appRef: ApplicationRef) {}

  ngOnInit() {
     this.pushService.pushListener.subscribe(notif => {
        this.mensajes.unshift(notif);
        this.appRef.tick();
     });
  }

  async IonViewWillEnter() {
    this.mensajes = await this.pushService.obtenerNotif();
    console.log(this.mensajes);
  }

}
