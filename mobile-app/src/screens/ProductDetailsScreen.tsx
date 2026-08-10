import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { Feather, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }: any) {
  const { product } = route.params;
  const addItem = useCartStore((state) => state.addItem);
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Gallery Logic
  const baseImage = product.image_url || product.img || product.images?.[0];
  const galleryImages = baseImage ? [baseImage] : [];
  if (product.images && product.images.length > 1) {
    galleryImages.push(...product.images.slice(1));
  }

  const categoryName = product.category || 'Component';
  const description = product.description || product.desc || 'No description available for this product.';
  const rating = product.rating || 0;
  const reviewCount = product.reviews || 0;
  const sku = product.sku || product.id?.slice(0, 8).toUpperCase() || 'N/A';

  const specs = product.specs || [];
  const features = product.features || [];

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigation.navigate('MainTabs', { screen: 'Cart' });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white z-10 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Feather name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 truncate max-w-[200px]" numberOfLines={1}>{product.name}</Text>
        <TouchableOpacity className="p-2">
          <Feather name="heart" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        
        {/* Gallery */}
        <View className="bg-gray-50 items-center justify-center border-b border-gray-100">
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
              if (slide !== activeImageIndex && slide >= 0 && slide < galleryImages.length) {
                setActiveImageIndex(slide);
              }
            }}
            scrollEventThrottle={16}
          >
            {galleryImages.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={{ width, height: width }}
                resizeMode="contain"
                className="mix-blend-multiply"
              />
            ))}
          </ScrollView>
          <View className="flex-row gap-2 absolute bottom-4">
            {galleryImages.map((_, idx) => (
              <View key={idx} className={`w-2 h-2 rounded-full ${idx === activeImageIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'}`} />
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View className="p-6">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{categoryName}</Text>
          <Text className="text-2xl font-black text-gray-900 leading-tight mb-4">{product.name}</Text>
          
          <View className="flex-row items-center gap-4 mb-4">
            <Text className="text-gray-500 font-medium">SKU: {sku}</Text>
          </View>

          <View className="flex-row items-baseline gap-2 mb-6">
            <Text className="text-3xl font-black text-gray-900">₹{Number(product.price).toFixed(2)}</Text>
            {product.stock > 0 ? (
              <View className="bg-green-50 px-2 py-1 rounded border border-green-100">
                <Text className="text-green-700 text-[10px] font-bold uppercase">In Stock ({product.stock})</Text>
              </View>
            ) : (
              <View className="bg-red-50 px-2 py-1 rounded border border-red-100">
                <Text className="text-red-700 text-[10px] font-bold uppercase">Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Guarantees Grid */}
          <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
            <View className="flex-row items-center w-[48%]">
              <Feather name="truck" size={16} color="#9ca3af" className="mr-2" />
              <Text className="text-gray-600 text-sm font-medium ml-2">Fast Delivery</Text>
            </View>
            <View className="flex-row items-center w-[48%]">
              <Feather name="shield" size={16} color="#9ca3af" className="mr-2" />
              <Text className="text-gray-600 text-sm font-medium ml-2">1 Year Warranty</Text>
            </View>
            <View className="flex-row items-center w-[48%]">
              <Feather name="refresh-cw" size={16} color="#9ca3af" className="mr-2" />
              <Text className="text-gray-600 text-sm font-medium ml-2">30-Day Returns</Text>
            </View>
            <View className="flex-row items-center w-[48%]">
              <Feather name="check-circle" size={16} color="#9ca3af" className="mr-2" />
              <Text className="text-gray-600 text-sm font-medium ml-2">100% Genuine</Text>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row border-b border-gray-200 mb-6">
            {['Overview', 'Specifications'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                className="mr-8 pb-3 relative"
              >
                <Text className={`font-bold ${activeTab === tab ? 'text-blue-600' : 'text-gray-500'}`}>{tab}</Text>
                {activeTab === tab && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'Overview' ? (
            <View>
              <Text className="text-gray-700 leading-relaxed mb-6 text-sm">{description}</Text>
              {features.length > 0 && (
                <>
                  <Text className="text-lg font-bold text-gray-900 mb-4">Key Features</Text>
                  {features.map((feature: string, idx: number) => (
                    <View key={idx} className="flex-row items-start mb-2 pr-4">
                      <View className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-3" />
                      <Text className="text-gray-700 text-sm">{feature}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          ) : (
            <View className="border border-gray-200 rounded-lg">
              {specs.length > 0 ? (
                specs.map((spec: any, idx: number) => (
                  <View key={idx} className={`flex-row justify-between p-4 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${idx !== specs.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <Text className="text-gray-500 font-medium w-1/3">{spec.label}</Text>
                    <Text className="text-gray-900 font-bold flex-1">{spec.value}</Text>
                  </View>
                ))
              ) : (
                <View className="p-4 bg-gray-50">
                  <Text className="text-gray-500 text-sm text-center">No technical specifications available for this product.</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="p-4 bg-white border-t border-gray-200 shadow-lg">
        
        <View className="flex-row items-center gap-4 mb-4">
          <Text className="text-gray-600 text-sm font-bold">Qty:</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg h-11 w-32">
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 items-center justify-center border-r border-gray-200 h-full">
              <Text className="text-xl font-bold text-gray-600">-</Text>
            </TouchableOpacity>
            <View className="flex-1 items-center justify-center">
              <Text className="font-bold text-gray-900">{quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} className="w-10 items-center justify-center border-l border-gray-200 h-full">
              <Text className="text-xl font-bold text-gray-600">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-1 py-3.5 rounded-xl items-center justify-center flex-row border-2 border-gray-900 bg-white"
            disabled={product.stock <= 0}
            onPress={handleAddToCart}
          >
            <Feather name="shopping-cart" size={18} color="#111827" className="mr-2" />
            <Text className="text-gray-900 font-bold ml-2">Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3.5 rounded-xl items-center justify-center border-2 ${product.stock > 0 ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-gray-300'}`}
            disabled={product.stock <= 0}
            onPress={handleBuyNow}
          >
            <Text className="text-white font-bold">Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}
