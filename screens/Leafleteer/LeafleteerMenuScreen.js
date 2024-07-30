import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function MenuScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Menu Screen</Text>
            <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
            <Button title="Job Listings" onPress={() => navigation.navigate('Job Listings')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});