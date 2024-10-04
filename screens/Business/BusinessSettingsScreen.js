import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function BusinessSettingsScreen({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionHeader}>Account Settings</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Edit Profile')}>
                <Ionicons name="person-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Account Management</Text>
                <Ionicons name="chevron-forward-outline" size={24} color="white" style={styles.chevron} />
            </TouchableOpacity>
            
        </ScrollView>
    );
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