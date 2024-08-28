import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import axios from '../../api';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function BusinessJobDetailsScreen() {
    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [locationName, setLocationName] = useState('');
    const [isAcceptingBid, setIsAcceptingBid] = useState(false);

    const route = useRoute();
    const navigation = useNavigation();
    const { jobId } = route.params;

    useEffect(() => {
        fetchJobDetails();
        fetchJobBids();
    }, [refresh]);

    useEffect(() => {
        if (job) {
            fetchLocationName();
        }
    }, [job]);

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

    const fetchLocationName = async () => {
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: job.latitude,
                longitude: job.longitude,
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

    const handleAcceptBid = async (bidId) => {
        if (isAcceptingBid) return; 

        setIsAcceptingBid(true);

        try {
            const response = await axios.post(`/bids/${bidId}/accept/`);
            console.log('Bid accepted:', response.data);
            setRefresh(prev => !prev);
            navigation.navigate('Business')
        } catch (error) {
            console.error('Error accepting bid:', error);
        } finally {
            setIsAcceptingBid(false);
        }
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
            <Text style={styles.bidText}>Name: {item.leafleteer_user.first_name}  Bid Amount: ${item.bid_amount}</Text>
            <View style={styles.bidActions}>
                <TouchableOpacity 
                onPress={() => handleAcceptBid(item.id)}
                disabled={isAcceptingBid}
                style={isAcceptingBid ? styles.disabledButton : styles.acceptButton}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRejectBid(item.id)}>
                    <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {job ? (
                <>
                <Text style={styles.jobDetail}>Location: {locationName}</Text>
                <TouchableOpacity style={styles.viewMapButton} onPress={handleViewOnMap}>
                    <Text style={styles.viewMapButtonText}>View on Map</Text>
                </TouchableOpacity>
                <Text style={styles.jobDetail}>Number of Leaflets: {job.number_of_leaflets}</Text>
                <Text style={styles.jobDetail}>Job Status: {job.status}</Text>


                {job.status === 'Open' && (
                <>
                <Text style={styles.sectionTitle}>Bids</Text>
                <FlatList 
                    data={bids}
                    renderItem={renderBidItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.bidsList}
                    />
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
        padding: spacing.medium,
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
        color: colors.primary,
    },
    bidActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.small,
    },
    acceptButton: {
        backgroundColor: colors.success,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        minWidth: 80,
    },
    rejectButtonText: {
        color: colors.danger,
        fontWeight: fontWeights.bold,
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
    },
    bidsList: {
        paddingBottom: spacing.medium,
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