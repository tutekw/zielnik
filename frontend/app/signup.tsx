import HomeButton from '@/components/HomeButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PlatformPressable } from '@react-navigation/elements';
import { Link, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import { authStyles} from './styles';
import axios from 'axios';

export default function Signup() {

  const router = useRouter();
  const styles = authStyles;

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({email: '', password: '', password2: ''});
  const [visible, setVisible] = useState<boolean>(false);
  
  function handleChange(field: 'email' | 'password' | 'password2', value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function signup(e: any){
    e.preventDefault();
    if(formData.email == ''){
      setErrorMessage('Missing email');
      return;
    }
    if(formData.password == ''){
      setErrorMessage('Missing password');
      return;
    }
    if(formData.password2 == ''){
      setErrorMessage('Please repeat password');
      return;
    }
    if(formData.password != formData.password2) {
      setErrorMessage("Passwords don't match");
    }

    (async ()=>{
      try {
        const response = await axios.post('http://localhost:5050/api/auth/signup', {
          mail: formData.email,
          password: formData.password,
        });
        setVisible(true);
      }
      //Error messages
      catch (error :any) {
        setVisible(false);
        if(error.response) {
          const status = error.response.status;

          if (status === 400) {
            setErrorMessage('An account with this e-mail already exists');
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
        <Text style={styles.title}>Welcome to Zielnik!</Text>
        <Text style={styles.subtitle}>Create your account</Text>
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
          onSubmitEditing={() => repeatPasswordRef.current?.focus()} 
          returnKeyType="next"
        ></TextInput>
        <Text style={styles.inputLabel}>Repeat password</Text>
        <TextInput 
          ref={repeatPasswordRef}
          style={styles.input} 
          secureTextEntry={true} 
          onChangeText={(text) => handleChange('password2', text)} 
          id='password2'
          onSubmitEditing={signup}
          returnKeyType="done"
        ></TextInput>
        {visible ? (<Text style={styles.inputLabel}>Account successfully created! Please check your e-mail and <Link href="/activate" style={styles.link}>activate your account</Link> </Text>) : (<Text style={styles.errorMessage}>{errorMessage}</Text>)}
        <PlatformPressable style={styles.button} onPress={signup}>
          Create account
        </PlatformPressable>
      </View>
      <View style={styles.options}>
        <Text>Forgot your password? <Link href="/forgot" style={styles.link}>Reset password</Link></Text>
        <Text>Already have an account? <Link href="/login" style={styles.link}>Log in instead</Link></Text>
      </View>
      <View style={styles.info}>
        <Text>By creating an account you agree to our <Link href="/tos" style={styles.link}>Terms of service</Link> and <Link href="/privacy-policy" style={styles.link}>Privacy policy</Link></Text>
      </View>
      <HomeButton/>
    </View>
  );
}