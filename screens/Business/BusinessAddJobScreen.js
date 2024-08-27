import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../api';

export default function BusinessAddJobScreen({ navigation }) {
    const [location, setLocation] = useState('');
    const [numberOfLeaflets, setNumberOfLeaflets] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [radius, setRadius] = useState(100);
    const [loading, setLoading] = useState(true);
    const [recentRoutes, setRecentRoutes] = useState([]);


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log("User Location:", location);
            setCoordinates({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            setLoading(false);  // Set loading to false after fetching data

            // Fetch recent routes for this business 
            fetchRecentRoutes();
        })();
    }, []);

    const fetchRecentRoutes = async () => {
        try {
            const response = await axios.get('/business-jobs/recent_routes/');
            setRecentRoutes(response.data);
            console.log('Recnet Routes:', response.data);
        } catch (error) {
            console.error('Error fetching recent routes:', error);
            Alert.alert('Failed to fetch recent routes', 'Please try again');
        }
    }

    const handleAddJob = async () => {
        try {
            if (!coordinates) {
                Alert.alert('Error', 'Please select a location on the map.');
            }
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
            setRadius(100);

            navigation.navigate('Business My Jobs');
        
        } catch (error) {
            console.error('Error posting job', error);
            Alert.alert('Failed to create job', 'Please try again');
        }
    };

    const handleMapPress = (e) => {
        setCoordinates(e.nativeEvent.coordinate);
    }

    const resetLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});
        setCoordinates({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    };

    const increaseRadius = () => {
        setRadius(radius + 100);
    };

    const decreaseRadius = () => {
        if (radius > 100) {
            setRadius(radius - 100);
        }
    }

    if (loading) {
        return ( 
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Add New Job</Text>
            <Text style={styles.label}>Location (Select on Map)</Text>
            <View style={styles.mapContainer}>
            {coordinates && (
                <MapView 
                    style={styles.map} 
                    onPress={handleMapPress}
                    initialRegion={{
                        latitude: coordinates ? coordinates.latitude: 37.78825,
                        longitude: coordinates ? coordinates.longitude : -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                        <>
                        <Marker 
                            draggable 
                            coordinate={coordinates}
                            onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}
                        />
                        <Circle 
                            center={coordinates}
                            radius={parseFloat(radius)}
                            fillColor="rgba(0, 39, 77, 0.3)"
                            strokeColor="rgba(0, 39, 77, 0.5)"
                        />
                        {recentRoutes.map((route, index) => (
                            <Polyline 
                                key={index}
                                coordinates={route.coordinates.map(coord => ({
                                    latitude: coord.latitude,
                                    longitude: coord.longitude,
                                }))}
                                strokeWidth={3}
                                strokeColor="rgba(255, 0, 0, 0.8)"
                            />
                        ))}
                        </>
                </MapView>
                )}
            </View>     

            <View style={styles.radiusButtonsContainer}>
                <TouchableOpacity style={styles.radiusButton} onPress={decreaseRadius}>
                    <Ionicons name="remove-circle-outline" size={32} color="#00274D" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.radiusButton} onPress={increaseRadius}>
                    <Ionicons name="add-circle-outline" size={32} color="#00274D" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetLocation}>
                <Text style={styles.resetButtonText}>Reset Location to Current Position</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Number of Leaflets</Text>
            <TextInput 
                style={styles.input}
                value={numberOfLeaflets}
                onChangeText={setNumberOfLeaflets}
                keyboardType="numeric"
                placeholder="Enter number of Leaflets"
                placehodlerTextColor="#7D8A95"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddJob}>
                <Text style={styles.addButtonText}>Add Job</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#EAF2F8',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#00274D',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#00274D',
    },
    mapContainer: {
        height: 300,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    radiusButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBttom: 16,
    },
    radiusButton: {
        marginHorizontal: 10,
    },
    input: {
        height: 40,
        borderColor: '#7D8A95',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#F4F7FA',
        color: '#00274D',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    resetButton: {
        marginVertical: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    resetButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold', 
    },
    addButton: {
        backgroundColor: '#00274D',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 16,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});