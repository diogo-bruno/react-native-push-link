<p align="center">
  <img src="https://pushlink.com/javax.faces.resource/images/site/logo-verde.png.xhtml?ln=pushlink" height='130' />
  </br>
  </br>
</p>

# `React Native PushLink SDK`

[![npm](https://img.shields.io/npm/v/react-native-push-link)](https://www.npmjs.com/package/react-native-push-link) [![CircleCI Status](https://img.shields.io/circleci/build/github/diogo-bruno/react-native-push-link/master.svg)](https://circleci.com/gh/diogo-bruno/workflows/react-native-push-link/tree/master) ![Supports Android](https://img.shields.io/badge/platforms-android-lightgrey.svg)

## `Docs`

<https://docs.pushlink.com/>

---

## `Installation`

- Download dependencies

```sh
yarn add react-native-push-link

# or

npm install react-native-push-link --save
```

and

- Create or Edit file .env api Key

```
PUSH_LINK_API_KEY=your-api-key
```

---

## `Prepare Project Android Native`

```sh
react-native pushlink-prepare-project
```

## `Publish APK PushLink`

- Required .env [PUSH_LINK_API_KEY=your-api-key] in project root

```sh
react-native pushlink-publish-apk
```

## `Download APK PushLink`

- Required .env [PUSH_LINK_API_KEY=your-api-key] in project root

```sh
react-native pushlink-download-apk
```

---

## `Running Project`

```sh
cd ./example
yarn start
yarn android
```

---

## `Example project`

[Example Project React Native - PushLink](https://github.com/diogo-bruno/react-native-push-link-example)

## `Usage`

```javascript
...
import PushLink from 'react-native-push-link';
...

componentDidMount = () => {

  const deviceId = await PushLink.getDeviceId().catch((e) => e);

  const pushLinkStarted = await PushLink.start(PUSH_LINK_API_KEY, deviceId).catch((e) => e);

};
```

<a target="_blank" href="https://github.com/diogo-bruno/react-native-push-link/blob/master/example/App.js">Open file Application: <b>App.js</b></a>

---

## API

- Open file `./node_modules/react-native-push-link/index.d.ts` and see all possibilities of using the API

---

## Troubleshooting

- Use `adb logcat | grep PUSHLINK` to check what's going on. If you can't solve the problem by yourself, please contact the support.

---

## Help & Support

Always feel free to drop a line to support at pushlink dot com or visit our [support](https://www.pushlink.com/support.xhtml).

Users are always welcome to contribute with [issues](https://github.com/diogo-bruno/react-native-push-link/issues) and [pull requests](https://github.com/diogo-bruno/react-native-push-link/pulls)
