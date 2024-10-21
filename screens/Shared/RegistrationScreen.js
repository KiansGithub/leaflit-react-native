import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity, Image, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function RegistrationScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userType, setUserType] = useState('business');
    const [businessName, setBusinessName] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [error, setError] = useState(null);
    const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Email validation regex 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone number validation regex (same as backend)
    const phoneRegex = /^\+?1?\d{9,15}$/;

    // Get coordinates 
    const getCoordinates = async(address) => {
        try {
            console.log(Constants.expoConfig?.extra?.googleMapsApiKey);
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address: address,
                    key: googleMapsApiKey
                }
            });
            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                return location;
            } else {
                throw new Error('No results found');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            throw error;
        }
    };

    const handleRegister = async() => {
        setError(null);

        // Basic validation 
        if (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber) {
            setError('Please fill in all fields');
            return;
        }

        // Email validation 
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Phone number validation 
        if (!phoneRegex.test(phoneNumber)) {
            setError('Please enter a valid phone number (9 to 15 digits)');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Additional validation based on user type 
        if (userType === 'business') {
            if (!businessName || !businessAddress) {
                setError('Please fill in all business fields');
                return;
        }
        } else if (userType === 'leafleteer') {
            if (!homeAddress) {
                setError('Please fill in the home address');
                return;
            }
        }
        try {
            let coordinates = { lat: null, lng: null };
            if (userType === 'business') {
                coordinates = await getCoordinates(businessAddress);
            } else if (userType === 'leafleteer') {
                coordinates = await getCoordinates(homeAddress);
            }

            const response = await axios.post('/register/', { 
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                phone_number: phoneNumber,
                user_type: userType,
                business_name: businessName,
                business_address: businessAddress,
                business_latitude: userType === 'business' ? coordinates.lat : null,
                business_longitude: userType === 'business' ? coordinates.lng : null,
                home_address: homeAddress,
                home_latitude: userType === 'leafleteer' ? coordinates.lat : null,
                home_longitude: userType === 'leafleteer' ? coordinates.lng : null,
            }, {
                headers: {
                    'No-Auth': true
                }
            });
            navigation.navigate('Login');
        } catch(error) {
            // Displaying specific validation errors from the backend
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                if (errorData.username) {
                    setError(errorData.username[0]);
                } 
                // Check if a specific error is returned for email
                else if (errorData.email) {
                    setError(errorData.email[0]);
                } 
                // Check for any other form-related error message 
                else if (errorData.password) {
                    setError(errorData.password[0]);
                }
                else if (errorData.non_field_errors) {
                    setError(errorData.non_field_errors[0]);
                }
                else {
                    setError('Registration failed. Please try again.');
                }
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <FlatList
                data={[{ key: 'form' }]} // Dummy data to render the form
                renderItem={() => (
                    <View style={styles.formContainer}>
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

                        {/* Last Name Input */}
                        <Text style={styles.label}>Last Name:</Text>
                        <TextInput 
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter your last name"
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

                        {/* Conditional Fields Based on User Type */}
                        {userType === 'business' && (
                            <>
                                <Text style={styles.label}>Business Name:</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={businessName}
                                    onChangeText={setBusinessName}
                                    placeholder="Enter your business name"
                                    placeholderTextColor={colors.textSecondary}
                                />

                                <Text style={styles.label}>Business Address:</Text>
                                <GooglePlacesAutocomplete
                                    placeholder="Enter your business address"
                                    onPress={(data, details = null) => {
                                        const address = data.description; 
                                        setBusinessAddress(address);
                                    }}
                                    query={{
                                        key: googleMapsApiKey,
                                        language: 'en',
                                        components: 'country:uk',
                                    }}
                                    onFocus={() => setIsDropdownVisible(true)}
                                    onBlur={() => setIsDropdownVisible(false)}
                                    styles={{
                                        textInput: {
                                            ...styles.input,
                                            width: '100%',
                                        },
                                        listView: {
                                            position: 'absolute',
                                            top: 44,
                                            zIndex: 999,
                                            elevation: 3,
                                            maxHeight: 150,
                                        },
                                        container: {
                                            flex: 1,
                                            width: '100%',
                                        },
                                    }}
                                />
                            </>
                        )}

                        {userType === 'leafleteer' && (
                            <>
                                <Text style={styles.label}>Home Address:</Text>
                                <GooglePlacesAutocomplete
                                    placeholder="Enter your home address"
                                    onPress={(data, details = null) => {
                                        const address = data.description;
                                        setHomeAddress(address);
                                    }}
                                    query={{
                                        key: googleMapsApiKey,
                                        language: 'en',
                                        components: 'country:uk',
                                    }}
                                    onFocus={() => setIsDropdownVisible(true)}
                                    onBlur={() => setIsDropdownVisible(false)}
                                    styles={{
                                        textInput: {
                                            ...styles.input,
                                            width: '100%',
                                        },
                                        listView: {
                                            position: 'absolute',
                                            top: 44,
                                            zIndex: 10,
                                            elevation: 3,
                                            maxHeight: 150,
                                        },
                                        container: {
                                            flex: 1,
                                            width: '100%',
                                        },
                                    }}
                                    onFail={(error) => console.error('Error:', error)}
                                    onNotFound={() => console.log('No results found')}
                                    onTimeout={() => console.log('Timeout')}
                                />
                            </>
                        )}

                        {/* Error Message */}
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        {/* Register Button */}
                        <View style={[styles.buttonContainer, { marginTop: isDropdownVisible ? 150 : 0 }]}>
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
                    </View>
                )}
                keyExtractor={item => item.key}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        backgroundColor: colors.background, 
    },
    formContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.medium,
        width: '100%',
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
        paddingBottom: spacing.large,
    },
    customButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.medium,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.medium,
        paddingBottom: spacing.large,
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
