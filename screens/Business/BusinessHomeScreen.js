import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function BusinessHomeScreen() {
    const [recentJobs, setRecentJobs] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stats, setStats] = useState({
        totalJobsCompleted: 0,
        totalLeafletsDistributed: 0,
        totalAmountSpent: 0
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
    };

    const fetchRecentJobs = async () => {
        try {
            const response = await axios.get('/business-jobs/');
            setRecentJobs(response.data.slice(0,4));
        } catch (error) {
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/business-stats/');
            setStats(response.data);
        } catch (error) {
        }
    };

    const fetchUnreadNotifications = async () => {
        try {
            const response = await axios.get('/notifications/unread-count/');
            setUnreadCount(response.data.unread_count);
        } catch (error) {
        }
    };

    const renderJobItem = ({ item }) => (
        <View style={styles.jobItem}>
            <Text style={styles.jobText}>{item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <TouchableOpacity style={styles.bellIcon} onPress={() => navigation.navigate('Business Notifications')}>
                    <Ionicons name="notifications-outline" size={28} color={colors.primary} />
                    {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('Business Add Job')}
            >
                <Text style={styles.addButtonText}>Add Job</Text>
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
                onPress={() => navigation.navigate('Business My Jobs')}
            >
                <Text style={styles.viewAllButtonText}>View All</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsContainer}>
                <Text>Total Jobs Completed: {stats.totalJobsCompleted}</Text>
                <Text>Total Leaflets Distributed: {stats.totalLeafletsDistributed}</Text>
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
        color: colors.primary,
    },
    bellIcon: {
        fontSize: fontSizes.xlarge,
        color: colors.primary,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: colors.danger,
        borderRadius: borderRadius.small,
        padding: spacing.small,
        minWidth: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: fontSizes.small,
    },
    addButton: {
        backgroundColor: colors.primary,
        padding: spacing.medium,
        borderRadius: borderRadius.large,
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
        marginTop: spacing.medium,
        marginBottom: spacing.small,
        color: colors.primary,
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
    jobText: {
        color: colors.primary,
    },
    viewAllButton: {
        backgroundColor: colors.primary,
        padding: spacing.medium,
        borderRadius: borderRadius.large,
        alignItems: 'center',
        marginBottom: spacing.medium,
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
        color: colors.primary,
        fontSize: fontSizes.medium,
    }
});