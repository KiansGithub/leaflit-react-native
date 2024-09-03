import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from '../../api';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../styles/theme';

export default function BusinessJobMapScreen() {
    const [job, setJob] = useState(null);
    const [locationName, setLocationName] = useState('');    
    const route = useRoute();
    const { coordinates, radius, businessUserId, jobId } = route.params;
    const [routes, setRoutes] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchJobDetails();
        fetchRecentRoutes();
    }, []);

    useEffect(() => {
        if (job) {
            fetchLocationName();
        }
    }, [job]);

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`/business-jobs/${jobId}/`);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const fetchRecentRoutes = async () => {
        try {
            const response = await axios.get(`/business-jobs/recent_routes/?business_user=${businessUserId}`);
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching recent routes:', error);
        }
    };

    const fetchLocationName = async () => {
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: job.latitude,
                longitude: job.longitude,
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

                {/* Render recent routes as polylines */}
                {routes.map((route, index) => (
                    <Polyline 
                        key={index}
                        coordinates={route.coordinates.map(coord => ({
                            latitude: coord.latitude,
                            longitude: coord.longitude,
                        }))}
                        strokeColor={colors.danger}
                        strokeWidth={3}
                    />
                ))}
            </MapView>
            <View style={styles.detailsContainer}>
                <Text style={styles.jobDetail}>Location: {locationName}</Text>
                <Text style={styles.jobDetail}>Number of Leaflets: {job?.number_of_leaflets}</Text>
                <Text style={styles.jobDetail}>Job Status: {job?.status}</Text>
            </View>
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
    },
    detailsContainer: {
        padding: spacing.medium,
        backgroundColor: colors.cardBackground,
        borderTopLeftRadius: borderRadius.large,
        borderTopRightRadius: borderRadius.large,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.textSecondary,
    },
    jobDetail: {
        fontSize: fontSizes.medium,
        color: colors.textPrimary,
        marginBottom: spacing.small,
    }
});