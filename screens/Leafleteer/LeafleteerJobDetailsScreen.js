import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import axios from '../../api';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function LeafleteerJobDetailsScreen() {
    const [job, setJob] = useState(null);
    const [businessUser, setBusinessUser] = useState(null);
    const [locationName, setLocationName] = useState('Loading...');
    const [bidAmount, setBidAmount] = useState('');
    const [isStripeAccountSetup, setIsStripeAccountSetup] = useState(false);
    const [onboardingUrl, setOnboardingUrl] = useState(null);
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
            console.log('Job Details:', response.data);

            // Accessing job details correctly 
            const jobData = response.data.job; 

            console.log('Business User ID:', jobData.business_user);
            setJob(jobData);

            if (jobData.business_user) {
                fetchBusinessUserDetails(jobData.business_user);
            } else {
                console.warn('Business User ID is undefined');
                setBusinessUser(null);
            }

            if (jobData.latitude && jobData.longitude) {
                fetchLocationName(jobData.latitude, jobData.longitude);
            } else {
                setLocationName('Location unavailable');
                console.warn('Latitude or Longitude is missing from job data');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const fetchBusinessUserDetails = async (userId) => {
        try {
            const response = await axios.get(`/profiles/${userId}/`);
            setBusinessUser(response.data);
        } catch (error) {
            console.error('Error fetching business user details:', error);
        }
    };

    const fetchLocationName = async (latitude, longitude) => {
        console.log('Fetching location name for:', latitude, longitude);
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude, 
                longitude,
            });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                setLocationName(`${address.city}, ${address.region}`);
            } else {
                setLocationName('Unknown Location');
            }
        } catch (error) {
            console.error('Error fetching location name:', error);
            setLocationName('Location Unavailable');
        }
    };

    const checkStripeAccountSetup = async () => {
        try {
            const response = await axios.get('/stripe-account-status/'); // Endpoint to check if Stripe account is set up
            setIsStripeAccountSetup(response.data.is_stripe_account_fully_setup);

            if (!response.data.is_stripe_account_fully_setup) {
                // Fetch the Stripe onboarding URL if the account is not fully set up 
                const onboardingResponse = await axios.get('/stripe-onboarding-url/');
                console.log('Onboarding response data:', onboardingResponse.data);

                if (onboardingResponse.data && onboardingResponse.data.onboarding_url) {
                    setOnboardingUrl(onboardingResponse.data.onboarding_url);
                    console.log('Onboarding URL:', onboardingResponse.data.onboarding_url);
                } else {
                    console.error('Onboarding URL is missing in the response');
                }
            }
        } catch (error) {
            console.error('Error checking Stripe account setup:', error);
            Alert.alert('Error', 'unable to check payment setup. Please try again later.');
        }
    };

    const handleBid = async () => {
        console.log('Bid button clicked');
        console.log('Is Stripe Account setup:', isStripeAccountSetup);
        if (!isStripeAccountSetup) {
            console.log('Onboarding URL:', onboardingUrl);
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
            return;
        }

        try {
            console.log('Placing bid...')
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
            console.error('Error placing bid:', error);
            alert('Error placing bid');
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
            <Text style={styles.jobDetail}>Location: {locationName}</Text>
            <Text style={styles.jobDetail}>Number of Leaflets: {job.number_of_leaflets}</Text>
            <Text style={styles.jobDetail}>Average Bid Amount: £{job.average_bid_amount}</Text>
            <TextInput 
                style={styles.input}
                placeholder="Your Bid"
                value={bidAmount}
                onChangeText={setBidAmount}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.bidButton} onPress={handleBid}>
                <Text style={styles.bidButtonText}>Bid on Job</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#EAF2F8',
    },
    backButton: {
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00274D',
        marginBottom: 16,
    },
    jobDescription: {
        fontSize: 16,
        marginBottom: 16,
    },
    jobDetail: {
        fontSize: 16,
        color: '#00274D',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#7D8A95',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: '#F4F7FA',
    },
    bidButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    bidButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});