import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LeafleteerEditProfileScreen() {
    const [profile, setProfile] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigation = useNavigation();

    const scrollViewRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/profiles/');
            const profileData = response.data;
            console.log('Profile data:', profileData);
            setProfile(profileData);
            setFirstName(profileData.first_name);
            setLastName(profileData.last_name);
            setEmail(profileData.email);
            setPhoneNumber(profileData.phone_number);
            setAddress(profileData.home_address || '');
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        try {
            const response = await axios.put(`/profiles/${profile.id}/`, {
                first_name: firstName, 
                last_name: lastName, 
                email: email, 
                phone_number: phoneNumber, 
                home_address: address, 
            });
            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to update profile:', error.response.data);
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding': 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView 
                style={styles.container}
                contentContainerStyle={{ paddingBottom: spacing.large, flexGrow: 1 }}
                ref={scrollViewRef}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText}>Edit Profile</Text>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput 
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput 
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput 
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput 
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        multiline 
                    />
                </View>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSave} 
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, 
        padding: spacing.medium,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: spacing.large,
    },
    headerText: {
        fontSize: fontSizes.xlarge, 
        fontWeight: fontWeights.bold, 
        color: colors.textPrimary,
    },
    formGroup: {
        marginBottom: spacing.medium,
    },
    label: {
        fontSize: fontSizes.medium, 
        fontWeight: fontWeights.bold, 
        color: colors.textSecondary, 
        marginBottom: spacing.small / 2, 
    },
    input: {
        borderWidth: 1,
        borderColor: colors.textSecondary, 
        borderRadius: borderRadius.medium, 
        padding: spacing.small, 
        fontSize: fontSizes.medium, 
        color: colors.textPrimary, 
        backgroundColor: colors.background, 
    },
    saveButton: {
        backgroundColor: colors.primary, 
        padding: spacing.medium, 
        borderRadius: borderRadius.medium, 
        alignItems: 'center',
        marginTop: spacing.large,
    },
    saveButtonText: {
        color: colors.white, 
        fontSize: fontSizes.medium, 
        fontWeight: fontWeights.bold, 
    },
});