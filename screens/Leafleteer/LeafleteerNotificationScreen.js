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
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response) {
            }
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/notifications/${id}/`, { is_read: true });
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            if (error.response) {
            }
        }
    };

    const clearAllNotifications = async () => {
        Alert.alert(
            "Clear All Notifications",
            "Are you sure you want to clear all notifications? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear All",
                    onPress: async () => {
                        try {
                            await axios.delete('/notifications/clear_all/');
                            fetchNotifications();
                            Alert.alert('Success', 'All notifications have been cleared.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear notifications. Please try again.');
                        }
                    },
                    style: "destructive"
                }
            ]
        )
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
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
        marginBottom: spacing.large,
    },
    clearAllButtonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
    },
});

export default LeafleteerNotificationScreen;