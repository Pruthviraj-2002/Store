import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const faqs = [
  {
    q: "How can I track my order?",
    a: "You can track your order by navigating to the 'Orders' tab and tapping on 'Track Order' next to your active shipments."
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day money-back guarantee. If you're not satisfied, simply return the item in its original packaging."
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to over 100 countries worldwide. Shipping times and costs vary depending on the destination."
  },
  {
    q: "How can I change my shipping address?",
    a: "You can update your shipping address in the 'Profile' tab under 'Shipping Addresses'."
  }
];

export default function HelpScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 border-b border-gray-100 bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Text className="font-bold text-gray-500">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-black text-gray-900">Help Center</Text>
      </View>

      <ScrollView className="p-6">
        <Text className="text-2xl font-black text-gray-900 mb-6">Frequently Asked Questions</Text>
        
        {faqs.map((faq, index) => (
          <View key={index} className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm">
            <Text className="font-bold text-gray-900 text-lg mb-2">{faq.q}</Text>
            <Text className="text-gray-600 leading-relaxed">{faq.a}</Text>
          </View>
        ))}

        <View className="mt-6 mb-10">
          <Text className="text-gray-500 text-center mb-4">Still need help?</Text>
          <TouchableOpacity 
            className="bg-blue-600 w-full py-4 rounded-xl items-center"
            onPress={() => navigation.navigate('ContactUs')}
          >
            <Text className="text-white font-bold">Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
