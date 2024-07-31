import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

export default function LeafleteerMenuScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>My Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Find Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Earnings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Help/Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        jsutifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    button: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 4,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
    },
});