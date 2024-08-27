import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LeafleteerMyBidsScreen() {
    const [bids, setBids] = useState([]);
    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchBids = async () => {
        try {
            const response = await axios.get('bids/', {
                params: { status: 'Pending' }
            });
            const bidData = response.data;
            console.log("Bids fetched:", bidData);
            setBids(bidData);

            // Fetch job details for each bid 
            const jobDetails = await Promise.all(
                bidData.map(async (bid) => {
                    try {
                    const jobResponse = await axios.get(`/leafleteerjobs/${bid.job}/`);
                    console.log("Job detais fetched for job ID", bid.job, ":", jobResponse.data);
                    return { jobId: bid.job, jobDetails: jobResponse.data};
                    } catch (error) {
                        console.error(`Error fetching job details for job ID ${bid.job}:`, error);
                        return { jobId: bid.job, jobDetails: null};
                    }
                })
            );

            // Store job details in the jobs state 
            const jobDetailsMap = jobDetails.reduce((acc, job) => {
                acc[job.jobId] = job.jobDetails;
                return acc;
            }, {});

            setJobs(jobDetailsMap);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bids:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to load bids. Please try again later.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBids();
        }, [])
    );

    const handleCancelBid = async (bidId) => {
        try {
            await axios.delete(`/bids/${bidId}/`);
            fetchBids();
            Alert.alert('Success', 'Bid cancelled successfully');
        } catch (error) {
            console.error('Error cancelling bid:', error);
            Alert.alert('Error', 'Failed to cancel bid. Please try again.');
        }
    }

    const renderBidItem = ({ item }) => {
        const jobDetails = jobs[item.job];

        return (
        <View style={styles.bidCard}>
            {jobDetails ? (
                <>
                <View style={styles.jobInfo}>
                    <Text style={styles.location}>
                        <Ionicons name="location-outline" size={18} color="#007BFF" />
                        {jobDetails.location}
                    </Text>
                    <Text style={styles.amount}>£{item.bid_amount}</Text>
                    <Text style={styles.posterName}>Posted by: {jobDetails.posterName}</Text>   
                </View>
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBid(item.id)}>
                    <Ionicons name="trash-bin" size={18} color="white" />
                </TouchableOpacity>
                </>
            ) : (
                <ActivityIndicator size="small" color="#007BFF" />
            )}
        </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>My Bids</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
            <FlatList 
                data={bids}
                renderItem={renderBidItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.bidList}
            />
            )}
            <TouchableOpacity style={styles.loadMoreButton} onPress={fetchBids}>
                <Text style={styles.loadMoreText}>Load More</Text>
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
    headerContainer: {
        marginBottom: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00274D',
        marginBottom: 16,
    },
    bidList: {
        paddingBottom: 16,
    },
    bidCard: {
        backgroundColor: '#F4F7FA',
        padding: 16,
        marginBottom: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#7D8A95',
        elevation: 4,
        shadowColor: '#000',
        shadowOffer: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    jobInfo: {
        flex: 1,
        marginRight: 16,
    },
    location: {
        fontSize: 16,
        color: '#007BFF',
        marginBottom: 8,
        fontWeight: '600',
    },
    amount: {
        fontSize: 22,
        color: '#28A745',
        fontWeigjht: 'bold',
        marginBottom: 12,
    },
    posterName: {
        fontSize: 14,
        color: '#7D8A95',
        fontStyle: 'italic',
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    jobDetails: {
        fontSize: 16,
        color: '#00274D',
        marginBottom: 4,
    },
    bidInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bidAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6c757d',
    },
    bidStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6c757d',
    },
    pending: {
        color: '#ffc107',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    bidDetails: {
        fontSize: 16,
        marginBottom: 4,
    },
    bidOptions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        color: '#dc3545',
        fontWeight: 'bold',
    },
    loadMoreButton: {
        backgroundColor: '#00274D',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 16,
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});