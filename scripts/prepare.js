const utils = require('./utils');

utils.print('cyan', 'Prepare Android settings', 2);

const path = require('path');
const fs = require('fs');
const editAndroidManifest = require('./edit-android-manifest');

const pathDirPlugin = path.resolve('./node_modules/react-native-push-link/scripts/');

const pathDirPluginFilesInstall = pathDirPlugin + '/files-install/';

const pathAndroidApp = path.resolve('./android/app/');

const pathAndroidMain = path.resolve('./android/app/src/main');

utils.print('green', '• Get package project');

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

utils.print('green', '• Package project: ' + packageName);

const pathPackage = pathAndroidMain + '/java/' + packageName.replaceAll('.', '/') + '';

utils.print('green', '• Create class PushlinkAdminReceiver');

const contentFilePushlinkAdminReceiver = fs.readFileSync(
  pathDirPluginFilesInstall + '/PushlinkAdminReceiver.java',
  'utf-8',
);

fs.writeFileSync(
  pathPackage + '/PushlinkAdminReceiver.java',
  'package ' + packageName + ';\n' + contentFilePushlinkAdminReceiver,
  'utf-8',
);

utils.print('green', '• Create XML device_admin');

const pathAndroidResXml = pathAndroidMain + '/res/xml';

if (!fs.existsSync(pathAndroidResXml)) {
  fs.mkdirSync(pathAndroidResXml);
}

const contentFileXmlDeviceAdmin = fs.readFileSync(
  pathDirPluginFilesInstall + '/device_admin_sample.xml',
  'utf-8',
);

fs.writeFileSync(
  pathAndroidResXml + '/device_admin_sample.xml',
  contentFileXmlDeviceAdmin,
  'utf-8',
);

utils.print('green', '• Update file AndroidManifest', 2);

const fileAndroidManifest = pathAndroidMain + '/AndroidManifest.xml';

let contentAndroidManifest = fs.readFileSync(fileAndroidManifest, 'utf-8');

let xmlAndroidManifest = editAndroidManifest(contentAndroidManifest, packageName);

fs.writeFileSync(fileAndroidManifest, xmlAndroidManifest, 'utf-8');

utils.print('yellow', 'For strategy CUSTOM update, requires the app to be a device owner!');
utils.print('white', 'Command to device owner:', 1);
utils.print('red', 'adb shell dpm set-device-owner ' + packageName + '/.PushlinkAdminReceiver', 2);

utils.print('magenta', 'Finished Configuration', 2);

//clear && yarn install && react-native pushlink-prepare-project
