import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Feather } from '@expo/vector-icons';

export default function ShopScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Realtime product update received!', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          short_description,
          categories ( name, slug ),
          brands ( name ),
          product_variants ( id, base_price, sale_price, sku, inventory ( quantity ) ),
          product_images ( url ),
          created_at
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedProducts = (data || []).map((item: any) => {
        const defaultVariant = item.product_variants?.[0] || {};
        
        let stockQuantity = 0;
        if (Array.isArray(defaultVariant.inventory)) {
          stockQuantity = defaultVariant.inventory[0]?.quantity || 0;
        } else if (defaultVariant.inventory) {
          stockQuantity = defaultVariant.inventory.quantity || 0;
        }

        return {
          id: item.id,
          slug: item.slug,
          name: item.name,
          brand: item.brands?.name || 'Generic',
          description: item.short_description || '',
          price: defaultVariant.sale_price || defaultVariant.base_price || 0,
          sktPartNo: defaultVariant.sku || 'N/A',
          stock: stockQuantity,
          image_url: item.product_images?.[0]?.url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
          category: item.categories?.name || 'Hardware',
          categories: item.categories
        };
      });

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#1d4ed8" />
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200' }}
        className="w-full h-96 justify-center items-center"
        imageStyle={{ opacity: 0.4, backgroundColor: '#000000' }}
      >
        <View className="flex-1 w-full justify-center items-center px-6 pt-4 pb-12 bg-black/30">
          <View className="bg-blue-600/80 border border-blue-400/50 px-4 py-1.5 rounded-full flex-row items-center mb-6">
            <View className="w-2 h-2 rounded-full bg-white mr-2" />
            <Text className="text-white text-[10px] font-black tracking-widest uppercase">Next-Gen Components</Text>
          </View>

          <Text className="text-3xl font-black text-white text-center tracking-tight mb-4 leading-tight w-full max-w-[300px]">
            Powering the Future of Electronics
          </Text>
          
          <Text className="text-sm text-gray-200 text-center font-medium mb-8 leading-relaxed max-w-[320px]">
            Discover premium, industrial-grade components for your next breakthrough project. Fast, reliable, and authentic.
          </Text>

          <TouchableOpacity 
            className="bg-blue-600 px-8 py-4 rounded-full flex-row items-center shadow-lg"
            onPress={() => {/* Could scroll to products */}}
          >
            <Text className="text-white font-black text-base mr-2">Explore Catalog</Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Trust Badges */}
      <View className="bg-white mx-4 -mt-10 mb-8 rounded-3xl p-5 shadow-md shadow-gray-200 flex-row flex-wrap justify-between border border-gray-100">
        <View className="w-[48%] items-center mb-6">
          <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2 shadow-inner">
            <Feather name="check-circle" size={22} color="#2563eb" />
          </View>
          <Text className="font-bold text-gray-800 text-xs text-center">100% Original</Text>
        </View>

        <View className="w-[48%] items-center mb-6">
          <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2 shadow-inner">
            <Feather name="truck" size={22} color="#2563eb" />
          </View>
          <Text className="font-bold text-gray-800 text-xs text-center">Fast Delivery</Text>
        </View>

        <View className="w-[48%] items-center">
          <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2 shadow-inner">
            <Feather name="shield" size={22} color="#2563eb" />
          </View>
          <Text className="font-bold text-gray-800 text-xs text-center">Secure Pay</Text>
        </View>

        <View className="w-[48%] items-center">
          <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2 shadow-inner">
            <Feather name="user" size={22} color="#2563eb" />
          </View>
          <Text className="font-bold text-gray-800 text-xs text-center">Expert Support</Text>
        </View>
      </View>

      <View className="px-4 mb-4">
        <Text className="text-2xl font-black text-gray-900 tracking-tight">Trending Now</Text>
        <Text className="text-gray-500 font-medium mt-1">Top components chosen by our engineers.</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row items-center justify-between shadow-sm z-10">
        <Text className="text-3xl font-black text-gray-900 tracking-tight">
          SK<Text className="text-blue-600">.</Text>
        </Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => navigation.navigate('ProductDetails', { product: item })} 
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
