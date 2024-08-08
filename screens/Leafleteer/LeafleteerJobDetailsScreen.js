import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import axios from '../../api';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function LeafleteerJobDetailsScreen() {
    const [job, setJob] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const route = useRoute();
    const navigation = useNavigation();
    const { jobId } = route.params;

    useEffect(() => {
        fetchJobDetails();
    }, []);

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`/leafleteer-jobs/${jobId}/`);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const handleBid = async () => {
        try {
            const response = await axios.post('/bids/', {
                job: jobId, 
                bid_amount: bidAmount,
                bid_status: 'Pending'
            });
            if (response.status === 201) {
                alert('Bid placed sccessfully');
                navigation.navigate('Leafleteer', { refresh: true });
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Error placing bid');
        }
    };

    if (!job) {
        return (
            <View style={StyleSheet.container}>
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
            <Text style={styles.jobDetail}>Posted by: {job.business_user.first_name}</Text>
            <Text style={styles.jobDetail}>Location: {job.location}</Text>
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
        backgroundColor: '#f5f5f5',
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        color: '#007BFF',
        fontSize: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    jobDescription: {
        fontSize: 16,
        marginBottom: 16,
    },
    jobDetail: {
        fontSize: 16,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
    bidButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    bidButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});