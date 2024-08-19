import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from '../../api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function LeafleteerFindJobsScreen() {
    const [jobs, setJobs] = useState([]);
    const navigation = useNavigation();

    const fetchJobs = async () => {
        try {
            const response = await axios.get('/leafleteerjobs/available/');
            const jobsWithLocationNames = await Promise.all(
                response.data.map(async (job) => {
                    const locationName = await fetchLocationName(job.latitude, job.longitude);
                    return { ...job, locationName };
                })
            );
            setJobs(jobsWithLocationNames);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

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
            console.error('Error fetching location name:', error);
            return 'Location Unavailable';
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchJobs();
        }, [])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchJobs();
        });
        return unsubscribe;
    }, [navigation]);

    const renderJobItem = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobDetails}>Location: {item.locationName || 'Loading...'} </Text>
            <Text style={styles.jobDetails}>Status: {item.status}</Text>
            <Text style={styles.jobDetails}>Leaflets: {item.number_of_leaflets}</Text>
            <View style={styles.jobActions}>
                <TouchableOpacity 
                    style={styles.bidButton}
                    onPress={() => navigation.navigate('Leafleteer Job Details', { jobId: item.id })}
                >
                    <Text style={styles.bidButtonText}>Bid</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.mapButton} 
                    onPress={() => navigation.navigate('Leafleteer Job Map', {
                        coordinates: { latitude: item.latitude, longitude: item.longitude },
                        radius: item.radius,
                        businessUserId: item.business_user,
                    })}
                >
                    <Text style={styles.mapButtonText}>View on Map</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Find Jobs</Text>
            </View>
            <FlatList 
                data={jobs}
                renderItem={renderJobItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.jobList}
            />
            <TouchableOpacity style={styles.loadMoreButton} onPress={fetchJobs}>
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
    jobList: {
        paddingBottom: 16,
    },
    jobCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    jobDetails: {
        fontSize: 14,
        marginBottom: 4,
    },
    jobActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bidButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    bidButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    mapButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    mapButtonText: {
        color: '#fff',
        fontSize: 16,
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