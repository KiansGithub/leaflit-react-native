import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

const LeafleteerStripeOnboardingRefreshScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // Handle refresh logic here 
        navigation.navigate('Leafleteer Stripe Onboarding');
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Onboarding Refresh! Redirecting...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    message: {
        fontSize: fontSizes.large,
        fontWeight: fontWeights.bold,
        color: colors.primary,
    },
});

export default LeafleteerStripeOnboardingRefreshScreen;