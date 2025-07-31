import Header from '@/components/Header';
import { Stack } from 'expo-router';
import { Dimensions } from 'react-native';

export default function RootLayout() {
  var vw = Dimensions.get('window').width;
  var vh = Dimensions.get('window').height;

  return (
    <Stack screenOptions={{
        header: () => <Header/>,
        headerStyle: {
        }
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="user" />

      <Stack.Screen name="login" />

      <Stack.Screen name="signup"/>
    </Stack>
  );
}
