import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from '../../api';

export default function PasswordResetConfirmScreen({ route, navigation }) {
    const { uidb64, token } = route.params;
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordResetConfirm = async () => {
        try {
            const response = await axios.post(`/password-reset-confirm/${uidb64}/${token}/`, { password });
            setMessage(response.data.message);
            navigation.navigate('Login');
    } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred');
    }
};
    return (
        <View style={styles.container}>
            <Text style={styles.label}>New Password:</Text>
            <TextInput 
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry 
            />
            <Button title="Set New Password" onPress={handlePasswordResetConfirm} />
            {message ? <Text>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});