import { NativeEventEmitter, NativeModules } from 'react-native';

const { RNPushLink } = NativeModules;

const PushLinkEventEmitter = new NativeEventEmitter(RNPushLink);

let PushLinkcaptureGlobarErros = false;

let PushLinkStarted = false;

let defaultHandler =
  (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler;

const wrapGlobalHandler = (error, isFatal) => {
  if (PushLinkcaptureGlobarErros) {
    const errorPush = error;
    const errorRN = {};
    if (error instanceof Error) {
      errorRN['name'] = errorPush.name;
      errorRN['stack'] = errorPush.stack;
      errorRN['message'] = errorPush.message;
    }
    errorRN['line'] = error['line'];
    errorRN['column'] = error['column'];
    errorRN['sourceURL'] = error['sourceURL'];

    PushLink.sendExceptionReactNative(JSON.stringify(errorRN));
  }

  defaultHandler(error, isFatal);
};

ErrorUtils.setGlobalHandler(wrapGlobalHandler);

const tryResponse = (messageResponse) => {
  let response;
  try {
    response = JSON.parse(messageResponse);
  } catch (e) {
    response = messageResponse;
  }
  return response;
};

const PromiseSuccess = async (response) => {
  return new Promise((resolve, reject) => {
    resolve(response);
  });
};

const PromiseError = async (msg) => {
  return new Promise((resolve, reject) => {
    reject({ error: msg });
  });
};

const androidExec = async (action, arg) => {
  var args = arg ? [arg] : [];

  if (!PushLinkStarted && !['start', 'getDeviceId', 'version'].includes(action)) {
    return PromiseError('PushLink not started...');
  }

  return new Promise((resolve, reject) => {
    RNPushLink.execute(action, args, (response) => {
      const objResponse = tryResponse(response);
      if (objResponse && objResponse.error) {
        reject(objResponse);
      } else {
        if (action === 'start') PushLinkStarted = true;
        resolve(objResponse);
      }
    });
  });
};

const PushLink = {
  start: async (apiKey, deviceId) => {
    if (PushLinkStarted) {
      console.log('PushLink already started');
      return PromiseSuccess(true);
    }
    if (!apiKey) {
      return PromiseError('apiKey is required');
    }
    if (!deviceId) {
      return PromiseError('deviceId is required');
    }
    return androidExec('start', {
      apiKey: apiKey,
      deviceId: deviceId,
    });
  },
  addMetadata: async (key, value) => {
    if (!key) {
      return PromiseError('parm key is required');
    }
    if (!value) {
      return PromiseError('parm value is required');
    }
    return androidExec('addMetadata', { key: key, value: value });
  },
  addExceptionMetadata: async (key, value) => {
    if (!key) {
      return PromiseError('parm key is required');
    }
    if (!value) {
      return PromiseError('parm value is required');
    }
    return androidExec('addExceptionMetadata', { key: key, value: value });
  },
  sendExceptionReactNative: async (error) => {
    return androidExec('SendAsyncExceptionReactNative', {
      error: error,
    });
  },
  enableExceptionNotification: async () => {
    return androidExec('enableExceptionNotification', null);
  },
  disableExceptionNotification: async () => {
    return androidExec('disableExceptionNotification', null);
  },
  setStrategyAnnoyingPoup: async (properties) => {
    PushLinkEventEmitter.addListener('androidActivityResumed', () => {
      androidExec('setCurrentActivity', null);
    });

    return androidExec('setCurrentStrategy', {
      strategy: 'ANNOYING_POPUP',
      properties: properties,
    });
  },
  setStrategyFriendlyPopup: async (properties) => {
    PushLinkEventEmitter.addListener('androidActivityResumed', () => {
      androidExec('setCurrentActivity', null);
    });

    return androidExec('setCurrentStrategy', {
      strategy: 'FRIENDLY_POPUP',
      properties: properties,
    });
  },
  setStrategyCustom: async (properties, functionEventListener) => {
    if (!functionEventListener || typeof functionEventListener !== 'function') {
      return PromiseError('functionEventListener is required and valid function');
    }

    PushLinkEventEmitter.removeListener('androidActivityResumed', () => {
      androidExec('setCurrentActivity', null);
    });

    PushLinkEventEmitter.addListener('onReceiverStrategyCustom', functionEventListener);

    if (!properties || typeof properties !== 'object') {
      properties = { TypeBroadcastReceiver: 'APPLY' };
    }

    return androidExec('setCurrentStrategy', { strategy: 'CUSTOM', properties: properties });
  },
  setStrategyStatusBar: async (properties) => {
    PushLinkEventEmitter.removeListener('androidActivityResumed', () => {
      androidExec('setCurrentActivity', null);
    });

    return androidExec('setCurrentStrategy', { strategy: 'STATUS_BAR', properties: properties });
  },
  setStrategyNinja: async () => {
    PushLinkEventEmitter.removeListener('androidActivityResumed', () => {
      androidExec('setCurrentActivity', null);
    });

    return androidExec('setCurrentStrategy', { strategy: 'NINJA', properties: null });
  },
  getCurrentStrategy: async () => {
    return androidExec('getCurrentStrategy', null);
  },
  hasPendingUpdate: async () => {
    return androidExec('hasPendingUpdate', null);
  },
  idle: (isIdle) => {
    return androidExec('idle', { idle: isIdle });
  },
  getVersion: async () => {
    return androidExec('version', null);
  },
  getDeviceId: async () => {
    return androidExec('getDeviceId', null);
  },
  installApk: async () => {
    return androidExec('installApk', null);
  },
  captureGlobalErrorsReactNative: (option) => {
    PushLinkcaptureGlobarErros = option;
  },
};

export default PushLink;
