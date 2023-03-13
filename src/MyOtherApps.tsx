import React, { useEffect, useState } from "react";
import { ListItem, Avatar, Button, Text } from "@rneui/themed";
import { Linking, Platform, TextStyle, View, ViewStyle } from "react-native";
import _ from 'lodash';
import type { AppInfo } from './api-types';

interface MyOtherAppsProps {
  api: string,
  ignoreKeys: string[]
  containerStyle?: ViewStyle
  headerTitle?: string
}


export const MyOtherApps = ({ api, ignoreKeys, containerStyle, headerTitle: title }: MyOtherAppsProps) => {
  if (!_.isArray(ignoreKeys)) { ignoreKeys = []; }

  const [appInfos, setAppInfos] = useState<AppInfo[]>([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(api);
      const appInfosRes = (await res.json()).data;
      setAppInfos(appInfosRes);
    })();
  }, [api]);

  const downloadApp = (appInfo: AppInfo) => {
    const downloadUrl = Platform.select({ ios: appInfo.iosUrl, android: appInfo.androidUrl }) as string;
    Linking.openURL(downloadUrl);
  };

  return <View style={containerStyle}>
    <Text style={headerTitle}>{title || '作者的其他APP，欢迎试用'}</Text>
    {appInfos
      .filter(appInfo => !ignoreKeys.includes(appInfo.key))
      .filter(appInfo => {
        return (appInfo.androidUrl && Platform.OS === 'android') ||
          (appInfo.iosUrl && Platform.OS === 'ios');
      })
      .map((appInfo => {
        return <ListItem key={appInfo.key} bottomDivider>
          <Avatar source={{ uri: appInfo.avatar }} />
          <ListItem.Content>
            <ListItem.Title style={{ color: '#0e153a' }}>{appInfo.name}</ListItem.Title>
            <ListItem.Subtitle style={{ color: '#8f8787' }}>{appInfo.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
          <Button type='outline' size='sm' onPress={() => { downloadApp(appInfo) }}>安装</Button>
        </ListItem>
      }))}
  </View>;

};

const headerTitle: TextStyle = {
  paddingLeft: 12,
  fontSize: 16,
  fontWeight: '400'
};
