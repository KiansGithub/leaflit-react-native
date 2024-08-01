import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import axios from '../../api';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function BusinessJobDetailsScreen() {
    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();
    const { jobId } = route.params;

    useEffect(() => {
        fetchJobDetails();
        fetchJobBids();
    }, []);

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

    const handleAcceptBid = async (bidId) => {
        try {
            console.log(`Accepting bid with id: ${bidId}`);
            const response = await axios.put(`/bids/${bidId}/`, { bid_status: 'Accepted' });
            console.log('Bid accepted:', response.data);
            fetchJobBids();
            fetchJobDetails();
            navigation.navigate('Business')
        } catch (error) {
            console.error('Error accepting bid:', error);
        }
    };

    const renderBidItem = ({ item }) => (
        <View style={styles.bidItem}>
            <Text>Name: {item.leafleteer_user.username}  Bid Amount: ${item.bid_amount}</Text>
            <View style={styles.bidActions}>
                <TouchableOpacity onPress={() => handleAcceptBid(item.id)}>
                    <Text style={styles.acceptButton}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.viewButton}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {job ? (
                <>
                <Text style={styles.title}>Title: {job.title}</Text>
                <Text>Location: {job.location}</Text>
                <Text>Number of Leaflets: {job.number_of_leaflets}</Text>
                <Text>Job Status: {job.status}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Edit Job', { jobId: job.id })}>
                    <Text>Edit Job</Text>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Bids</Text>
                <FlatList 
                    data={bids}
                    renderItem={renderBidItem}
                    keyExtractor={(item) => item.id.toString()}
                    />
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bidItem: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        marginBottom: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    bidActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    acceptButton: {
        color: 'green',
    },
    viewButton: {
        color: 'blue',
    },
    editButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 16,
    },
});