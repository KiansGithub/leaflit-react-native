import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

const LeafleteerNotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/notifications/');
            console.log(response.data);
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error resoponse status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            }
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/notifications/${id}/`, { is_read: true });
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error('Error marking notification as read:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
        }
    };

    const clearAllNotifications = async () => {
        try {
            await axios.delete('/notifications/clear_all/');
            fetchNotifications(); // Refresh notifications after clearing 
            Alert.alert('Success', 'All notifications have been cleared.');
        } catch (error) {
            console.error('Error clearing notifications:', error);
            Alert.alert('Error', 'Failed to clear notifications. Please try again.');
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.notification}>
            <Text style={styles.message}>{item.message}</Text>
            {!item.is_read && (
                <TouchableOpacity style={styles.markAsReadButton} onPress={() => markAsRead(item.id)}>
                    <Text style={styles.markAsReadButtonText}>Mark as Read</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00274D" />
                <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
        );
    }

    return (
    <View style={styles.container}>
        <FlatList 
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<TouchableOpacity style={styles.clearAllButton} onPress={clearAllNotifications}>
                <Text style={styles.clearAllButtonText}>Clear All Notifications</Text>
            </TouchableOpacity>}
        />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    loadingContaner: {
        flex: 1,
        justifyContnet: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.small,
        fontSize: fontSizes.medium,
        color: colors.primary,
    },
    notification: {
        padding: spacing.small + 4,
        backgroundColor: colors.cardBackground,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.small,
        borderWidth: 1,
        borderColor: colors.textSecondary,
    },
    message: {
        fontSize: fontSizes.medium,
        color: colors.primary,
        marginBottom: spacing.small,
    },
    markAsReadButton: {
        backgroundColor: colors.success,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        marginTop: spacing.small / 2,
    },
    markAsReadButtonText: {
        color: colors.white,
        fontSize: fontSizes.small,
        fontWeight: fontWeights.bold,
    },
    clearAllButton: {
        backgroundColor: colors.primary,
        padding: spacing.medium,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        marginBottomn: spacing.large,
    },
    clearAllButtonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
    },
});

export default LeafleteerNotificationScreen;