import { Tabs } from "expo-router";
import TabBar from '@/components/TabBar';
import Header from '@/components/Header';

export default function RootLayout() {

  return (
    <Tabs 
    tabBar={(props: any) => <TabBar {...props}/>}

    screenOptions={{
      tabBarActiveTintColor: '#ffd33d',
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: '#22b005',
      },
      header: () => <Header/>,
    }}
   >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home'
        }} />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Map'
        }} />

    </Tabs>
  );
}

