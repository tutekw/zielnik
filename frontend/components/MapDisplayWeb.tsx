import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { colors } from '@/app/styles';
import LocationWindow from './LocationWindow';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset';

export default function MapDisplayWeb({ locations } : {locations? :any | undefined}) {

    const mapContainer = useRef(null);

    const [windowVisible, setWindowVisibility] = useState(false);

    const toggleWindowVisibility = () => setWindowVisibility(!windowVisible);

    let map :Map;
    const userMarker = new maplibregl.Marker({
        'color': colors.themeColor
    });
    const types = ["mushroom", "herb", "fruit", "other"] as const;
    let customLayers = [''] ;

    interface Feature {
        type: "Feature";
        geometry: {
            type: "Point";
            coordinates: [number, number]; // [longitude, latitude]
        };
        properties: {
            id: number;
            name: string | undefined;
        };
    }

    interface Location {
        id: number;
        name: string | undefined;
        type: string;
        longitude: number;
        latitude: number;
        collectionStartMonth: number;
        collectionEndMonth: number;
    }

    const createFeatures = (locations: Location[], type: string): Feature[] => 
        locations
            .filter((location) => location.type === type)
            .map(({ id, name, longitude, latitude, collectionStartMonth, collectionEndMonth }: { id: number, name: string | undefined, longitude :number, latitude :number, collectionStartMonth :number, collectionEndMonth :number}) => ({
                type: "Feature" as const,
                geometry: { type: "Point" as const, coordinates: [longitude, latitude] },
                properties: { 
                    id, 
                    name: name ? name : (type.charAt(0).toUpperCase() + type.slice(1) + 's'), //mushroom => Mushrooms
                    collectionStartMonth: collectionStartMonth,
                    collectionEndMonth: collectionEndMonth,
                }, 
    }));
        
    function getMarker(type: string) {
        switch(type) {
            case "mushroom":
                return {
                    color: "#8403fc"
                };
            case "herb":
                return {
                    color: colors.themeColor,
                };
            case "fruit":
                return {
                    color: "#fc0352",
                };
        }
        return {
            color: "#737373",
        };
    }

    const month :string = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
        undefined: "Unknown"
    }

    useEffect(() => {
        if (!mapContainer.current) return;

        map = new maplibregl.Map({
            container: mapContainer.current,
            style: process.env.EXPO_PUBLIC_TILESERVER_URL + "styles/basic/style.json",
            center: [21.0, 52.0],
            zoom: 6,
            minZoom: 5,
            maxZoom: 12,
            maxBounds: [
                [14.0, 49.0], 
                [24.5, 55.0] 
            ]
        });

        map.on('load', async () => {
            // const mushroom = Asset.fromModule(require("@/assets/images/mushroom.png"));
            // await mushroom.downloadAsync();

            const url = process.env.EXPO_PUBLIC_API_URL + 'icon/';

            const spriteData = await fetch(url + 'sprite.json').then(r => r.json());
            const spriteImg: HTMLImageElement = await new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = url + 'sprite.png';
                img.onload = () => resolve(img);
                img.onerror = reject;
            });

            for (const name in spriteData) {
                if (!map.hasImage(name)) {
                    console.log(name);
                    const frame = spriteData[name];
                    const canvas = document.createElement('canvas');
                    canvas.width = frame.width;
                    canvas.height = frame.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(
                    spriteImg,
                    frame.x, frame.y, frame.width, frame.height,
                    0, 0, frame.width, frame.height
                    );
                    const img = new Image();
                    img.src = canvas.toDataURL();
                    await img.decode();
                    map.addImage(name, img, { sdf: false });
                }
            }

            for (const type of types) {
                const markerData = getMarker(type);
                
                const features = createFeatures(locations, type);

                if(map.getSource(type)) continue;

                map.addSource(type, {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: features,
                    },
                });

                const layerId = type.concat("-layer")
                customLayers.push(layerId);

                map.addLayer({
                    id: layerId,
                    type: 'symbol',
                    source: type,
                    layout: {
                        'icon-image': type,
                        // 'icon-size': ["interpolate", ["linear"], ["zoom"],
                        //     5, 0.1,
                        //     10, 0.2,
                        //     15, 0.4
                        // ],
                        'icon-size': 0.5,
                        'icon-allow-overlap': true
                    },
                    paint: {
                        'icon-color': markerData.color,
                        // "icon-halo-color": "#ffffff",
                        // "icon-halo-width": 5,
                    },

                });

                map.on('click', layerId, (e) => {
                    if (!e.features || !e.features.length) return;

                    userMarker.getElement().style.display = 'none';

                    const feature = e.features[0];
                    //add a popup window showing detailed information about a point
                    new maplibregl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<div style="text-align: center; font-weight: bold;">${feature.properties.name}</div>
                            </br>
                            
                            <div style="text-align: center;">
                                Type: ${type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                                </br></br>
                                Collection period:
                                </br>
                                ${feature.properties.collectionStartMonth == feature.properties.collectionEndMonth ? (
                                    month[feature.properties.collectionStartMonth]
                                ): (
                                    month[feature.properties.collectionStartMonth] + ' - ' + month[feature.properties.collectionEndMonth]
                                )}
                            </div>
                        `)
                        .addTo(map);
                    
                    e.preventDefault();
                });

                

                
            }
        });

        map.on('click', (e) => {
            if (e.originalEvent.defaultPrevented) return;

            const features = map.queryRenderedFeatures(e.point, { layers: customLayers });
            if (features.length) return;

            userMarker.setLngLat(e.lngLat).addTo(map);
            userMarker.getElement().style.display = 'block'
        })

        map.on("error", (e) => {
            console.error("Map error:", e);
        });
        return () => map.remove();
    });


    return (
        <>
            <div style={styles.container} ref={mapContainer}></div>
            <LocationWindow visible={windowVisible}></LocationWindow>
            <TouchableOpacity style={styles.addButton} onPress={toggleWindowVisibility}>
                <Text style={{textAlign: 'center'}}>
                    <FontAwesome name="plus" size={50} color="#fff" />
                </Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: '100%',
        marginTop: 100,
        height: '100%' 
    },
        addButton: {
        position: 'absolute',
        bottom: 80,
        right: 80,
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: colors.themeColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
        elevation: 5,
        borderWidth: 2,
        borderColor: colors.themeColor,
        color: '#fff',
        alignContent: 'center',
        justifyContent: 'center',
    },
});