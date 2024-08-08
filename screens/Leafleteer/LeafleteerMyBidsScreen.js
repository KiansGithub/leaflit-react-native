import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from '../../api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

export default function LeafleteerMyBidsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [bids, setBids] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [editingBid, setEditingBid] = useState(null);
    const [bidAmount, setBidAmount] = useState('');

    const fetchBids = async () => {
        try {
            const response = await axios.get('bids/', {
                params: { status: 'Pending' }
            });
            console.log(response.data);
            setBids(response.data);
        } catch (error) {
            console.error('Error fetching bids:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBids();
        }, [])
    );

    const handleEditBid = (bid) => {
        setEditingBid(bid);
        setBidAmount(bid.bid_amount.toString());
    }

    const handleUpdateBid = async () => {
        try {
            const response = await axios.put(`/bids/${editingBid.id}/`, {
                bid_amount: bidAmount
        });
        setEditingBid(null);
        fetchBids();
        Alert.alert('Success', 'Bid updated successfully');
        } catch(error) {
            console.error('Error updating bid:', error);
            Alert.alert('Error', 'Failed to update bid. Please try again.');
        }
    };

    const handleCancelBid = async (bidId) => {
        try {
            await axios.delete(`/bids/${bidId}/`);
            fetchBids();
            Alert.alert('Success', 'Bid cancelled successfully');
        } catch (error) {
            console.error('Error cancelling bid:', error);
            Alert.alert('Error', 'Failed to cancel bid. Please try again.');
        }
    }

    const renderBidItem = ({ item }) => {
        return (
        <View style={styles.bidCard}>
            <Text style={styles.bidDetails}>Bid Amount: £{item.bid_amount}</Text>
            <Text style={styles.bidDetails}>Status: {item.bid_status}</Text>
            {item.bid_status === 'Pending' && (
                <View style={styles.bidOptions}>
                    <TouchableOpacity onPress={() => handleEditBid(item)}>
                        <Text style={styles.optionText}>Edit</Text>
                    </TouchableOpacity>
                    <Text> | </Text>
                    <TouchableOpacity onPress={() => handleCancelBid(item.id)}>
                        <Text style={styles.optionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>My Bids</Text>
            </View>
            <FlatList 
                data={bids}
                renderItem={renderBidItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.bidList}
            />
            {editingBid && (
                <View style={styles.editBidContainer}>
                    <Text>Edit Bid Amount:</Text>
                    <TextInput 
                        style={styles.input}
                        value={bidAmount}
                        onChangeText={setBidAmount}
                        keyboardType="numeric"
                    />
                    <Button title="Update Bid" onPress={handleUpdateBid} />
                    <Button title="Cancel" onPress={() => setEditingBid(null)} />
                </View>
            )}
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
    editBidContainer: {
        padding: 16, 
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
        borderRadius: 4,
    }
});