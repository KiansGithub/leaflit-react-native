import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

const LeafleteerStripeOnboardingSuccessScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // Handle any logic here, such as updating the user's Stripe account status 
        navigation.navigate('Leafleteer');
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Onboarding Completed! Redirecting...</Text>
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
        color: colors.primary
    },
});

export default LeafleteerStripeOnboardingSuccessScreen;