import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../api';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

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
                <ActivityIndicator size="large" color={colors.primary} />
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
                    <Ionicons name="remove-circle-outline" size={32} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.radiusButton} onPress={increaseRadius}>
                    <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
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
                placehodlerTextColor={colors.textSecondary}
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
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: fontSizes.xlarge,
        fontWeight: fontWeights.bold,
        marginBottom: spacing.medium,
        color: colors.primary,
    },
    label: {
        fontSize: fontSizes.medium,
        marginBottom: spacing.small,
        fontWeight: fontWeights.bold,
        color: colors.primary,
    },
    mapContainer: {
        height: 300,
        marginBottom: spacing.medium,
        borderRadius: borderRadius.medium,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    radiusButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBttom: spacing.medium,
    },
    radiusButton: {
        marginHorizontal: spacing.small,
    },
    input: {
        height: 40,
        borderColor: colors.textSecondary,
        borderWidth: 1,
        marginBottom: spacing.medium,
        paddingHorizontal: spacing.small,
        borderRadius: borderRadius.small,
        backgroundColor: colors.cardBackground,
        color: colors.primary,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.medium,
    },
    resetButton: {
        marginVertical: spacing.small,
        backgroundColor: colors.secondary,
        padding: spacing.small,
        borderRadius: borderRadius.small,
        alignItems: 'center',
    },
    resetButtonText: {
        color: colors.white,
        textAlign: 'center',
        fontWeight: fontWeights.bold, 
    },
    addButton: {
        backgroundColor: colors.primary,
        padding: spacing.medium,
        borderRadius: borderRadius.small,
        alignItems: 'center',
        marginTop: spacing.medium,
    },
    addButtonText: {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
    },
});