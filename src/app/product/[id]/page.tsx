"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useStore } from '@/store/useStore';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  HeartIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { StarIcon, CheckCircleIcon, ClockIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// Using your exact existing interface
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
  const { addToCart } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const [quantity, setQuantity] = useState(1);

  // --- EXISTING LOGIC STARTS HERE ---
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
    // Adding mock images to match the 5-thumbnail look from the screenshot
    if (images.length === 1) {
       images.push('https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80');
       images.push('https://images.unsplash.com/photo-1559819614-81fea9efd090?w=600&q=80');
    }
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'];
  }, [product]);

  const relatedProducts = useMemo(() => products.filter((item) => item.id !== product?.id).slice(0, 3), [products, product?.id]);

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
    alert('Added to cart!');
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    router.push('/checkout');
  };
  // --- EXISTING LOGIC ENDS HERE ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="grow flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d52bc]" />
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="grow flex flex-col items-center justify-center p-8">
          <MagnifyingGlassIcon className="h-20 w-20 text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <Link href="/shop" className="bg-[#0d52bc] text-white font-bold py-3 px-8 rounded hover:bg-blue-800 transition-colors">
            Return to Shop
          </Link>
        </main>
      </div>
    );
  }

  const categoryName = product.categories?.name || product.category || 'Microcontrollers';
  const description = product.description || product.desc || 'A performance line 32-bit RISC core based microcontroller operating at a frequency of up to 72 MHz. Features rich peripherals and standard communication interfaces.';
  
  // Placeholder specs to match the table in your screenshot if DB is empty
  const specs = product.specs || [
    { label: 'Core', value: 'ARM Cortex-M3' },
    { label: 'Core Size', value: '32-bit' },
    { label: 'Speed', value: '72MHz' },
    { label: 'Flash Size', value: '64KB' },
    { label: 'RAM Size', value: '20KB' },
    { label: 'I/O Pins', value: '37' },
    { label: 'Package / Case', value: 'LQFP-48' },
    { label: 'Operating Voltage', value: '2.0V to 3.6V' },
    { label: 'Operating Temperature', value: '-40°C to +85°C' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />

      <main className="grow max-w-[1400px] w-full mx-auto px-4 md:px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs mb-6 gap-2 text-gray-500 flex-wrap">
          <Link href="/" className="text-[#0d52bc] hover:underline">Home</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link href="/shop" className="text-[#0d52bc] hover:underline">Electronic Components</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link href="/shop" className="text-[#0d52bc] hover:underline">{categoryName}</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* TOP SECTION: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Column 1: Image Gallery (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative border border-gray-200 rounded-lg p-6 bg-white flex-1 flex items-center justify-center min-h-[300px]">
              <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 border border-gray-200 shadow-sm">
                <HeartIcon className="h-5 w-5 text-gray-600" />
              </button>
              <img src={galleryImages[activeImage]} alt={product.name} className="max-h-full max-w-full object-contain" />
            </div>
            
            {galleryImages.length > 1 && (
              <div className="flex items-center justify-between gap-2 mt-4">
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-white shadow-sm"><ChevronLeftIcon className="h-4 w-4 text-gray-600" /></button>
                <div className="flex gap-3 overflow-x-auto px-1 no-scrollbar">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`h-16 w-16 rounded border shrink-0 bg-white p-1 flex items-center justify-center transition-all ${activeImage === idx ? 'border-[#0d52bc] ring-1 ring-[#0d52bc]' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-white shadow-sm"><ChevronRightIcon className="h-4 w-4 text-gray-600" /></button>
              </div>
            )}
          </div>

          {/* Column 2: Product Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col pt-2 px-2">
            <div className="flex items-center gap-4 mb-3">
              {/* Fake brand logo placeholder matching STMicroelectronics */}
              <div className="h-8 w-auto text-[#03234b] font-black text-2xl tracking-tighter italic">
                 {product.brand === 'Generic' ? 'ST' : product.brand}
              </div>
              <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4" /> In Stock ({product.stock} units)
              </p>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
            <p className="text-gray-600 text-sm mb-6">{product.sktPartNo || 'ARM 32-bit Cortex-M3 MCU, 72MHz, 64KB Flash, LQFP-48'}</p>

            <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Mfr. Part No.:</span>
                <span className="col-span-2 text-gray-900 font-medium">{product.mfrPartNo || product.name.replace(/\s+/g, '')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">SKT Part No.:</span>
                <span className="col-span-2 text-gray-900 font-medium">SKT-{product.sktPartNo || product.name.replace(/\s+/g, '')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Manufacturer:</span>
                <Link href="#" className="col-span-2 text-[#0d52bc] hover:underline font-medium">{product.brand || 'STMicroelectronics'}</Link>
              </div>
              
              <div className="flex items-center gap-2 pt-2 mt-2 text-sm">
                <div className="flex text-yellow-400">
                  <StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4 text-gray-300" />
                </div>
                <span className="font-bold text-gray-900">{product.rating || 4.8}</span>
                <Link href="#" className="text-[#0d52bc] hover:underline ml-2">{product.reviews || 125} reviews</Link>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">{product.questions || 32} answered questions</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2 mb-4">
                {product.features ? product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="h-1 w-1 rounded-full bg-gray-500 mt-2 shrink-0"></span>
                    {feature}
                  </li>
                )) : specs.slice(0, 6).map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="h-1 w-1 rounded-full bg-gray-500 mt-2 shrink-0"></span>
                    {spec.label}: {spec.value}
                  </li>
                ))}
              </ul>
              <Link href="#specs" className="text-[#0d52bc] text-sm font-medium hover:underline flex items-center gap-1">
                View More Details <ChevronRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Column 3: Buy Box (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</span>
                <p className="text-xs text-gray-500 mt-1">(Incl. of all taxes)</p>
                <p className="text-sm font-bold text-gray-900 mt-4 mb-2">Unit Price (per piece)</p>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center border border-gray-300 rounded overflow-hidden w-28 bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-r border-gray-300 transition-colors flex-1">−</button>
                  <input type="text" value={quantity} readOnly className="w-10 text-center text-sm font-medium text-gray-900 outline-none bg-white" />
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-l border-gray-300 transition-colors flex-1">+</button>
                </div>
                <span className="text-xs text-gray-500">Min. Order: 1</span>
              </div>

              <div className="space-y-3 mb-6">
                <button onClick={handleAddToCart} className="w-full bg-[#0d52bc] hover:bg-blue-800 text-white font-medium py-2.5 rounded transition-colors flex items-center justify-center gap-2">
                  <ShoppingCartIcon className="h-4 w-4" /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="w-full bg-white hover:bg-blue-50 border border-[#0d52bc] text-[#0d52bc] font-medium py-2.5 rounded transition-colors flex items-center justify-center gap-2">
                  Buy Now
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-sm font-bold text-gray-900 whitespace-nowrap">Check Delivery</span>
                </div>
                <div className="flex items-center w-full relative mb-4">
                  <input type="text" placeholder="Enter Pincode" className="w-full text-sm py-2 pl-3 pr-16 border border-gray-300 rounded outline-none focus:border-[#0d52bc] text-gray-900 bg-white" />
                  <button className="absolute right-2 text-sm font-medium text-[#0d52bc] hover:text-blue-800">Check</button>
                </div>

                <ul className="space-y-3 text-xs text-gray-600">
                  <li className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3"><ClockIcon className="h-4 w-4 text-green-600" /> Order within 4h 32m for same day dispatch</div>
                    <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                  </li>
                  <li className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3"><TruckIcon className="h-4 w-4 text-green-600" /> Delivery by 24 May to 110001</div>
                    <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                  </li>
                  <li className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3"><ShieldCheckIcon className="h-4 w-4 text-green-600" /> Free delivery for orders above ₹500</div>
                    <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                  </li>
                  <li className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3"><ArrowPathIcon className="h-4 w-4 text-green-600" /> 30 days easy returns</div>
                    <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="specs">
          
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-8 px-6 border-b border-gray-200 overflow-x-auto bg-white">
              {['Overview', 'Specifications', 'Documents', `Reviews (${product.reviews || 125})`, `Q&A (${product.questions || 32})`].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.split(' ')[0] || activeTab === tab ? 'border-[#0d52bc] text-[#0d52bc]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">{description}</p>
              
              <h3 className="text-lg font-bold text-gray-900 mb-4">Applications</h3>
              <ul className="space-y-2 mb-8 text-sm text-gray-600 list-disc pl-5">
                 <li>Industrial control</li>
                 <li>Consumer electronics</li>
                 <li>Medical devices</li>
                 <li>IoT and smart devices</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Specifications</h3>
              <div className="border border-gray-200 rounded text-sm overflow-hidden">
                {specs.map((spec, idx) => (
                  <div key={idx} className="flex border-b border-gray-200 last:border-0">
                    <div className="w-1/3 bg-[#f8f9fa] p-3 text-gray-700 border-r border-gray-200 font-medium">{spec.label}</div>
                    <div className="w-2/3 p-3 text-gray-900">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* You May Also Like Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-[#f8f9fa] rounded-lg">
            <h3 className="text-base font-bold text-gray-900 mb-4 px-1">You May Also Like</h3>

            <div className="space-y-3">
              {relatedProducts.length > 0 ? relatedProducts.map((item, idx) => (
                <Link href={`/product/${item.slug || item.id}`} key={idx}>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 hover:border-[#0d52bc] transition-colors cursor-pointer shadow-sm">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center p-1 shrink-0 border border-gray-100">
                      <img src={item.image_url || item.img || item.images?.[0] || ''} alt={item.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description || item.sktPartNo || 'Standard component'}</p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col justify-center items-end">
                      <div className="font-bold text-gray-900 text-sm mb-1">₹{Number(item.price).toFixed(2)}</div>
                      <p className="text-[10px] text-green-600 font-medium flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>In Stock</p>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="text-sm text-gray-500 italic p-4">No related components found.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}