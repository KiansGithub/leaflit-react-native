import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from '../../api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LeafleteerMyJobsScreen() {
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
            navigation.navigate('Leafleteer Job Tracking', { jobId });
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

    const removeJob = async (jobId) => {
        try {
            await axios.post(`/leafleteerjobs/${jobId}/remove/`);
            setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
            Alert.alert('Success', 'Job removed from your view.');
        } catch (error) {
            console.error('Error removing job:', error);
            Alert.alert('Error', 'Failed to remove the job. Please try again.');
        }
    };

    const renderJobItem = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobDetails}>Location: {item.location}</Text>
            <Text style={styles.jobDetails}>Number of Leaflets: {item.number_of_leaflets}</Text>
            <Text style={styles.jobDetails}>Status: {item.status}</Text>
            <View style={styles.jobOptions}>
                {item.status === 'Assigned' && (
                    <>
                    <TouchableOpacity style={styles.startButton} onPress={() => startJob(item.id)}>
                        <Ionicons name="play-circle" size={24} color="white" /> 
                        <Text style={styles.buttonText}>Start</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => cancelJob(item.id)}>
                        <Ionicons name="close-circle" size={24} color="white" />
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </>
                )}
                {item.status === 'In Progress' && (
                    <>
                    <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Leafleteer Job Tracking', { jobId: item.id })}>
                        <Ionicons name="arrow-forward-circle" size={24} color='white' />
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.completeButton} onPress={() => completeJob(item.id)}>
                        <Ionicons name="checkmark-circle" size={24} color='white' />
                        <Text style={styles.buttonText}>Complete</Text>
                    </TouchableOpacity>
                    </>
                )}
                {item.status === 'Cancelled' && (
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeJob(item.id)}>
                        <Ionicons name="trash-bin" size={24} color="white" />
                        <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                )}
                {item.status === 'Completed' && (
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeJob(item.id)}>
                        <Ionicons name="trash-bin" size={24} color="white" />
                        <Text style={styles.buttonText}>Remove</Text>
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
        elevation: 2,
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
        marginTop: 8,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffc107',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
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