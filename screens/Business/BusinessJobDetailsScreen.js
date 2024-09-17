import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert, Linking } from 'react-native';
import axios from '../../api';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';
import { useStripe } from '@stripe/stripe-react-native';

export default function BusinessJobDetailsScreen() {
    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isAcceptingBid, setIsAcceptingBid] = useState(false);

    const route = useRoute();
    const navigation = useNavigation();
    const { jobId } = route.params;
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    useEffect(() => {
        fetchJobDetails();
        fetchJobBids();
    }, [refresh]);

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`/business-jobs/${jobId}/`);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const fetchJobBids = async () => {
        try {
            const response = await axios.get(`/bids/?job_id=${jobId}`);
            setBids(response.data);
        } catch (error) {
            console.error('Error fetching job bids:', error);
        }
    };

    // Confirmation dialog for accepting a bid 
    const confirmAcceptBid = (bidId) => {
        Alert.alert(
            "Accept Bid", 
            "Are you sure you want to accept this bid?", 
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => handleAcceptBid(bidId) }
            ],
            { cancelable: true }
        );
    };

    const handleAcceptBid = async (bidId) => {
        if (isAcceptingBid) return; 

        setIsAcceptingBid(true);

        try {
            const response = await axios.post(`/bids/${bidId}/accept/`);
            console.log('Bid accepted:', response.data);

            // Extract the client_asecret, empheralKey, and customer ID from the response 
            const { client_secret, ephemeral_key, customer_id } = response.data;

            if (client_secret) {
                console.log('Client Secret:', client_secret);
                console.log('Ephemeral Key:', ephemeral_key);
                console.log('Customer ID:', customer_id);

                // Initialize the PaymentSheet
                const { error: initError } = await initPaymentSheet({
                    merchantDisplayName: 'Leaflit',
                    customerId: customer_id,
                    customerEphemeralKeySecret: ephemeral_key,
                    paymentIntentClientSecret: client_secret,
                });

                if (initError) {
                    console.error('Error initializing PaymentSheet:', initError);
                    Alert.alert('Error', 'Failed to initialize payment. Please try again.');
                    return;
                }

                // Present the PaymentSheet to the user 
                const { error: sheetError } = await presentPaymentSheet();

                if (sheetError) {
                    console.error('Error presenting PaymentSheet:', sheetError);
                    Alert.alert('Payment Failed', sheetError.message);
                } else {
                    Alert.alert('Payment Successful', 'Your payment was successful!');
                }
            }

            setRefresh(prev => !prev);
            navigation.navigate('Business')
        } catch (error) {
            console.error('Error accepting bid:', error);
        } finally {
            setIsAcceptingBid(false);
        }
    };

    // Confirmation dialog for rejecting a bid 
    const confirmRejectBid = (bidId) => {
        Alert.alert(
            "Reject Bid", 
            "Are you sure you want to reject this bid?", 
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => handleRejectBid(bidId) }
            ],
            { cancelable: true }
        );
    };

    const handleRejectBid = async (bidId) => {
        try {;
            const response = await axios.post(`/bids/${bidId}/reject/`);
            setRefresh(prev => !prev);
        } catch (error) {
            console.error('Error rejecting bid:', error);
        }
    }

    const handleViewOnMap = () => {
        navigation.navigate('Business Job Map', {
            jobId: job.id,
            coordinates: { latitude: job.latitude, longitude: job.longitude },
            radius: job.radius,
            businessUserId: job.business_user,
        });
    }

    const renderBidItem = ({ item }) => (
        <View style={styles.bidItem}>
            <Text style={styles.bidText}>£{item.bid_amount} from {item.leafleteer_user.first_name}</Text>
            <View style={styles.bidActions}>
                <TouchableOpacity 
                onPress={() => confirmAcceptBid(item.id)}
                disabled={isAcceptingBid}
                style={isAcceptingBid ? styles.disabledButton : styles.acceptButton}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => confirmRejectBid(item.id)}
                    style={styles.rejectButton}
                    >
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {job ? (
                <>
                <TouchableOpacity style={styles.viewMapButton} onPress={handleViewOnMap}>
                    <Text style={styles.viewMapButtonText}>View on Map</Text>
                </TouchableOpacity>
                <Text style={styles.jobDetail}>Number of Leaflets: {job.number_of_leaflets}</Text>
                <Text style={styles.jobDetail}>Job Status: {job.status}</Text>


                {job.status === 'Open' && (
                <>
                <Text style={styles.sectionTitle}>Bids</Text>
                {bids.length > 0 ? (
                    <FlatList 
                        data={bids}
                        renderItem={renderBidItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.bidsList}
                    />
                ) : (
                    <Text style={styles.noBidsText}>No bids yet</Text>
                )}
                </>
                )}
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: fontSizes.xlarge,
        fontWeight: fontWeights.bold,
        marginBottom: spacing.large,
        color: colors.primary,
    },
    jobDetail: {
        fontSize: fontSizes.medium,
        marginBottom: spacing.medium,
        color: colors.primary,
    },
    sectionTitle: {
        fontSize: fontSizes.large,
        fontWeight: fontWeights.bold,
        marginBottom: spacing.medium,
        color: colors.primary
    },
    bidItem: {
        padding: spacing.large,
        backgroundColor: colors.cardBackground,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.small,
        borderColor: colors.textSecondary,
        borderWidth: 1,
        shadowColor: colors.textSecondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bidText: {
        fontSize: fontSizes.large,
        color: colors.primary,
        fontWeight: fontWeights.bold, 
        marginBottom: spacing.small,
    },
    bidActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.medium,
    },
    acceptButton: {
        backgroundColor: colors.success,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        minWidth: 100,
    },
    rejectButton: {
        backgroundColor: colors.danger, 
        padding: spacing.small, 
        borderRadius: borderRadius.small, 
        alignItems: 'center',
        minWidth: 100,
    },
    disabledButton: {
        backgroundColor: colors.textSecondary,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        minWidth: 80,
    },
    buttonText: {
        color: colors.white,
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.medium,
    },
    bidsList: {
        paddingBottom: spacing.medium,
    },
    noBidsText: {
        fontSize: fontSizes.medium, 
        color: colors.textSecondary, 
        textAlign: 'center', 
        marginTop: spacing.medium, 
    },
    viewMapButton: {
        backgroundColor: colors.secondary,
        padding: spacing.medium,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        marginTop: spacing.small,
        marginBottom: spacing.medium,
    },
    viewMapButtonText: {
        color: colors.white,
        fontWeight: fontWeights.bold,
    },
});