import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
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
            // Set error message from the API response 
            if (error.response && error.response.data) {
                if (error.response && error.response.data) {
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
            <Text>First Name:</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
            <Text>Email:</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />
            <Text>Password:</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            <Text>Confirm Password:</Text>
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <Text>Phone Number:</Text>
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />
            <Text>User Type:</Text>
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, userType === 'business' && styles.selectedToggleButton]}
                    onPress={() => setUserType('business')}
                    >
                        <Text style={[styles.toggleButtonText, userType === 'business' && styles.selectedToggleButtonText]}>Business</Text>
                    </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, userType === 'leafleteer' && styles.selectedToggleButton]}
                    onPress={() => setUserType('leafleteer')}
                >
                    <Text style={[styles.toggleButtonText, userType === 'leafleteer' && styles.selectedToggleButtonText]}>Leafleteer</Text>
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.buttonContainer}>
                <Button title="Register" onPress={handleRegister} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container : {
        flexGrow: 1, 
        justifyContent: 'center',
        padding: 16,
        paddingBottom: 60,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
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
    borderColor: 'gray',
   },
   selectedToggleButton: {
    backgroundColor: 'blue',
   },
   toggleButtonText: {
    color: 'gray',
   },
   selectedToggleButtonText: {
    color: 'white',
   },
    buttonContainer: {
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
    }
});