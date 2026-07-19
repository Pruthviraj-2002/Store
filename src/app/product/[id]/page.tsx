"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRightIcon,
  HeartIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { StarIcon, CheckCircleIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  slug?: string;
  brand?: string;
  name: string;
  category?: string;
  desc?: string;
  description?: string;
  price: number;
  stock: number;
  mfrPartNo?: string;
  sktPartNo?: string;
  sku?: string;
  rating?: number;
  reviews?: number;
  questions?: number;
  image_url?: string | null;
  img?: string | null;
  images?: string[];
  features?: string[];
  specs?: Array<{ label: string; value: string }>;
  categories?: { name?: string | null; slug?: string | null };
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, showToast } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    void loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to load products');
      const items = Array.isArray(result) ? result : result.products || [];
      setProducts(items);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
  }, [params.id]);

  const product = useMemo(() => {
    return products.find((item) => item.slug === params.id || item.id === params.id) ?? null;
  }, [products, params.id]);

  const galleryImages = useMemo(() => {
    const images = [product?.image_url || product?.img || product?.images?.[0] || ''].filter(Boolean);
    if (images.length === 1) {
       images.push('https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80');
       images.push('https://images.unsplash.com/photo-1559819614-81fea9efd090?w=600&q=80');
    }
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'];
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      name: product.name,
      desc: product.desc || product.description || '',
      price: Number(product.price) || 0,
      stock: product.stock > 0 ? `In stock (${product.stock} units)` : 'Out of stock',
      img: product.image_url || product.img || product.images?.[0] || '',
    };
    addToCart(cartItem, quantity);
    showToast(`${quantity}x ${product.name} added to cart!`, 'success');
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      name: product.name,
      desc: product.desc || product.description || '',
      price: Number(product.price) || 0,
      stock: product.stock > 0 ? `In stock (${product.stock} units)` : 'Out of stock',
      img: product.image_url || product.img || product.images?.[0] || '',
    };
    addToCart(cartItem, quantity);
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="grow flex flex-col items-center justify-center p-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-8 w-8 border-b-2 border-indigo-600"
          />
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="grow flex flex-col items-center justify-center p-8">
          <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Product Not Found</h1>
          <Link href="/shop" className="block text-center mt-6 bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
            Return to Shop
          </Link>
        </main>
      </div>
    );
  }

  const categoryName = product.categories?.name || product.category || 'Microcontrollers';
  const description = product.description || product.desc || 'A premium quality component built for the highest performance standards, trusted by professionals worldwide for reliability and durability.';
  
  const specs = product.specs || [
    { label: 'Core', value: 'High Performance' },
    { label: 'Architecture', value: 'Next-Gen' },
    { label: 'Speed', value: 'Ultra Fast' },
    { label: 'Power Consumption', value: 'Low' },
    { label: 'Operating Temperature', value: '-40°C to +85°C' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="grow max-w-[1200px] w-full mx-auto px-4 md:px-8 py-6 lg:py-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs mb-6 gap-2 text-gray-500 font-medium tracking-wide flex-wrap">
          <Link href="/" className="hover:text-indigo-600 transition-colors">HOME</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link href="/shop" className="hover:text-indigo-600 transition-colors">SHOP</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link href="/shop" className="hover:text-indigo-600 transition-colors uppercase">{categoryName}</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-gray-900 uppercase truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
          
          {/* Gallery (5 cols) - Streamlined and professional */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative bg-[#f8f9fa] rounded-xl border border-gray-200 aspect-square flex items-center justify-center overflow-hidden p-6">
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-all border border-gray-200 z-10 shadow-sm">
                <HeartIcon className="h-5 w-5" />
              </button>
              <img 
                src={galleryImages[activeImage]} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>
            
            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 -mx-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 shrink-0 rounded-lg bg-[#f8f9fa] p-1.5 flex items-center justify-center transition-all overflow-hidden ${activeImage === idx ? 'ring-2 ring-indigo-600' : 'border border-gray-200 hover:border-indigo-400'}`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details (7 cols) - Dense, professional, non-boxy */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Title & Status */}
            <div className="mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 4.8) ? 'text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-gray-700">{product.rating || 4.8}</span>
                </div>
                <span className="text-gray-300">|</span>
                <Link href="#reviews" className="text-gray-500 hover:text-indigo-600 font-medium">
                  {product.reviews || 128} Reviews
                </Link>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 font-medium">SKU: {product.sku || product.id.slice(0,8).toUpperCase()}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              {description}
            </p>

            {/* Action Bar (Clean, integrated, no massive card) */}
            <div className="py-6 border-y border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                
                {/* Price */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Unit Price</p>
                    {product.stock > 0 ? (
                      <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-green-100">In Stock ({product.stock})</span>
                    ) : (
                      <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-100">Out of Stock</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900">₹{Number(product.price).toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm font-bold">Qty:</span>
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden h-11 w-32">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 shrink-0 h-full bg-gray-50 hover:bg-gray-200 text-gray-800 transition-colors font-bold text-lg border-r border-gray-200 flex items-center justify-center">−</button>
                    <input type="text" value={quantity} readOnly className="w-12 text-center text-sm font-bold text-gray-900 bg-transparent outline-none p-0 border-none ring-0" />
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 shrink-0 h-full bg-gray-50 hover:bg-gray-200 text-gray-800 transition-colors font-bold text-lg border-l border-gray-200 flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>

              {/* Buttons (Creative Black) */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart} 
                  className="flex-1 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <ShoppingCartIcon className="h-5 w-5" /> Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow} 
                  className="flex-1 bg-gray-900 text-white hover:bg-black font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Guarantees List */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-gray-400" /> Fast Delivery
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-gray-400" /> 1 Year Warranty
              </div>
              <div className="flex items-center gap-2">
                <ArrowPathIcon className="h-4 w-4 text-gray-400" /> 30-Day Returns
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-gray-400" /> 100% Genuine
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM TABS SECTION - Flat and professional */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          
          {/* Tab Headers */}
          <div className="flex items-center border-b border-gray-200 overflow-x-auto no-scrollbar gap-8 mb-8">
            {['Overview', 'Specifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'Overview' && (
                <motion.div 
                  key="Overview"
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About this product</h3>
                    <p className="text-gray-700 leading-relaxed mb-4 text-sm">{description}</p>
                    <p className="text-gray-700 leading-relaxed text-sm mb-8">Designed for maximum efficiency and robust performance in demanding environments. This component represents the pinnacle of modern engineering.</p>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Key Features</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                      {(product.features || [
                        'High-quality materials ensuring longevity',
                        'Strict quality control and testing',
                        'Optimized for superior performance',
                        'Easy integration into existing setups'
                      ]).map((feature, idx) => (
                        <li key={idx} className="pl-1 leading-relaxed">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-xl">Quick Specs</h4>
                    <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                      {specs.slice(0, 5).map((spec, idx) => (
                        <li key={idx} className="flex justify-between items-center p-3 text-sm">
                          <span className="text-gray-500 font-medium">{spec.label}</span>
                          <span className="text-gray-900 font-bold">{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Specifications' && (
                <motion.div 
                  key="Specifications"
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
                  <table className="w-full text-sm text-left text-gray-700">
                    <tbody className="divide-y divide-gray-200 border-t border-b border-gray-200">
                      {specs.map((spec, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                          <th className="py-3 px-4 font-medium text-gray-500 w-1/3">{spec.label}</th>
                          <td className="py-3 px-4 font-bold text-gray-900">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}