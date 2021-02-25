import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {PUSH_LINK_API_KEY} from '@env';
import {TouchableOpacity, StyleSheet, Image, Text, View} from 'react-native';
import PushLink from 'react-native-push-link';

export default class App extends Component {
  pushLinkStart = async () => {
    const deviceId = await PushLink.getDeviceId().catch((e) => e);

    const pushLinkStarted = await PushLink.start(
      PUSH_LINK_API_KEY,
      deviceId,
    ).catch((e) => e);

    if (pushLinkStarted && !pushLinkStarted.error) {
      const responseStrategyCustom = await PushLink.setStrategyCustom(
        {TypeBroadcastReceiver: 'APPLY'},
        (responseBroadcast) => {
          console.log(responseBroadcast);
        },
      ).catch((e) => e);

      console.log(responseStrategyCustom);
    }
  };

  componentDidMount = () => {
    SplashScreen.hide();
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.welcome}>Example of use</Text>

          <Image
            style={styles.tinyLogo}
            source={require('./assets/push-link.png')}
          />

          <TouchableOpacity style={styles.button} onPress={this.pushLinkStart}>
            <Text>Start PushLink</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    color: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
    marginBottom: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginTop: 20,
  },
  tinyLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    width: '80%',
    height: 150,
  },
});
