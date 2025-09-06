import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import MapView from 'react-native-maps';
import "leaflet/dist/leaflet.css";
import axios from 'axios'
import storage from '../storage';
import { WebView } from "react-native-webview";

export default function MapScreen() {
	// useEffect(() => {
	// 	fetchData();
	// }, []);

	// const [locations, setLocationData] = useState<any>([]);

	// const fetchData = async () => {
	// 	try {
	// 		const token = await storage.getValue("token");
	// 		const response = await axios.get("http://localhost:5050/api/location/", 
	// 		{
	// 			headers: token ? { Authorization: `Bearer ${token}` } : {},
	// 		});
	// 		setLocationData(response.data);
	// 		console.log(response.data[0]?.name);
	// 	} catch (err) {
	// 		console.error("Error during fetching locations: ", err);
	// 	}
	// };

	// const markersJs = locations
    // .map(
	// 	(loc :any) =>
	// 		`L.marker([${loc.lat}, ${loc.lng}]).addTo(map).bindPopup("${loc.name}");`
    // )
    // .join("\n");

	// const html = `
    // <!DOCTYPE html>
	// 	<html>
	// 		<head>
	// 			<meta name="viewport" content="width=device-width, initial-scale=1">
	// 			<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
	// 			<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
	// 			<style> #map { height: 100vh; width: 100vw; } </style>
	// 		</head>
	// 		<body>
	// 			<div id="map"></div>
	// 			<script>
	// 			var map = L.map('map').setView([52.2297, 21.0122], 12);
	// 			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 				maxZoom: 19
	// 			}).addTo(map);
	// 			</script>
	// 		</body>
	// 	</html>
  	// `;

	return  (
		<View style={styles.container}>
			{/* <Text style={styles.text}>{locations.length > 0 ? (JSON.stringify(locations)) : "Loading..."}</Text> */}
			<MapView
				style={styles.map}
			>
			</MapView>
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
	map : {
		flex : 1
	}
});
