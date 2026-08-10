import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, ImageBackground } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function ProfileScreen({ navigation }: any) {
  const { user, session, signOut } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      // Use makeRedirectUri to ensure it resolves to mobileapp://auth in production and exp:// in dev
      const redirectUrl = makeRedirectUri({
        scheme: 'mobileapp',
        path: 'auth'
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (res.type === 'success') {
          const { url } = res;
          const hashString = url.split('#')[1];
          if (hashString) {
             const matchAccess = hashString.match(/access_token=([^&]+)/);
             const matchRefresh = hashString.match(/refresh_token=([^&]+)/);
             if (matchAccess && matchRefresh) {
               await supabase.auth.setSession({
                 access_token: matchAccess[1],
                 refresh_token: matchRefresh[1],
               });
             }
          }
        }
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Error', error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) Alert.alert('Error', error.message);
      else Alert.alert('Success', 'Account created! Check your email to verify.');
    }
    setLoading(false);
  };

  if (user) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
        <View className="p-6 items-center">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl font-black text-blue-700">
              {(user.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-1">{user.email || 'User'}</Text>
          <Text className="text-gray-500 mb-8">Logged in</Text>

          <View className="w-full space-y-3">
            <TouchableOpacity 
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row justify-between items-center"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}
            >
              <Text className="font-bold text-gray-700">My Orders</Text>
              <Text className="text-gray-400">&gt;</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row justify-between items-center"
              onPress={() => navigation.navigate('Help')}
            >
              <Text className="font-bold text-gray-700">Help Center</Text>
              <Text className="text-gray-400">&gt;</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row justify-between items-center"
              onPress={() => navigation.navigate('AboutUs')}
            >
              <Text className="font-bold text-gray-700">About Us</Text>
              <Text className="text-gray-400">&gt;</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row justify-between items-center"
              onPress={() => navigation.navigate('ContactUs')}
            >
              <Text className="font-bold text-gray-700">Contact Us</Text>
              <Text className="text-gray-400">&gt;</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className="mt-8 bg-red-50 px-8 py-3 rounded-xl border border-red-100"
            onPress={signOut}
          >
            <Text className="text-red-600 font-bold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* Brand Header */}
        <View className="px-6 pt-10 pb-6 items-center">
          <Text className="text-4xl font-black text-gray-900 tracking-tight">
            SK<Text className="text-blue-600">.</Text>
          </Text>
        </View>

        <View className="px-6 flex-1 justify-center pb-10">
          <View className="mb-10">
            <Text className="text-3xl font-black text-gray-900 tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </Text>
            <Text className="text-gray-500 mt-2 font-medium">
              {isLogin 
                ? "Enter your details to securely access your workspace." 
                : "Join over 50,000 engineers and makers today."}
            </Text>
          </View>

          <View className="space-y-4">
            
            {!isLogin && (
              <View className="relative justify-center">
                <View className="absolute left-4 z-10">
                  <Feather name="user" size={20} color={name ? '#2563eb' : '#9ca3af'} />
                </View>
                <TextInput
                  className="bg-white border-2 border-gray-100 rounded-xl pl-12 pr-4 py-4 text-gray-900 font-semibold focus:border-blue-600"
                  placeholder="Full Name"
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View className="relative justify-center">
              <View className="absolute left-4 z-10">
                <Feather name="mail" size={20} color={email ? '#2563eb' : '#9ca3af'} />
              </View>
              <TextInput
                className="bg-white border-2 border-gray-100 rounded-xl pl-12 pr-4 py-4 text-gray-900 font-semibold focus:border-blue-600"
                placeholder="Email Address"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="relative justify-center">
              <View className="absolute left-4 z-10">
                <Feather name="lock" size={20} color={password ? '#2563eb' : '#9ca3af'} />
              </View>
              <TextInput
                className="bg-white border-2 border-gray-100 rounded-xl pl-12 pr-12 py-4 text-gray-900 font-semibold focus:border-blue-600"
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                className="absolute right-4 z-10"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View className="relative justify-center">
                <View className="absolute left-4 z-10">
                  <Feather name="lock" size={20} color={confirmPassword ? '#2563eb' : '#9ca3af'} />
                </View>
                <TextInput
                  className="bg-white border-2 border-gray-100 rounded-xl pl-12 pr-12 py-4 text-gray-900 font-semibold focus:border-blue-600"
                  placeholder="Confirm Password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            )}

            {isLogin && (
              <View className="items-end pt-1">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">Forgot?</Text>
              </View>
            )}

            <TouchableOpacity 
              className="bg-blue-600 rounded-xl py-4 flex-row justify-center items-center mt-6 shadow-sm"
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-white font-bold text-base mr-2">
                    {isLogin ? "Sign In Securely" : "Create Account"}
                  </Text>
                  <Feather name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-100" />
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4">Or continue with</Text>
              <View className="flex-1 h-px bg-gray-100" />
            </View>

            <TouchableOpacity 
              className="bg-white border-2 border-gray-100 rounded-xl py-4 flex-row justify-center items-center active:bg-gray-50"
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Feather name="globe" size={18} color="#ea4335" />
              <Text className="text-gray-700 font-bold text-base ml-3">Google</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-gray-500 font-medium">
                {isLogin ? "New to SK Store? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => {
                setIsLogin(!isLogin);
                setName('');
                setConfirmPassword('');
              }}>
                <Text className="font-bold text-blue-600">
                  {isLogin ? "Create an account" : "Sign in here"}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
