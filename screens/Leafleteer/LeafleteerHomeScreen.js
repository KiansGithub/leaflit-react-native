import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api';

export default function LeafleteerHomeScreen() {
    const [recentJobs, setRecentJobs] = useState([]);
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalEarnings: 0,
        totalLeafletsDelivered: 0
    });
    const navigation = useNavigation();

    useEffect(() => {
        fetchRecentJobs();
        fetchStats();
    }, []);

    const fetchRecentJobs = async () => {
        try {
            const response = await axios.get('/leafleteerjobs/active');
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

    const renderJobItem = ({ item }) => {
        <View style={styles.jobItem}>
            <Text>{item.title} - {item.location} - {item.status}</Text>
        </View>
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, User</Text>
                <TouchableOpacity style={styles.bellIcon}>
                    <Text>🔔</Text>
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
                <Text>Total Jobs Completed: {stats.totalJobs}</Text>
                <Text>Total Earnings: ${stats.totalEarnings}</Text>
                <Text>Total Leaflets Delivered: {stats.totalLeafletsDelivered}</Text>
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