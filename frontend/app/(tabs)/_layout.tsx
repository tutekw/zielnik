import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Strona główna' }} />
      <Tabs.Screen name="map" options={{ title: 'Mapa' }} />
    </Tabs>
  );
}

