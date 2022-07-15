import { useEffect, useState } from "react";
import { ListItem, Avatar, Button } from "@rneui/themed";
import { Linking, Platform, View } from "react-native";

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}
interface AppInfo {
  key: string
  name: string
  subtitle: string
  avatar: string // 图标url
  androidUrl?: string
  androidVersion?: string
  iosUrl?: string
}
interface MyOtherAppsProps {
  api: string
}

export const MyOtherApps = ({ api }: MyOtherAppsProps) => {
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

  return <View style={{ flex: 1 }}>
    {appInfos.map((appInfo => {
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
