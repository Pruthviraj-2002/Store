import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function AboutUsScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Text className="font-bold text-gray-500">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-black text-gray-900">About Us</Text>
      </View>

      <ScrollView className="p-6">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1553456558-bef63de6060e?w=800&q=80' }} 
          className="w-full h-48 rounded-2xl mb-6 bg-gray-100" 
        />
        
        <Text className="text-3xl font-black text-gray-900 mb-4">SK Store</Text>
        
        <Text className="text-base text-gray-600 leading-relaxed mb-6">
          Welcome to SK Store! We are a premium e-commerce destination committed to bringing you the highest quality products at the best prices. Founded with a passion for excellence, we source only the finest components and goods for our customers.
        </Text>
        
        <Text className="text-xl font-bold text-gray-900 mb-2">Our Mission</Text>
        <Text className="text-base text-gray-600 leading-relaxed mb-6">
          To provide an unparalleled shopping experience through cutting-edge technology, exceptional customer service, and a curated selection of top-tier products.
        </Text>
        
        <Text className="text-xl font-bold text-gray-900 mb-2">Why Choose Us?</Text>
        <View className="space-y-3 mb-10">
          <Text className="text-gray-600">• Fast & secure shipping</Text>
          <Text className="text-gray-600">• 24/7 Customer Support</Text>
          <Text className="text-gray-600">• Quality guaranteed</Text>
          <Text className="text-gray-600">• Easy returns</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
