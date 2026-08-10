import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Feather } from '@expo/vector-icons';

export default function TrackOrderScreen({ route, navigation }: any) {
  const { orderId } = route.params || {};
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product_variants (
              products (
                name,
                product_images (url)
              )
            )
          )
        `)
        .eq('id', orderId)
        .single();
        
      if (data && !error) {
        setOrderDetails(data);
      }
      setLoading(false);
    };

    fetchOrder();

    const channel = supabase.channel(`order_tracking_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new) {
            setOrderDetails((prev: any) => ({
              ...prev,
              status: payload.new.status,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (!orderDetails) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-6 justify-center items-center flex-1">
          <Text className="text-xl font-bold text-gray-900 mb-2">Order Not Found</Text>
          <Text className="text-gray-500 text-center mb-6">We couldn't find tracking details for this order.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className="bg-blue-600 px-6 py-3 rounded-xl">
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const status = orderDetails.status || 'pending';
  const isCancelled = status === 'cancelled' || status === 'returned' || status === 'refunded';
  
  const isProcessing = status === 'packed' || status === 'shipped' || status === 'delivered';
  const isShipped = status === 'shipped' || status === 'delivered';
  const isDelivered = status === 'delivered';

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100 shadow-sm bg-white z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
          <Feather name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-black text-gray-900">Track Order</Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50">
        {/* Header section */}
        <View className="bg-gray-900 p-6">
          <Text className="font-bold text-gray-400 mb-1">
            ORDER #{orderDetails.order_number || orderId.split('-')[0].toUpperCase()}
          </Text>
          <Text className="text-white text-sm mb-4">
            Placed on {new Date(orderDetails.created_at).toLocaleDateString()}
          </Text>
          <View className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Expected Delivery</Text>
            <Text className="text-xl font-bold text-green-400">{orderDetails.estimated_delivery || 'TBD'}</Text>
          </View>
        </View>

        {/* Timeline section */}
        <View className="bg-white p-6 mt-2">
          {isCancelled ? (
            <View className="space-y-6">
              <View className="flex-row items-start">
                <View className="w-4 h-4 rounded-full border-2 border-red-500 bg-red-500 mt-1 mr-4" />
                <View>
                  <Text className="font-bold text-gray-900 text-lg">Order Placed</Text>
                  <Text className="text-gray-500">{new Date(orderDetails.created_at).toLocaleDateString()}</Text>
                </View>
              </View>
              
              <View className="w-0.5 h-10 bg-red-500 ml-2 -mt-6 -mb-6" />

              <View className="flex-row items-start">
                <View className="w-4 h-4 rounded-full border-2 border-red-500 bg-red-500 mt-1 mr-4" />
                <View>
                  <Text className="font-bold text-red-600 text-lg uppercase">{status}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className="space-y-6">
              {/* Placed */}
              <View className="flex-row items-start">
                <View className="w-4 h-4 rounded-full border-2 border-gray-900 bg-gray-900 mt-1 mr-4" />
                <View>
                  <Text className="font-bold text-gray-900 text-lg">Order Placed</Text>
                  <Text className="text-gray-500">{new Date(orderDetails.created_at).toLocaleDateString()}</Text>
                </View>
              </View>
              
              <View className={`w-0.5 h-10 ml-2 -mt-6 -mb-6 ${isProcessing ? 'bg-gray-900' : 'bg-gray-200'}`} />

              {/* Packed */}
              <View className="flex-row items-start">
                <View className={`w-4 h-4 rounded-full border-2 mt-1 mr-4 ${isProcessing ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'}`} />
                <View>
                  <Text className={`font-bold text-lg ${isProcessing ? 'text-gray-900' : 'text-gray-400'}`}>Packed</Text>
                </View>
              </View>

              <View className={`w-0.5 h-10 ml-2 -mt-6 -mb-6 ${isShipped ? 'bg-gray-900' : 'bg-gray-200'}`} />

              {/* Shipped */}
              <View className="flex-row items-start">
                <View className={`w-4 h-4 rounded-full border-2 mt-1 mr-4 ${isShipped ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'}`} />
                <View>
                  <Text className={`font-bold text-lg ${isShipped ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</Text>
                </View>
              </View>

              <View className={`w-0.5 h-10 ml-2 -mt-6 -mb-6 ${isDelivered ? 'bg-gray-900' : 'bg-gray-200'}`} />

              {/* Delivered */}
              <View className={`flex-row items-start ${!isDelivered ? 'opacity-50' : ''}`}>
                <View className={`w-4 h-4 rounded-full border-2 mt-1 mr-4 ${isDelivered ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'}`} />
                <View>
                  <Text className={`font-bold text-lg ${isDelivered ? 'text-gray-900' : 'text-gray-500'}`}>Delivered</Text>
                  <Text className="text-gray-400">Estimated: {orderDetails.estimated_delivery || 'TBD'}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Shipping details */}
        <View className="bg-white p-6 mt-2 mb-8">
          <Text className="font-bold text-gray-900 text-lg mb-4">Shipping Details</Text>
          <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <Text className="font-bold text-gray-800">{orderDetails.shipping_address?.name || 'Customer'}</Text>
            <Text className="text-gray-600 mt-2 leading-5">{orderDetails.shipping_address?.address || 'No address provided'}</Text>
            {orderDetails.shipping_address?.phone && (
              <Text className="text-gray-600 mt-2">Phone: {orderDetails.shipping_address.phone}</Text>
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
