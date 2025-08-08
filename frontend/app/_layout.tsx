import Header from '@/components/Header';
import { Stack } from 'expo-router';
import { Dimensions } from 'react-native';

export default function RootLayout() {
  var vw = Dimensions.get('window').width;
  var vh = Dimensions.get('window').height;

  return (
    <Stack
    
    screenOptions={{
        header: () => <Header/>,
        headerStyle: {
        },
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="profile" />

      <Stack.Screen name="login" />

      <Stack.Screen name="signup"/>

      <Stack.Screen name="activate"/>

      <Stack.Screen name="forgot"/>

      <Stack.Screen name="reset"/>
      
      <Stack.Screen name="tos"/>

      <Stack.Screen name="privacy-policy"/>
    </Stack>
  );
}
