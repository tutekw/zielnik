import { useRef, useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { authStyles } from './styles';
import { PlatformPressable } from '@react-navigation/elements';
import axios from 'axios';
import HomeButton from '@/components/HomeButton';
import { Link } from 'expo-router';

export default function Reset() {
  const styles = authStyles;

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({code: '', password: '', password2: ''});
  const [visible, setVisible] = useState<boolean>(false);

  const codeRef = useRef(null);
  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);

  function handleChange(field: 'code' | 'password' | 'password2', value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }


  function reset (e :any) {
    e.preventDefault();
    if(formData.code == ''){
      setErrorMessage('Missing reset code');
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
          const response = await axios.post('http://localhost:5050/api/auth/reset', {
              code: formData.code,
              password: formData.password
          });
          if (response.status == 200) {
              setVisible(true);
              return;
          } 
      }
      //Error messages
      catch (error :any) {
        if(error.response) {
          const status = error.response.status;
          setErrorMessage(error.response.data.message);
          if (status === 400) {
          //setErrorMessage("Account with this e-mail doesn't exist.");
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
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>The code was sent to your email</Text>
        <Text style={styles.inputLabel}>Reset code</Text>
        <TextInput 
          ref={codeRef}
          style={styles.input} 
          onChangeText={(text) => handleChange('code', text)} 
          onSubmitEditing={() => passwordRef.current?.focus()} 
          id='code'
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
          onSubmitEditing={reset}
          returnKeyType="done"
        ></TextInput>
        {visible ? (<Text style={styles.inputLabel}>Password successfully changed! You can <Link href="/login" style={styles.link}>Log in now</Link> </Text>) : (<Text style={styles.errorMessage}>{errorMessage}</Text>)}
        <PlatformPressable style={styles.button} onPress={reset}>
          Change password
        </PlatformPressable>
      </View>
      <View style={styles.options}>
        <Text>Code didn't arrive? <Link href="/forgot" style={styles.link}>Resend code</Link></Text>
        <Text>Already have an account? <Link href="/login" style={styles.link}>Log in instead</Link></Text>
        <Text>Don't have an account yet? <Link href="/signup" style={styles.link}>Create account</Link></Text>
      </View>
      <HomeButton/>
    </View>
  );
}