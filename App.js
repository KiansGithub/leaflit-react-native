import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from './screens/Shared/LoginScreen';
import RegistrationScreen from './screens/Shared/RegistrationScreen';
import BusinessHomeScreen from './screens/Business/BusinessHomeScreen';
import LeafleteerHomeScreen from './screens/Leafleteer/LeafleteerHomeScreen';
import BusinessMenuScreen from './screens/Business/BusinessMenuScreen'; // New screen for the menu 
import LeafleteerMenuScreen from './screens/Leafleteer/LeafleteerMenuScreen'; // New screen for the menu
import BusinessAddJobScreen from './screens/Business/BusinessAddJobScreen';
import BusinessMyJobsScreen from './screens/Business/BusinessMyJobsScreen';
import LeafleteerMyJobsScreen from './screens/Leafleteer/LeafleteerMyJobsScreen';
import LeafleteerFindJobsScreen from './screens/Leafleteer/LeafleteerFindJobsScreen';
import LeafleteerJobDetailsScreen from './screens/Leafleteer/LeafleteerJobDetailsScreen';
import BusinessJobDetailsScreen from './screens/Business/BusinessJobDetailsScreen';
import LeafleteerMyBidsScreen from './screens/Leafleteer/LeafleteerMyBidsScreen';
import PasswordResetConfirmScreen from './screens/Shared/PasswordResetConfirmScreen';
import PasswordResetRequestScreen from './screens/Shared/PasswordResetRequestScreen';
import BusinessNotificationScreen from './screens/Business/BusinessNotificationScreen';
import LeafleteerNotificationScreen from './screens/Leafleteer/LeafleteerNotificationScreen';
import LeafleteerJobTrackingScreen from './screens/Leafleteer/LeafleteerJobTrackingScreen';
import BusinessJobViewRoutesScreen from './screens/Business/BusinessJobViewRoutesScreen';
import BusinessJobMapScreen from './screens/Business/BusinessJobMapScreen';
import LeafleteerJobMapScreen from './screens/Leafleteer/LeafleteerJobMapScreen';
import LeafleteerStripeOnboardingScreen from './screens/Leafleteer/LeafleteerStripeOnboardingScreen';
import LeafleteerStripeOnboardingSuccessScreen from './screens/Leafleteer/LeafleteerStripeOnboardingSuccessScreen';
import LeafleteerStripeOnboardingRefreshScreen from './screens/Leafleteer/LeafleteerStripeOnboardingRefreshScreen';
import * as Linking from 'expo-linking';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define the deep linking configuration 
const linking = {
  prefixes: ['leaflitapp://', 'https://f7ea-86-18-167-205.ngrok-free.app'],
  config: {
    screens: {
        LeafleteerStripeOnboardingSuccess: 'onboarding-success',
        LeafleteerStripeOnboardingRefresh: 'onboarding-refresh',
  },
},
};

function BusinessTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home"
        component={BusinessHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
     <Tab.Screen
       name="My Jobs"
       component={BusinessMyJobsScreen}
       options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="briefcase-outline" color={color} size={size} />
        ),
       }}
      />
      <Tab.Screen
        name="Add Job"
        component={BusinessAddJobScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={BusinessMenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="menu-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function LeafleteerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home"
        component={LeafleteerHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="My Jobs"
        component={LeafleteerMyJobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="briefcase-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Find Jobs"
        component={LeafleteerFindJobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
          name="My Bids"
          component={LeafleteerMyBidsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="clipboard-outline" color={color} size={size} />
            ),
          }}
      />
      <Tab.Screen 
        name="Menu"
        component={LeafleteerMenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="menu-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
      <Stack.Screen name="Business" component={BusinessTabs} />
      <Stack.Screen name="Leafleteer" component={LeafleteerTabs} />
      <Stack.Screen name="Leafleteer Job Details" component={LeafleteerJobDetailsScreen} />
      <Stack.Screen name="Business Job Details" component={BusinessJobDetailsScreen} />
      <Stack.Screen name="Password Reset Confirm" component={PasswordResetConfirmScreen} />
      <Stack.Screen name="Password Reset Request" component={PasswordResetRequestScreen} />
      <Stack.Screen name="Business Notifications" component={BusinessNotificationScreen} />
      <Stack.Screen name="Leafleteer Notifications" component={LeafleteerNotificationScreen} />
      <Stack.Screen name="Leafleteer Job Tracking" component={LeafleteerJobTrackingScreen} />
      <Stack.Screen name="Business Job View Routes" component={BusinessJobViewRoutesScreen} />
      <Stack.Screen name="Business Job Map" component={BusinessJobMapScreen} />
      <Stack.Screen name="Leafleteer Job Map" component={LeafleteerJobMapScreen} />
      <Stack.Screen name="Leafleteer Stripe Onboarding" component={LeafleteerStripeOnboardingScreen} />
      <Stack.Screen name="Leafleteer Stripe Onboarding Success" component={LeafleteerStripeOnboardingSuccessScreen} />
      <Stack.Screen name="Leafleteer Stripe Onboarding Refresh" component={LeafleteerStripeOnboardingRefreshScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const linkingListener = ({ url }) => {
      console.log('Received deep link:', url);
    };

    Linking.addEventListener('url', linkingListener);

    // Cleanup the event listener on unmount
    return () => {
      Linking.removeEventListener('url', linkingListener);
  };
}, []);

  return (
    <NavigationContainer linking={linking}>
      <MainStack />
    </NavigationContainer>
  );
}