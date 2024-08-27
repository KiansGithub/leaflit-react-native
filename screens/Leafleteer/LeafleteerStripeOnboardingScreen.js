import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import axios from '../../api';

const LeafleteerStripeOnboardingScreen = () => {
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState(0);
    const route = useRoute();
    const { onboardingUrl } = route.params; 
    const navigation = useNavigation();

    console.log('Onboarding URL:', onboardingUrl);

    const handleOnboardingComplete = () => {
        // Navigate back to the main app after onboarding is complete 
        navigation.navigate('Leafleteer');
    };

    // Force reload WebView when screen is focused 
    useFocusEffect(
        useCallback(() => {
            setKey(prevKey => prevKey + 1);
            setLoading(true);
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Complete Your Stripe Account Setup</Text>
            <Text style={styles.instructions}>
                Please complete the following steps to set up your Stripe account and start receiving payouts.
            </Text>

            <View style={styles.webViewContainer}>
                {loading && (
                    <ActivityIndicator 
                        size="large"
                        color="#00274D"
                        style={styles.loadingIndicator}
                    />
                )}
                
                <WebView 
                    key={key}
                    source={{ uri: onboardingUrl }}
                    style={styles.webview}
                    onLoadEnd={() => setLoading(false)}
                    onNavigationStateChange={(navState) => {
                        console.log('Navigating to URL:', navState.url);
                        if (navState.url.includes('onboarding-success')) {
                            handleOnboardingComplete();
                        } else if (navState.url.includes('onboarding-refresh')) {
                            navigation.navigate('Leafleteer Stripe Onboarding Refresh');    
                        }
                    }}
                />
            </View>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#EAF2F8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#00274D',
    },
    instructions: {
        fontSize: 16,
        marginBottom: 16,
        color: '#00274D',
    },
    webViewContainer: {
        flex: 1,
        backgroundColor: '#F4F7FA',
        borderRadius: 10,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: '#00274D',
        borderRadius: 10,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25}],
    },
    cancelButton: {
        backgroundColor: '#FF5A5F',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default LeafleteerStripeOnboardingScreen;