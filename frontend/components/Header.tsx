import { View, Text, StyleSheet, Dimensions} from 'react-native'
import UserPanel from './UserPanel'
import { SafeAreaView } from 'react-native-safe-area-context';

var vw = Dimensions.get('window').width;
var vh = Dimensions.get('window').height;

export function Header () {
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container} >
            <View style={styles.logo}>
                <Text style={styles.title}>Zielnik</Text>
                <Text style={styles.name}>Dobra Aura</Text>
            </View>
            <View style={styles.user}>
                <UserPanel></UserPanel>
            </View>  
        </View>   
        </SafeAreaView>
         
    )
}

const styles = StyleSheet.create({
    safeArea: {
        alignItems: 'center', 
        position: 'absolute', 
        left: 0, 
        right: 0, 
        width: '100%',
        padding: 10,
        backgroundColor: '#fff'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 80,
        width: '90%',
        alignItems: 'center',
    },
    logo: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 35,
        textAlign: 'center'
    },
    name: {
        letterSpacing: 3,
        textAlign: 'center',
    },
    user: {
        justifyContent:'center',
        alignItems: 'center',
        alignContent: 'center',
        minWidth: 100,
        height: 80
    }
})

export default Header;