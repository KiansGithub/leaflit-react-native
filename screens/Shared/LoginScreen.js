import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // Email validation regex 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async() => {
        try {
            setError(null);

            // Basic validation 
            if(!email || !password) {
                setError('Please enter both email and password');
                return;
            }

            // Email format validation 
            if (!emailRegex.test(email)) { // Check if email is in valid format 
                setError('Please enter a valid email address');
                return;    
            }

            const response = await axios.post('/token/', {
                email: email.toLowerCase(), 
                password 
            });

            const { access, refresh, user_type } = response.data;

            await AsyncStorage.setItem('access_token', access);
            await AsyncStorage.setItem('refresh_token', refresh);
            await AsyncStorage.setItem('user_type', user_type);

            if(user_type === 'business') {
                navigation.navigate('Business');
            } else {
                navigation.navigate('Leafleteer');
            }
        } catch(error) {
            if (error.response) {
                const errorMessage = error.response.data.detail || "Incorrect email or password. Please try again.";
                setError(errorMessage)
            } else if (error.request) {
                setError("Network error: Please check your internet connection.");
            } else {
                setError("An unexpected error occured: " + error.message);
            }
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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

            {/* Display Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Login Button */}
            <Button 
                title="Login" 
                onPress={handleLogin} 
                color={colors.primary} // Dark blue color
            />

            {/* Register Button */}
            <Button 
                title="Register" 
                onPress={() => navigation.navigate('Register')} 
                color={colors.primary} // Dark blue color
                style={styles.registerButton}
                />

                {/* Forgot Password Link */}
            <TouchableOpacity onPress={() => navigation.navigate('Password Reset Request')} style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: colors.background,
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
    forgotPasswordContainer: {
        marginTop: spacing.medium,
    },
    forgotPassword: {
        color: colors.primary,
        marginTop: spacing.small,
        textAlign: 'center',
    },
    registerButton: {
        marginTop: spacing.medium,
    },
    errorText: {
        color: colors.danger,
        marginBottom: spacing.small,
        textAlign: 'center',
    }
});