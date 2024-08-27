import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen({ navigation }) {
    const handleLogout = async () => {
        await AsyncStorage.clear();
        console.log("User logged out");
        navigation.navigate('Login');
    }

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Profile')}>
                <Ionicons name="person-circle-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business My Jobs')}>
                <Ionicons name="briefcase-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>My Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Add Job')}>
                <Ionicons name="add-circle-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Add Job</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Settings')}>
                <Ionicons name="settings-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Business Help/Support')}>
                <Ionicons name="help-circle-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Help/Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" style={styles.icon} />
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
        padding: 16,
        backgroundColor: '#EAF2F8',
    },
    button: {
        flexDirection: 'row',
        width: '90%',
        padding: 14,
        backgroundColor: '#00274D',
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 6,
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