import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from '../../api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function LeafleteerFindJobsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);
    const navigation = useNavigation();

    const fetchJobs = async () => {
        try {
            const response = await axios.get('/leafleteerjobs/available/');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
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

    useEffect(() => {
        const params = navigation.getState().routes.find(route => route.name === 'LeafleteerFindJobsScreen')?.params;
        if (params?.refresh) {
            console.log("Refresh parameter detected, fetching jobs...");
            fetchJobs();
            navigation.setParams({ refresh: false });
        }
    }, [navigation]);

    const renderJobItem = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDetails}>Location: {item.location} </Text>
            <Text style={styles.jobDetails}>Status: {item.status}</Text>
            <Text style={styles.jobDetails}>Leaflets: {item.number_of_leaflets}</Text>
            <View style={styles.jobActions}>
                <TouchableOpacity 
                    style={styles.bidButton}
                    onPress={() => navigation.navigate('Leafleteer Job Details', { jobId: item.id })}
                >
                    <Text style={styles.bidButtonText}>Bid</Text>
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
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
        borderRadius: 4,
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