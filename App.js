import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import BusinessHomeScreen from './screens/BusinessHomeScreen';
import LeafleteerHomeScreen from './screens/LeafleteerHomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import JobListingsScreen from './screens/JobListingsScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BusinessTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={BusinessHomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Job Listings" component={JobListingsScreen} />
    </Tab.Navigator>
  );
}

function LeafleteerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={LeafleteerHomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Job Listings" component={JobListingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator InitialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Business" component={BusinessTabs} />
        <Stack.Screen name="Leafleteer" component={LeafleteerTabs} />
        <Stack.Screen name="Job Details" component={JobDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}