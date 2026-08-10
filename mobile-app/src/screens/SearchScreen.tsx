import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Feather } from '@expo/vector-icons';

export default function SearchScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          short_description,
          category_id,
          categories ( id, name, slug ),
          brands ( name ),
          product_variants ( id, base_price, sale_price, sku, inventory ( quantity ) ),
          product_images ( url ),
          created_at
        `)
        .eq('is_published', true);

      if (prodError) throw prodError;

      // Flatten products
      const formattedProducts = (prodData || []).map((item: any) => {
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

      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (!catError && catData) {
        setCategories([{ id: 'all', name: 'All Categories' }, ...catData]);
      } else {
        setCategories([{ id: 'all', name: 'All Categories' }]);
      }

    } catch (error) {
      console.error('Error fetching search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Category filter
      let categoryMatch = true;
      if (selectedCategory && selectedCategory !== 'All Categories') {
        categoryMatch = (
          product.category === selectedCategory ||
          product.categories?.name === selectedCategory
        );
      }
      
      // 2. Search filter
      let searchMatch = true;
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        searchMatch = (
          (product.name || '').toLowerCase().includes(term) ||
          (product.description || '').toLowerCase().includes(term) ||
          (product.sktPartNo || '').toLowerCase().includes(term)
        );
      }

      return categoryMatch && searchMatch;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header & Search Bar */}
      <View className="px-4 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
        <Text className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Browse Shop</Text>
        <View className="relative">
          <View className="absolute left-4 top-3.5 z-10">
            <Feather name="search" size={20} color="#9ca3af" />
          </View>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-10 py-3 text-gray-900 font-medium text-base"
            placeholder="Search components, SKUs..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              className="absolute right-4 top-3.5 z-10"
              onPress={() => setSearchQuery('')}
            >
              <Feather name="x-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Pill Scroller */}
      <View className="bg-white border-b border-gray-100">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="py-3 px-4"
          contentContainerStyle={{ paddingRight: 32 }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id || cat.name}
                className={`px-4 py-2 rounded-full mr-2 border ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-200'
                }`}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Text className={`font-bold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Header */}
      <View className="px-4 py-4 bg-gray-50 flex-row justify-between items-center border-b border-gray-100">
        <Text className="font-bold text-gray-900">
          {searchQuery ? `Results for "${searchQuery}"` : selectedCategory}
        </Text>
        <Text className="text-gray-500 font-medium text-sm">
          {filteredProducts.length} items
        </Text>
      </View>

      {/* Product Grid */}
      {loading ? (
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              onPress={() => navigation.navigate('ProductDetails', { product: item })} 
            />
          )}
          showsVerticalScrollIndicator={false}
          className="bg-gray-50"
        />
      ) : (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
          <Feather name="box" size={48} color="#d1d5db" />
          <Text className="text-xl font-black text-gray-900 mt-4 mb-2 text-center">No components found</Text>
          <Text className="text-gray-500 text-center font-medium">
            We couldn't find anything matching your criteria.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
