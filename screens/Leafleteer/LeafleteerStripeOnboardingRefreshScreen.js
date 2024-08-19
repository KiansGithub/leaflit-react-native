import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LeafleteerStripeOnboardingRefreshScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // Handle refresh logic here 
        navigation.navigate('Leafleteer Stripe Onboarding');
    }, []);

    return (
        <View style={StyleSheet.container}>
            <Text style={StyleSheet.message}>Onboarding Refresh! Redirecting...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    message: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LeafleteerStripeOnboardingRefreshScreen;