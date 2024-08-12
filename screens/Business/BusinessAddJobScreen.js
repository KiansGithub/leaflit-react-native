import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import axios from '../../api';

export default function BusinessAddJobScreen({ navigation }) {
    const [location, setLocation] = useState('');
    const [numberOfLeaflets, setNumberOfLeaflets] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [radius, setRadius] = useState(1000);

    const handleAddJob = async () => {
        try {
            const response = await axios.post('/business-jobs/', {
                location,
                number_of_leaflets: numberOfLeaflets,
                status: 'Open',
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                radius: radius,
            });
            console.log('Job added successfully:', response.data)

            // Display a confirmation message 
            Alert.alert('Success', 'Job added successfully');

            // Clear form fields 
            setLocation('');
            setNumberOfLeaflets('');
            setCoordinates(null);
            setRadius(1000);

            navigation.navigate('My Jobs');
        
        } catch (error) {
            console.error('Error posting job', error);
            Alert.alert('Failed to create job', 'Please try again');
        }
    };

    const handleMapPress = (e) => {
        setCoordinates(e.nativeEvent.coordinate);
    }

    const handleRadiusChange = (newRadius) => {
        setRadius(newRadius);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Location (Select on Map)</Text>
            <View style={styles.mapContainer}>
                <MapView 
                    style={styles.map} 
                    onPress={handleMapPress}
                    initialRegion={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {coordinates && (
                        <>
                        <Marker 
                            draggable 
                            coordinate={coordinates}
                            onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}
                        />
                        <Circle 
                            center={coordinates}
                            radius={radius}
                            strokeColor="rgba(0, 0, 255, 0.5)"
                            fillColor="rgba(0, 0, 255, 0.2)"
                            onPress={(e) => handleMapPress(e)}
                        />
                        </>
                    )}
                </MapView>
            </View>

            <View astyle={styles.buttonContainer}>
                <Button title="Increase Radius" onPress={() => handleRadiusChange(radius + 100 )} />
                <Button title="Decrease Radius" onPress={() => handleRadiusChange(radius - 100 )} />
            </View>

            <Text style={styles.label}>Number of Leaflets</Text>
            <TextInput 
                style={styles.input}
                value={numberOfLeaflets}
                onChangeText={setNumberOfLeaflets}
                keyboardType="numeric"
                placeholder="Enter number of Leaflets"
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
    mapContainer: {
        height: 300,
        marginBottom: 16,
    },
    map: {
        flex: 1,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    }
});