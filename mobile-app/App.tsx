import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from './src/lib/supabase';

import ShopScreen from './src/screens/ShopScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import ContactUsScreen from './src/screens/ContactUsScreen';
import HelpScreen from './src/screens/HelpScreen';
import TrackOrderScreen from './src/screens/TrackOrderScreen';
import { useAuthStore } from './src/store/authStore';
import { useCartStore } from './src/store/cartStore';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { getTotals } = useCartStore();
  const { totalItems } = getTotals();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1d4ed8',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={ShopScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} /> }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Feather name="shopping-cart" size={24} color={color} />,
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="package" size={24} color={color} /> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const { items: cartItems, clearCart, setCartItems } = useCartStore();

  useEffect(() => {
    initializeAuth();
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, []);

  // Fetch Cart from Supabase on Login
  useEffect(() => {
    if (!user) return;
    
    const fetchCart = async () => {
      try {
        const { data, error } = await supabase
          .from('carts')
          .select('items')
          .eq('id', user.id)
          .single();
          
        if (data && data.items) {
          setCartItems(data.items);
        }
      } catch (err) {
        console.error('Failed to fetch initial cart:', err);
      }
    };
    
    fetchCart();
  }, [user?.id]);

  // Sync Cart to Supabase Realtime
  useEffect(() => {
    if (!user) return;
    
    const syncCart = async () => {
      try {
        const { error } = await supabase
          .from('carts')
          .upsert({ id: user.id, items: cartItems, updated_at: new Date().toISOString() });
        if (error) console.error('Error syncing cart to db:', error);
      } catch (err) {
        console.error('Failed to sync cart:', err);
      }
    };
    
    const timeout = setTimeout(syncCart, 1000);
    return () => clearTimeout(timeout);
  }, [cartItems, user]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen 
          name="ProductDetails" 
          component={ProductDetailsScreen} 
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Invoice" component={InvoiceScreen} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
