const axios = require('axios');
const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const clipboardy = require('clipboardy');
const path = require('path');
const fs = require('fs');
const loading = require('loading-cli');
const utils = require('./utils');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

utils.print('cyan', 'Download APK', 2);

if (!process.env.PUSH_LINK_API_KEY) {
  utils.print(
    'red',
    'env.PUSH_LINK_API_KEY does not exist, please create PUSH_LINK_API_KEY in file .env in your project!',
  );
  process.exit();
}

https.globalAgent.options.rejectUnauthorized = false;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = false;

const configProxy = process.env['http_proxy'];

const axiosInstance = axios.create({
  timeout: 60 * 10 * 1000, //10min
  headers: {},
  proxy: false,
  httpsAgent: configProxy
    ? new HttpsProxyAgent(configProxy)
    : new https.Agent({ rejectUnauthorized: false }),
});

const pathAndroidApp = path.resolve('./android/app/');

const contentBuildGradle = fs.readFileSync(pathAndroidApp + '/build.gradle', {
  encoding: 'utf8',
  flag: 'r',
});

const packageName = contentBuildGradle
  .split('applicationId')[1]
  .split(/\r\n|\r|\n/g)[0]
  .trim()
  .replaceAll('"', '')
  .replaceAll("'", '');

async function downloadApk() {
  try {
    const request_config = {
      method: 'get',
      url:
        'https://www.pushlink.com/download?package=' +
        packageName +
        '&api_key=' +
        process.env.PUSH_LINK_API_KEY,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      responseType: 'stream',
      headers: {},
      onUploadProgress: (progressEvent) => {
        utils.print('', progressEvent.loaded);
      },
    };

    const load = loading('Download started...').start();

    let secondsUpload = 1;
    setInterval(function () {
      secondsUpload++;
      load.text = 'Download APK in progress... ' + secondsUpload + ' seconds...';
    }, 1000);

    const outputLocationPath = './pushlink-apk-download/';

    if (!fs.existsSync(outputLocationPath)) {
      fs.mkdirSync(outputLocationPath);
    }

    const writer = fs.createWriteStream(outputLocationPath + packageName + '.apk');

    const responseDownload = await axiosInstance(request_config).then((response) => {
      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error = null;
        writer.on('error', (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on('close', () => {
          if (!error) {
            resolve(true);
          }
        });
      });
    });

    if (responseDownload === true) {
      utils.print('cyan', 'Download finished...', 2);

      load.stop();

      utils.print('green', 'Running command install APk:', 1);

      const comandAdbInstall =
        'adb install -r ' + path.resolve(outputLocationPath + packageName + '.apk');

      clipboardy.writeSync(comandAdbInstall);

      utils.print('magenta', comandAdbInstall, 1);

      utils.print('white', 'Command copied to the clipboard', 1);
    } else {
      load.stop();
      utils.print('red', 'Error download: ', responseDownload, 1);
    }

    process.exit();
  } catch (error) {
    utils.print('red', error, 2);
  }
}

(async () => {
  try {
    await downloadApk();
  } catch (e) {}
})();

//clear && yarn install && react-native pushlink-download-apk
