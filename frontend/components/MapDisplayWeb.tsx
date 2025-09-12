import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapDisplayWeb({ locations } : {locations? :any | undefined} )  {
    const mapContainer = useRef(null);
    
    

    useEffect(() => {
        if (!mapContainer.current) return;
        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "http://127.0.0.1:9090/styles/basic/style.json",
            center: [21.0, 52.0],
            zoom: 6,
            minZoom: 5,
            maxZoom: 12,
            maxBounds: [
                [14.0, 49.0], 
                [24.5, 55.0] 
            ]
        });
        map.on('load', () => {
            const features = locations.map(
                ({type, latitude, longitude} : {type :string, latitude :number, longitude :number}) => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [latitude, longitude] },
                    properties: { type: type },
                })
            );


            console.log(features);
            map.addSource('locations', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: features,
                },
            });

            map.addLayer({
                id: 'locations-layer',
                type: 'symbol',
                source: 'locations',
                layout: {
                    'icon-image': 'marker',
                    'icon-size': 2,
                    'text-field': ['get', 'type'],
                    'text-offset': [0, 1.2],
                    'text-anchor': 'top',
                },
                paint: {
                    'text-color': '#000',
                },
            });
        });
        

        map.on("error", (e) => {
            console.error("Map error:", e);
        });
        return () => map.remove();
    }, []);


    return (
        <div style={styles.container} ref={mapContainer}>
            
        </div>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: '100%',
        height: '100%' 
    }
});