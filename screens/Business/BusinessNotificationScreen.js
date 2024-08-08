import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const BusinessNotificationScreen = () => {
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
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/notifications/${id}/`, { is_read: true });
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

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
        <FlatList 
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
};

const styles = StyleSheet.create({
    notification: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    message: {
        fontSize: 16,
    },
});

export default BusinessNotificationScreen;