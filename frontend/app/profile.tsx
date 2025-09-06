import { PlatformPressable } from '@react-navigation/elements';
import { Text, View, StyleSheet, TextInput, Button, Pressable, Platform, TextBase, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HomeButton from '@/components/HomeButton';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { authStyles, colors, createTableStyles  } from './styles';
import handleResponseError from './responseErrorHandler';
import { LinearGradient } from 'expo-linear-gradient';
import storage from './storage';
import dataHandler from './dataHandler';
import SubscriptionDisplay from '@/components/SubscriptionDisplay';
import AddressDisplay from '@/components/AddressDisplay';

export default function Profile() {
  
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEdit] = useState<boolean>(false);

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

    const tableStyles = createTableStyles(editing);

    const [errorMessage, setErrorMessage] = useState('');
    const [messageVisible, setMessageVisible] = useState<boolean>(false)

    const [formData, setFormData] = useState({name: '', surname: '', phone_code: '', phone_number: ''});

    function handleChange(field: 'name' | 'surname' | 'phone_code' | 'phone_number', value: string|undefined) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    const fetchData = async () => {
        try {
            const user = await dataHandler.getUser();
            if(user) setUser(user);
        } catch (err) {
            console.error("Error getting user data: ", err);
        } finally {
            setLoading(false);
        }
    };

    function edit() {
        setFormData({
            name: user.name,
            surname: user.surname,
            phone_code: user.phone_code,
            phone_number: user.phone_number
        });
        setMessageVisible(false);
        setEdit(true);
    }

    function save(e :any) {
        e.preventDefault();
        (async ()=>{
            const token = await storage.getValue("token");
            if(!token ) { 
                return;
            }

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
                    await storage.remove("user");
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
        return router.replace("/login");;
    }
    return (
        <View style={authStyles.container}>
            <Text style={authStyles.title}>User profile</Text>
            <Text style={authStyles.subtitle}>{user.mail}</Text>

            {/* subscription display */}
            {!editing && 
                <TouchableOpacity onPress={()=> router.navigate('/subscription')}>
                    <SubscriptionDisplay sub={user.subscription} displayUpgrade={true}/>
                </TouchableOpacity>
            } 
            

            {editing && <Text style={[authStyles.title, {textAlign: 'left', marginBottom: 10}]}>Editing</Text>}


            <View style={tableStyles.dataContainer}>
                <View style={[tableStyles.row, tableStyles.rowFirst]}>
                    <View style={tableStyles.dataName}>
                        <Text>First name:</Text>
                    </View>
                    {editing ? (
                        <TextInput 
                            style={[tableStyles.data, tableStyles.dataFirst]}
                            value={formData.name}
                            ref={nameRef} 
                            onChangeText={(text) => handleChange('name', text)} 
                            onSubmitEditing={() => surnameRef.current?.focus()} 
                            id='name'
                            returnKeyType="next"
                            placeholder='Name'
                        ></TextInput>
                    ): (
                        <View style={[tableStyles.data, tableStyles.dataFirst]}>
                            <Text>{user.name}</Text>
                        </View>
                    )}
                </View>
                <View style={tableStyles.row}>
                    <View style={tableStyles.dataName}>
                        <Text>Last name:</Text>
                    </View>
                    {editing ? (
                        <TextInput 
                            style={tableStyles.data}
                            value={formData.surname}
                            ref={surnameRef} 
                            onChangeText={(text) => handleChange('surname', text)} 
                            onSubmitEditing={() => codeRef.current?.focus()} 
                            id='surname'
                            returnKeyType="next"
                            placeholder='Surname'
                        ></TextInput>
                    ): (
                        <View style={tableStyles.data}>
                            <Text>{user.surname}</Text>
                        </View>
                    )}
                </View>
                <View style={tableStyles.row}>
                    <View style={tableStyles.dataName}>
                        <Text>Phone number:</Text>
                    </View>
                    {editing ? (
                        <>
                            <Text style={[tableStyles.data, {width: '5%'}]}>+</Text>
                            <TextInput
                                style={[tableStyles.data, {width: '10%', borderLeftWidth: 0}]}
                                //onPress={() => setPickerVisibility(true)}
                                value={formData.phone_code}
                                ref={codeRef} 
                                onChangeText={(text) => handleChange('phone_code', text)} 
                                onSubmitEditing={() => phoneRef.current?.focus()} 
                                id='phone_code'
                                returnKeyType="next"
                                placeholder='Code'
                            ></TextInput>
                            <TextInput 
                                style={[tableStyles.data, tableStyles.dataLast, {width: '35%'}]}
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
                        <View style={[tableStyles.data, tableStyles.dataLast]}>
                            <Text>+{user.phone_code} {user.phone_number}</Text>
                        </View>
                    )}
                </View>
            </View>
            {editing ? (
                <PlatformPressable style={tableStyles.button} onPress={save}>
                    <Text style={[tableStyles.buttonText, {textAlign: 'center'}]}>Save changes</Text>
                </PlatformPressable>
            ): (
                <PlatformPressable style={tableStyles.button} onPress={edit}>
                    <Text style={tableStyles.buttonText}>Edit</Text>
                    <FontAwesome style={styles.editIcon} name="edit" color="black" />
                </PlatformPressable>
            )}
            {messageVisible && (
                <Text style={[authStyles.subtitle, {color: colors.themeColor}]}>Data saved successfully!</Text>
            )}
            <View style={styles.addressContainer}>
                <Text style={styles.addressTitle}>Billing address</Text>
                <AddressDisplay address={user.address}></AddressDisplay>
            </View>
            <HomeButton />
        </View>
    );
}

const styles = StyleSheet.create({
    editIcon: {
        position: 'absolute',
        right: 10,
        fontSize: 20,
        color: '#fff',
        top: 13
    },
    addressContainer: {
        marginTop: 40,
        alignContent: 'center',
    },
    addressTitle: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
    }
})