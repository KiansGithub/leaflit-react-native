import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons'; // Import icon library 

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    // Email validation regex 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        checkBiometricSupport();
        checkSavedCredentials();
    }, []);

    const checkBiometricSupport = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
    }

    const checkSavedCredentials = async () => {
        const savedEmail = await SecureStore.getItemAsync('userEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            authenticateUser();
        }
    };

    const authenticateUser = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to login',
            fallbackLabel: 'Enter passcode',
        });

        if (result.success) {
            const savedPassword = await SecureStore.getItemAsync('userPassword');
            if (savedPassword) {
                setPassword(savedPassword);
            }
        }
    };

    // useEffect(() => {
    //     if (email && password) {
    //         handleLogin();
    //     }
    // }, [email, password]);

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

            // Fetch the user's profile to get user ID 
            const profileResponse = await axios.get('/profiles/', {
                headers: {
                    Authorization: `Bearer ${access}`,
                }
            });

            const userId = profileResponse.data.id; 
            await AsyncStorage.setItem('user_id', userId.toString());

            // Save credentials securely 
            await SecureStore.setItemAsync('userEmail', email);
            await SecureStore.setItemAsync('userPassword', password);

            await registerForPushNotificationsAsync();

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

    async function registerForPushNotificationsAsync() {
        let token; 
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus; 

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            Alert.alert('Failed to get push token for push notifications!');
            return;
        }

        const projectId = Constants.manifest?.extra?.eas?.projectId;
        token =(await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Push notification token:', token);

        try {
            await axios.post('/push-tokens/register/', { token });
        } catch (error) {
            console.error('Error sending push token to backend:', error);
        }
    }

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

            {isBiometricSupported && (
                <TouchableOpacity style={styles.iconButton} onPress={authenticateUser}>
                    <Ionicons name="finger-print" size={40} color={colors.primary} />
                    <Text style={styles.iconText}>Use Fingerprint</Text>
                </TouchableOpacity>
            )}

            <View style={styles.buttonRow}>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            </View>

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
        padding: spacing.large,
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.medium,
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: spacing.large,
        resizeMode: 'contain',
        alignSelf: 'center', // Center the logo
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: spacing.small,
        marginBottom: spacing.small / 2,
        color: colors.primary, // Dark blue text color
        fontSize: fontSizes.medium,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: colors.textSecondary, // Light gray border color
        borderWidth: 1,
        borderRadius: borderRadius.large,
        marginBottom: spacing.medium,
        paddingHorizontal: spacing.small,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: spacing.medium,
    },
    forgotPasswordContainer: {
        marginTop: spacing.medium,
    },
    forgotPassword: {
        color: colors.primary,
        marginTop: spacing.small,
        textAlign: 'center',
    },
    button: {
        flex: 1,
        backgroundColor: colors.primary, // Same background color
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: spacing.small,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
    errorText: {
        color: colors.danger,
        marginBottom: spacing.small,
        textAlign: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: 'bold',
    },
    iconButton: {
        marginTop: spacing.medium,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.medium,
    },
    iconText: {
        color: colors.primary,
        fontSize: fontSizes.small, 
        marginTop: spacing.small / 2,
        textAlign: 'center', 
    }
});