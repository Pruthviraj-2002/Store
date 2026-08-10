import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function ContactUsScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    Alert.alert('Message Sent', "Thanks for reaching out! We'll get back to you soon.");
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Text className="font-bold text-gray-500">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-black text-gray-900">Contact Us</Text>
      </View>

      <ScrollView className="p-6">
        <Text className="text-gray-500 mb-6">
          Have a question or need support? Drop us a message below and our team will get back to you within 24 hours.
        </Text>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">Name</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">Email Address</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">Message</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              placeholder="How can we help you?"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-100 bg-white shadow-lg">
        <TouchableOpacity
          className="bg-blue-600 w-full py-4 rounded-xl items-center"
          onPress={handleSend}
        >
          <Text className="text-white font-bold text-lg">Send Message</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
