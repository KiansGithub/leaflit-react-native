import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

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
                placeholder="Enter your new password"
                placeholderTextColor={colors.textSecondary}
            />
            <Button 
                title="Set New Password" 
                onPress={handlePasswordResetConfirm}
                color={colors.primary} 
            />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.medium,
        justifyContent: 'center',
        backgroundColor: colors.background
    },
    label: {
        fontSize: fontSizes.medium,
        marginBottom: spacing.small,
        color: colors.primary,
        fontWeight: fontWeights.bold,
    },
    input: {
        height: 40,
        borderColor: colors.textSecondary,
        borderWidth: 1,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.medium,
        paddingHorizontal: spacing.small,
        backgroundColor: colors.white,
    },
    message: {
        marginTop: spacing.medium,
        fontSize: fontSizes.medium,
        color: colors.success,
        fontWeight: fontWeights.regular,
    }
});