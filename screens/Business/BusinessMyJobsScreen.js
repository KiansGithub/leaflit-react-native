import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api'

export default function BusinessMyJobsScreen() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('/business-jobs/');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs', error);
        }
    };

    const renderJob = ({ item }) => (
        <View style={styles.jobContainer}>
            <Text>Job Title: {item.title}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Status: {item.status}</Text>
            <TouchableOpacity>
                <Text style={styles.options}>Options: Edit | Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Jobs</Text>
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search for jobs..."
                    value = {search}
                    onChangeText = {setSearch}
                />
                <TouchableOpacity
                 style={styles.addButton}
                 onPress={() => navigation.navigate('Add Job')}
                >
                    <Text style={styles.addButtonText}>+</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
            </View>
            <FlatList 
                data={jobs.filter(job => job.title.includes(search))}
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
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 8,
        paddingHorizontal: 8,
    },
    addButton: {
        padding: 8,
        backgroundColor: '#007BFF',
        borderRadius: 4,
        marginRight: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
    },
    filterButton: {
        padding: 8,
        backgroundColor: '#28a745',
        borderRadius: 4,
    },
    filterButtonText: {
        color: 'white',
    },
    listContainer: {
        paddingBottom: 16,
    },
    jobContainer: {
        padding: 16,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 8,
    },
    options: {
        color: '#007BFF',
        marginTop: 8,
    },
    loadMoreButton: {
        padding: 16,
        backgroundColor: '#007BFF',
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 16,
    },
    loadMoreText: {
        color: 'white',
        fontSize: 16,
    },
});