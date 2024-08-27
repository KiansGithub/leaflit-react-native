import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LeafleteerHomeScreen() {
    const [recentJobs, setRecentJobs] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stats, setStats] = useState({
        totalJobsCompleted: 0,
        totalEarnings: 0,
        totalLeafletsDistributed: 0
    });

    const navigation = useNavigation();

    useEffect(() => {
        fetchInitialData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAllData();
        }, [])
    );

    const fetchInitialData = async () => {
        await Promise.all([fetchRecentJobs(), fetchStats(), fetchUnreadNotifications()]);
    };

    const fetchAllData = async () => {
        await Promise.all([fetchRecentJobs(), fetchStats(), fetchUnreadNotifications()]);
    }

    const fetchRecentJobs = async () => {
        try {
            const response = await axios.get('/leafleteerjobs/active/');
            setRecentJobs(response.data.slice(0, 2));
        } catch (error) {
            console.error('Error fetching recent jobs', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('leafleteer-stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats', error);
        }
    };

    const fetchUnreadNotifications = async () => {
        try {
            const response = await axios.get('/notifications/unread-count/');
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Error fetching unread notifications count', error);
        }
    };

    const renderJobItem = ({ item }) => {
        return (
        <View style={styles.jobItem}>
            <Text>- {item.location} - {item.status} - {item.number_of_leaflets}</Text>
        </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, User</Text>
                <TouchableOpacity style={styles.bellIcon} onPress={() => navigation.navigate('Leafleteer Notifications')}>
                    <Text>🔔</Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                            </View>
                            )}
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('Leafleteer Find Jobs')}
            >
                <Text style={styles.addButtonText}>Find a New Job</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>My Jobs Quick View</Text>
            <FlatList 
                data={recentJobs}
                renderItem={renderJobItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.jobList}
            />
            <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Leafleteer My Jobs')}
            >
                <Text style={styles.viewAllButtonText}>View All</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsContainer}>
                <Text style={styles.statsText}>Total Jobs Completed: {stats.totalJobsCompleted}</Text>
                <Text style={styles.statsText}>Total Earnings: £{stats.totalEarnings}</Text>
                <Text style={styles.statsText}>Total Leaflets Delivered: {stats.totalLeafletsDistributed}</Text>
            </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.medium,
    },
    welcomeText: {
        fontSize: fontSizes.xlarge,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    bellIcon: {
        fontSize: fontSizes.xlarge,
        color: colors.textPrimary,
    },
    badge: {
        position: 'absolute',
        top: -spacing.small,
        right: -spacing.small,
        backgroundColor: colors.danger,
        borderRadius: borderRadius.small * 2,
        padding: spacing.small / 2,
        minWidth: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: colors.white,
        fontSize: fontSizes.small,
    },
    addButton: {
        backgroundColor: colors.primary,
        padding: spacing.medium,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        marginBottom: spacing.medium,
    },
    addButtonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
    },
    sectionTitle: {
        fontSize: fontSizes.large,
        fontWeight: fontWeights.bold,
        marginTop: spacing.large,
        marginBottom: spacing.small,
        color: colors.textPrimary,
    },
    jobList: {
        marginBottom: spacing.medium,
    },
    jobItem: {
        padding: spacing.medium,
        backgroundColor: colors.cardBackground, 
        borderRadius: borderRadius.medium,
        marginBottom: spacing.small,
        borderWidth: 1,
        borderColor: colors.textSecondary,
    },
    viewAllButton: {
        backgroundColor: colors.primary,
        padding: spacing.small,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        marginBottom: spacing.small,
    },
    viewAllButtonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
    },
    statsContainer: {
        padding: spacing.medium,
        backgroundColor: colors.cardBackground,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.textSecondary,
    },
    statsText: {
        color: colors.textPrimary,
        fontSize: fontSizes.medium,
    }
});