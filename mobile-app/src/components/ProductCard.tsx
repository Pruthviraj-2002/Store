import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useCartStore } from '../store/cartStore';

export default function ProductCard({ product, onPress }: { product: any, onPress?: () => void }) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  
  const cartItem = items.find((item) => item.id === product.id);
  const qtyInCart = cartItem ? cartItem.qty : 0;
  
  const imageUrl = product.image_url || product.img || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80';

  return (
    <TouchableOpacity 
      className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm m-2 overflow-hidden"
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Image Section */}
      <View className="bg-gray-50 pt-[85%] relative items-center justify-center w-full">
        <Image 
          source={{ uri: imageUrl }} 
          className="absolute top-0 bottom-0 left-0 right-0 m-4"
          resizeMode="contain"
        />
        {product.stock > 0 && product.stock <= 10 && (
          <View className="absolute top-3 left-3 bg-red-600 px-2 py-0.5 rounded-full z-10">
            <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
              Only {product.stock} Left
            </Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="p-4 flex-1">
        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          {product.category || 'Component'}
        </Text>
        <Text className="font-bold text-gray-900 text-sm leading-snug mb-3" numberOfLines={2}>
          {product.name}
        </Text>

        <View className="mt-auto flex-row items-center justify-between pt-3 border-t border-gray-100">
          <View>
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</Text>
            <Text className="text-lg font-black text-gray-900 tracking-tight">
              ₹{Number(product.price).toFixed(2)}
            </Text>
          </View>

          <View>
            {qtyInCart > 0 ? (
              <View className="flex-row items-center justify-between bg-blue-50 rounded-xl border border-blue-100 overflow-hidden h-9 w-[90px]">
                <TouchableOpacity 
                  className="px-2 h-full justify-center items-center"
                  onPress={() => qtyInCart === 1 ? removeItem(product.id) : updateQuantity(product.id, qtyInCart - 1)}
                >
                  <Text className="text-blue-600 font-bold text-lg">-</Text>
                </TouchableOpacity>
                <Text className="text-sm font-bold text-blue-900 w-6 text-center">
                  {qtyInCart}
                </Text>
                <TouchableOpacity 
                  className="px-2 h-full justify-center items-center"
                  onPress={() => updateQuantity(product.id, qtyInCart + 1)}
                >
                  <Text className="text-blue-600 font-bold text-lg">+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                className="bg-gray-900 h-9 px-4 rounded-xl items-center justify-center shadow-sm"
                onPress={() => addItem(product)}
              >
                <Text className="text-white font-bold text-xs">Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
