import { PlatformPressable } from '@react-navigation/elements';
import { Text, View, StyleSheet, TextInput, Button, Pressable, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HomeButton from '@/components/HomeButton';
import { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import { authStyles } from './styles';
export default function Login() {
  
  const router = useRouter();
  const styles = authStyles;

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({email: '', password: ''});

  function handleChange(field: 'email' | 'password', value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            password: formData.password
          });
          if (response.status == 202) {
            setErrorMessage("Check your email to confirm your account.");
            return;
          } 
          sessionStorage.setItem("token", response.data.message.token);
          router.navigate('/');
        }
        //Error messages
        catch (error :any) {
          if(error.response) {
            const status = error.response.status;

            if (status === 400) {
              setErrorMessage('Invalid email or password.');
            } 
            else if (status === 500) {
              setErrorMessage('Server error. Please try again later.');
            } 
            else {
              setErrorMessage(`Unexpected error (${status}).`);
            }
          }
          else if (error.request) {
            //Brak odpowiedzi z serwera
            setErrorMessage('No response from server. Are you online?');
          } 
          else {
            //Coś innego poszło nie tak
            setErrorMessage('An unexpected error occurred.');
          }

          console.error('Login error:', error);
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
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <PlatformPressable style={styles.button} onPress={login}>
          <FontAwesome name="long-arrow-right" size={30} color="#fff" />
        </PlatformPressable>
      </View>
      <View style={styles.options}>
        <Text>Forgot your password? <Link href="/forgot" style={styles.link}>Reset password</Link></Text>
        <Text>Don't have an account yet? <Link href="/signup" style={styles.link}>Create account</Link></Text>
      </View>
      <HomeButton/>
    </View>
    //Dodaj że Signup i Forgot password, na stronach Forgot i Signup dodaj "Wróć do login" albo "Sign up instead", zeby ludzie na iPhone mogli nawigować
  );
}