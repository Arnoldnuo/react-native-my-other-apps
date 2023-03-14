import * as Application from 'expo-application';
import type { AppInfo } from './api-types';
import _ from 'lodash';
import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IgnoredVersionStorageKey = '__MY_OTHER_APP_IgnoredVersion';

const versionGreaterThan = (versionNew: string, versionCurrent: string) => {
  const vnArr = versionNew.split('.').map(v => ~~v);
  const vcArr = versionCurrent.split('.').map(v => ~~v);
  for (const [i, vn] of vnArr.entries()) {
    const vc = _.get(vcArr, i, 0);
    if (vn > vc) {
      return true;
    } else if (vn === vc) {
      continue;
    } else if (vn < vc) {
      return false;
    }
  }
  return false;
};

/**
 * 
 * @param api 获取app最新版信息的url
 * @param shouldIgnoreVersion 如果某个版本已经被忽略了，这个属性控制要不要忽略这个版本，忽略时用于app的自动更新，不忽略时，用于用户的手动检查更新 
 * @Param noUpgradeCb 没有更新时的回调函数
 */
export const UpgradeCheck = async (api: string, shouldIgnoreVersion = false, noUpgradeCb = () => { }) => {
  const res = await fetch(api);
  const appInfoRes: AppInfo = (await res.json()).data;
  const versionCurrent = Application.nativeApplicationVersion || '';
  const versionNew = Platform.select({
    ios: appInfoRes.iosVersion,
    android: appInfoRes.androidVersion,
  }) || '';
  const ignoredVersion = await AsyncStorage.getItem(IgnoredVersionStorageKey);
  if (shouldIgnoreVersion && ignoredVersion === versionNew) {
    noUpgradeCb && noUpgradeCb();
    return;
  }
  if (versionGreaterThan(versionNew, versionCurrent)) {
    Alert.alert('发现新版本', appInfoRes.whatsNew, [
      {
        text: '忽略', onPress: async () => {
          await AsyncStorage.setItem(IgnoredVersionStorageKey, versionNew);
        }
      },
      {
        text: '更新', onPress: () => {
          const upgardeUrl = Platform.select({ ios: appInfoRes.iosUrl, android: appInfoRes.androidUrl });
          if (upgardeUrl) {
            Linking.openURL(upgardeUrl);
          }
        }
      }
    ]);
  } else {
    noUpgradeCb && noUpgradeCb();
  }
};
