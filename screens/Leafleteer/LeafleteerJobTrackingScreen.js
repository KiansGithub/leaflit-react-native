import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from '../../api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LeafleteerJobTrackingScreen({ route, navigation }) {
    const { jobId } = route.params;
    const [location, setLocation] = useState(null);
    const [tracking, setTracking] = useState(false);
    const [coordinates, setCoordinates] = useState([]);
    const [region, setRegion] = useState(null);
    const [watcher, setWatcher] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log("User Location:", location);
            setLocation(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        })();

        return () => {
            if (watcher) {
                watcher.remove();
            }
        };
    }, []);

    const startTracking = async () => {
        setCoordinates([]);
        setTracking(true);
        const locationWatcher = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
            (location) => {
                const newCoordinate = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    timestamp: location.timestamp,
                };
                setCoordinates((prev) => [...prev, newCoordinate]);
                
                const newRegion = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                };

                setRegion(newRegion);

                // Animate the map to the new region 
                if(mapRef.current) {
                    mapRef.current.animateToRegion(newRegion, 1000);
                }
            },
            (error) => {
                console.error("Location error:", error);
                Alert.alert("Error", "Unable to fetch location. Please check your settings.");
            }
        );

        setWatcher(locationWatcher);
    };

    const stopTracking = async () => {
        if (watcher) {
            watcher.remove(); // Stop watching location 
            setWatcher(null);
        }
        setTracking(false);
        if (coordinates.length > 0) {
            try {
                // Save the route to the server 
                await saveRoute();
            } catch (error) {
                console.error('Error saving route:', error);
                Alert.alert('Error', 'Failed to save the route. It will be saved locally and retried later.');
                // Save the route locally for retry 
                await saveRouteLocally(coordinates);
            }
        }
    };

    const saveRoute = async () => {
        const formattedCoordinates = coordinates.map(coord => ({
            ...coord,
            timestamp: new Date(coord.timestamp).toISOString(),
        }));

        await axios.post('/routes/', {
            job_id: jobId,
            coordinates: formattedCoordinates,
            start_time: formattedCoordinates[0].timestamp,
            end_time: formattedCoordinates[formattedCoordinates.length - 1].timestamp,
        });

        setCoordinates([]);
    };

    const saveRouteLocally = async (coordinates) => {
        try {
            const storedRoutes = await AsyncStorage.getItem('unsavedRoutes');
            const unsavedRoutes = storedRoutes ? JSON.parse(storedRoutes) : [];
            unsavedRoutes.push({ jobId, coordinates });
            await AsyncStorage.setItem('unsavedRoutes', JSON.stringify(unsavedRoutes));
        } catch (error) {
            console.error('Error saving route locally:', error);
        }
    };

    const retryUnsavedRoutes = async () => {
        try {
            const storedRoutes = await AsyncStorage.getItem('unsavedRoutes');
            const unsavedRoutes = storedRoutes ? JSON.parse(storedRoutes) : [];

            for (const route of unsavedRoutes) {
                try {
                    await axios.post('/routes/', {
                        job_id: route.jobId,
                        coordinates: route.coordinates.map(coord => ({
                            ...coord,
                            timestamp: new Date(coord.timestamp).toISOString(),
                        })),
                        start_time: route.coordinates[0].timestamp,
                        end_time: route.coordinates[route.coordinates.length - 1].timestamp,
                    });
                } catch (error) {
                    console.error('Error retrying unsaved route:', error);
                    return;
                }
            }

            // Clear the local storage ifa ll retries are successful 
            await AsyncStorage.removeItem('unsavedRoutes');
        } catch (error) {
            console.error('Error retrying unsaved routes:', error);
        }
    };

    useEffect(() => {
        retryUnsavedRoutes();
    }, []);

    return (
        <View style={styles.container}>
            {region && (
                <MapView 
                    ref={mapRef}
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    {coordinates.length > 0 && (
                        <Polyline
                        coordinates={coordinates.map(coord => ({ latitude: coord.latitude, longitude: coord.longitude }))}
                        strokeWidth={5}
                        strokeColor='blue'
                        />
                    )}
                </MapView>
            )}
            <View style={styles.buttons}>
                {!tracking ? (
                    <TouchableOpacity style={styles.startButton} onPress={startTracking}>
                        <Ionicons name="play-circle" size={24} color="white" />
                        <Text style={styles.buttonText}>Start Tracking</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
                        <Ionicons name="stop-circle" size={24} color="white" />
                        <Text style={styles.buttonText}>Stop Tracking</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '80%',
    },
    buttons: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
    },
});