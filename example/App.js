import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {PUSH_LINK_API_KEY} from '@env';
import {TouchableOpacity, StyleSheet, Image, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import PushLink from 'react-native-push-link';

export default class App extends Component {
  pushLinkStarted;
  deviceId;
  currentStrategySelected = 'CUSTOM';
  currentStrategy;

  onError(error) {
    console.log('onError Print: ', error);
    PushLink.toastMessage(error);
  }

  pushLinkStart = async () => {
    this.pushLinkStarted = await PushLink.start(
      PUSH_LINK_API_KEY,
      this.deviceId,
    ).catch(this.onError);
  };

  getCurrentStrategy = async () => {
    this.currentStrategy = await PushLink.getCurrentStrategy().catch(
      this.onError,
    );
  };

  reciverEventListenerCustom(data) {
    console.log('_reciverEventListener CUSTOM', data);
  }

  selectStrategy = async () => {
    switch (this.currentStrategySelected) {
      case 'ANNOYING_POPUP':
        await PushLink.setStrategyAnnoyingPoup().catch(this.onError);
        break;
      case 'FRIENDLY_POPUP':
        await PushLink.setStrategyFriendlyPopup().catch(this.onError);
        break;
      case 'STATUS_BAR':
        await PushLink.setStrategyStatusBar().catch(this.onError);
        break;
      case 'CUSTOM':
        PushLink.toastMessage('CUSTOM requires the app to be DEVICE OWNER');
        await PushLink.setStrategyCustom(
          {TypeBroadcastReceiver: 'APPLY'},
          this.reciverEventListenerCustom,
        ).catch(this.onError);
        break;
      case 'NINJA':
        PushLink.toastMessage('NINJA only for ROOTED devices (DEPRECATED)');
        await PushLink.setStrategyNinja().catch(this.onError);
        break;
      default:
    }
  };

  componentDidMount = async () => {
    this.deviceId = await PushLink.getDeviceId().catch(this.onError);
    SplashScreen.hide();
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Image
            style={styles.tinyLogo}
            source={require('./assets/push-link.png')}
          />

          <Text>DeviceId: {this.deviceId}</Text>

          <TouchableOpacity style={styles.button} onPress={this.pushLinkStart}>
            <Text>Start PushLink</Text>
          </TouchableOpacity>

          <Text>Current Strategy:</Text>

          <Text>{this.currentStrategy}</Text>

          <Text>Select Strategy:</Text>

          <RNPickerSelect
            onValueChange={(value) => {
              this.currentStrategySelected = value;
            }}
            items={[
              {label: 'ANNOYING_POPUP', value: 'ANNOYING_POPUP'},
              {label: 'FRIENDLY_POPUP', value: 'FRIENDLY_POPUP'},
              {label: 'STATUS_BAR', value: 'STATUS_BAR'},
              {label: 'CUSTOM', value: 'CUSTOM'},
              {label: 'NINJA', value: 'NINJA'},
            ]}
          />

          <TouchableOpacity style={styles.button} onPress={this.selectStrategy}>
            <Text>Set Strategy</Text>
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
