import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function InvoiceScreen({ route, navigation }: any) {
  const { orderId, total } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-blue-600 justify-center items-center p-6">
      <View className="bg-white w-full rounded-3xl p-8 items-center shadow-xl">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">✅</Text>
        </View>
        
        <Text className="text-2xl font-black text-gray-900 mb-2">Order Confirmed!</Text>
        <Text className="text-gray-500 text-center mb-8">
          Thank you for shopping with SK Store. Your order has been successfully placed.
        </Text>
        
        <View className="w-full bg-gray-50 rounded-xl p-4 mb-8">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 font-bold">Order ID</Text>
            <Text className="text-gray-900 font-bold">{orderId}</Text>
          </View>
          <View className="flex-row justify-between pt-2 border-t border-gray-200">
            <Text className="text-gray-500 font-bold">Amount Paid</Text>
            <Text className="text-gray-900 font-black">₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-600 w-full py-4 rounded-xl items-center mb-3"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}
        >
          <Text className="text-white font-bold">View My Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="w-full py-4 items-center"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Shop' })}
        >
          <Text className="text-gray-500 font-bold">Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
