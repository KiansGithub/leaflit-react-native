import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from '../../api'
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

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
            setJobs(response.data);
            console.log('Jobs:', response.data);
        } catch (error) {
            console.error('Error fetching jobs', error);
        }
    };

    // Confirmation dialog for canceling a job 
    const confirmCancelJob = (jobId) => {
        Alert.alert(
            "Cancel Job", 
            "Are you sure you want to cancel this job?", 
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => cancelJob(jobId) }
            ],
            { cancelable: true }
        );
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

    // Confirmation dialog for removing a job 
    const confirmRemoveJob = (jobId) => {
        Alert.alert(
            "Remove Job", 
            "Are you sure you want to remove this job?",
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "Yes", onPress: () => removeJob(jobId) }
            ],
            { cancelable: true }
        );
    };

    const removeJob = async (jobId) => {
        try {
            const response = await axios.post(`/business-jobs/${jobId}/remove/`);
            setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        } catch (error) {
            console.error('Error removing job:', error);
        }
    }

    const viewLeafleteerDetails = (leafleteerId) => {
        console.log(leafleteerId);
        navigation.navigate('Contact Details', { userId: leafleteerId });
    }

    const renderJob = ({ item }) => (
        <View style={styles.jobContainer}>
            <Text style={styles.jobTitle}>Number of Leaflets: {item.number_of_leaflets}</Text>
            <Text style={styles.jobDetails}>Status: {item.status}</Text>

            {/* Add contact icon if job has a leafleteer */}
            {item.leafleteer_user && (
                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => viewLeafleteerDetails(item.leafleteer_user)}
                >
                    <Ionicons name="person-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
            )}

            {item.status === 'Open' && (
                <>
                <Text style={styles.jobDetails}>Pending Bids: {item.pending_bid_count}</Text>
                <TouchableOpacity style={styles.viewDetailsButton} onPress={() => navigation.navigate('Business Job Details', { jobId: item.id })}>
                    <Text style={styles.buttonText}>View Job</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => confirmCancelJob(item.id)}>
                    <Text style={styles.buttonText}>Cancel Job</Text>
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
                    <Text style={styles.buttonText}>View Routes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => confirmRemoveJob(item.id)}
                >
                    <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity> 
                </>
            )}

            {item.status === 'Cancelled' && (
                <TouchableOpacity style={styles.removeButton} onPress={() => confirmRemoveJob(item.id)}>
                    <Text style={styles.buttonText}>Remove</Text>
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
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    header: {
        fontSize: fontSizes.xlarge,
        fontWeight: fontWeights.bold,
        marginBottom: spacing.medium,
        color: colors.primary,
    },
    listContainer: {
        paddingBottom: spacing.medium,
    },
    jobContainer: {
        padding: spacing.medium,
        borderColor: colors.textSecondary,
        borderWidth: 1,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.small,
        backgroundColor: colors.cardBackground,
        elevation: 2,
    },
    jobTitle: {
        fontSize: fontSizes.large,
        fontWeight: fontWeights.bold,
        marginBottom: spacing.small,
        color: colors.primary,
    },
    jobDetails: {
        fontSize: fontSizes.medium,
        marginBottom: spacing.small / 2,
        color: colors.primary,
    },
    cancelButton: {
        backgroundColor: colors.danger,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        marginTop: spacing.small,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    removeButton: {
        backgroundColor: colors.textSecondary,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        marginTop: spacing.small,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    viewRoutesButton: {
        backgroundColor: colors.success,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        marginTop: spacing.small,
    },
    viewRoutesText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    viewDetailsButton: {
        marginTop: spacing.small,
        padding: spacing.small,
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.small,
        alignItems: 'center',
    },
    viewDetailsText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    loadMoreButton: {
        padding: spacing.medium,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        marginTop: spacing.medium,
    },
    loadMoreText: {
        color: colors.white,
        fontSize: fontSizes.medium,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
    }, 
    contactButton: {
        marginLeft: 'auto', 
        padding: spacing.small,
    }
});