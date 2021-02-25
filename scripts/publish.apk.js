const axios = require('axios');
const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const cliSelect = require('cli-select');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const loading = require('loading-cli');
const utils = require('./utils');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

utils.print('cyan', 'Upload APK', 2);

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

utils.print('red', 'Select the path to the apk file:', 1);

const pathAndroidApp = path.resolve('./android/app/');

const pathAndroidApks = path.resolve(pathAndroidApp + '/build/outputs/apk/');

const dirsApkUpload = [];

const pathsApks = [];
fs.readdirSync(pathAndroidApks).forEach((file) => {
  if (file) {
    pathsApks.push('Path: ' + file);
    dirsApkUpload.push(pathAndroidApks + '/' + file + '/');
  }
});
pathsApks.push('Cancel');

cliSelect({
  values: pathsApks,
  cleanup: false,
  selected: '[X]',
  unselected: '[ ]',
  indentation: 3,
}).then(async (response) => {
  utils.print('yellow', 'Path APK selected: ' + response.value);

  if (dirsApkUpload[response.id]) {
    await uploadApk(response.id);
  }
});

async function uploadApk(indexPathUpload) {
  const pathApk = dirsApkUpload[indexPathUpload];

  const filesApk = [];
  fs.readdirSync(pathApk).forEach((file) => {
    if (file && file.endsWith('.apk')) {
      filesApk.push(file);
    }
  });

  if (filesApk.length) {
    utils.print(1);

    utils.print('red', 'Select APK Upload:', 1);

    cliSelect({
      values: [...filesApk, 'Cancel'],
      cleanup: false,
      selected: '[X]',
      unselected: '[ ]',
      indentation: 3,
    }).then(async (response) => {
      utils.print('yellow', 'APK selected: ' + response.value);

      if (filesApk[response.id]) {
        await startUpload(pathApk + filesApk[response.id]);
      }
    });
  } else {
    utils.print('red', 'No file APK Upload...', 2);
  }

  async function startUpload(filePath) {
    try {
      var fileAPK = fs.createReadStream(filePath);

      const form_data = new FormData();
      form_data.append('apk', fileAPK);
      form_data.append('apiKey', process.env.PUSH_LINK_API_KEY);
      form_data.append('current', 'true');

      const request_config = {
        method: 'post',
        url: 'https://www.pushlink.com/apps/api_upload',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          ...form_data.getHeaders(),
        },
        data: form_data,
        onUploadProgress: (progressEvent) => {
          utils.print('', progressEvent.loaded);
        },
      };

      var stats = fs.statSync(filePath);

      var fileSizeInMegabytes = stats.size / (1024 * 1024);

      utils.print('white', 'File size upload: ' + fileSizeInMegabytes.toFixed(2) + ' MB');

      const load = loading('Upload started...').start();

      let secondsUpload = 1;
      setInterval(function () {
        secondsUpload++;
        load.text = 'Upload in progress... ' + secondsUpload + ' seconds...';
      }, 1000);

      utils.print(2);

      const responseUpload = await axiosInstance(request_config);

      utils.print('cyan', 'Upload finished...', 2);

      load.stop();

      utils.print('green', 'Return API PushLink', 1);

      utils.print(
        responseUpload.status == 200 ? 'green' : 'red',
        'StatusCode: ' + responseUpload.status,
      );

      utils.print(
        responseUpload.data &&
          responseUpload.data.toUpperCase().trim().startsWith('PushLink deploy fails'.toUpperCase())
          ? 'red'
          : 'green',
        'Response: ' + responseUpload.data,
        1,
      );

      process.exit();
    } catch (error) {
      utils.print('red', error);
    }
  }
}

//clear && yarn install && react-native pushlink-publish-apk
