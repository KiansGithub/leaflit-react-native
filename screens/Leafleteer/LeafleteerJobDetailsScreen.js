import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import axios from '../../api';
import { useReoute, useNavgation } from '@react-navigation/native';

export default function JobDetailsScreen() {
    const [job, setJob] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const route = useRoute9;
    const navigation = useNavigation();
    const { jobId } = route.params;

    useEffect(() => {
        fetchJobDetails();
    }, []);

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get('/leafleteerjob/${jobId');
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const handleBid = async () => {
        try {
            const response = await axios.post('/bids/', {
                job: jobId, 
                bid_amount: bidAmount
            });
            console.log('Bid placed successfully:', response.data);
        } catch (error) {
            console.error('Error placing bid:', error);
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
        <View style={StyleSheet.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={StyleSheet.backButton}>
                <Text style={StyleSheet.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={StyleSheet.header}>Job Details</Text>
            <Text style={StyleSheet.jobDescription}>{job.description}</Text>
          
        </View>
    )
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
    viewBidsButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
    },
    viewBidsButtonText: {
        color: '#fff',
        fontSize: 16,
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