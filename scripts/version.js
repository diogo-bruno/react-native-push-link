const utils = require('./utils');
const path = require('path');
const fs = require('fs');
const packageJson = JSON.parse(
  fs.readFileSync('./package.json', {
    encoding: 'utf8',
    flag: 'r',
  }),
);
const fileVersionPlugin = path.resolve('./android/src/main/java/com/pushlink/rn/Version.java');
const versionJava = fs.readFileSync(fileVersionPlugin, {
  encoding: 'utf8',
  flag: 'r',
});
const split_ = 'pluginVersion = "';
versionJavaSplit = versionJava.split(split_);
const newFileVersionJava = `${versionJavaSplit[0]}${split_}${packageJson.version}"${
  versionJavaSplit[1].split('"')[1]
}`;
fs.writeFileSync(fileVersionPlugin, newFileVersionJava, 'utf-8');
utils.print('green', 'Success set version plugin PushLink', 2);
