import { colors } from '@/app/styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PlatformPressable } from '@react-navigation/elements';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, TouchableOpacity} from 'react-native'

export default function AddressDisplay ({address}: {address: any}) {

    const router = useRouter();

    function edit() {
        router.replace('/address');
    }

    if((Array.isArray(address) && address.length > 0) || (address && typeof address === 'object' && Object.keys(address).length > 0)) {
        return (
            <TouchableOpacity style={styles.addressContainer} onPress={edit}>
                <Text style={styles.addressLine}>{address.street} {address.street_number} {address.house_number && '\nflat '.concat(address.house_number)}</Text>
                <Text style={styles.addressLine}>{address.postcode} {address.city}</Text>
                <Text style={styles.addressLine}>{address.country}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity style={styles.addButton} onPress={edit}>
            <Text style={{textAlign: 'center'}}>
                <FontAwesome name="plus" size={30} color="#fff" />
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#aaa',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        borderRadius: 10,
    },
    addressContainer: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.themeColor,
        padding: 10,
        minWidth: 100,
        maxWidth: 150,
        maxHeight: 150,
        justifyContent: 'center',
        alignContent: 'center'
    },
    addressLine: {
        
    }
})