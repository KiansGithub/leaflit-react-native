import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async() => {
        try {
            console.log("Starting login process");
            console.log("Email:", email.toLowerCase(), "Password:", password);

            const response = await axios.post('/token/', {
                email: email.toLowerCase(), 
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
            {/* Logo */}
            <Image source={require('../../assets/icon.png')} style={styles.logo} />

            {/* Email Input */}
            <Text style={styles.label}>Email:</Text>
            <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize='none' 
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary} // Light gray color
            />

            {/* Password Input */}
            <Text style={styles.label}>Password:</Text>
            <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary} // Light gray color
            />

            {/* Login Button */}
            <Button 
                title="Login" 
                onPress={handleLogin} 
                color={colors.primary} // Dark blue color
            />

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={() => navigation.navigate('Password Reset Request')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Register Button */}
            <Button 
                title="Register" 
                onPress={() => navigation.navigate('Register')} 
                color={colors.primary} // Dark blue color
                />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.medium,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: spacing.large,
        resizeMode: 'contain',
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: spacing.small,
        marginBottom: spacing.small / 2,
        color: colors.primary, // Dark blue text color
        fontSize: fontSizes.medium,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: colors.textSecondary, // Light gray border color
        borderWidth: 1,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.medium,
        paddingHorizontal: spacing.small,
        backgroundColor: colors.white,
    },
    forgotPassword: {
        color: colors.primary,
        marginTop: spacing.small,
        textAlign: 'center',
    }
});