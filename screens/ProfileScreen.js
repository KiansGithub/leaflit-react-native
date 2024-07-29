import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button} from 'react-native';
import axios from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async() => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get('/profiles/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    fetchProfile();
}, []);

if(!profile) {
    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
    );
}

    return (
        <View style={styles.container}>
            <Text>Username: {profile.user.username}</Text>
            <Text>Email: {profile.user.email}</Text>
            <Text>Phone Number: {profile.user.phone_number}</Text>
            {profile.user.user_type === 'business' && (
                <>
                <Text>Business Name: {profile.business_name}</Text>
                <Text>Address: {profile.address}</Text>
                </>
            )}
            {profile.user.user_type === 'leafleteer' && (
                <>
                <Text>First Name: {profile.first_name}</Text>
                <Text>Last Name: {profile.last_name}</Text>
                <Text>Rating: {profile.rating}</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});