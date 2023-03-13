import * as Application from 'expo-application';
import type { AppInfo } from './api-types';
import _ from 'lodash';
import { Alert, Linking, Platform } from 'react-native';

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

export const UpgradeCheck = async (api: string) => {
  const res = await fetch(api);
  const appInfoRes: AppInfo = (await res.json()).data;
  const versionCurrent = Application.nativeApplicationVersion;
  const versionNew = Platform.select({
    ios: appInfoRes.iosVersion,
    android: appInfoRes.androidVersion,
  });
  if (versionGreaterThan(versionNew || '', versionCurrent || '')) {
    Alert.alert('发现新版本', appInfoRes.whatsNew, [
      { text: '忽略', onPress: () => { } },
      {
        text: '更新', onPress: () => {
          const upgardeUrl = Platform.select({ ios: appInfoRes.iosUrl, android: appInfoRes.androidUrl });
          if (upgardeUrl) {
            Linking.openURL(upgardeUrl);
          }
        }
      }
    ]);
  }
};
