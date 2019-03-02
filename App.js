/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform,Image,StyleSheet, Text, View,Alert} from 'react-native';
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
  console.log('permission checked top');
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getToken();
      console.log('permission checked if');
  } else {
      this.requestPermission();
      console.log('permission checked else');
  }
  console.log('permission checked bottom');
}

async requestPermission() {
  console.log('permission request top');
  try {

      await firebase.messaging().requestPermission();
      // User has authorised
      console.log('permission request if');
      this.getToken();
  } catch (error) {
      // User has rejected permissions
      console.log('permission request else');
  }
  console.log('permission request bottom');
}


async getToken() {

  let fcmToken = await AsyncStorage.getItem('fcmToken');
  /************************Since we are getting fcmToken here****************************/
  console.log('with token');
  console.log(fcmToken);
  /***********************So the callback this.notificationOpenedListener();*****************************/
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log('with token in if');
      if (fcmToken) {
          // user has a device token
          console.log('token check '+fcmToken);
          console.log('with token in else');
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }

  }
}

async createNotificationListeners() {

  this.notificationListener = firebase.notifications().onNotification((notification) => {
     const { title, body } = notification;
     this.showAlert(title, body,);
 });


 const notificationOpen =await firebase.notifications().getInitialNotification();
 if (notificationOpen) {
  console.log(notificationOpen);
     const { title, body } = notificationOpen.notification;
     this.showAlert(title, body);
 }

 this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    const { title, body } = notificationOpen.notification;
    this.showAlert(title, body);
});


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
        <View>
            <View style={styles.navbar}>
              <Text>Navbar</Text>
            </View>
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
  navbar:{
    backgroundColor:'blue',
    height:60,
    width:415,
  },
  body:{
    flex:1,
    backgroundColor:'skyblue',
  },
});
