import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from '../../api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function LeafleteerMyJobsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);
    const navigation = useNavigation();

    const fetchJobs = async () => {
        try {
            const response = await axios.get('leafleteerjobs/active/');
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
        if (navigation.getState().routes.some(route => route.params?.refresh)) {
            fetchJobs();
            navigation.setParams({ refresh: false });
        }
    }, [navigation]);

    const startJob = async (jobId) => {
        try {
            const response = await axios.post(`/leafleteerjobs/${jobId}/start/`, { status: 'In Progress'});
            setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'In Progress'} : job));
        } catch (error) {
            console.error('Error starting job:', error);
            Alert.alert('Error', 'Failed to start the job. Please try again.');
        }
    };

    const completeJob = async(jobId) => {
        try {
            const response = await axios.post(`/leafleteerjobs/${jobId}/complete/`, { status: 'Completed' });
            setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'Completed' } : job));
        } catch (error) {
            console.error('Error completing job:', error);
            Alert.alert('Error', 'Failed to complete the job. Please try again.');
        }
    };

    const cancelJob = async (jobId) => {
        try {
            const response = await axios.post(`/leafleteerjobs/${jobId}/cancel/`);
            setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'Cancelled' } : job));
            Alert.alert('Success', 'Job cancelled successfully.');
        } catch (error) {
            console.error('Error cancelling job:', error);
            Alert.alert('Error', 'Failed to cancel the job. Please try again.');
        }
    };

    const renderJobItem = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDetails}>Location: {item.location} | Status: {item.status}</Text>
            <View style={styles.jobOptions}>
                {item.status === 'Assigned' && (
                    <>
                    <TouchableOpacity onPress={() => startJob(item.id)}>
                        <Text style={styles.startButton}>Start</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => cancelJob(item.id)}>
                        <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                </>
                )}
                {item.status === 'In Progress' && (
                    <TouchableOpacity onPress={() => completeJob(item.id)}>
                        <Text style={styles.completeButton}>Complete</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>My Jobs</Text>
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
    jobOptions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    startButton: {
        color: '#007bff',
        fontWeight: 'bold',
        marginRight: 10,
    },
    completeButton: {
        color: '#28a745',
        fontWeight: 'bold',
    },
    cancelButton: {
        color: '#dc3545',
        fontWeight: 'bold',
    },
    optionText: {
        color: '#007bff',
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