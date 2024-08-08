import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from '../../api';

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
                onPress={() => navigation.navigate('Find Jobs')}
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
                onPress={() => navigation.navigate('My Jobs')}
            >
                <Text style={styles.viewAllButtonText}>View All</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsContainer}>
                <Text>Total Jobs Completed: {stats.totalJobsCompleted}</Text>
                <Text>Total Earnings: £{stats.totalEarnings}</Text>
                <Text>Total Leaflets Delivered: {stats.totalLeafletsDistributed}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    bellIcon: {
        fontSize: 24,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 3,
        minWidth: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    jobList: {
        marginBottom: 16,
    },
    jobItem: {
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        marginBottom: 8,
    },
    viewAllButton: {
        backgroundColor: '#007BFF',
        borderRadius: 4,
        marginBottom: 8,
    },
    viewAllButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAllButtonText: {
        color: 'white',
        fontSize: 16,
    },
    statsContainer: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
    },
});