import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useCartStore } from '../store/cartStore';

export default function CartScreen({ navigation }: any) {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { totalPrice } = getTotals();

  if (items.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</Text>
        <Text className="text-gray-500 text-center mb-6">
          Looks like you haven't added anything to your cart yet.
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-xl"
          onPress={() => navigation.navigate('Search')}
        >
          <Text className="text-white font-bold">Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-black text-gray-900 tracking-tight">Shopping Cart</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 p-4 items-center">
            <Image
              source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' }}
              className="w-20 h-20 rounded-xl bg-gray-50"
              resizeMode="contain"
            />
            <View className="flex-1 ml-4">
              <Text className="font-bold text-gray-900 mb-1" numberOfLines={2}>
                {item.name}
              </Text>
                <Text className="text-gray-500 font-bold mb-2">₹{item.price.toFixed(2)}</Text>
                
                <View className="flex-row items-center space-x-4">
                  <View className="flex-row items-center border border-gray-200 rounded-lg bg-gray-50">
                    <TouchableOpacity 
                      className="p-2"
                      onPress={() => updateQuantity(item.id, item.qty - 1)}
                    >
                      <Text className="text-xl font-bold text-gray-500">-</Text>
                    </TouchableOpacity>
                    <Text className="font-black text-gray-900 px-4">{item.qty}</Text>
                    <TouchableOpacity 
                      className="p-2"
                      onPress={() => updateQuantity(item.id, item.qty + 1)}
                    >
                    <Text className="text-gray-600 font-bold">+</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text className="text-red-500 font-bold">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View className="bg-white p-6 border-t border-gray-200 shadow-lg">
        <View className="flex-row justify-between mb-4">
          <Text className="text-gray-500 font-bold">Total</Text>
          <Text className="text-2xl font-black text-gray-900">₹{totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          className="bg-gray-900 w-full py-4 rounded-xl items-center"
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text className="text-white font-bold text-lg">Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
