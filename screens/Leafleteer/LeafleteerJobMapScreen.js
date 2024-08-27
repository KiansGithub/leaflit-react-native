import React, { useState, useEffect } from 'react';
import { View, StyleSheet }  from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import axios from '../../api';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function LeafleteerJobMapScreen() {
    const route = useRoute();
    const { coordinates, radius, businessUserId } = route.params;
    const [recentRoutes, setRecentRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Debug: Check radius and coordinates value 
    console.log("Coordinates:", coordinates);
    console.log("Radius:", radius);
    console.log("Business User ID:", businessUserId);

    useEffect(() => {
        fetchRecentRoutes();
    }, []);

    const fetchRecentRoutes = async () => {
        try {
            const response = await axios.get('/business-jobs/recent_routes/', {
                params: { business_user: businessUserId }
            });
            console.log('Recent Routes:', response.data);
            setRecentRoutes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recent routes:', error);
            setLoading(false);
        }
    }

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
                    pinColor={colors.primary}
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
                </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    map: {
        flex: 1,
    }
})

