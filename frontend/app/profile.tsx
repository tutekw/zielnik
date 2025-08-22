import { PlatformPressable } from '@react-navigation/elements';
import { Text, View, StyleSheet, TextInput, Button, Pressable, Platform, TextBase, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HomeButton from '@/components/HomeButton';
import { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import { authStyles, colors  } from './styles';
import handleResponseError from './responseErrorHandler';
import { LinearGradient } from 'expo-linear-gradient';


export default function Profile() {
  
    const router = useRouter();

    useEffect(() => {
            fetchData();
        }, []);

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEdit] = useState<boolean>(false);

    //const [phoneCode, setPhoneCode] = useState<string>('');
    // const [pickerVisible, setPickerVisibility] = useState<boolean>(false);

    const nameRef = useRef(null);
    const surnameRef = useRef(null);
    const codeRef = useRef(null);
    const phoneRef = useRef(null);

    // const streetRef = useRef(null);
    // const streetNumRef = useRef(null);
    // const houseNumRef = useRef(null);
    // const postcodeRef = useRef(null);
    // const cityRef = useRef(null);
    // const countryRef = useRef(null);

    const styles = createStyles(editing);

    const [errorMessage, setErrorMessage] = useState('');
    const [messageVisible, setMessageVisible] = useState<boolean>(false)

    const [formData, setFormData] = useState({name: '', surname: '', phone_code: '', phone_number: ''});
    //street: '', street_number: '', house_number: null, postcode: '', city: '', country: ''

    function handleChange(field: 'name' | 'surname' | 'phone_code' | 'phone_number', value: string|undefined) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }
    // | 'street' | 'street_number' | 'house_number' | 'postcode' | 'city' | 'country'

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
                const user = {
                    ...response.data,
                    address: response.data.address ?? {}
                };
                console.log(response.data)
                setUser(user);
                return;
            }
        } catch (err) {
            console.error("Error getting user data: ", err);
        } finally {
            setLoading(false);
        }
    };

    // const formatPhone = (phone: any) => {
    //     if (!phone) return "";
    //     const str = String(phone);
    //     return str.slice(0, 2) + " " + str.slice(2);
    // };

    const formatSubscription = (sub: any) => {
        if (!sub || sub.subscription_type == 0) {
            return (
                <View style={styles.subscription}>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Free subscription</Text>
                </View>
            );
        }
        else if(sub.subscription_type == 1) {
            return (
                <LinearGradient
                    colors={['#39d5b8', '#22b005']}
                    start={{x: 0.85, y: 0.85}}
                    end={{x: 0.15, y: 0.15}}
                    style={styles.subscription}
                >
                    <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 18, marginBottom: 10}}>Premium subscription</Text> {/* fajne efekty, pogrubienie, jakis gradient */}
                    <Text style={{textAlign: 'right', color: '#fff'}}>Expires in: {sub.expire_date ? sub.expire_date : 'Lifetime!'}</Text>
                </LinearGradient>
            )
        }
    };

    function edit() {
        setFormData({
            name: user.name,
            surname: user.surname,
            phone_code: user.phone_code,
            phone_number: user.phone_number
        });
        setEdit(true);
    }

    function save(e :any) {
        e.preventDefault();
        if(!window.sessionStorage ) { 
            return;
        }
        const token = sessionStorage.getItem("token");
        if(!token ) { 
            return;
        }
        // const number = ((formData.phone_code).concat(formData.phone_number)).replace(/\s+/g, '');
        (async ()=>{
            try {
                const response = await axios.post('http://localhost:5050/api/user/update', {
                    name: formData.name,
                    surname: formData.surname,
                    phone_code: formData.phone_code,
                    phone_number: formData.phone_number,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status == 200) {
                    setLoading(true);
                    setEdit(false);
                    await fetchData();
                    setMessageVisible(true);
                    return;
                } 
            }
            catch (error :any) {
                setMessageVisible(false);
                if(error.response && error.response.status === 400) setErrorMessage(error.response.data.message);
                else setErrorMessage(handleResponseError(error));
            }
        })();

    }

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

            {!editing && formatSubscription(user.subscription)}
            {editing && <Text style={[authStyles.title, {textAlign: 'left', marginBottom: 10}]}>Editing</Text>}
            <View style={styles.dataContainer}>
                
                <View style={[styles.row, styles.rowFirst]}>
                    <View style={styles.dataName}>
                        <Text>First name:</Text>
                    </View>
                    {editing ? (
                        <TextInput 
                        style={[styles.data, styles.dataFirst]}
                        value={formData.name}
                        ref={nameRef} 
                        onChangeText={(text) => handleChange('name', text)} 
                        onSubmitEditing={() => surnameRef.current?.focus()} 
                        id='name'
                        returnKeyType="next"
                        placeholder='Name'
                        ></TextInput>)
                    : (
                        <View style={[styles.data, styles.dataFirst]}>
                            <Text>{user.name}</Text>
                        </View>)
                    }
                </View>

                <View style={styles.row}>
                    <View style={styles.dataName}>
                        <Text>Last name:</Text>
                    </View>
                    {editing ? (
                        <TextInput 
                        style={styles.data}
                        value={formData.surname}
                        ref={surnameRef} 
                        onChangeText={(text) => handleChange('surname', text)} 
                        onSubmitEditing={() => codeRef.current?.focus()} 
                        id='surname'
                        returnKeyType="next"
                        placeholder='Surname'
                        ></TextInput>
                    )
                    : (
                        <View style={styles.data}>
                            <Text>{user.surname}</Text>
                        </View>
                    )
                    }
                </View>

                <View style={styles.row}>
                    <View style={styles.dataName}>
                        <Text>Phone number:</Text>
                    </View>
                    {editing ? (
                        <>
                            <Text style={[styles.data, {width: '5%'}]}>+</Text>
                            <TextInput
                                style={[styles.data, {width: '10%'}]}
                                //onPress={() => setPickerVisibility(true)}
                                value={formData.phone_code}
                                ref={codeRef} 
                                onChangeText={(text) => handleChange('phone_code', text)} 
                                onSubmitEditing={() => codeRef.current?.focus()} 
                                id='phone_code'
                                returnKeyType="next"
                                placeholder='Code'
                            >
                                
                            </TextInput>
                            <TextInput 
                                style={[styles.data, styles.dataLast, {width: '35%'}]}
                                value={formData.phone_number}
                                ref={phoneRef} 
                                onChangeText={(text) => handleChange('phone_number', text)} 
                                onSubmitEditing={save}
                                id='phone_number'
                                returnKeyType="done"
                                placeholder='Phone number'
                            ></TextInput>
                        </>
                    ): (
                        <View style={[styles.data, styles.dataLast]}>
                            <Text>+{user.phone_code} {user.phone_number}</Text>
                        </View>
                    )}
                </View>
                {/* <View style={styles.row}>
                    <View style={styles.dataName}>
                        <Text>Address:</Text>
                    </View>
                    <View style={[styles.data, styles.dataLast]}>
                        <Text style={{flexWrap: 'wrap'}}>{user.address.street} {user.address.street_number} {user.address.house_number && '\nflat '.concat(user.address.house_number)}</Text>
                        <Text style={{flexWrap: 'wrap'}}>{user.address.postcode} {user.address.city}</Text>
                        <Text style={{flexWrap: 'wrap'}}>{user.address.country}</Text>
                    </View>
                </View> */}
            </View>
            {editing ? (
                <PlatformPressable style={styles.editBtn} onPress={save}>
                    <Text style={[styles.editBtnText, {textAlign: 'center'}]}>Save changes</Text>
                </PlatformPressable>
            )
            : (
                <PlatformPressable style={styles.editBtn} onPress={edit}>
                    <Text style={styles.editBtnText}>Edit</Text>
                    <FontAwesome style={styles.editIcon} name="edit" color="black" />
                </PlatformPressable>
            )
            }
            {messageVisible && (
                <Text style={[authStyles.subtitle, {color: colors.themeColor}]}>Data saved successfully!</Text>
            )}
            <HomeButton />
        </View>
    );
}

const createStyles = (editing: boolean) => StyleSheet.create({
    dataContainer: {
        minWidth: 400,
        maxWidth: 400,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: editing ? 'black' : colors.themeColor,
        backgroundColor: editing ? '#ddd' : '#fff'
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
        backgroundColor: '#fff',
        borderLeftWidth: editing ? 2 : 0
    },
    dataFirst: {
        borderStartEndRadius: 10
    },
    dataLast: {
        borderEndEndRadius: 10,
    },
    editBtn: {
        width: 100,
        position: 'relative',
        top: 20,
        height: 50,
        backgroundColor: colors.themeColor,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        left: 150,
        padding: 20
    },
    editBtnText: {
        textAlign: 'left',
        color: '#fff',
        fontWeight: 'bold'
    },
    editIcon: {
        position: 'absolute',
        right: 10,
        fontSize: 20,
        color: '#fff',
        top: 13
    },
    subscription: {
        width: 250,
        padding: 20,
        marginBottom: 30,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
        elevation: 5,
        minHeight: 100
    }
})