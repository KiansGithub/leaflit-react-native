import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function BusinessHelpSupportScreen({ navigation }) {
    const handleContactSupport = () => {
        Linking.openURL('mailto:support@example.com'); // Need to replace with actual support email 
    };

    const handleFaqs = () => {
        navigation.navigate('BusinessFaqs'); // Navigate to Business FAQs screen
    };
 
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionHeader}>Support</Text>

            <TouchableOpacity style={styles.button} onPress={handleFaqs}>
                <Ionicons name="help-circle-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>FAQs</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleContactSupport}>
                <Ionicons name="mail-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business How-To Guides')}>
                <Ionicons name="book-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>How-To Guides</Text>
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
    },
    icon: {
        marginRight: spacing.small,
    },
    buttonText: {
        color: colors.white, 
        fontSize: fontSizes.medium, 
        fontWeight: fontWeights.bold, 
    }
});