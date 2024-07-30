import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async() => {
        try {
            console.log("Starting login process");

            const response = await axios.post('/token/', {
                username: email, 
                password 
            });

            console.log("Login response received", response.data);

            const { access, refresh, user_type } = response.data;

            await AsyncStorage.setItem('access_token', access);
            await AsyncStorage.setItem('refresh_token', refresh);
            await AsyncStorage.setItem('user_type', user_type);

            console.log("Tokens and user type saved to AsyncStorage");

            console.log("User Type: ", user_type)

            if(user_type === 'business') {
                console.log("Navigating to Business home screen");
                navigation.navigate('Business');
            } else {
                console.log("Navigating to Leafleteer home screen");
                navigation.navigate('Leafleteer');
            }
        } catch(error) {
            if (error.response) {
                console.error("Login error response", error.response.data);
                alert("Login failed: " + (error.response.data.detail || "Unknown error"));
            } else if (error.request) {
                console.error("Login error request", error.request);
                alert("Network error: Please check your internet connection.");
            } else {
                console.error("Login error", error.message);
                alert("An error occurred: " + error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text>Email:</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />
            <Text>Password:</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});