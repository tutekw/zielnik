import { Text, View, StyleSheet, TextInput } from 'react-native';
import {colors, authStyles, createTableStyles} from '@/app/styles'
import { useEffect, useRef, useState } from 'react';
import dataHandler from './dataHandler';
import storage from './storage';
import { Link, useRouter } from 'expo-router';
import { PlatformPressable } from '@react-navigation/elements';
import HomeButton from '@/components/HomeButton';
import axios from 'axios';
import handleResponseError from './responseErrorHandler';

export default function Address() {

    const tableStyles = createTableStyles(true);

	const router = useRouter();

	const [user, setUser] = useState<any>(null)
	const [formData, setFormData] = useState({street: '', street_number: '', house_number: undefined, postcode: '', city: '', country: ''})
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	const streetRef = useRef(null);
    const streetNumRef = useRef(null);
    const houseNumRef = useRef(null);
    const postcodeRef = useRef(null);
    const cityRef = useRef(null);
    const countryRef = useRef(null);

	function handleChange(field: 'street' | 'street_number' | 'house_number' | 'postcode' | 'city' | 'country', value: string|undefined) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const user = await dataHandler.getUser();
			if(user) {
				setUser(user);
				const address = user.address;
				if(address) {
					setFormData({
						street: address.street,
						street_number: address.street_number,
						house_number: (address.house_number ? address.house_number : undefined),
						postcode: address.postcode,
						city: address.city,
						country: address.country,
					})
				}
			}
		} catch (err) {
			console.error("Error getting user data: ", err);
		} finally {
			setLoading(false);
		}
	}

	function save() {
		for (const [key, value] of Object.entries(formData)) {
			if(key == "house_number") continue;
			if(!value || value == '' ) {
				setErrorMessage((key.charAt(0).toUpperCase() + key.slice(1)).concat(" is missing"));
				return;
			}
		}
		(async () => {
			const token = await storage.getValue("token");
            if(!token ) { 
                return;
            }
            try {
                const response = await axios.post('http://localhost:5050/api/user/address', {
                    street: formData.street,
                    street_number: formData.street_number,
                    house_number: (formData.house_number ? formData.house_number : null),
                    postcode: formData.postcode,
					city: formData.city,
					country: formData.country,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status == 200) {
                    await storage.remove("user");
                    return router.replace('/profile');
                } 
            }
            catch (error :any) {
                if(error.response && error.response.status === 400) setErrorMessage(error.response.data.message);
                else setErrorMessage(handleResponseError(error));
            }
		})();
	}

	if (loading) {
        return (
            <View style={authStyles.container}>
                <Text style={authStyles.subtitle}>Loading...</Text>
            </View>
        );
    }
    if (!user) {
        return router.replace("/login");
    }

    return (
        <View style={authStyles.container}>
            <Text style={[authStyles.title, {marginBottom: 20}]}>Edit your billing address</Text>
			<View style={tableStyles.dataContainer}>

				<View style={[tableStyles.row, tableStyles.rowFirst]}>
					<View style={tableStyles.dataName}>
						<Text>Street:</Text>
					</View>
					<TextInput 
						style={[tableStyles.data, tableStyles.dataFirst]}
						value={formData.street}
						ref={streetRef} 
						onChangeText={(text) => handleChange('street', text)} 
						onSubmitEditing={() => streetNumRef.current?.focus()} 
						id='street'
						returnKeyType="next"
						placeholder='Street'
					></TextInput>
				</View>

				<View style={tableStyles.row}>
					<View style={tableStyles.dataName}>
						<Text>Street number:</Text>
						<Text>/Flat number: (optional)</Text>
					</View>
					<TextInput 
						style={tableStyles.data}
						value={formData.street_number}
						ref={streetNumRef} 
						onChangeText={(text) => handleChange('street_number', text)} 
						onSubmitEditing={() => houseNumRef.current?.focus()} 
						id='streetNumber'
						returnKeyType="next"
						placeholder='Street no.'
					></TextInput>
					<TextInput 
						style={[tableStyles.data, {width: '50%'}]}
						value={formData.house_number}
						ref={houseNumRef} 
						onChangeText={(text) => handleChange('house_number', text)} 
						onSubmitEditing={() => postcodeRef.current?.focus()} 
						id='houseNumber'
						returnKeyType="next"
						placeholder="Flat no."
					></TextInput>
				</View>

				<View style={tableStyles.row}>
					<View style={tableStyles.dataName}>
						<Text>Postcode:</Text>
					</View>
					<TextInput 
						style={tableStyles.data}
						value={formData.postcode}
						ref={postcodeRef} 
						onChangeText={(text) => handleChange('postcode', text)} 
						onSubmitEditing={() => cityRef.current?.focus()} 
						id='postcode'
						returnKeyType="next"
						placeholder='Postcode'
					></TextInput>
				</View>

				<View style={tableStyles.row}>
					<View style={tableStyles.dataName}>
						<Text>City/Town/Province:</Text>
					</View>
					<TextInput 
						style={tableStyles.data}
						value={formData.city}
						ref={cityRef} 
						onChangeText={(text) => handleChange('city', text)} 
						onSubmitEditing={() => countryRef.current?.focus()} 
						id='city'
						returnKeyType="next"
						placeholder='Place of residence'
					></TextInput>
				</View>
				
				<View style={tableStyles.row}>
					<View style={tableStyles.dataName}>
						<Text>Country:</Text>
					</View>
					<TextInput 
						style={[tableStyles.data, tableStyles.dataLast]}
						value={formData.country}
						ref={countryRef} 
						onChangeText={(text) => handleChange('country', text)} 
						onSubmitEditing={save} 
						id='country'
						returnKeyType="done"
						placeholder='Country'
					></TextInput>
				</View>
			</View>
			
			<PlatformPressable style={tableStyles.button} onPress={save}>
				<Text style={[tableStyles.buttonText, {textAlign: 'center'}]}>Save changes</Text>
			</PlatformPressable>

			<View style={{position: 'relative', top: -20, width: 400}}>
				<Text style={{textAlign: 'left'}}><Link style={{textDecorationLine: 'underline', color: 'red'}} href='/profile'>Cancel</Link></Text>
			</View>

			<Text style={authStyles.errorMessage}>{errorMessage}</Text>
			<HomeButton/>
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: '#000',
	},
});
