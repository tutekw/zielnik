import { authStyles, colors, createTableStyles } from "@/app/styles";
import handleResponseError from "@/utils/responseErrorHandler";
import storage from "@/utils/storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { PlatformPressable } from "@react-navigation/elements";
import axios from "axios";
import Checkbox from "expo-checkbox";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image, TextInput } from "react-native";
import ModalSelector from 'react-native-modal-selector';

interface LocationWindowProps {
    visible: boolean;
    onClose: () => void;
    onSave:  () => void;
    coordinates: {
        lng: number;
        lat: number;
    }
}

export default function LocationWindow({ visible, onClose, onSave, coordinates } : LocationWindowProps) {

    const tableStyles = createTableStyles(false);

    const nameRef = useRef(null);
    const descRef = useRef(null);

    const [errorMessage, setErrorMessage] = useState("To add new locations, you must first purchase a subscription");
    
    const [subscriptionStatus, setSubscriptionStatus] = useState(0);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const user = await storage.getObject("user");
        if(user && user.subscription) {
            setSubscriptionStatus(user.subscription.subscription_type);
            if(subscriptionStatus) setErrorMessage('');
        }
        else setSubscriptionStatus(0);
    }
    

    const [formData, setFormData] = useState({name: '', description: ''});
    const [isPrivate, setPrivate] = useState(false);

    function handleChange(field: 'name' | 'description', value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    const togglePrivate = () => {
        setPrivate(!isPrivate);
    }

    

    const types = [
        { id: 'mushroom', label: 'Mushrooms', image: require('@/assets/images/mushroom.svg') },
        { id: 'herb', label: 'Herbs', image: require('@/assets/images/grass.svg') },
        { id: 'fruit', label: 'Fruits', image: require('@/assets/images/fruit-cherries.svg') },
        { id: 'other', label: 'Other', image: require('@/assets/images/sprout.png') },
    ];

    const [selectedType, setSelectedType] = useState('');

    const months = [
        { key: 1, label: 'January' },
        { key: 2, label: 'February' },
        { key: 3, label: 'March' },
        { key: 4, label: 'April' },
        { key: 5, label: 'May' },
        { key: 6, label: 'June' },
        { key: 7, label: 'July' },
        { key: 8, label: 'August' },
        { key: 9, label: 'September' },
        { key: 10, label: 'October' },
        { key: 11, label: 'November' },
        { key: 12, label: 'December' },
    ];

    const [startMonth, setStartMonth] = useState<number | null>(null);
    const [endMonth, setEndMonth] = useState<number | null>(null);

    const startMonthLabel = months.find(m => m.key === startMonth)?.label || 'Choose starting month';
    const endMonthLabel = months.find(m => m.key === endMonth)?.label || 'Choose ending month';

    function save () {
        if(!selectedType) {
            return setErrorMessage('Missing location type');
        }
        console.log(coordinates);
        (async ()=>{
			try {
                const token = await storage.getValue("token");
				const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + 'location', {
					name: formData.name,
					description: formData.description,
					type: selectedType,
                    longitude: coordinates.lng,
                    latitude: coordinates.lat,
                    collectionStartMonth: startMonth,
                    collectionEndMonth: endMonth,
                    access: isPrivate ? 1 : 0,
				},
                {
                    headers: { Authorization: `Bearer ${token}` }
                });

				if (response.status == 200) {
					await onSave();
				} 
			}
			catch (error :any) {
                if(error.response && error.response.status && error.response.status == 402) {
                    setErrorMessage("To add new locations, you must first purchase a subscription");
					return;
                }
				setErrorMessage(handleResponseError(error, 'Invalid email or password.'));
			}
		})();
    }

    const TypeButton = React.memo(({ type, isSelected, onPress } : {type :any, isSelected: boolean, onPress: ()=>void}) => (
        <PlatformPressable
            style={[styles.type, isSelected && styles.selectedType]}
            onPress={onPress}
        >
            <Image source={type.image} style={[styles.typeImg, isSelected && styles.selectedTypeImg]} resizeMode="contain" />
            <Text style={[styles.typeText, isSelected && styles.selectedTypeText]}>{type.label}</Text>
        </PlatformPressable>
    ));

    if(visible) {
        return (
            <>
                {subscriptionStatus ? (
                    <View style={styles.container}>
                        <View style={styles.mapOverlay}></View>
                        <View style={styles.addWindow}>
                                <Text style={authStyles.title}>Add location</Text>

                                <Text style={authStyles.inputLabel}>Name (Optional)</Text>
                                <TextInput 
                                    ref={nameRef} 
                                    style={authStyles.input} 
                                    onChangeText={(text) => handleChange('name', text)} 
                                    onSubmitEditing={() => descRef.current?.focus()} 
                                    id='name'
                                    returnKeyType="next"
                                ></TextInput>

                                <Text style={authStyles.inputLabel}>Short description (Optional)</Text>
                                <TextInput 
                                    ref={descRef} 
                                    style={authStyles.input} 
                                    onChangeText={(text) => handleChange('description', text)} 
                                    id='description'
                                    returnKeyType="next"
                                ></TextInput>

                                <Text style={authStyles.inputLabel}>Location type</Text>
                                <View style={styles.typeSwitch}>
                                    {types.map((type) => (
                                        <TypeButton
                                            key={type.id}
                                            type={type}
                                            isSelected={selectedType === type.id}
                                            onPress={() => setSelectedType(type.id)}
                                        />
                                    ))}
                                </View>
                                
                                <Text style={authStyles.inputLabel}>Collection period</Text>
                                
                                <View style={styles.monthSelect}>
                                    <View style={styles.pickerWrapper}>
                                        <ModalSelector
                                            data={months}
                                            initValue={startMonthLabel}
                                            onChange={(option) => setStartMonth(option.key)}
                                        />
                                    </View>
                                    <Text style={{textAlign: 'center', fontSize: 30}}>-</Text>
                                    <View style={styles.pickerWrapper}>
                                        <ModalSelector
                                            data={months}
                                            initValue={endMonthLabel}
                                            onChange={(option) => setEndMonth(option.key)}
                                        />
                                    </View>
                                </View>
                                

                                <TouchableOpacity style={authStyles.checkboxArea} onPress={togglePrivate}>
                                    <Checkbox style={authStyles.checkbox} value={isPrivate} color={colors.themeColor}/>
                                    <Text>Save as a private location</Text>
                                </TouchableOpacity>

                                <Text style={authStyles.errorMessage}>{errorMessage}</Text>

                                <Text style={styles.cancelText} onPress={onClose}>Cancel</Text>
                                <PlatformPressable style={[authStyles.button, {position: 'absolute', right: 20, bottom: 20}]} onPress={save}>
                                    <Text style={[tableStyles.buttonText, {textAlign: 'center'}]}>Save location</Text>
                                </PlatformPressable>
                        </View>
                    </View>
                ): (
                    <View style={styles.container}>
                        <View style={styles.mapOverlay}></View>
                        <View style={styles.popup}>
                            <Text style={[authStyles.title, {textAlign: 'center'}]}>{errorMessage}</Text>
                            <Text style={[styles.cancelText, {right: 0, left: 0}]} onPress={onClose}>Cancel</Text>
                        </View>
                    </View>
                )}
            </>
        )
    }
   
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#eee',
        opacity: 0.5,
    },
    popup: {
        height: 200,
        width: 440,
        backgroundColor: '#fff',
        opacity: 1,
        borderWidth: 2,
        borderColor: colors.themeColor,
        borderRadius: 10,
        alignContent: 'center',
        padding: 20,
        alignItems: 'center'
    },
    addWindow: {
        height: 600,
        width: 440,
        backgroundColor: '#fff',
        opacity: 1,
        borderWidth: 2,
        borderColor: colors.themeColor,
        borderRadius: 10,
        alignContent: 'center',
        padding: 20,
        alignItems: 'center'
    },
    typeSwitch: {
        width: '100%',
        height: 120,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    type: {
        height: 120, 
        width: 95,
        marginLeft: 1,
        alignContent: 'center',
        justifyContent: 'space-between',
        padding: 5,
    },
    selectedType: {
        backgroundColor: colors.themeColor,
    },
    typeImg: {
        alignSelf: 'center',
        height: 75,
        width: 75,
    },
    selectedTypeImg: {
        tintColor: 'white'
    },
    typeText: {
        textAlign: 'center'
    },
    selectedTypeText: {
        color: '#fff',
        fontWeight: 'bold',
        flexWrap: 'nowrap'
    },
    
    monthSelect: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pickerWrapper: {
        width: '50%', 
        alignItems: 'center',
    },
    cancelText: {
        color: "red", 
        position: 'absolute', 
        left: 20, 
        bottom: 20,     
        minWidth: 120,
        minHeight: 50,
        marginTop: 20,
        padding: 10,
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    }
})