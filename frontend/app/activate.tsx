import { Text, View, StyleSheet, TextInput } from 'react-native';
import { authStyles} from './styles';
import { Link, useRouter } from 'expo-router';
import { PlatformPressable } from '@react-navigation/elements';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

export default function Activate () {

    const router = useRouter();
    const styles = authStyles;

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);

    function handleChange(value: string) {
        setCode(value);
    }

    function activate (e :any) {
        e.preventDefault();
        if(code == ''){
        setErrorMessage('Missing code');
        return;
        }
        (async ()=>{
            try {
                const response = await axios.post('http://localhost:5050/api/auth/activate', {
                    code: code,
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
                    setErrorMessage('Invalid code.');
                    }
                    else if (status === 409) {
                        setErrorMessage('This account is already activated')
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
                <Text style={styles.subtitle}>Please activate your account</Text>
                <Text style={styles.inputLabel}>Your activation code</Text>
                <TextInput 
                style={styles.input} 
                onChangeText={(text) => handleChange(text)} 
                id='code' 
                onSubmitEditing={activate}
                returnKeyType="done"
                ></TextInput>
                {visible ? (<Text style={styles.inputLabel}>Account activated! You can now <Link href="/login" style={styles.link}>Log in</Link> </Text>) : (<Text style={styles.errorMessage}>{errorMessage}</Text>)}
                <PlatformPressable style={styles.button} onPress={activate}>
                <FontAwesome name="long-arrow-right" size={30} color="#fff" />
                </PlatformPressable>
            </View>
            <View style={styles.options}>
                <Text>Forgot your password? <Link href="/forgot" style={styles.link}>Reset password</Link></Text>
                <Text>Already have an account? <Link href="/login" style={styles.link}>Log in instead</Link></Text>
                <Text>Don't have an account yet? <Link href="/signup" style={styles.link}>Create account</Link></Text>
            </View>
        </View>
    );
}

