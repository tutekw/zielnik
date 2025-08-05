
import { tabBar } from '@/app/styles'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { PlatformPressable } from '@react-navigation/elements'
import { useRouter } from 'expo-router'
import { View, StyleSheet, Platform, Text} from 'react-native'

export function HomeButton () {
    
    const router = useRouter();
    
    return (
        <View style={styles.navBar}>
            <PlatformPressable style={styles.navBarElement} onPress={() => router.navigate('/')} > 
                <View style={styles.navIcon}>
                    <FontAwesome5 name={'home'}  size = {tabBar.iconSize} />
                </View>
                <Text>Home</Text>
            </PlatformPressable>
        </View>
    )
}

const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: 100,
        borderWidth: 2,
        borderBottomWidth: 0,
        borderColor: '#22b005'
    },
    navBarElement: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 70,
        borderRadius: 20
    },
    navIcon: {
        display: "flex",
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    }
})
export default HomeButton;