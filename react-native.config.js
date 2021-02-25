module.exports = {
  commands: [
    {
      name: 'pushlink-prepare-project',
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
