import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import axios from '../../api';

const LeafleteerStripeOnboardingScreen = () => {
    const route = useRoute();
    const { onboardingUrl } = route.params; 
    const navigation = useNavigation();

    console.log('Onboarding URL:', onboardingUrl);

    const handleOnboardingComplete = () => {
        // Navigate back to the main app after onboarding is complete 
        navigation.navigate('Leafleteer');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Complete Your Stripe Account Setup</Text>
            <Text style={styles.instructions}>
                Please complete the following steps to set up your Stripe account and start receiving payouts.
            </Text>

            {/* Use WebView to display the Stripe onboarding page */}
            <WebView 
                source={{ uri: onboardingUrl }}
                style={styles.webview}
                onNavigationStateChange={(navState) => {
                    console.log('Navigating to URL:', navState.url);
                    if (navState.url.includes('onboarding-success')) {
                        handleOnboardingComplete();
                    } else if (navState.url.includes('onboarding-refresh')) {
                        navigation.navigate('Leafleteer Stripe Onboarding Refresh');    
                    }
                }}
            />

            <Button 
                title="Cancel"
                onPress={() => navigation.goBack()}
                color="#FF6347"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    instructions: {
        fontSize: 16,
        marginBottom: 16,
    },
    webview: {
        flex: 1,
    },
});

export default LeafleteerStripeOnboardingScreen;