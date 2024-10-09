import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from '../../api';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LeafleteerJobDetailsScreen() {
    const [job, setJob] = useState(null);
    const [businessUser, setBusinessUser] = useState(null);
    const [locationName, setLocationName] = useState('Loading...');
    const [bidAmount, setBidAmount] = useState('');
    const [isStripeAccountSetup, setIsStripeAccountSetup] = useState(false);
    const [onboardingUrl, setOnboardingUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const { jobId } = route.params;

    useEffect(() => {
        fetchJobDetails();
        checkStripeAccountSetup(); // Check Stripe account setup when screen loads
    }, []);

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`/leafleteer-jobs/${jobId}/`);

            // Accessing job details correctly 
            const jobData = response.data.job; 

            setJob(jobData);

            if (jobData.business_user) {
                fetchBusinessUserDetails(jobData.business_user);
            } else {
                setBusinessUser(null);
            }

        } catch (error) {
          
        }
    };

    const fetchBusinessUserDetails = async (userId) => {
        try {
            const response = await axios.get(`/profiles/${userId}/`);
            setBusinessUser(response.data);
        } catch (error) {
            
        }
    };

    const checkStripeAccountSetup = async () => {
        try {
            const response = await axios.get('/stripe-account-status/'); // Endpoint to check if Stripe account is set up
            setIsStripeAccountSetup(response.data.is_stripe_account_fully_setup);

            if (!response.data.is_stripe_account_fully_setup) {
                // Fetch the Stripe onboarding URL if the account is not fully set up 
                const onboardingResponse = await axios.get('/stripe-onboarding-url/');

                if (onboardingResponse.data && onboardingResponse.data.onboarding_url) {
                    setOnboardingUrl(onboardingResponse.data.onboarding_url);
                } else {
                    console.error('Onboarding URL is undefined.');
                    Alert.alert('Error', 'Unable to check payment setup. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Error checking Stripe account setup:', error);
            Alert.alert('Error', 'unable to check payment setup. Please try again later.');
        }
    };

    // Function to confirm bidding 
    const confirmBid = () => {
        Alert.alert(
            "Place Bid", 
            `Are you sure you want to bid £${bidAmount}?`, 
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => handleBid() }
            ],
            { cancelable: true }
        );
    };

    const handleBid = async () => {
        if (isSubmitting) return; // Prevent further submissions 
        setIsSubmitting(true);

        if (!isStripeAccountSetup) {
            Alert.alert(
                'Complete Your Payment Setup',
                'You need to complete your Stripe account setup before placing a bid.',
                [
                    {
                        text: 'Go to Setup',
                        onPress: () => navigation.navigate('Leafleteer Stripe Onboarding', {
                            onboardingUrl: onboardingUrl,
                        }),
                    },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('/bids/', {
                job: jobId, 
                bid_amount: bidAmount,
                bid_status: 'Pending'
            });
            if (response.status === 201) {
                alert('Bid placed successfully');
                navigation.navigate('Leafleteer', { refresh: true });
            }
        } catch (error) {
            alert('Error placing bid');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!job || !businessUser) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Job Details</Text>
            <Text style={styles.jobDetail}>Posted by: {businessUser.first_name}</Text>
            <Text style={styles.jobDetail}>Number of Leaflets: {job.number_of_leaflets}</Text>
            <Text style={styles.jobDetail}>Average Bid Amount: £{job.average_bid_amount}</Text>
            <TextInput 
                style={styles.input}
                placeholder="Your Bid"
                value={bidAmount}
                onChangeText={setBidAmount}
                keyboardType="numeric"
                editable={!isSubmitting}
            />
            <TouchableOpacity 
                style={styles.bidButton} 
                onPress={confirmBid}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.white} />
                ) : (
                    <Text style={styles.bidButtonText}>Bid on Job</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    backButton: {
        marginBottom: spacing.medium,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: colors.secondary, // Bright blue
        fontSize: fontSizes.medium, // 16px
        fontWeight: fontWeights.bold,
    },
    header: {
        fontSize: fontSizes.xlarge, // 24px
        fontWeight: fontWeights.bold,
        color: colors.primary, // Dark blue
        marginBottom: spacing.medium,
    },
    jobDescription: {
        fontSize: fontSizes.medium, // 16px
        marginBottom: spacing.medium,
        color: colors.textPrimary,
    },
    jobDetail: {
        fontSize: fontSizes.medium, // 16px
        color: colors.textPrimary, // Dark blue
        marginBottom: spacing.small,
    },
    input: {
        height: 40,
        borderColor: colors.textSecondary, // Grey border
        borderWidth: 1,
        paddingHorizontal: spacing.small,
        marginBottom: spacing.medium,
        borderRadius: borderRadius.medium,
        backgroundColor: colors.cardBackground, // Very light grey-blue background
    },
    bidButton: {
        backgroundColor: colors.success, // Green for success
        padding: spacing.medium,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        marginTop: spacing.medium,
    },
    disabledButton: {
        backgroundColor: colors.textSecondary,
    },
    bidButtonText: {
        color: colors.white,
        fontSize: fontSizes.medium, // 16px
        fontWeight: fontWeights.bold,
    },
});