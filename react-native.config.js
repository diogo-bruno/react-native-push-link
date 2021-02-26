module.exports = {
  commands: [
    {
      name: 'pushlink-prepare-project',
      description: 'Prepare Android project to use the features of the PushLink',
      func: () => {
        console.log('Processing Command...');
        setTimeout(function () {
          console.clear();
          require('./scripts/prepare');
        }, 500);
      },
    },
    {
      name: 'pushlink-publish-apk',
      description: 'Publish APK Debug/Release to the system PushLink',
      func: () => {
        console.log('Processing Command...');
        setTimeout(function () {
          console.clear();
          require('./scripts/publish.apk');
        }, 500);
      },
    },
    {
      name: 'pushlink-download-apk',
      description: 'Download the latest APK of your project directly from the PushLink platform',
      func: () => {
        console.log('Processing Command...');
        setTimeout(function () {
          console.clear();
          require('./scripts/download.apk');
        }, 500);
      },
    },
  ],
  dependency: {
    platforms: {
      ios: {},
      android: {
        packageImportPath: 'import com.pushlink.rn.PushLinkPackage;',
        packageInstance: 'new PushLinkPackage()',
      },
    },
  },
};
