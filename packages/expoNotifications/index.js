import dotenv from "dotenv";
import Expo from 'expo-server-sdk';

const expo = new Expo();

export default (messageText) => {
      try {
            expo.sendPushNotificationsAsync({
                  to: process.env.EXPO_NOTIFICATION_KEY,
                  sound: 'default',
                  body: messageText,
                  data: { withSome: 'data' },
            })
      } catch (error) {
            console.error(error);
      }
}