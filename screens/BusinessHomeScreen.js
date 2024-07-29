import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BusinessHomeScreen({ navigation }) {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get('/jobs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setJobs(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    fetchJobs();
}, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Job Listings</Text>
            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item}) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Job Details', { jobId: item.id })}>
                        <View style={styles.jobItem}>
                            <Text style={styles.jobTitle}>{item.title}</Text>
                            <Text>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    jobItem: {
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    jobTitle: {
        fontWeight: 'bold',
    },
});