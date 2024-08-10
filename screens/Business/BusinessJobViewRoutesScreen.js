import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from '../../api';
import MapView, { Polyline } from 'react-native-maps';

export default function BusinessJobViewRoutesScreen({ route }) {
    const { jobId } = route.params;
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get(`/business-jobs/${jobId}/view_routes/`);
                setRoutes(response.data);
            } catch (error) {
                console.error('Error fetching routes:', error);
            }
        };

        fetchRoutes();
    }, [jobId]);

    return (
        <View style={styles.container}>
            {routes.length > 0 ? (
                <FlatList 
                    data={routes}
                    horizontal 
                    pagingEnabled 
                    renderItem={({ item }) => (
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: item.coordinates[0].latitude,
                                    longitude: item.coordinates[0].longitude, 
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                            >
                                <Polyline 
                                    coordinates={item.coordinates.map(coord => ({
                                        latitude: coord.latitude,
                                        longitude: coord.longitude,
                                    }))}
                                    strokeWidth={5}
                                    strokeColor="blue"
                                />
                            </MapView>
                            <Text style={styles.Text}>Start: {new Date(item.start_time).toLocaleString()}</Text>
                            <Text style={styles.text}>End: {new Date(item.end_time).toLocaleString()}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                ) : (
                    <Text>No routes available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
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
});