import { saveSubscription } from "../firebase/firestore"

const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }
  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!')
  }
}

const urlB64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export const registerNotificationsWorker = async () => {
    check();
    await navigator.serviceWorker.register('notificationServiceWorker.js');
    if (Notification.permission !== 'granted') {
        const perm = await window.Notification.requestPermission();
        if ( perm === 'granted') {
            const serviceWorker = await navigator.serviceWorker.ready;
            const subscription = await serviceWorker.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array('BFTpOSbLs8ZLXZhH_xRvSUKiLx5jxxxFlVY41Osz2f3jjt77l0lsrap_EfX4baQZdmzTdAzfxffTDrKx8-nkcXg')
            });
            console.log(subscription.toJSON());
            saveSubscription(subscription.toJSON());
        }
    } else {
        console.log('already granted');
    }
}