import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from '../../api'
import * as Location from 'expo-location';

export default function BusinessMyJobsScreen() {
    const [jobs, setJobs] = useState([]);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            fetchJobs();
        }, [])
    );


    const fetchJobs = async () => {
        try {
            const response = await axios.get('/business-jobs/');
            const jobsWithLocationNames = await Promise.all(
                response.data.map(async (job) => {
                    const locationName = await fetchLocationName(job.latitude, job.longitude);
                    return { ...job, location: locationName };
                })
            )
            setJobs(jobsWithLocationNames);
        } catch (error) {
            console.error('Error fetching jobs', error);
        }
    };

    // Function to reverse geocode the location name 
    const fetchLocationName = async (latitude, longitude) => {
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude, 
                longitude,
            });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                return `${address.city}, ${address.region}`;
            } else {
                return 'Unknown Location';
            }
        } catch (error) {
            console.error('error fetching location name', error);
            return 'Location Unavailable';
        }
    };

    const cancelJob = async (jobId) => {
        try {
            const response = await axios.post(`/business-jobs/${jobId}/cancel/`);
            Alert.alert('Success', 'Job cancelled successfully.');
            fetchJobs();
        } catch (error) {
            console.error('Error cancelling job', error);
            Alert.alert('Error', 'Failed to cancel the job. Please try again.');
        }
    };


    const removeJob = async (jobId) => {
        try {
            const response = await axios.post(`/business-jobs/${jobId}/remove/`);
            setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        } catch (error) {
            console.error('Error removing job:', error);
        }
    }

    const renderJob = ({ item }) => (
        <View style={styles.jobContainer}>
            <Text styles={styles.jobDetails}>Location: {item.location}</Text>
            <Text style={styles.jobTitle}>Number of Leaflets: {item.number_of_leaflets}</Text>
            <Text>Status: {item.status}</Text>
            {item.status === 'Open' && (
                <>
                <Text style={styles.jobDetails}>Pending Bids: {item.pending_bid_count}</Text>
                <TouchableOpacity style={styles.viewDetailsButton} onPress={() => navigation.navigate('Business Job Details', { jobId: item.id })}>
                    <Text style={styles.viewDetailsText}>View Job</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => cancelJob(item.id)}>
                    <Text style={styles.cancelButtonText}>Cancel Job</Text>
                </TouchableOpacity>
                </>
            )}
    
            {item.status === 'Completed' && (
                <>
                <TouchableOpacity
                    style={styles.viewRoutesButton}
                    onPress={() => navigation.navigate('Business Job View Routes', {
                        jobId: item.id, 
                        coordinates: { latitude: item.latitude, longitude: item.longitude },
                        radius: item.radius,
                        businessUserId: item.business_user, 
                        })}
                    >
                    <Text style={styles.viewRoutesText}>View Routes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeJob(item.id)}
                >
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity> 
                </>
            )}

            {item.status === 'Cancelled' && (
                <TouchableOpacity style={styles.removeButton} onPress={() => removeJob(item.id)}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Jobs</Text>
            <FlatList 
                data={jobs}
                renderItem={renderJob}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={
                    <TouchableOpacity style={styles.loadMoreButton} onPress={fetchJobs}>
                        <Text style={styles.loadMoreText}>Load More</Text>
                    </TouchableOpacity>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 16,
    },
    jobContainer: {
        padding: 16,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 8,
    },
    jobDetails: {
        fontSize: 14,
        marginBottom: 4,
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    removeButton: {
        backgroundColor: '#6c757d',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 8,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    viewRoutesButton: {
        backgroundColor: '#28a745',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 8,
    },
    viewRoutesText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    viewDetailsButton: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#007BFF',
        borderRadius: 4,
        alignItems: 'center',
    },
    viewDetailsText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loadMoreButton: {
        padding: 16,
        backgroundColor: '#007BFF',
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 16,
    },
    loadMoreText: {
        color: 'white',
        fontSize: 16,
    },
});