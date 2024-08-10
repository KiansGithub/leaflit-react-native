import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';

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
                <Button title="Mark as Read" onPress={() => markAsRead(item.id)} />
            )}
        </View>
    );

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
    <View style={styles.container}>
        <Button title="Clear All Notifications" onPress={clearAllNotifications} />
        <FlatList 
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    notification: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    message: {
        fontSize: 16,
    },
});

export default LeafleteerNotificationScreen;