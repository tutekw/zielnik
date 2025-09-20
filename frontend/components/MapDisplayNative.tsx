import React from "react";
import { StyleSheet } from "react-native";
import {MapView, Camera, setAccessToken, StyleURL} from "@maplibre/maplibre-react-native";

export default function MapDisplayNative({ locations } : {locations? :any | undefined}) {
    setAccessToken(null);

    const features = locations.map(
        ({type, longitude, latitude} : {type :string, longitude :number, latitude :number, }) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [longitude, latitude] },
            properties: { type: type },
        })
    );

    return (
        <MapView 
            style={styles.container}
            mapStyle={process.env.EXPO_PUBLIC_TILESERVER_URL + "styles/basic/style.json"}
            compassEnabled={true}
        >
            <Camera
                zoomLevel={6}
                centerCoordinate={[21.0, 52.0]}
            />
        </MapView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: '100%',
        marginTop: 100,
        height: '100%' 
    },
});