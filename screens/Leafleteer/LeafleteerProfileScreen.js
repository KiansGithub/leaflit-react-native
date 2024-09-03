import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LeafleteerProfileScreen() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/profiles/');
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Use useFocusEffect to refresh the data when the screen comes back into focus 
    useFocusEffect(
        useCallback(() => {
            setLoading(true); // Set loading to true before fetching the data again
            fetchProfile();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Failed to load profile.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Profile</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Leafleteer Edit Profile')}>
                    <Ionicons name="create-outline" size={28} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>First Name</Text>
                <Text style={styles.detailText}>{profile.first_name}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Last Name</Text>
                <Text style={styles.detailText}>{profile.last_name}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.detailText}>{profile.email}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <Text style={styles.detailText}>{profile.phone_number}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.detailText}>{profile.home_address || 'N/A'}</Text>
            </View>
        </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.large,
    },
    headerText: {
        fontSize: fontSizes.xlarge, 
        fontWeight: fontWeights.bold, 
        color: colors.textPrimary, 
    },
    detailsContainer: {
        marginBottom: spacing.medium, 
        backgroundColor: colors.cardBackground, 
        padding: spacing.medium, 
        borderRadius: borderRadius.medium, 
        borderWidth: 1, 
        borderColor: colors.textSecondary, 
    },
    label: {
        fontSize: fontSizes.medium, 
        fontWeight: fontWeights.bold, 
        color: colors.textSecondary, 
        marginBottom: spacing.small / 2,
    },
    detailText: {
        fontSize: fontSizes.medium, 
        color: colors.textPrimary,
    },
});