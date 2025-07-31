import { Button, PlatformPressable } from '@react-navigation/elements';
import { View, Text, StyleSheet, Pressable} from 'react-native'
import { useRouter } from 'expo-router';

export function UserPanel () {
    const router = useRouter();

    return (
        <PlatformPressable>
            <Button style={styles.loginBtn} onPress={() => router.navigate('/login')}>Log in</Button>
            
        </PlatformPressable>
    )
}

const styles = StyleSheet.create({
    loginBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        alignContent: 'center',
        width: 100,
        height: 20,
        borderRadius: 10
    }
})

export default UserPanel;