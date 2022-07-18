import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { MyOtherApps } from 'react-native-my-other-apps';

export default function App() {
  return (
    <View style={styles.container}>
      <MyOtherApps api='https://fyjdev.fayanji.com/myapps/infos'
        ignoreKeys={['fayanji1']}
        containerStyle={{marginTop: 100}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, marginTop: 100
  },
});
