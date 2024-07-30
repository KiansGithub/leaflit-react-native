import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from '../../api';

export default function BusinessAddJobScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [numberOfLeaflets, setNumberOfLeaflets] = useState('');
    const [description, setDescription] = useState('');

    const handleAddJob = async () => {
        try {
            const response = await axios.post('/business-jobs/', {
                title,
                location,
                number_of_leaflets: numberOfLeaflets,
                description,
            });
            console.log('Job added successfully:', response.data)

            // Display a confirmation message 
            Alert.alert('Success', 'Job added successfully');

            // Clear form fields 
            setTitle('');
            setDescription('');
            setLocation('');
            setNumberOfLeaflets('');

            navigation.navigate('My Jobs');
        
        } catch (error) {
            console.error('Error posting job', error);
            alert('Failed to create job. Please try again');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Job Title</Text>
            <TextInput 
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Location</Text>
            <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
            />
            <Text style={styles.label}>Number of Leaflets</Text>
            <TextInput 
                style={styles.input}
                value={numberOfLeaflets}
                onChangeText={setNumberOfLeaflets}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput 
                style={styles.textarea}
                value={description}
                onChangeText={setDescription}
                multiline 
            />
            <Button title="Add Job" onPress={handleAddJob} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    textarea: {
        height: 80,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    }
});