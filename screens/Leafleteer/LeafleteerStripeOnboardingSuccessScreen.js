import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LeafleteerStripeOnboardingSuccessScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // Handle any logic here, such as updating the user's Stripe account status 
        navigation.navigate('Leafleteer');
    }, []);

    return (
        <View style={StyleSheet.container}>
            <Text style={StyleSheet.message}>Onboarding Completed! Redirecting...</Text>
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
    messsage: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LeafleteerStripeOnboardingSuccessScreen;