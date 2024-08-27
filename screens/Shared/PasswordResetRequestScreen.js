import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function PasswordResetRequestScreen() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async () => {
        try {
            const response = await axios.post('/password-reset/', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occured');
        }
    };

    return (
       <View style={styles.container}>
            <Text style={styles.label}>Email:</Text>
            <TextInput 
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
            />
            <Button 
            title="Reset Password" 
            onPress={handlePasswordReset}
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
        backgroundColor: colors.background,
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