import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from '../../api';

export default function LeafleteerMyJobsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('leafleteerjobs/active/');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const renderJobItem = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDetails}>Location: {item.location} | Status: {item.status}</Text>
            <View style={styles.jobOptions}>
                <Text>Options: </Text>
                <TouchableOpacity>
                    <Text style={styles.optionText}>Edit</Text>
                </TouchableOpacity>
                <Text> | </Text>
                <TouchableOpacity>
                    <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>My Jobs</Text>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search for jobs..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Button title="Filter" onPress={() => {}} />
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