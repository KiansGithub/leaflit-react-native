import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Clipboard } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function ContactDetailsScreen({ route }) {
    const { userId } = route.params;
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`/profiles/${userId}/`);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchUserDetails();
        }, [userId])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Failed to load user details.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Contact Details</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>First Name</Text>
                <Text style={styles.detailText}>{user.first_name}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.detailText}>{user.email}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <Text style={styles.detailText}>{user.phone_number}</Text>
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
    errorText: {
        fontSize: fontSizes.medium, 
        color: colors.error, 
    },
});