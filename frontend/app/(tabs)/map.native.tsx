import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import "leaflet/dist/leaflet.css";
import axios from 'axios'
import storage from '../../utils/storage';
import { WebView } from "react-native-webview";
// import MapDisplayNative from '@/components/MapDisplayNative';

export default function MapScreen() {
	useEffect(() => {
		fetchData();
	}, []);

	const [locations, setLocationData] = useState<any>([]);

	const fetchData = async () => {
		try {
			const token = await storage.getValue("token");
			const response = await axios.get(process.env.EXPO_PUBLIC_API_URL + "location/", 
			{
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			setLocationData(response.data);
			console.log(response.data);
		} catch (err) {
			console.error("Error during fetching locations: ", err);
		}
	};
	
	if(locations.length >0) {
		return  (
			<View style={styles.container}>
				{/* <MapDisplayNative locations={locations}></MapDisplayNative> */}
				{/* <Text style={styles.text}>{locations.length > 0 ? (JSON.stringify(locations)) : "Loading..."}</Text> */}
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={{color: "#fff"}}>Loading...</Text>
		</View>
	)
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
	map : {
		flex : 1
	}
});
