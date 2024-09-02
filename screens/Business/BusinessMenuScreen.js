import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MenuScreen({ navigation }) {
    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            navigation.navigate('Login');
        } catch (error) {
            console.error("Failed to clear AsyncStorage:", error);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Profile')}>
                <Ionicons name="person-circle-outline" size={24} color={colors.white} style={styles.icon} />
                <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business My Jobs')}>
                <Ionicons name="briefcase-outline" size={24} color={colors.white} style={styles.icon} />
                <Text style={styles.buttonText}>My Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Add Job')}>
                <Ionicons name="add-circle-outline" size={24} color={colors.white} style={styles.icon} />
                <Text style={styles.buttonText}>Add Job</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Settings')}>
                <Ionicons name="settings-outline" size={24} color={colors.white} style={styles.icon} />
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Help Support')}>
                <Ionicons name="help-circle-outline" size={24} color={colors.white} style={styles.icon} />
                <Text style={styles.buttonText}>Help/Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={colors.white} style={styles.icon} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    button: {
        flexDirection: 'row',
        width: '90%',
        padding: spacing.medium,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.medium,
        alignItems: borderRadius.medium,
        alignItems: 'center',
        marginVertical: spacing.small,
        justifyContent: 'flex-start',
    },
    icon: {
        marginRight: spacing.small,
    },
    buttonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: colors.danger,
        padding: spacing.medium,
        marginVertical: spacing.small,
        width: '90%',
        alignItems: 'center',
        borderRadius: borderRadius.medium,
        justifyContent: 'flex-start',
        borderColor: colors.danger,
        borderWidth: 1,
    },
    logoutButtonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
        marginLeft: spacing.small,
    },
});