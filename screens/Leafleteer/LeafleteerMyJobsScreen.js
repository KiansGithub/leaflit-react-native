import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from '../../api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LeafleteerMyJobsScreen() {
    const [jobs, setJobs] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        // Load the current user's ID when the component mounts 
        const loadUserId = async () => {
            const userId = await AsyncStorage.getItem('user_id');
            if (userId) {
                setCurrentUserId(userId);
            }
        };
        loadUserId();
    })

    useFocusEffect(
        useCallback(() => {
            fetchJobs();
        }, [])
    );

    const fetchJobs = async () => {
        try {
            const response = await axios.get('leafleteerjobs/active/');
            setJobs(response.data);
        } catch (error) {
        }
    };

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

    // Function to navigate to the chat screen with the job's business user 
    const navigateToChat = (job) => {
        if (currentUserId) {
            navigation.navigate('Chat', {
                user_1: currentUserId, 
                user_2: job.business_user 
            });
        } else {
            Alert.alert('Error', 'Unable to retrieve current user information.');
        }
    }

    const startJob = async (job) => {
        try {
            const response = await axios.post(`/leafleteerjobs/${job.id}/start/`, { status: 'In Progress'});
            setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'In Progress'} : j));
            navigation.navigate('Leafleteer Job Tracking', {
                jobId: job.id, 
                coordinates: { latitude: job.latitude, longitude: job.longitude },
                radius: job.radius,
                businessUserId: job.business_user,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to start the job. Please try again.');
        }
    };

    const completeJob = async(jobId) => {
        try {
            const response = await axios.post(`/leafleteerjobs/${jobId}/complete/`, { status: 'Completed' });
            setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'Completed' } : job));
        } catch (error) {
            Alert.alert('Error', 'Failed to complete the job. Please try again.');
        }
    };

    const cancelJob = async (jobId) => {
        try {
            const response = await axios.post(`/leafleteerjobs/${jobId}/cancel/`);
            setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'Cancelled' } : job));
            Alert.alert('Success', 'Job cancelled successfully.');
        } catch (error) {
            Alert.alert('Error', 'Failed to cancel the job. Please try again.');
        }
    };

    const removeJob = async (jobId) => {
        try {
            await axios.post(`/leafleteerjobs/${jobId}/remove/`);
            setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
            Alert.alert('Success', 'Job removed from your view.');
        } catch (error) {
            Alert.alert('Error', 'Failed to remove the job. Please try again.');
        }
    };

    const renderJobItem = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobDetails}>Number of Leaflets: {item.number_of_leaflets}</Text>
            <Text style={styles.jobDetails}>Status: {item.status}</Text>
            <View style={styles.jobOptions}>
                {item.status === 'Assigned' && (
                    <>
                    <TouchableOpacity style={styles.startButton} onPress={() => startJob(item)}>
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
                    <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Leafleteer Job Tracking', { 
                        jobId: item.id,
                        coordinates: { latitude: item.latitude, longitude: item.longitude },
                        radius: item.radius,
                        businessUserId: item.business_user, 
                        })}>
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

                <TouchableOpacity 
                    style={styles.messageButton}
                    onPress={() => navigateToChat(item)}
                >
                    <Ionicons name="chatbubbles-outline" size={24} color="white" />
                    <Text style={styles.buttonText}>Message</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mapButton} onPress={() => navigation.navigate('Leafleteer Job Map', {
                    coordinates: { latitude: item.latitude, longitude: item.longitude },
                    radius: item.radius,
                    businessUserId: item.business_user,
                    })}>
                    <Ionicons name="map" size={24} color="white" />
                    <Text style={styles.buttonText}>View Map</Text>
                </TouchableOpacity>
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
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    headerContainer: {
        marginBottom: spacing.medium,
    },
    header: {
        fontSize: fontSizes.xlarge,
        fontWeight: fontWeights.bold,
        marginBottom: spacing.medium,
        color: colors.primary,
    },
    jobList: {
        paddingBottom: spacing.medium,
    },
    jobCard: {
        backgroundColor: colors.cardBackground,
        padding: spacing.medium,
        marginBottom: spacing.medium,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        elevation: 2,
    },
    jobTitle: {
        fontSize: fontSizes.large,
        fontWeight: fontWeights.bold,
        marginBottom: spacing.small,
        color: colors.primary
    },
    jobDetails: {
        fontSize: fontSizes.medium,
        marginBottom: spacing.small,
        color: colors.textPrimary,
    },
    jobOptions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.small,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        marginRight: spacing.small,
        marginBottom: spacing.small,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        marginRight: spacing.small,
        marginBottom: spacing.small,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        marginBottom: spacing.small,
    },
    buttonText: {
        color: colors.white,
        marginLeft: spacing.small,
        fontWeight: fontWeights.bold,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.danger,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        marginBottom: spacing.small,
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.danger,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        marginRight: spacing.small,
        marginBottom: spacing.small,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        marginBottom: spacing.small,
    },
    messageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary, 
        padding: spacing.small, 
        borderRadius: borderRadius.small, 
        marignBottom: spacing.small, 
    },
    optionText: {
        color: colors.secondary,
        fontWeight: fontWeights.bold,
    },
    loadMoreButton: {
        backgroundColor: colors.primary,
        padding: spacing.medium,
        borderRadius: borderRadius.small,
        alignItems: 'center',
    },
    loadMoreText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
    },
});