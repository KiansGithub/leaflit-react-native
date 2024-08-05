import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from '../../api';

export default function LeafleteerMyBidsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [bids, setBids] = useState([]);

    useEffect(() => {
        fetchBids();
    }, []);

    const fetchBids = async () => {
        try {
            const response = await axios.get('bids/', {
                params: { status: 'Pending' }
            });
            setBids(response.data);
        } catch (error) {
            console.error('Error fetching bids:', error);
        }
    };

    const renderBidItem = ({ item }) => (
        <View style={styles.bidCard}>
            <Text style={styles.jobTitle}>Job: {item.job.title}</Text>
            <Text style={styles.bidDetails}>Bid Amount: ${item.bid_amount}</Text>
            <Text style={styles.bidDetails}>Status: {item.bid_status}</Text>
            <View style={styles.bidOptions}>
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
                <Text style={styles.header}>My Bids</Text>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search for bids..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Button title="Filter" onPress={() => {}} />
            </View>
            <FlatList 
                data={bids}
                renderItem={renderBidItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.bidList}
            />
            <TouchableOpacity style={styles.loadMoreButton} onPress={fetchBids}>
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
    bidList: {
        paddingBottom: 16,
    },
    bidCard: {
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
    bidOptions: {
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