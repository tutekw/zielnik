import { PlatformPressable } from '@react-navigation/elements';
import { Text, View, StyleSheet, TextInput, Button, Pressable, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HomeButton from '@/components/HomeButton';
import { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import { authStyles, colors  } from './styles';
import handleResponseError from './responseErrorHandler';
export default function Login() {
  
    const router = useRouter();

    useEffect(() => {
            fetchData();
        }, []);

    const [user, setUser] = useState<any>(null);
     const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            if(!window.sessionStorage ){ 
                setLoading(false);
          return;
            }
            const token = sessionStorage.getItem("token");
            if(!token ){ 
                setLoading(false);
                return;
            }
            const response = await axios.get("http://localhost:5050/api/user/", 
            {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(response.status == 200) {
                setUser(response.data);
                return;
            }
        } catch (err) {
            console.error("Error getting user data: ", err);
        } finally {
            setLoading(false);
        }
    };

    const formatPhone = (phone: any) => {
        if (!phone) return "";
        const str = String(phone);
        return str.slice(0, 2) + " " + str.slice(2);
    };

    const formatSubscription = (sub: any) => {
        if (!sub) return "";
        switch(sub) {
            case 0:
                return (
                    <View style={styles.data}>
                        <Text>Free</Text>
                    </View>
                    
                )
            case 1: 
                return (
                    <View style={[styles.data, {backgroundColor: colors.themeColor}]}>
                        <Text>Premium</Text> {/* fajne efekty, pogrubienie, jakis gradient */}
                        <Text style={{textAlign: 'right'}}>Expires in: </Text>
                    </View>
                    
                )
        }
    };

    if (loading) {
        return (
            <View style={authStyles.container}>
                <Text style={authStyles.subtitle}>Loading profile...</Text>
            </View>
        );
    }

    if (!user) {
        router.replace("/login");
        return null;
    }

    return (
        <View style={authStyles.container}>
            <Text style={authStyles.title}>User profile</Text>
            <Text style={authStyles.subtitle}>{user.mail}</Text>
            <View style={styles.dataContainer}>
                <View style={[styles.row, styles.rowFirst]}>
                    <View style={styles.dataName}>
                        <Text>Name:</Text>
                    </View>
                    <View style={styles.data}>
                        <Text>{user.name}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.dataName}>
                        <Text>Surname:</Text>
                    </View>
                    <View style={styles.data}>
                        <Text>{user.surname}</Text>
                    </View>
                </View>
                
                <View style={styles.row}>
                    <View style={styles.dataName}>
                        <Text>Subscription:</Text>
                    </View>
                    {formatSubscription(user.subscription_type)}
                </View>

                <View style={styles.row}>
                    <View style={styles.dataName}>
                        <Text>Phone number:</Text>
                    </View>
                    <View style={styles.data}>
                        <Text>+{formatPhone(user.phone_number)}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.dataName}>
                        <Text>Address:</Text>
                    </View>
                    <View style={styles.data}>
                        <Text style={{flexWrap: 'wrap'}}>{JSON.stringify(user.address)}</Text>
                    </View>
                </View>
            </View>
            <HomeButton />
        </View>
    );

}

const styles = StyleSheet.create({
    dataContainer: {
        minWidth: 250,
        maxWidth: 400,
        borderColor: colors.themeColor,
        borderWidth: 2,
        borderRadius: 10
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 2
    },
    rowFirst: {
        borderTopWidth: 0
    },
    dataName: {
        width: '50%',
        borderRightWidth: 2,
        padding: 10
    },
    data: {
        width: '50%',
        padding: 10,
        
    }
})