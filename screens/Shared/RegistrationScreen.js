import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function RegistrationScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userType, setUserType] = useState('business');
    const [error, setError] = useState(null);

    const handleRegister = async() => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            console.log('Making API request to register user');
            console.log({
                first_name: firstName, 
                email, 
                password, 
                phone_number: phoneNumber,
                user_type: userType,
            });
            const response = await axios.post('/register/', { 
                first_name: firstName,
                email,
                password,
                phone_number: phoneNumber,
                user_type: userType
            }, {
                headers: {
                    'No-Auth': true
                }
            });
            console.log('API response', response.data);
            navigation.navigate('Login');
        } catch(error) {
            console.error(error); 
            if (error.response && error.response.data) {
                if (error.response.data.username) {
                    setError(error.response.data.username[0]);
                } else if (error.response.data.email) {
                    setError(error.response.data.email[0]);
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Logo */}
            <Image source={require('../../assets/icon.png')} style={styles.logo} />

            {/* First Name Input */}
            <Text style={styles.label}>First Name:</Text>
            <TextInput 
                style={styles.input} 
                value={firstName} 
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor={colors.textSecondary}  
            />

            {/* Email Input */}
            <Text style={styles.label}>Email:</Text>
            <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize='none'
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary} 
            />

            {/* Password Input */}
            <Text style={styles.label}>Password:</Text>
            <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary} 
            />

            {/* Confirm Password Input */}
            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput 
                style={styles.input} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry 
                placeholder="Confirm your password"
                placeholderTextColor={colors.textSecondary} 
            />

            {/* Phone Number Input */}
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput 
                style={styles.input} 
                value={phoneNumber} 
                onChangeText={setPhoneNumber} 
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary} 
            />

            {/* User Type Toggle */}
            <Text style={styles.label}>User Type:</Text>
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, userType === 'business' && styles.selectedToggleButton]}
                    onPress={() => setUserType('business')}>
                    <Text style={[styles.toggleButtonText, userType === 'business' && styles.selectedToggleButtonText]}>Business</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, userType === 'leafleteer' && styles.selectedToggleButton]}
                    onPress={() => setUserType('leafleteer')}>
                    <Text style={[styles.toggleButtonText, userType === 'leafleteer' && styles.selectedToggleButtonText]}>Leafleteer</Text>
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Register Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleRegister} style={[styles.customButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.customButtonText}>Register</Text>
                </TouchableOpacity>
            </View>

            {/* Back to Login Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.customButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.customButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container : {
        flexGrow: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background, 
        padding: spacing.medium,
        paddingBottom: spacing.large,
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
        color: colors.primary, 
        fontSize: fontSizes.medium,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: colors.textSecondary, 
        borderWidth: 1,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.medium,
        paddingHorizontal: spacing.small,
        backgroundColor: colors.white, 
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: spacing.large,
        justifyContent: 'space-between',
    },
   toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.small,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: borderRadius.medium,
    marginHorizontal: spacing.small / 2,
   },
   selectedToggleButton: {
    backgroundColor: colors.primary,
   },
   toggleButtonText: {
    color: colors.textSecondary,
   },
   selectedToggleButtonText: {
    color: colors.white,
   },
    buttonContainer: {
        width: '100%',
        marginBottom: spacing.medium,
    },
    customButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.medium,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    customButtonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
    },
    errorText: {
        color: colors.danger,
        marginBottom: spacing.medium,
        textAlign: 'center',
    },
});