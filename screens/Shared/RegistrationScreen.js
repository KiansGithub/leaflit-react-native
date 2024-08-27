import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import axios from '../../api';

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
                placeholderTextColor="#7D8A95"  
            />

            {/* Email Input */}
            <Text style={styles.label}>Email:</Text>
            <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize='none'
                placeholder="Enter your email"
                placeholderTextColor="#7D8A95" 
            />

            {/* Password Input */}
            <Text style={styles.label}>Password:</Text>
            <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                placeholder="Enter your password"
                placeholderTextColor="#7D8A95" 
            />

            {/* Confirm Password Input */}
            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput 
                style={styles.input} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry 
                placeholder="Confirm your password"
                placeholderTextColor="#7D8A95" 
            />

            {/* Phone Number Input */}
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput 
                style={styles.input} 
                value={phoneNumber} 
                onChangeText={setPhoneNumber} 
                placeholder="Enter your phone number"
                placeholderTextColor="#7D8A95" 
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
                <TouchableOpacity onPress={handleRegister} style={[styles.customButton, { backgroundColor: '#00274D'}]}>
                    <Text style={styles.customButtonText}>Register</Text>
                </TouchableOpacity>
            </View>

            {/* Back to Login Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.customButton, { backgroundColor: '#00274D' }]}>
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
        backgroundColor: '#EAF2F8', 
        padding: 16,
        paddingBottom: 60,
    },
    logo: {
        width: 150, 
        height: 150,
        marginBottom: 40,
        resizeMode: 'contain',
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginBottom: 5,
        color: '#00274D', 
        fontSize: 16,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#7D8A95', 
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
        backgroundColor: '#fff', 
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
   toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#7D8A95',
    borderRadius: 10,
    marginHorizontal: 5,
   },
   selectedToggleButton: {
    backgroundColor: '#00274D',
   },
   toggleButtonText: {
    color: '#7D8A95',
   },
   selectedToggleButtonText: {
    color: 'white',
   },
    buttonContainer: {
        width: '100%',
        marginBottom: 20,
    },
    customButton: {
        backgroundColor: '#00274D',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    customButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
});