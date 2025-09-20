import { authStyles, colors } from "@/app/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";

export default function LocationWindow({visible } : {visible: boolean}) {

    return (
        //if has subscription, if not show a pop-up
        <>
            {visible&& (
                <View style={styles.container}>
                    <View style={styles.mapOverlay}></View>
                    <View style={styles.addWindow}>
                            <Text style={authStyles.title}>Add location</Text>     
                    </View>
                </View>
            )}
        </>
        
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#eee',
        opacity: 0.5,
    },
    addWindow: {
        height: 500,
        width: 350,
        backgroundColor: '#fff',
        opacity: 1,
        borderWidth: 2,
        borderColor: colors.themeColor,
        borderRadius: 10,
        alignContent: 'center',
        padding: 20,
        alignItems: 'center'
    }
})