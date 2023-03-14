import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { MyOtherApps, UpgradeCheck } from 'react-native-my-other-apps';

const OtherAppUrl = 'https://fyjdev.fayanji.com/myapps/infos';
const LatestInfoUrl = 'https://fyjdev.fayanji.com/myapps/info/fayanji'


export default function App() {

  React.useEffect(() => {
    UpgradeCheck(LatestInfoUrl, false, ()=>{console.log('no upgrade')});
  }, []);

  return (
    <View style={styles.container}>
      <MyOtherApps api={OtherAppUrl}
        ignoreKeys={['fayanji1']}
        containerStyle={{ marginTop: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, marginTop: 100
  },
});
