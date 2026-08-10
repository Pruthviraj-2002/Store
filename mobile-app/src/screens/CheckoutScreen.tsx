import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useCartStore } from '../store/cartStore';

export default function CheckoutScreen({ navigation }: any) {
  const { clearCart, getTotals } = useCartStore();
  const { totalPrice } = getTotals();
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  
  const handlePlaceOrder = () => {
    if (!address || !city || !zip) {
      Alert.alert('Missing Info', 'Please fill in all shipping details.');
      return;
    }
    
    // Simulate placing order
    clearCart();
    navigation.replace('Invoice', { 
      orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
      total: totalPrice 
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Text className="font-bold text-gray-500">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-black text-gray-900">Checkout</Text>
      </View>

      <ScrollView className="p-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Shipping Details</Text>
        
        <View className="space-y-4 mb-8">
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
            placeholder="Full Address"
            value={address}
            onChangeText={setAddress}
          />
          <View className="flex-row space-x-4">
            <TextInput
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              placeholder="ZIP Code"
              keyboardType="number-pad"
              value={zip}
              onChangeText={setZip}
            />
          </View>
        </View>

        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 font-bold">Subtotal</Text>
            <Text className="text-gray-900 font-bold">₹{totalPrice.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 font-bold">Shipping</Text>
            <Text className="text-green-600 font-bold">Free</Text>
          </View>
          <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
            <Text className="text-gray-900 font-black text-lg">Total</Text>
            <Text className="text-gray-900 font-black text-lg">₹{totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-100 bg-white shadow-lg">
        <TouchableOpacity
          className="bg-blue-600 w-full py-4 rounded-xl items-center"
          onPress={handlePlaceOrder}
        >
          <Text className="text-white font-bold text-lg">Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
