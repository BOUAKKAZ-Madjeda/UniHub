import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebaseConfig';

const messaging = getMessaging(app);
const vapidKey = "VOTRE_CLE_VAPID"; // À générer dans Firebase Console

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey });
      console.log('FCM Token:', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Permission error:', error);
    return null;
  }
};

export const onMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    callback(payload);
  });
};

export const showLocalNotification = (title, options) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  }
};