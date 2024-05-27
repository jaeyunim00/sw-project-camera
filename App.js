import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MyCamera from './myCamera';

export default function App() {
  return (
    <View style={styles.container}>
      <MyCamera></MyCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
