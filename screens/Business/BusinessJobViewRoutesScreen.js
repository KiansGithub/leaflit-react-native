import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from '../../api';
import MapView, { Polyline, Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function BusinessJobViewRoutesScreen({ route }) {
    const { jobId, coordinates, radius, businessUserId } = route.params;
    const [routes, setRoutes] = useState([]);
    const [recentRoutes, setRecentRoutes] = useState([]);
    const [locationName, setLocationName] = useState('');

    useEffect(() => {
        fetchRoutes();
        fetchRecentRoutes();
        fetchLocationName();
    }, [jobId, businessUserId]);
        
        
    const fetchRoutes = async () => {
        try {
            const response = await axios.get(`/business-jobs/${jobId}/view_routes/`);
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching routes:', error);            
        }
    };

    const fetchRecentRoutes = async () => {
        try {
            const response = await axios.get('/business-jobs/recent_routes/', {
                params: { business_user: businessUserId }
            });
            const filteredRecentRoutes = response.data.filter(route => route.job_id !== jobId);
            setRecentRoutes(filteredRecentRoutes);
        } catch (error) {
            console.error('Error fetching recent routes:', error);
        }
    };

    const fetchLocationName = async () => {
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                setLocationName(`${address.city}, ${address.region}`);
            } else {
                setLocationName('Unknown Location');
            } 
        } catch (error) {
            console.error('Error fetching location name:', error);
            setLocationName('Location Unavailable');
        }
    }

    const aggregatedCoordinates = routes.flatMap(route => route.coordinates);

    return (
        <View style={styles.container}>
            {aggregatedCoordinates.length > 0 || recentRoutes.length > 0 ? (
                <MapView 
                    style={styles.map}
                    initialRegion={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker 
                        coordinate={coordinates} 
                        title={locationName || "Job Location"}
                        pinColor="#00274D"
                    >
                        <Ionicons name="location-sharp" size={32} color="#007BFF" />
                    </Marker>

                    <Circle 
                        center={coordinates}
                        radius={radius}
                        fillColor="rgba(0, 123, 255, 0.3)"
                        strokeColor="#00274D"
                    />

                    {aggregatedCoordinates.length > 0 && (
                    <Polyline 
                        coordinates={aggregatedCoordinates.map(coord => ({
                            latitude: coord.latitude,
                            longitude: coord.longitude,
                        }))}
                        strokeWidth={5}
                        strokeColor="#007BFF"
                    />
                    )}

                    {recentRoutes.map((route, index) => (
                        <Polyline 
                            key={`recent-${index}`}
                            coordinates={route.coordinates.map(coord => ({
                                latitude: coord.latitude,
                                longitude: coord.longitude,
                            }))}
                            strokeWidth={3}
                            strokeColor="rgba(255, 0, 0, 0.8)"
                        />
                    ))}
                </MapView>
            ) : (
            <Text style={styles.noRoutesText}>No routes available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF2F8',
    },
    mapContainer: {
        width: 300,
        height: 400,
        marginRight: 16,
    },
    map: {
        width: '100%',
        height: '100%'
    },
    text: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    noRoutesText: {
        textAlgin: 'center',
        fontSize: 16,
        color: '#00274D',
        marginTop: 20,
    },
});