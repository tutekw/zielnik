import { Text, View, StyleSheet, TextInput } from 'react-native';
import { authStyles } from './styles';
import { PlatformPressable } from '@react-navigation/elements';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

export default function Forgot() {

    const styles = authStyles

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);

    function handleChange(value: string) {
        setMail(value);
    }

    function forgot (e :any) {
        e.preventDefault();
        if(mail == ''){
            setErrorMessage('Missing e-mail');
            return;
        }
        (async ()=>{
            try {
                const response = await axios.post('http://localhost:5050/api/auth/forgot', {
                    mail: mail,
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

                if (status === 400) {
                setErrorMessage("Account with this e-mail doesn't exist.");
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
                <Text style={styles.title}>Forgot your password?</Text>
                <Text style={styles.subtitle}>Not a problem!</Text>
                <Text style={styles.inputLabel}>Your e-mail</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={(text) => handleChange(text)} 
                    id='email' 
                    onSubmitEditing={forgot}
                    returnKeyType="done"
                ></TextInput>
                {visible ? (<Text style={styles.inputLabel}>Reset code sent to your e-mail! Check your inbox and <Link href="/reset" style={styles.link}>reset password</Link> </Text>) : (<Text style={styles.errorMessage}>{errorMessage}</Text>)}
                <PlatformPressable style={styles.button} onPress={forgot}>
                    Send reset code
                </PlatformPressable>
            </View>
            <View style={styles.options}>
                <Text>Remember your password? <Link href="/login" style={styles.link}>Log in instead</Link></Text>
                <Text>Don't have an account yet? <Link href="/signup" style={styles.link}>Create account</Link></Text>
            </View>
        </View>
    );
}

