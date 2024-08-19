import React, { useState, useEffect } from 'react';
import { View, StyleSheet} from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import axios from '../../api';

export default function BusinessJobMapScreen() {
    const route = useRoute();
    const { coordinates, radius, businessUserId } = route.params;
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        fetchRecentRoutes();
    }, []);

    const fetchRecentRoutes = async () => {
        try {
            const response = await axios.get(`/business-jobs/recent_routes/?business_user=${businessUserId}`);
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching recent routes:', error);
        }
    };

    return (
        <View style={styles.container}>
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
                    title="Job Location"
                />
                <Circle 
                    center={coordinates}
                    radius={radius}
                    fillColor="rgba(0, 0, 255, 0.3)"
                    strokeColor="rgba(0, 0, 255, 0.5)"
                />

                {/* Render recent routes as polylines */}
                {routes.map((route, index) => (
                    <Polyline 
                        key={index}
                        coordinates={route.coordinates.map(coord => ({
                            latitude: coord.latitude,
                            longitude: coord.longitude,
                        }))}
                        strokeColor="#FF0000"
                        strokeWidth={3}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    map: {
        flex: 1,
    },
});