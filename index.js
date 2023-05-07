/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Apps from './Apps';  //default initiation file from React Native CLI
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
