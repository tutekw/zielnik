import { Button, PlatformPressable } from '@react-navigation/elements';
import { View, Text, StyleSheet, Pressable, TouchableOpacity} from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Updates from 'expo-updates';
import { colors } from '@/app/styles';

export function UserPanel () {
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const [loggedIn, setLoggedIn] = useState<boolean>();
    const [userMail, setUserMail] = useState<string>();
    const expanded = useSharedValue(0); // 0 = zamknięte, 1 = otwarte
    const [visible, setVisible] = useState(false);

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
            if(response.status == 200) {
                setUserMail(response.data.mail)
                setLoggedIn(true);
                return;
            }
            setLoggedIn(false); 
        } catch (err) {
            console.error("Error checking login status: ", err);
        }
    };

    const toggleExpanded = () => {
        if (expanded.value === 0) {
            setVisible(true); // pokaż zanim zacznie animować
            expanded.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
        } else {
            expanded.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) }, (finished) => {
                if (finished) {
                    runOnJS(setVisible)(false); // ukryj po animacji
                }
            });
        }
    };

    const animatedMenuStyle = useAnimatedStyle(() => {
        const opacity = expanded.value;
        const translateY = expanded.value * 0 + (1 - expanded.value) * -20;
        return {
            opacity,
            transform: [{ translateY }],
        };
    });


    function logOut() {
        (async () => {
            console.log("LOGOUT");
            try {
                if(!loggedIn) {
                    return
                }
                const token = sessionStorage.getItem("token");
                await axios.put("http://localhost:5050/api/auth/signout", null,
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLoggedIn(false);
                sessionStorage.removeItem("token");

                //await Updates.reloadAsync();
            } catch (err) {
                console.error("Error during logout: ", err);
            }
        })();
    }

    return (
        <View>
            {loggedIn ? (
                <>
                    
                    <TouchableOpacity onPress={toggleExpanded}>
                        
                        <FontAwesome name={visible ? 'user-circle-o' : 'user-circle'} size = {30} color={visible? '#22b005' : '#000'}/>
                    </TouchableOpacity>
                {visible && (
                    <>
                        <Animated.View style={[styles.menu, animatedMenuStyle]}>
                            <View style={styles.menuTitle}>
                                <Text style={styles.userMail}>{userMail}</Text>
                            </View>
                            <TouchableOpacity onPress={() => router.navigate('/profile')} style={[styles.menuItem, styles.menuItemFirst]}>
                                <Text>Profile</Text>
                                <FontAwesome style={styles.menuIcon} name="edit" color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem}>
                                <Text>Subscription</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={logOut} style={[styles.menuItem, styles.menuItemLast]}>
                                <Text>Log out</Text>
                                <FontAwesome style={styles.menuIcon} name="sign-out" color="black" />
                            </TouchableOpacity>
                        </Animated.View>
                    </>
                )}
                </>
            )
            :
                (<PlatformPressable style={styles.loginBtn} onPress={() => router.navigate('/login')}><Text style={styles.loginText}>Log in</Text></PlatformPressable>)
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    loginBtn: {
        justifyContent: 'center',
        alignContent: 'center',
        width: 100,
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.themeColor,
    },
    loginText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    menu: {
        position: 'absolute',
        top: 40,
        width: 250,
        height: 185,
        right: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.themeColor,
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    menuTitle: {
        marginTop: -10,
        borderTopWidth: 0,
        height: 60,
        textAlignVertical: 'center',
        justifyContent: 'center',
    },
    userMail: {
        fontWeight: 'bold',
        fontSize: 20,
        wordWrap: 'break-word',
        width: 250,
        textAlign: 'center'
    },
    menuItem: {
        height: 40,
        width: 250,
        padding: 10,
        borderTopWidth: 2,
        textAlignVertical: 'center',
        justifyContent: 'center',
        
    },
    menuItemFirst: {
        
    },
    menuItemLast: {
        borderTopWidth: 5,
    },
    menuIcon: {
        position: 'absolute',
        right: 5,
        fontSize: 20,
        top: 6
    },
    userIcon: {
        position: 'absolute',
        right: 5,
        fontSize: 30,
        top: 0
    }
})

export default UserPanel;