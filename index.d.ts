declare module 'react-native-push-link' {
  export type TypesBroadcastReceiver = 'APPLY' | 'GIVEUP';

  export interface ANNOYING_POPUP_PROPERTIES {
    popUpMessage: String;
    updateButton: String;
  }

  export interface FRIENDLY_POPUP_PROPERTIES {
    reminderTimeInSeconds: Number;
    popUpMessage: String;
    updateButton: String;
    notNowButton: String;
  }

  export interface STATUS_BAR_PROPERTIES {
    statusBarTitle: String;
    statusBarDescription: String;
  }

  export interface CUSTOM_PROPERTIES {
    TypeBroadcastReceiver: TypesBroadcastReceiver;
  }

  export interface ErrorCallback {
    error: String;
  }

  export interface returnFunctionEventListener {
    new_apk: String;
    iconId_apk: Number;
    hash_apk: String;
  }

  export interface CurrentStrategy {
    class: String;
    hash: String;
    type: String;
  }

  /**
   * https://docs.pushlink.com/getting-started#4-call-pushlink-start-in-the-main-ui-thread
   * @param apkiKey - client apiKey from dashboard www.pushlink.com
   * @param deviceId - Unique ID device
   */
  export function start(apkiKey: String, deviceId: String): Promise<Boolean | ErrorCallback>;

  /**
   * https://docs.pushlink.com/metadata
   */
  export function addMetadata(key: String, value: String): Promise<Boolean | ErrorCallback>;

  /**
   * https://docs.pushlink.com/exception-notification
   */
  export function addExceptionMetadata(
    key: String,
    value: String,
  ): Promise<Boolean | ErrorCallback>;

  export function enableExceptionNotification(): Promise<Boolean | ErrorCallback>;

  export function disableExceptionNotification(): Promise<Boolean | ErrorCallback>;

  /**
   * https://docs.pushlink.com/strategies#annoying-popup-useful-for-full-screen-when-updates-cant-wait
   */
  export function setStrategyAnnoyingPoup(
    properties: ANNOYING_POPUP_PROPERTIES,
  ): Promise<Boolean | ErrorCallback>;

  /**
   * https://docs.pushlink.com/strategies#friendly-popup-useful-for-full-screen-apps
   */
  export function setStrategyFriendlyPopup(
    properties: FRIENDLY_POPUP_PROPERTIES,
  ): Promise<Boolean | ErrorCallback>;

  /**
   * https://docs.pushlink.com/strategies#custom-take-full-control-of-your-installation
   * https://docs.pushlink.com/strategies#custom-only-for-device-owner-apps
   */
  export function setStrategyCustom(
    properties: CUSTOM_PROPERTIES,
    functionEventListener: (responseBroadcast: returnFunctionEventListener) => void,
  ): Promise<Boolean | ErrorCallback>;

  /**
   * https://docs.pushlink.com/strategies#status-bar-default
   */
  export function setStrategyStatusBar(
    properties: STATUS_BAR_PROPERTIES,
  ): Promise<Boolean | ErrorCallback>;

  /**
   * https://docs.pushlink.com/strategies#ninja-only-for-rooted-devices-deprecated
   */
  export function setStrategyNinja(): Promise<Boolean | ErrorCallback>;

  /**
   * Checks which current strategy
   */
  export function getCurrentStrategy(): Promise<CurrentStrategy | ErrorCallback>;

  /**
   * Checks for a pending update
   */
  export function hasPendingUpdate(): Promise<Boolean | ErrorCallback>;

  /**
   * https://docs.pushlink.com/strategies#idle
   * @param idle
   */
  export function idle(idle: Boolean): Promise<Boolean | ErrorCallback>;

  /**
   * Return version Plugin PushLink React Native
   */
  export function getVersion(): Promise<String | ErrorCallback>;

  /**
   * Return unique ID from device
   */
  export function getDeviceId(): Promise<String | ErrorCallback>;

  /**
   * Install APK, Received from Strategy CUSTOM (it requires the app to be DEVICE OWNER)
   */
  export function installApk(): Promise<Boolean | ErrorCallback>;

  /**
   * Enable capture errors Global ReactNative
   */
  export function captureGlobalErrorsReactNative(option: Boolean): void;

  /**
   * Message shown in Toast when updating APK
   */
  export function setMsgUpdateApk(message: String): void;

  /**
   * Show Toast Message by Plugin PushLink
   */
  export function toastMessage(message: String): void;
}
