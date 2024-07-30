import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LeafleteerMyJobsScreen() {
    return (
        <View style={styles.container}>
            <Text>My Jobs</Text>
            {/* Add logic to display the list of jobs for the leafleteer */}
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