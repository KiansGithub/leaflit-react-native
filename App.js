import React, { useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StripeProvider } from '@stripe/stripe-react-native';

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
import LeafleteerEarningsDashboardScreen from './screens/Leafleteer/LeafleteerEarningsDashboardScreen';
import LeafleteerProfileScreen from './screens/Leafleteer/LeafleteerProfileScreen';
import LeafleteerEditProfileScreen from './screens/Leafleteer/LeafleteerEditProfileScreen';
import BusinessProfileScreen from './screens/Business/BusinessProfileScreen';
import BusinessEditProfileScreen from './screens/Business/BusinessEditProfileScreen';
import LeafleteerSettingsScreen from './screens/Leafleteer/LeafleteerSettingsScreen';
import BusinessSettingsScreen from './screens/Business/BusinessSettingsScreen';
import LeafleteerHelpSupportScreen from './screens/Leafleteer/LeafleteerHelpSupportScreen';
import BusinessHelpSupportScreen from './screens/Business/BusinessHelpSupportScreen';
import * as Linking from 'expo-linking';
import axios from './api';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Publishable key for the Stripe API
const publishableKey = 'pk_test_51OitMvIjsBAazCjHAwOMpH0hUZoEg97keC1O1dh4oLN6Kx5Jw9UzACcYuBtnLm7VR5KolNkVHDr1jn1dY37FycK300Ele0bTuy';

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
    <Tab.Navigator
      // Hides the header for all screens in the BusinessTabs navigator 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00274D',
        tabBarInactiveTintColor: '#7D8A95',
        tabBarStyle: {
          backgroundColor: '#EAF2F8',
        },
      }}
    >
      <Tab.Screen 
        name="Business Home"
        component={BusinessHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
     <Tab.Screen
       name="Business My Jobs"
       component={BusinessMyJobsScreen}
       options={{
        title: 'My Jobs',
        tabBarIcon: ({ color, size }) => (
          <Icon name="briefcase-outline" color={color} size={size} />
        ),
       }}
      />
      <Tab.Screen
        name="Business Add Job"
        component={BusinessAddJobScreen}
        options={{
          title: 'Add Job',
          tabBarIcon: ({ color, size }) => (
            <Icon name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Business Menu"
        component={BusinessMenuScreen}
        options={{
          title: 'Menu',
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
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#00274D',
      tabBarInactiveTintColor: '#7D8A95',
      tabBarStyle: {
        backgroundColor: '#EAF2F8', 
      },
      headerShown: false,
    }}
    >
      <Tab.Screen 
        name="Leafleteer Home"
        component={LeafleteerHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Leafleteer My Jobs"
        component={LeafleteerMyJobsScreen}
        options={{
          title: 'My Jobs',
          tabBarIcon: ({ color, size }) => (
            <Icon name="briefcase-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Leafleteer Find Jobs"
        component={LeafleteerFindJobsScreen}
        options={{
          title: 'Find Jobs',
          tabBarIcon: ({ color, size }) => (
            <Icon name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
          name="Leafleteer My Bids"
          component={LeafleteerMyBidsScreen}
          options={{
            title: 'My Bids',
            tabBarIcon: ({ color, size }) => (
              <Icon name="clipboard-outline" color={color} size={size} />
            ),
          }}
      />
      <Tab.Screen 
        name="Leafleteer Menu"
        component={LeafleteerMenuScreen}
        options={{
          title: 'Menu',
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
    <Stack.Navigator
        screenOptions={{
              headerStyle: {
                backgroundColor: '#EAF2F8',
              },
              headerTintColor: '#00274D',
              headerTitleAlign: 'center', 
              headerTitle: '',
              headerRight: () => null,
        }}
      >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
      <Stack.Screen 
          name="Business" 
          component={BusinessTabs} 
      />
      <Stack.Screen 
          name="Leafleteer" 
          component={LeafleteerTabs}
      />
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
      <Stack.Screen name="Leafleteer Earnings Dashboard" component={LeafleteerEarningsDashboardScreen} />
      <Stack.Screen name="Leafleteer Profile" component={LeafleteerProfileScreen} />
      <Stack.Screen name="Leafleteer Edit Profile" component={LeafleteerEditProfileScreen} />
      <Stack.Screen name="Business Profile" component={BusinessProfileScreen} />
      <Stack.Screen name="Business Edit Profile" component={BusinessEditProfileScreen} />
      <Stack.Screen name="Leafleteer Settings" component={LeafleteerSettingsScreen} />
      <Stack.Screen name="Business Settings" component={BusinessSettingsScreen} />
      <Stack.Screen name="Leafleteer Help Support" component={LeafleteerHelpSupportScreen} />
      <Stack.Screen name="Business Help Support" component={BusinessHelpSupportScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // Handle the notification here (e.g., display an in-app alert)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Handle the response here (e.g., navigate to a specific screen);
    });
    

    const linkingListener = ({ url }) => {
      console.log('Received deep link:', url);
    };

    const subscription = Linking.addEventListener('url', linkingListener);

    // Cleanup the event listener on unmount
    return () => {
      subscription.remove();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
  };
}, []);

  return (
    <StripeProvider 
      publishableKey={publishableKey}
    >
      <NavigationContainer linking={linking}>
        <MainStack />
      </NavigationContainer>
    </StripeProvider>
  );
}