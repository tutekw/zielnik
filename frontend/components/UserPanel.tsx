import { PlatformPressable } from '@react-navigation/elements';
import { View, Text, StyleSheet, Pressable, TouchableOpacity} from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { colors } from '@/app/styles';
import storage from '../app/storage';
import dataHandler from '@/app/dataHandler';
import * as Updates from 'expo-updates';

export function UserPanel () {
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<any>(undefined);
    const expanded = useSharedValue(0); // 0 = zamknięte, 1 = otwarte
    const [visible, setVisible] = useState(false);

    const styles = createStyles(user);

    async function reload() {
        if (__DEV__) {
            window.location.reload();
        } else {
            await Updates.reloadAsync();
        }
    }

    const fetchData = async () => {
        try {
            const user = await dataHandler.getUser();
            if(user) {
                setUser(user)
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
                const token = await storage.getValue("token");
                await axios.put("http://localhost:5050/api/auth/signout", null,
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLoggedIn(false);
                await storage.remove("user");
                await storage.setObject("logged_in", false);
                await storage.remove("token");
                await reload();

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
                                <Text style={styles.userMail}>{user.mail}</Text>
                                <Text style={styles.subscription}>{user.subscription ? (user.subscription.subscription_type ? "Premium account" : "Free account") : "Free account"}</Text>
                            </View>
                            <TouchableOpacity onPress={() => router.navigate('/profile')} style={[styles.menuItem, styles.menuItemFirst]}>
                                <Text>Profile</Text>
                                <FontAwesome style={styles.menuIcon} name="edit" color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.navigate('/subscription')} style={styles.menuItem}>
                                <Text>Subscription</Text>
                                <FontAwesome style={styles.menuIcon} name="external-link" color="black" />
                                {/* domyslnie niech tak wyglada jak user nie ma subskrypcji albo ma darmową, jak nie ma to wtedy jakis przycisk Choose */}
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

const createStyles = (user? :any) => StyleSheet.create({
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
        minHeight: 235,
        right: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.themeColor,
        padding: 10,
        paddingBottom: 0,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    menuTitle: {
        marginTop: -10,
        borderTopWidth: 0,
        height: 110,
        textAlignVertical: 'center',
        justifyContent: 'center',
    },
    userMail: {
        fontWeight: 'bold',
        fontSize: 20,
        wordWrap: 'break-word',
        width: 250,
        textAlign: 'center',
        marginBottom: 20
    },
    subscription: {
        textAlign: 'center',
        fontSize: 18,
        color: (user && user.subscription) ? (user.subscription.subscription_type ? colors.themeColor : '#000') : '#000'
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