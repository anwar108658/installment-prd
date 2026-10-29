import { Service, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle, informationCircle } from 'ionicons/icons';

addIcons({ checkmarkCircle, closeCircle, informationCircle });

@Service()
export class MessageService {
  private toastCtrl = inject(ToastController);

  success(message: string) { return this.show(message, 'success', 'checkmark-circle', 3000); }
  error(message: string)   { return this.show(message, 'danger', 'close-circle', 4500); }
  info(message: string)    { return this.show(message, 'primary', 'information-circle', 3000); }

  private async show(message: string, color: string, icon: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      icon,
      duration,
      position: 'top',
      buttons: [{ text: 'OK', role: 'cancel' }],
    });
    await toast.present();
  }
}