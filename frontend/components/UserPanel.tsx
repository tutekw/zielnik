import { Button, PlatformPressable } from '@react-navigation/elements';
import { View, Text, StyleSheet, Pressable, TouchableOpacity} from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export function UserPanel () {
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const [loggedIn, setLoggedIn] = useState<boolean>();
    const [expanded, setExpanded] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            if(!window.sessionStorage ){ 
                setLoggedIn(false);
                return;
            }
            const token = sessionStorage.getItem("token");
            if(!token ){ 
                setLoggedIn(false);
                return;
            }
            const response = await axios.get("http://localhost:5050/api/user/", 
            {
                headers: { Authorization: `Bearer ${token}` }
            });
            (response.status == 200) ? setLoggedIn(true) : setLoggedIn(false); 
        } catch (err) {
            console.error("Error checking login status: ", err);
        }
    };

    function toggleExpanded() {
        setExpanded(!expanded);
    }

    return (
        <PlatformPressable>
            {loggedIn ? (
                <>
                    <TouchableOpacity onPress={toggleExpanded}>
                        <FontAwesome name={expanded ? 'user-circle-o' : 'user-circle'} size = {30}/>
                    </TouchableOpacity>
                {expanded && (
                    <Text>DROPDOWN MENU</Text>
                )}
                </>
            )
            :
                (<PlatformPressable style={styles.loginBtn} onPress={() => router.navigate('/login')}><Text style={styles.loginText}>Log in</Text></PlatformPressable>)
            }
            
        </PlatformPressable>
    )
}

const styles = StyleSheet.create({
    loginBtn: {
        justifyContent: 'center',
        alignContent: 'center',
        width: 100,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#22b005',
    },
    loginText: {
    fontWeight: 'bold',
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
    }
})

export default UserPanel;