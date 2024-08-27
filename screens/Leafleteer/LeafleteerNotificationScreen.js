import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';

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
        padding: 16,
        backgroundColor: '#EAF2F8',
    },
    loadingContaner: {
        flex: 1,
        justifyContnet: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#00274D',
    },
    notification: {
        padding: 12,
        backgroundColor: '#F4F7FA',
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#7D8A95',
    },
    message: {
        fontSize: 16,
        color: '#00274D',
        marginBottom: 8,
    },
    markAsReadButton: {
        backgroundColor: '#28A745',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 4,
    },
    markAsReadButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    clearAllButton: {
        backgroundColor: '#00274D',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottomn: 16,
    },
    clearAllButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LeafleteerNotificationScreen;