import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../api';

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
            setRecentJobs(response.data.slice(0,2 ));
        } catch (error) {
            console.error('Error fetching recent jobs', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/business-stats/');
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

    const renderJobItem = ({ item }) => (
        <View style={styles.jobItem}>
            <Text style={styles.jobText}>{item.title} - {item.location} - {item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <TouchableOpacity style={styles.bellIcon} onPress={() => navigation.navigate('Business Notifications')}>
                    <Ionicons name="notifications-outline" size={28} color="#00274D" />
                    {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('Add Job')}
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
                onPress={() => navigation.navigate('My Jobs')}
            >
                <Text style={styles.viewAllButtonText}>View All</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsContainer}>
                <Text>Total Jobs Completed: {stats.totalJobsCompleted}</Text>
                <Text>Total Leaflets Distributed: {stats.totalLeafletsDistributed}</Text>
                <Text>Total Amount Spent: £{stats.totalAmountSpent}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#EAF2F8',
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
        color: '#00274D',
    },
    bellIcon: {
        fontSize: 24,
        color: '#00274D',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: '#FF5A5F',
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
        backgroundColor: '#00274D',
        padding: 12,
        borderRadius: 10,
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
        color: '#00274',
    },
    jobList: {
        marginBottom: 16,
    },
    jobItem: {
        padding: 12,
        backgroundColor: '#f4F7FA',
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#7D8A95',
    },
    jobText: {
        color: '#00274D',
    },
    viewAllButton: {
        backgroundColor: '#00274D',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 8,
    },
    viewAllButtonText: {
        color: 'white',
        fontSize: 16,
    },
    statsContainer: {
        padding: 16,
        backgroundColor: '#F4F7FA',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#7D8A95',
    },
    statsText: {
        color: '#00274D',
        fontSize: 16,
    }
});