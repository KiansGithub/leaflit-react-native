import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from '../../api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LeafleteerMyBidsScreen() {
    const [bids, setBids] = useState([]);
    const [jobs, setJobs] = useState({});

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
        } catch (error) {
            console.error('Error fetching bids:', error);
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
                <Text style={styles.jobDetails}><Ionicons name="location-outline" size={18} />{jobDetails.location}</Text>
                <Text style={styles.jobDetails}><Ionicons name="document-text-outline" size={18} />{jobDetails.number_of_leaflets}</Text>
            </View>
            </>
            ) : (
                <Text style={styles.jobDetails}>Loading job details...</Text>
            )}
            <View style={styles.bidInfo}>
                <Text style={styles.bidAmount}>£{item.bid_amount}</Text>
                <Text style={[styles.bidStatus, item.bid_status === 'Pending' ? styles.pending : null]}>{item.bid_status}</Text>
            </View>
            {item.bid_status === 'Pending' && (
                <View style={styles.bidOptions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBid(item.id)}>
                        <Ionicons name="trash-bin" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>My Bids</Text>
            </View>
            <FlatList 
                data={bids}
                renderItem={renderBidItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.bidList}
            />
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
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        marginBottom: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bidList: {
        paddingBottom: 16,
    },
    bidCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 3,
        shadowColor: '#000',
        shadowOffer: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    jobInfo: {
        marginBottom: 8,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    jobDetails: {
        fontSize: 16,
        color: '#333',
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
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'flex-start',
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
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 16,
    },
});