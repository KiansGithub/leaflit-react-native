import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from '../../api';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../styles/theme';

export default function EarningsDashboardScreen() {
    const [dashboardUrl, setDashboardUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const fetchDashboardLink = async () => {
        try {
            const response = await axios.get('/get-dashboard-link/');
            setDashboardUrl(response.data.dashboard_url);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardLink();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Button title="Retry" onPress={fetchDashboardLink} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {dashboardUrl ? (
                <WebView source={{ uri: dashboardUrl }} style={styles.webview} />
            ) : (
                <Text>No dashboard URL available</Text>
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
    errorText: {
        color: colors.error, 
        fontSize: fontSizes.medium, 
        fontWeight: fontWeights.bold, 
        marginBottom: spacing.medium,
    },
    webview: {
        flex: 1,
    },
});