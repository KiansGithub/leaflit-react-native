import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LeafleteerMenuScreen({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leafleteer Profile')}>
                <Ionicons name="person-circle-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leafleteer My Jobs')}>
                <Ionicons name="briefcase-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>My Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leafleteer Find Jobs')}>
                <Ionicons name="search-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Find Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leafleteer My Bids')}>
                <Ionicons name="clipboard-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>My Bids</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leafleteer Earnings Dashboard')}>
                <Ionicons name="cash-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Earnings Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leafleteer Settings')}>
                <Ionicons name="settings-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leafleteer Help/Support')}>
                <Ionicons name="help-circle-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Help/Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Logout')}>
                <Ionicons name="log-out-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        jsutifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAF2F8',
        padding: 16,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#00274D',
        padding: 14,
        marginVertical: 6,
        width: '90%',
        alignItems: 'center',
        borderRadius: 8,
        justifyContent: 'flex-start',
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#C82333',
        padding: 14,
        marginVertical: 6,
        width: '90%',
        alignItems: 'center',
        borderRadius: 8,
        justifyContent: 'flex-start',
        borderColor: '#DC3545',
        borderWidth: 1,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});