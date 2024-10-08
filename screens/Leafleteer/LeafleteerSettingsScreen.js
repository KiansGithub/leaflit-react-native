import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';
import axios from '../../api';

export default function LeafleteerSettingsScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            // Fetch the profile first 
                            const profileResponse = await axios.get('/profiles/');
                            const profile = profileResponse.data;

                            const response = await axios.delete(`/profiles/${profile.id}/`);
                            if (response.status === 200) {
                                Alert.alert("Account deleted successfully");
                                navigation.navigate('Login');
                            }
                        } catch (error) {
                            Alert.alert("Error", "There was an issue deleting your account.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionHeader}>Account Settings</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leafleteer Edit Profile')}>
                <Ionicons name="person-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Account Management</Text>
                <Ionicons name="chevron-forward-outline" size={24} color="white" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
            {loading ? (
                <View>
                <ActivityIndicator size="small" color={colors.white} />
                </View>
            ) : (
                <>
                <Ionicons name="trash-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Delete Account</Text>
                </>
            )}
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, 
        padding: spacing.medium,
    }, 
    sectionHeader: {
        fontSize: fontSizes.large, 
        fontWeight: fontWeights.bold, 
        color: colors.textSecondary, 
        marginVertical: spacing.medium, 
        marginLeft: spacing.small,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors.primary, 
        padding: spacing.medium, 
        marginVertical: spacing.small, 
        width: '100%',
        alignItems: 'center',
        borderRadius: borderRadius.medium, 
        justifyContent: 'space-between',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    icon: {
        marginRight: spacing.small,
    },
    buttonText: {
        color: colors.white, 
        fontSize: fontSizes.medium, 
        fontWeight: fontWeights.bold, 
        flex: 1,
    },
    chevron: {
        marginLeft: spacing.small, 
    },
});