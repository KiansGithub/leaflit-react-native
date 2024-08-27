import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import axios from '../../api';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';

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
            console.log(`Fetching bids for jobId: ${jobId}`);
            const response = await axios.get(`/bids/?job_id=${jobId}`);
            console.log(`Fetched bids:`, response.data);
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
            console.log(`Accepting bid with id: ${bidId}`);
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
        try {
            console.log(`Rejecting bid with id: ${bidId}`);
            const response = await axios.post(`/bids/${bidId}/reject/`);
            console.log('Bid rejected:', response.data);
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
        padding: 16,
        backgroundColor: '#EAF2F8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    jobDetail: {
        fontSize: 16,
        marginBottom: 16,
        color: '#00274D',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bidItem: {
        padding: 16,
        backgroundColor: '#F4F7FA',
        borderRadius: 8,
        marginBottom: 8,
        borderColor: '#7D8A95',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bidText: {
        color: '#00274D',
    },
    bidActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    acceptButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 80,
    },
    rejectButtonText: {
        color: '#dc3545',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 80,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    bidsList: {
        paddingBottom: 16,
    },
    viewMapButton: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    viewMapButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});