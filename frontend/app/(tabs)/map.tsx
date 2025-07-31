import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import axios from 'axios'

  

export default function MapScreen() {
  useEffect(() => {
    fetchData();
  }, []);

  const [locations, setLocationData] = useState<any>([]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:5050/api/location/", 
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLocationData(response.data);
      console.log(response.data[0]?.name);
    } catch (err) {
      console.error("Błąd podczas pobierania lokalizacji:", err);
    }
  };

  return  (
    <View style={styles.container}>
      <Text style={styles.text}>{locations.length > 0? (JSON.stringify(locations)) : "Ładowanie..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
