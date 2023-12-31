import { useEffect, useRef, useState } from "react";
import { Platform, Vibration } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Asset } from "expo-asset";
import setupNotifChannel from "../utils/setupNotifChannel";
import getPermission from "../utils/getPermission";
// for testing
import Button from "../components/forTestingNotification/Button";

// setting up custom notification handler - this will execute whenever notification is received.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// FOR TESTING NOTIFICATION BTN ONLY
const TEST_NOTIFICATION = {
  SEND_NOW: {
    TITLE: "TEST NOTIF FOR SEND NOW",
    MESSAGE: "HELLO WORLD FROM SEND NOW",
  },
  SEND_DELAY: {
    TITLE: "TEST NOTIF FOR 5 SEC. DELAY",
    MESSAGE: "HELLO WORLD FROM 5 SEC DELAY",
  },
};
//

// notif titles
const NOTIFICATION_TITLES = {
  TIME_IN: "Time-in Notification!",
  TIME_OUT: "Time-out Notification!",
};

// notif messages
const NOTIFICATION_MESSAGES = {
  TIME_IN: "15 minutes before time-in.",
  TIME_OUT: "15 minutes before time-out.",
};

// getting token from projectId(need for sending specifc notif "to")
const getToken = async () => {
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })
  ).data;

  return token;
};

// async func for schduling notification
const schedulePushNotification = async (
  expoPushToken,
  title,
  body,
  hour,
  minute,
  localUri,
  seconds
) => {
  try {
    // 1st object parameter of scheduleNotificationAsync
    const notificationContent = {
      to: expoPushToken,
      autoDismiss: false,
      sound: true,
      title,
      body,
      // attachment banner notif - dependable on every phones settings. I think this will work if it's an actual app and allow the pop on screen on app settings.
      attachments: [
        {
          identifier: "icon",
          uri: localUri,
        },
      ],
    };

    // 2nd object parameter of scheduleNotificationAsync
    let triggerOptions;
    // FOR TESTING
    if (seconds) {
      triggerOptions = {
        // FOR TESTING
        seconds,
        //
      };
    } else if (!hour && !minute && !seconds) {
      triggerOptions = null;
    } else if (hour && minute) {
      //
      triggerOptions = {
        hour,
        minute,
        repeats: true,
      };
    }

    // invocation
    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: triggerOptions,
    });
  } catch (err) {
    console.error(`Error in schedulePushNotification: ${title}`, err);
  }
};

// Notification Comp
export const Notification = () => {
  const [token, setToken] = useState("");
  const notificationListener = useRef();

  // import logo icon(for banner notif)
  const logoAsset = Asset.fromModule(require("../../assets/images/icon.png"));

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      // make sure it is downloaded to make it work.
      await logoAsset.downloadAsync();

      try {
        // notif channel - to customize desired notification when displayed on android.
        // invocation of the channel which is needed to customize desired display notification.
        await setupNotifChannel();

        // send an alert if dev is using simulator
        if (!Device.isDevice) {
          alert(
            "I suggest that you use a physical device for better client experience."
          );
        }

        // if this is denied you won't get notifications.
        await getPermission();

        // invocation of getting the token
        const gettingToken = await getToken();
        setToken(gettingToken);
        if (!gettingToken) {
          console.error("Failed to get Expo push token.");
          return;
        }

        // invocation of scheduling of notification for time-in
        await schedulePushNotification(
          token,
          NOTIFICATION_TITLES.TIME_IN,
          NOTIFICATION_MESSAGES.TIME_IN,
          6,
          45,
          logoAsset.localUri,
          0
        );

        // invocation of scheduling of notification for time-out
        await schedulePushNotification(
          token,
          NOTIFICATION_TITLES.TIME_OUT,
          NOTIFICATION_MESSAGES.TIME_OUT,
          15,
          45,
          logoAsset.localUri,
          0
        );

        return token;
      } catch (err) {
        // if you experience this error, try to check settings of expo/app itself if notifications coming frop this app is allowed. If the first one doesn't work uninstall expo go app and then reinstall it. That will resolve the problem.
        console.error("Error registerForPushNotificationsAsync", err);
      }
    };

    // invocation of pushNotif func
    registerForPushNotificationsAsync();

    // event for receiving the notification
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
        // after it received this will happen
        if (Platform.OS === "android") {
          Vibration.vibrate([0, 250, 250, 250]); // custom for andorid
        } else {
          Vibration.vibrate(); // default for ios
        }
      });

    return () => {
      // remove listener - cleanup/best practice(performance issue)
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, []);

  // FOR TESTING BTN NOTIFICATION ONLY
  return (
    <>
      <Button
        scheduleNotifFunc={async () =>
          await schedulePushNotification(
            token,
            TEST_NOTIFICATION.SEND_NOW.TITLE,
            TEST_NOTIFICATION.SEND_NOW.MESSAGE,
            null,
            null,
            logoAsset.localUri,
            0
          )
        }
        value="Send Notif Now!"
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 99,
          backgroundColor: "transparent",
          padding: 10,
          borderRadius: 5,
        }}
      />
      <Button
        scheduleNotifFunc={async () =>
          await schedulePushNotification(
            token,
            TEST_NOTIFICATION.SEND_DELAY.TITLE,
            TEST_NOTIFICATION.SEND_DELAY.MESSAGE,
            null,
            null,
            logoAsset.localUri,
            5
          )
        }
        value="Send Notif 5 sec delay"
        style={{
          position: "absolute",
          top: 120,
          left: 20,
          zIndex: 99,
          backgroundColor: "transparent",
          padding: 10,
          borderRadius: 5,
        }}
      />
    </>
  );
};
