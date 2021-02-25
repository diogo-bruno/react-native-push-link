const convertXml = require('xml-js');

const permissionIntallPackage = {
  type: 'element',
  name: 'uses-permission',
  attributes: {
    'android:name': 'android.permission.REQUEST_INSTALL_PACKAGES',
  },
};

const usesLibraryApacheHttpLegacy = {
  type: 'element',
  name: 'uses-library',
  attributes: {
    'android:name': 'org.apache.http.legacy',
    'android:required': 'false',
  },
};

const pushlinkAndroidFileProvider = {
  type: 'element',
  name: 'provider',
  attributes: {
    'android:name': 'com.pushlink.android.FileProvider',
    'android:authorities': '',
    'android:exported': 'true',
  },
};

const pushlinkAdminReceiver = {
  type: 'element',
  name: 'receiver',
  attributes: {
    'android:name': '.PushlinkAdminReceiver',
    'android:permission': 'android.permission.BIND_DEVICE_ADMIN',
  },
  elements: [
    {
      type: 'element',
      name: 'meta-data',
      attributes: {
        'android:name': 'android.app.device_admin',
        'android:resource': '@xml/device_admin_sample',
      },
    },
    {
      type: 'element',
      name: 'intent-filter',
      elements: [
        {
          type: 'element',
          name: 'action',
          attributes: {
            'android:name': 'android.app.action.DEVICE_ADMIN_ENABLED',
          },
        },
        {
          type: 'element',
          name: 'action',
          attributes: {
            'android:name': 'android.intent.action.MY_PACKAGE_REPLACED',
          },
        },
      ],
    },
  ],
};

const editAndroidManifest = (contentAndroidManifest, packageName) => {
  pushlinkAndroidFileProvider.attributes['android:authorities'] = packageName;

  let jsonAndroidManifest = convertXml.xml2json(contentAndroidManifest, {
    compact: false,
    spaces: 3,
  });

  jsonAndroidManifest = JSON.parse(jsonAndroidManifest);

  const filtered = jsonAndroidManifest.elements[0].elements.filter(function (obj) {
    if (
      obj.name &&
      obj.name === 'uses-permission' &&
      obj.attributes['android:name'] &&
      obj.attributes['android:name'] === 'android.permission.REQUEST_INSTALL_PACKAGES'
    ) {
      return false;
    }

    if (obj.name && obj.name === 'application') {
      obj.elements = obj.elements.filter((objApplication) => {
        if (
          objApplication.name &&
          (objApplication.name === 'receiver' ||
            objApplication.name === 'provider' ||
            objApplication.name === 'uses-library') &&
          objApplication.attributes['android:name'] &&
          (objApplication.attributes['android:name'] === '.PushlinkAdminReceiver' ||
            objApplication.attributes['android:name'] === 'com.pushlink.android.FileProvider' ||
            objApplication.attributes['android:name'] === 'org.apache.http.legacy')
        ) {
          return false;
        }
        return objApplication;
      });
    }

    return obj;
  });

  filtered.push(permissionIntallPackage);

  filtered.forEach((obj) => {
    if (obj.name && obj.name === 'application') {
      obj.elements.push(usesLibraryApacheHttpLegacy);
      obj.elements.push(pushlinkAndroidFileProvider);
      obj.elements.push(pushlinkAdminReceiver);
    }
  });

  jsonAndroidManifest.elements[0].elements = filtered;

  const result = convertXml.json2xml(jsonAndroidManifest, {
    compact: false,
    ignoreComment: true,
    spaces: 3,
  });

  return result;
};

module.exports = editAndroidManifest;
