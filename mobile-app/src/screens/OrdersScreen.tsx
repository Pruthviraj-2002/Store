import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function OrdersScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();

    // Subscribe to realtime changes for this user's orders
    const channel = supabase.channel('orders-mobile')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `profile_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((order) => (order.id === payload.new.id ? payload.new : order))
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((order) => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">Sign in required</Text>
        <Text className="text-gray-500 text-center">
          Please sign in to view your order history.
        </Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'delivered') return 'bg-green-500';
    if (s === 'shipped') return 'bg-blue-500';
    if (s === 'cancelled') return 'bg-red-500';
    return 'bg-amber-500'; // Pending / processing
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4">
      <View className="flex-row justify-between mb-4">
        <View>
          <Text className="text-gray-500 font-bold text-xs mb-1">ORDER ID</Text>
          <Text className="text-gray-900 font-black">
            {item.order_number || item.id.split('-')[0].toUpperCase()}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-500 font-bold text-xs mb-1">TOTAL</Text>
          <Text className="text-blue-600 font-black">₹{Number(item.grand_total || item.total_amount || 0).toFixed(2)}</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-center pt-4 border-t border-gray-100">
        <View className="flex-row items-center space-x-2">
          <View className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(item.status)}`} />
          <Text className="font-bold text-gray-700 capitalize">{item.status || 'Pending'}</Text>
        </View>
        <TouchableOpacity 
          className="bg-blue-50 px-4 py-2 rounded-xl"
          onPress={() => navigation.navigate('TrackOrder', { orderId: item.id })}
        >
          <Text className="text-blue-700 font-bold text-sm">Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-black text-gray-900 tracking-tight">My Orders</Text>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="py-12 items-center">
              <Text className="text-gray-500 font-medium">No orders found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
