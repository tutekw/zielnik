import { PlatformPressable } from '@react-navigation/elements';
import { Text, View, StyleSheet, TextInput, Button, Pressable, Platform, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HomeButton from '@/components/HomeButton';
import { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import { authStyles, colors } from './styles';
import handleResponseError from './responseErrorHandler';
import storage from './storage';
import Checkbox from 'expo-checkbox';
import dataHandler from './dataHandler';

export default function Login() {
	useEffect(() => {
		fetchData();
	}, []);

	const router = useRouter();
	const styles = authStyles;

	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const [errorMessage, setErrorMessage] = useState('');
	const [rememberMe, setRemember] = useState(false);
	const [formData, setFormData] = useState({email: '', password: '',});
	
	function toggleRemember() {
		setRemember(!rememberMe);
	}
	function handleChange(field: 'email' | 'password', value: string) {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}

	const fetchData = async () => {
		var loggedIn = await storage.getObject("logged_in");
		if(loggedIn) {
			router.navigate('/');
			return;
		}
		var token = await storage.getValue("token");
		if(token) {
			try {
				const response = await axios.get("http://localhost:5050/api/user/", 
					{
						headers: { Authorization: `Bearer ${token}` }
					});
				if(response.status == 200) {
					const user = {
						...response.data,
						address: response.data.address ?? {}
					};
					await storage.setObject("user", user);
					await storage.setObject("logged_in", true);
					router.navigate('/');
					return;
				}
			}
			catch(e) {
				await storage.remove("token"); //if status 400 <=> token is bad -> clear the storage
				await storage.remove("user");
			}
		}
	}

	function login(e: any){
		e.preventDefault();
		if(formData.email == ''){
		setErrorMessage('Missing email');
		return;
		}
		if(formData.password == ''){
		setErrorMessage('Missing password');
		return;
		}
		(async ()=>{
			try {
				const response = await axios.post('http://localhost:5050/api/auth/signin', {
					mail: formData.email,
					password: formData.password,
					remember_me: rememberMe,
				});
				if (response.status == 202) {
					setErrorMessage("Check your email to confirm your account.");
					return;
				} 
				await storage.setValue("token", response.data.message.token);
				await storage.setObject("logged_in", true)
				const user = await dataHandler.getUser();
				await storage.setObject("user", user);
				if(!user.subscription) {
					return router.navigate('/subscription');
				}
				return router.navigate('/');
			}
			catch (error :any) {
				setErrorMessage(handleResponseError(error, 'Invalid email or password.'));
			}
		})();
	}

	return (
		<View style={styles.container}>
		<View style={styles.form}>
			<Text style={styles.title}>Welcome back!</Text>
			<Text style={styles.subtitle}>Please log in</Text>
			<Text style={styles.inputLabel}>E-mail</Text>
			<TextInput 
				ref={emailRef} 
				style={styles.input} 
				onChangeText={(text) => handleChange('email', text)} 
				onSubmitEditing={() => passwordRef.current?.focus()} 
				id='email'
				returnKeyType="next"
			></TextInput>
			<Text style={styles.inputLabel}>Password</Text>
			<TextInput 
				ref={passwordRef} 
				style={styles.input} 
				secureTextEntry={true} 
				onChangeText={(text) => handleChange('password', text)} 
				id='password' 
				onSubmitEditing={login}
				returnKeyType="done"
			></TextInput>
			<TouchableOpacity style={styles.checkboxArea} onPress={toggleRemember}>
				<Checkbox style={styles.checkbox} value={rememberMe} color={rememberMe ? colors.themeColor : undefined}/>
				<Text>Remember me</Text>
			</TouchableOpacity>
			
			<Text style={styles.errorMessage}>{errorMessage}</Text>
			<PlatformPressable style={styles.button} onPress={login}>
			<FontAwesome name="long-arrow-right" size={30} color="#fff" />
			</PlatformPressable>
		</View>
		<View style={styles.options}>
			<Text>Your account is inactive? <Link href="/activate" style={styles.link}>Confirm account</Link></Text>
			<Text>Forgot your password? <Link href="/forgot" style={styles.link}>Reset password</Link></Text>
			<Text>Don't have an account yet? <Link href="/signup" style={styles.link}>Create account</Link></Text>
			
		</View>
		<HomeButton/>
		</View>
	);
}