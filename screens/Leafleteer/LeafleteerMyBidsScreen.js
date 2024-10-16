import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LeafleteerMyBidsScreen() {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchBids = async () => {
        setLoading(true);
        try {
            const response = await axios.get('bids/', {
                params: { status: 'Pending' }
            });
            const bidData = response.data;
            console.log(bidData);
            setBids(bidData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to load bids. Please try again later.');
        }
    };

    const loadMoreBids = async () => {
        if (isLoadingMore) return; // Prevent multiple triggers 
        setIsLoadingMore(true);
        try {
            const response = await axios.get('bids/', {
                params: { status: 'Pending', offset: bids.length }
            });

            const newBids = response.data;

            // Filter out duplicate bids 
            const uniqueBids = newBids.filter(newBid =>
                !bids.some(existingBid => existingBid.id === newBid.id)
            );

            setBids(prevBids => [...prevBids, ...uniqueBids]);
        } catch (error) {
            Alert.alert('Error', 'Failed to load more bids. Please try again later.');
        } finally {
            setIsLoadingMore(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBids();
        }, [])
    );

    const handleCancelBid = async (bidId) => {
        try {
            await axios.delete(`/bids/${bidId}/`);
            fetchBids();
            Alert.alert('Success', 'Bid cancelled successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to cancel bid. Please try again.');
        }
    }

    const renderBidItem = ({ item }) => { 

        // Convert the created_at date to a readable format 
        const formattedDate = new Date(item.job_details.created_at).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
    });

        return (
        <View style={styles.bidCard}>
            <View style={styles.jobInfo}>
                <Text style={styles.bidDetails}>Job ID: {item.job_details.job_id}</Text>
                <Text style={styles.bidDetails}>Business: {item.job_details.business_user}</Text>
                <Text style={styles.bidDetails}>Leaflets: {item.job_details.number_of_leaflets}</Text>
                <Text style={styles.bidDetails}>Created: {formattedDate}</Text>

                <Text style={styles.amount}>£{item.bid_amount}</Text>
            </View>

            <View style={styles.bidOptions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBid(item.id)}>
                <Ionicons name="trash-bin" size={18} color="white" />
            </TouchableOpacity>
            </View>
        </View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no pending bids.</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>My Bids</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
            <FlatList 
                data={bids}
                renderItem={renderBidItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.bidList}
                ListEmptyComponent={renderEmptyState}
            />
            )}
            {!loading && bids.length > 0 && (
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreBids}>
                    {isLoadingMore ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Text style={styles.loadMoreText}>Load More</Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    headerContainer: {
        marginBottom: spacing.medium,
    },
    header: {
        fontSize: fontSizes.xlarge,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.medium,
    },
    bidList: {
        paddingBottom: spacing.medium,
    },
    bidCard: {
        backgroundColor: colors.cardBackground,
        paddingVertical: spacing.medium,
        paddingHorizontal: spacing.large,
        marginBottom: spacing.medium,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        elevation: 4,
        shadowColor: colors.textPrimary,
        shadowOffer: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    jobInfo: {
        flex: 1,
        marginRight: spacing.medium,
    },
    location: {
        fontSize: fontSizes.large,
        color: colors.success,
        marginBottom: fontWeights.bold,
        fontWeight: spacing.large,
    },
    amount: {
        fontSize: fontSizes.large,
        color: colors.success,
        fontWeigjht: fontWeights.bold,
        marginTop: spacing.small,
    },
    bidInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.small,
    },
    bidAmount: {
        fontSize: fontSizes.large,
        fontWeight: fontWeights.bold,
        color: colors.textSecondary,
        marginTop: spacing.small,
    },
    bidStatus: {
        fontSize: fontSizes.small,
        fontWeight: fontWeights.bold,
        color: colors.textSecondary,
    },
    pending: {
        color: colors.warning,
    },
    cancelButton: {
        backgroundColor: colors.danger,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        marginTop: spacing.small,
    },
    emptyContainer: {
        alignItems:'center',
        justifyContent: 'center',
        flex: 1,
    },
    bidDetails: {
        fontSize: fontSizes.medium,
        marginBottom: spacing.small,
        color: colors.textPrimary
    },
    bidOptions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        color: colors.danger,
        fontWeight: fontWeights.bold,
    },
    loadMoreButton: {
        backgroundColor: colors.primary,
        padding: spacing.medium,
        borderRadius: borderRadius.small,
        alignItems: 'center',
    },
    loadMoreText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
    },
});