import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from '../../api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LeafleteerJobTrackingScreen({ route, navigation }) {
    const { jobId, coordinates, radius, businessUserId } = route.params;
    const [location, setLocation] = useState(null);
    const [tracking, setTracking] = useState(false);
    const [currentCoordinates, setCurrentCoordinates] = useState([]);
    const [region, setRegion] = useState(null);
    const [watcher, setWatcher] = useState(null);
    const [recentRoutes, setRecentRoutes] = useState([]);
    const [mapLoading, setMapLoading] = useState(true);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
            setMapLoading(false);
        })();

        fetchRecentRoutes();

        return () => {
            if (watcher) {
                watcher.remove();
            }
        };
    }, [watcher]);

    const fetchRecentRoutes = async () => {
        try {
            const response = await axios.get('/business-jobs/recent_routes/', {
                params: { business_user: businessUserId }
            });
            setRecentRoutes(response.data);
        } catch (error) {
            
        }
    };

    const startTracking = async () => {
        setCurrentCoordinates([]);
        setTracking(true);
        setSessionStartTime(new Date().toISOString());

        const locationWatcher = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
            (location) => {
                const newCoordinate = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    timestamp: location.timestamp,
                };
                setCurrentCoordinates((prev) => [...prev, newCoordinate]);
                
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
                Alert.alert("Error", "Unable to fetch location. Please check your settings.");
            }
        );

        setWatcher(locationWatcher);
    };

    // Log the active session to the backend 
    const logActiveSession = async (start_time, end_time) => {
        try {
            await axios.post(`/leafleteerjobs/${jobId}/log-session/`, {
                start_time, 
                end_time,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to log the session. Please try again.');
        }
    };

    const stopTracking = async () => {
        if (watcher) {
            watcher.remove(); // Stop watching location 
            setWatcher(null);
        }
        setTracking(false);
        if (currentCoordinates.length > 0) {
            const end_time = new Date().toISOString();
            await logActiveSession(sessionStartTime, end_time); // Log the entire session 
            await saveRouteOrStoreOffline(currentCoordinates, sessionStartTime, end_time);
            setSessionStartTime(null);
        }
    };

    const saveRouteOrStoreOffline = async (coordinates, start_time, end_time) => {
        try {
            await axios.post('/routes/', {
                job_id: jobId, 
                coordinates: coordinates.map(coord => ({
                    ...coord, 
                    timestamp: new Date(coord.timestamp).toISOString(),
                })),
                start_time,
                end_time,
            });
            setCurrentCoordinates([]);
        } catch (error) {
            // Save route locally if unable to save to server 
            await saveRouteLocally(coordinates, start_time, end_time);
        }
    };

    const saveRouteLocally = async (coordinates) => {
        try {
            const storedRoutes = await AsyncStorage.getItem('unsavedRoutes');
            const unsavedRoutes = storedRoutes ? JSON.parse(storedRoutes) : [];
            unsavedRoutes.push({ jobId, coordinates, start_time, end_time });
            await AsyncStorage.setItem('unsavedRoutes', JSON.stringify(unsavedRoutes));
        } catch (error) {
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
                        start_time: route.start_time,
                        end_time: route.end_time,
                    });
                } catch (error) {
                    return;
                }
            }

            // Clear the local storage if all retries are successful 
            await AsyncStorage.removeItem('unsavedRoutes');
        } catch (error) {
    
        }
    };

    useEffect(() => {
        retryUnsavedRoutes();
    }, []);

    return (
        <View style={styles.container}>
            {mapLoading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
            region && (
                <MapView 
                    ref={mapRef}
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                >

                    <Marker 
                        coordinate={coordinates}
                        title="Job Location"
                        pinColor={colors.primary} // Changed to use theme color for pin
                    >
                        <Ionicons name="location-sharp" size={32} color={colors.secondary} />
                    </Marker>
                    <Circle 
                        center={coordinates}
                        radius={radius}
                        fillColor="rgba(0, 123, 255, 0.3)"
                        strokeColor={colors.primary}
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

                    {currentCoordinates.length > 0 && (
                        <Polyline
                        coordinates={currentCoordinates.map(coord => ({ latitude: coord.latitude, longitude: coord.longitude }))}
                        strokeWidth={5}
                        strokeColor={colors.secondary}
                        />
                    )}
                </MapView>
            )
            )}
            <View style={styles.buttons}>
                {!tracking ? (
                    <TouchableOpacity style={styles.startButton} onPress={startTracking}>
                        <Ionicons name="play-circle" size={24} color={colors.white} />
                        <Text style={styles.buttonText}>Start Tracking</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
                        <Ionicons name="stop-circle" size={24} color={colors.white} />
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
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '80%',
    },
    buttons: {
        position: 'absolute',
        bottom: spacing.large,
        flexDirection: 'row',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        padding: spacing.medium,
        borderRadius: borderRadius.medium,
        marginRight: spacing.small,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success,
        padding: spacing.medium,
        borderRadius: borderRadius.medium,
    },
    buttonText: {
        color: colors.white,
        marginLeft: spacing.small,
        fontWeight: fontWeights.bold,
    },
});