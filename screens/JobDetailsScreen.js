import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JobDetailsScreen({ route }) {
    const { jobId } = route.params;
    const [job, setJob] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const response = await axios.get(`/jobs/${jobId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
            },
    });
    setJob(response.data);
} catch(error) {
    console.error(error);
}
        };

        fetchJobDetails();
}, [jobId]);

if (!job) {
    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
    );
}

return (
    <View style={styles.container}>
        <Text style={styles.title}>{job.title}</Text>
        <Text>{job.description}</Text>
        <Text>Location: {job.location}</Text>
        <Text>Number of Leaflets: {job.number_of_leaflets}</Text>
        <Text>Status: {job.status}</Text>
        <Text>Created At: {new Date(job.created_at).toLocaleDateString()}</Text>
        <Text>Updated At: {new Date(job.updated_at).toLocaleDateString()}</Text>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24, 
        fontWeight: 'bold',
        marginBottom: 16,
    },
});