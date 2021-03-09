import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {PUSH_LINK_API_KEY} from '@env';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import PushLink from 'react-native-push-link';

let countReciverEventListenerCustom = 0;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushLinkStarted: false,
      deviceId: '',
      currentStrategySelected: 'CUSTOM',
      currentStrategy: {},
    };
  }

  onError(error) {
    console.log('onError Print: ', error);
    PushLink.toastMessage(error.error);
  }

  pushLinkStart = async () => {
    const pushLinkStarted = await PushLink.start(
      PUSH_LINK_API_KEY,
      this.deviceId,
    ).catch(this.onError);
    this.setState({pushLinkStarted: pushLinkStarted});
  };

  getDeviceId = async () => {
    const deviceId = await PushLink.getDeviceId().catch(this.onError);
    this.setState({deviceId: deviceId});
  };

  getCurrentStrategy = async () => {
    const currentStrategy = await PushLink.getCurrentStrategy().catch(
      this.onError,
    );
    this.setState({currentStrategy: currentStrategy});
  };

  async reciverEventListenerCustom(data) {
    console.log('_reciverEventListener CUSTOM', data);
    countReciverEventListenerCustom++;
    PushLink.toastMessage(
      'call reciverEventListenerCustom: ' + countReciverEventListenerCustom,
    );

    // Open modal user interaction or silent install...
    //const install = await PushLink.installApk().catch((e) => e);
  }

  selectStrategy = async () => {
    switch (this.state.currentStrategySelected) {
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
    await this.getDeviceId();
    await this.getCurrentStrategy();
    await changeNavigationBarColor('#3d9874', false);
    SplashScreen.hide();
  };

  render() {
    return (
      <>
        <StatusBar
          animated={true}
          backgroundColor="#3d9874"
          barStyle={'light-content'}
          showHideTransition={'fade'}
          hidden={false}
        />
        <SafeAreaView style={styles.container}>
          <Image
            style={styles.logo}
            source={{
              uri:
                'https://pushlink.com/javax.faces.resource/images/site/logo-verde.png.xhtml?ln=pushlink',
            }}
          />

          <Text>DeviceId: {this.state.deviceId}</Text>

          <TouchableOpacity style={styles.button1} onPress={this.pushLinkStart}>
            <Text style={styles.colorWhite}>Start PushLink</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Current Strategy:</Text>

          <Text style={styles.instructions}>
            {JSON.stringify(this.state.currentStrategy, null, 1)}
          </Text>

          <Text style={styles.title}>Select Strategy:</Text>

          <RNPickerSelect
            placeholder={{}}
            InputAccessoryView={() => null}
            style={pickerSelectStyles}
            onValueChange={(value) => {
              this.setState({currentStrategySelected: value});
            }}
            value={this.state.currentStrategySelected}
            items={[
              {label: 'ANNOYING_POPUP', value: 'ANNOYING_POPUP'},
              {label: 'FRIENDLY_POPUP', value: 'FRIENDLY_POPUP'},
              {label: 'STATUS_BAR', value: 'STATUS_BAR'},
              {label: 'CUSTOM', value: 'CUSTOM'},
              {label: 'NINJA', value: 'NINJA'},
            ]}
          />

          <TouchableOpacity
            style={styles.button2}
            onPress={this.selectStrategy}>
            <Text style={styles.colorWhite}>Set Strategy</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    color: 'white',
    textAlign: 'center',
  },
  colorWhite: {
    color: 'white',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: 'black',
    marginBottom: 5,
  },
  instructions: {
    textAlign: 'left',
    color: '#AAA',
    marginBottom: 0,
  },
  button1: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    marginTop: 20,
  },
  button2: {
    alignItems: 'center',
    backgroundColor: '#1fa6cb',
    padding: 10,
    marginTop: 20,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    width: '80%',
    height: 150,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    marginLeft: '25%',
    width: '50%',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});
