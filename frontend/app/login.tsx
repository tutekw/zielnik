import { PlatformPressable } from '@react-navigation/elements';
import { Text, View, StyleSheet, TextInput, Button, Pressable, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HomeButton from '@/components/HomeButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
export default function Login() {
  
    const router = useRouter();

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
            sessionStorage.setItem("token", response.data.message.token)
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
      <View style={styles.loginForm}>
        <Text style={styles.title}>Welcome to Zielnik!</Text>
        <Text style={styles.subtitle}>Please log in</Text>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput style={styles.input} onChangeText={(text) => handleChange('email', text)} id='email'></TextInput>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput style={styles.input} secureTextEntry={true} onChangeText={(text) => handleChange('password', text)} id='password'></TextInput>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <PlatformPressable style={styles.loginBtn} onPress={login}>
          <FontAwesome name="long-arrow-right" size={30} color="#fff" />
        </PlatformPressable>
      </View>
      <HomeButton/>
    </View>
    //Dodaj że Signup i Forgot password, na stronach Forgot i Signup dodaj "Wróć do login" albo "Sign up instead", zeby ludzie na iPhone mogli nawigować
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',

  },
  loginForm: {
    alignItems: 'center',
    position: 'relative',
    top: -50
  },
  title: {
    color: '#000',
    fontSize: 25,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 30
  },
  inputLabel: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#22b005',
    borderRadius: 3,
    borderWidth: 1,
    minWidth: 100,
    marginTop: 8,
    minHeight: 25,
    padding: 5
  },
  errorMessage: {
    color: 'red',
    marginTop: 10
  },
  loginBtn: {
    width: 120,
    height: 50,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#22b005',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
