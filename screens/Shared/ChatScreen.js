import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function ChatScreen() {
    const route = useRoute();
    const { user_1, user_2 } = route.params; 

    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(`wss://649e-86-18-167-205.ngrok-free.app/ws/chat/${user_1}/${user_2}/`);
        setSocket(ws);

        ws.onopen = () => {
            console.log('Websocket connection opened');
        }

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setChatMessages((prevMessages) => [...prevMessages, data.message]);
        };

        ws.onclose = () => {
            console.log('Websocket closed');
        };

        return () => {
            ws.close();
        };
    }, [user_1, user_2]);

    const sendMessage = () => {
        if (socket && message.trim()) {
            socket.send(JSON.stringify({ message }));
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chat between {user_1} and {user_2}</Text>
            <FlatList 
                data={chatMessages}
                renderItem={({ item }) => (
                <View style={styles.messageItem}>
                    <Text style={styles.messageText}>{item}</Text>
                </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.chatList}
            />
            <TextInput 
                value={message}
                onChangeText={setMessage}
                placeholder="Enter your message"
                style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.medium, 
        backgroundColor: colors.background, 
    },
    header: {
        fontSize: fontSizes.xlarge, 
        fontWeight: fontWeights.bold, 
        marginBottom: spacing.medium, 
        color: colors.primary, 
    },
    chatList: {
        flex: 1,
        marginBottom: spacing.medium,
    },
    messageItem: {
        backgroundColor: colors.cardBackground, 
        padding: spacing.small, 
        borderRadius: borderRadius.small, 
        marginVertical: spacing.small, 
        borderWidth: 1, 
        borderColor: colors.textSecondary, 
    },
    messageText: {
        fontSize: fontSizes.medium, 
        color: colors.textPrimary, 
    },
    input: {
        borderWidth: 1, 
        borderColor: colors.textSecondary, 
        borderRadius: borderRadius.small, 
        padding: spacing.small, 
        marginBottom: spacing.small, 
    },
    sendButton: {
        backgroundColor: colors.primary, 
        padding: spacing.medium, 
        borderRadius: borderRadius.small, 
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white, 
        fontSize: fontSizes.medium, 
        fontWeight: fontWeights.bold, 
    },
});