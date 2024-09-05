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
            setBids(prevBids => [...prevBids, ...response.data]);
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

        return (
        <View style={styles.bidCard}>
            <Text style={styles.amount}>£{item.bid_amount}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBid(item.id)}>
                <Ionicons name="trash-bin" size={18} color="white" />
            </TouchableOpacity>
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
        padding: spacing.large,
        marginBottom: spacing.medium,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        elevation: 4,
        shadowColor: colors.textPrimary,
        shadowOffer: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        fontSize: fontSizes.xlarge,
        color: colors.success,
        fontWeigjht: fontWeights.bold,
        marginBottom: spacing.large,
    },
    bidInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.small,
    },
    bidAmount: {
        fontSize: fontSizes.large,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
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