/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Alert} from 'react-native';
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  async componentDidMount() {
  this.checkPermission();
  this.createNotificationListeners();
}

componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
}

async checkPermission() {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getToken();
  } else {
      this.requestPermission();
  }

}

async requestPermission() {
  try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
  } catch (error) {
      // User has rejected permissions
  }
}


async getToken() {

  let fcmToken = await AsyncStorage.getItem('fcmToken');
  /************************Since we are getting fcmToken here****************************/
  console.log(fcmToken);
  /***********************So the callback this.notificationOpenedListener();*****************************/
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          // user has a device token
          console.log('token check '+fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
      this.notificationOpenedListener;
  }
}

async createNotificationListeners() {

  this.notificationListener = firebase.notifications().onNotification((notification) => {
     const { title, body } = notification;
     this.showAlert(title, body,);
 });


 this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
   console.log('hey');
      const { title, body,value } = notificationOpen.notification;
      this.showAlert(title, body);
  });


  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
  }

   this.messageListener = firebase.messaging().onMessage((message) => {
   //process data message
   console.log(JSON.stringify(message));
 });
}

showAlert(title,body) {
  Alert.alert(
    title, body,
    [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
});
