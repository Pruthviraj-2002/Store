"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useStore } from '@/store/useStore';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon,
  HeartIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  BoltIcon,
  ClockIcon,
  TruckIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// --- COMPREHENSIVE MOCK DATABASE ---
const ALL_PRODUCTS = [
  {
    id: "p1",
    brand: "Arduino",
    name: "Arduino Uno R3",
    category: "Development Boards",
    desc: "The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, an ICSP header and a reset button.",
    price: 850.00,
    stock: "In Stock (50 units)",
    mfrPartNo: "A000066",
    sktPartNo: "SKT-ARD-001",
    rating: 4.9,
    reviews: 342,
    questions: 56,
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&q=80"
    ],
    features: [
      "Microcontroller: ATmega328P",
      "Operating Voltage: 5V",
      "Input Voltage (recommended): 7-12V",
      "Digital I/O Pins: 14 (of which 6 provide PWM output)",
      "Analog Input Pins: 6",
      "Clock Speed: 16 MHz"
    ],
    specs: [
      { label: "Microcontroller", value: "ATmega328P" },
      { label: "Architecture", value: "AVR" },
      { label: "Operating Voltage", value: "5V" },
      { label: "Flash Memory", value: "32 KB" },
      { label: "SRAM", value: "2 KB" },
      { label: "Clock Speed", value: "16 MHz" },
    ]
  },
  {
    id: "p2",
    brand: "Espressif Systems",
    name: "ESP32 Dev Board",
    category: "Development Boards",
    desc: "ESP32 is a low-cost, low-power system on a chip (SoC) series with Wi-Fi & dual-mode Bluetooth capabilities. Perfect for IoT applications.",
    price: 320.00,
    stock: "In Stock (120 units)",
    mfrPartNo: "ESP32-WROOM-32",
    sktPartNo: "SKT-ESP-002",
    rating: 4.8,
    reviews: 215,
    questions: 45,
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
    ],
    features: [
      "Dual-core Xtensa 32-bit LX6 microprocessor",
      "Integrated 802.11b/g/n Wi-Fi",
      "Integrated dual-mode Bluetooth (classic and BLE)",
      "Ultra-low power management",
      "Rich peripheral interfaces"
    ],
    specs: [
      { label: "Processor", value: "Xtensa Dual-Core 32-bit LX6" },
      { label: "Clock Frequency", value: "Up to 240 MHz" },
      { label: "ROM", value: "448 KB" },
      { label: "SRAM", value: "520 KB" },
      { label: "Wireless", value: "Wi-Fi 802.11 b/g/n + Bluetooth 4.2 BLE" },
    ]
  },
  {
    id: "p3",
    brand: "YAGEO",
    name: "10K Ohm Resistor",
    category: "Passive Components",
    desc: "1/4W 10K Ohm Through Hole Carbon Film Resistor with 5% tolerance. Essential for basic circuit building, pull-up/pull-down configurations.",
    price: 0.25,
    stock: "In Stock (10,000+ units)",
    mfrPartNo: "CFR-25JB-52-10K",
    sktPartNo: "SKT-RES-10K",
    rating: 4.5,
    reviews: 89,
    questions: 12,
    images: [
      "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&q=80"
    ],
    features: [
      "Resistance: 10K Ohm",
      "Power Rating: 1/4 W (0.25 W)",
      "Tolerance: ±5%",
      "Type: Carbon Film",
      "Mounting Type: Through Hole"
    ],
    specs: [
      { label: "Resistance", value: "10 kOhms" },
      { label: "Power (Watts)", value: "0.25W, 1/4W" },
      { label: "Tolerance", value: "±5%" },
      { label: "Composition", value: "Carbon Film" },
      { label: "Package / Case", value: "Axial" },
    ]
  },
  {
    id: "p4",
    brand: "KEMET",
    name: "10uF Capacitor",
    category: "Passive Components",
    desc: "10uF 50V Aluminum Electrolytic Capacitor. Radial, Can type. Excellent for power supply filtering and decoupling.",
    price: 2.50,
    stock: "In Stock (5,000 units)",
    mfrPartNo: "ESK106M050AC3AA",
    sktPartNo: "SKT-CAP-10U",
    rating: 4.7,
    reviews: 112,
    questions: 8,
    images: [
      "https://images.unsplash.com/photo-1580828343064-fde4cad202d5?w=600&q=80"
    ],
    features: [
      "Capacitance: 10 µF",
      "Voltage Rating: 50 V",
      "Tolerance: ±20%",
      "Operating Temperature: -40°C to 85°C",
      "Mounting Type: Through Hole"
    ],
    specs: [
      { label: "Capacitance", value: "10 µF" },
      { label: "Voltage - Rated", value: "50 V" },
      { label: "Tolerance", value: "±20%" },
      { label: "Mounting Type", value: "Through Hole" },
      { label: "Package / Case", value: "Radial, Can" },
    ]
  }
];

export default function ProductDetailsPage() {
  const params = useParams(); 
  const router = useRouter();
  const { addToCart } = useStore();
  
  // 1. Find the specific product based on the URL ID
  const product = ALL_PRODUCTS.find(p => p.id === params.id) || ALL_PRODUCTS[0]; 
  
  // 2. Get Related Products (Exclude current product, grab up to 3)
  const relatedProducts = ALL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const [quantity, setQuantity] = useState(1);

  // --- Handlers ---
  const handleAddToCart = () => {
    // Format data for the global cart
    const cartItem = {
      id: product.id,
      name: product.name,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      img: product.images[0]
    };
    addToCart(cartItem, quantity);
    alert("Added to Cart!");
    setQuantity(1);
  };

  const handleBuyNow = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      img: product.images[0]
    };
    addToCart(cartItem, quantity);
    router.push('/checkout');
  };

  // --- ERROR STATE: Product Not Found ---
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="grow flex flex-col items-center justify-center p-8">
          <MagnifyingGlassIcon className="h-20 w-20 text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The component you are looking for does not exist or has been removed.</p>
          <Link href="/shop" className="bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700 transition-colors">
            Return to Shop
          </Link>
        </main>
      </div>
    );
  }

  // --- SUCCESS STATE: Product Found ---
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="grow max-w-[1600px] w-full mx-auto px-4 md:px-8 py-6">
        
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center text-sm mb-6 gap-2 text-gray-500 flex-wrap">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link href="/shop" className="text-blue-600 hover:underline">Electronic Components</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link href="/shop" className="text-blue-600 hover:underline">{product.category}</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* TOP SECTION: 3 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* COLUMN 1: Image Gallery */}
          <div className="lg:col-span-4 relative border border-gray-100 rounded-xl p-4 bg-white">
            <button className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors z-10">
              <HeartIcon className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Main Image */}
            <div className="h-100 w-full flex items-center justify-center mb-4 p-4">
              <img src={product.images[activeImage]} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply transition-opacity duration-300" />
            </div>

            {/* Thumbnails row */}
            {product.images.length > 1 && (
              <div className="flex items-center justify-between gap-2">
                <button className="p-1 rounded border border-gray-200 hover:bg-gray-50"><ChevronLeftIcon className="h-5 w-5 text-gray-600" /></button>
                <div className="flex gap-3 overflow-hidden px-1">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`h-16 w-16 rounded border shrink-0 p-1 flex items-center justify-center transition-all ${activeImage === idx ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
                <button className="p-1 rounded border border-gray-200 hover:bg-gray-50"><ChevronRightIcon className="h-5 w-5 text-gray-600" /></button>
              </div>
            )}
          </div>

          {/* COLUMN 2: Product Details */}
          <div className="lg:col-span-5 flex flex-col pt-2">
            
            {/* Brand Header */}
            <div className="flex items-center gap-4 mb-2">
              <span className="font-bold text-blue-800 text-sm tracking-wide bg-blue-50 px-2 py-1 rounded">{product.brand}</span>
              <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4" /> {product.stock}
              </p>
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 text-base mb-6">{product.desc}</p>

            {/* Part Numbers & Ratings */}
            <div className="space-y-2 text-sm mb-6 border-b border-gray-100 pb-6">
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-500">Mfr. Part No.:</span>
                <span className="col-span-2 text-gray-900 font-medium">{product.mfrPartNo}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-500">SKT Part No.:</span>
                <span className="col-span-2 text-gray-900 font-medium">{product.sktPartNo}</span>
              </div>
              
              <div className="flex items-center gap-2 pt-2 mt-2">
                <div className="flex text-yellow-400">
                  <StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" />
                </div>
                <span className="font-bold text-gray-900">{product.rating}</span>
                <span className="text-gray-300">|</span>
                <Link href="#" className="text-blue-600 hover:underline">{product.reviews} reviews</Link>
                <span className="text-gray-300">|</span>
                <Link href="#" className="text-gray-500 hover:underline">{product.questions} answered questions</Link>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2 mb-4">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 3: Sticky Action Card */}
          <div className="lg:col-span-3">
            <div className="bg-[#fafafa] border border-gray-200 rounded-xl p-6 sticky top-28 shadow-sm">
              
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900">₹{product.price.toFixed(2)}</span>
                <p className="text-xs text-gray-500 mt-1">(Incl. of all taxes)</p>
                <p className="text-sm font-bold text-gray-900 mt-4 mb-2">Unit Price (per piece)</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center border border-gray-300 rounded overflow-hidden w-32 bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 font-bold border-r border-gray-300 transition-colors flex-1"
                  >
                    −
                  </button>
                  <input type="text" value={quantity} readOnly className="w-10 text-center font-bold text-gray-900 outline-none bg-white" />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 font-bold border-l border-gray-300 transition-colors flex-1"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500">Min. Order: 1</span>
              </div>

              {/* Buttons */}
              <div className="space-y-3 mb-8 border-b border-gray-200 pb-8">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-[#0d52bc] hover:bg-blue-800 text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="h-5 w-5" /> Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-white hover:bg-blue-50 border border-[#0d52bc] text-[#0d52bc] font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <BoltIcon className="h-5 w-5" /> Buy Now
                </button>
              </div>

              {/* Delivery Check */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-sm font-bold text-gray-900 whitespace-nowrap">Check Delivery</span>
                  <div className="flex items-center w-full relative">
                    <input type="text" placeholder="Enter Pincode" className="w-full text-sm py-2 pl-3 pr-16 border border-gray-300 rounded outline-none focus:border-blue-600 text-gray-900 bg-white" />
                    <button className="absolute right-2 text-sm font-bold text-blue-600 hover:text-blue-800">Check</button>
                  </div>
                </div>
                
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2"><ClockIcon className="h-5 w-5 text-green-600" /> Order within 4h 32m for same day dispatch</div>
                  </li>
                  <li className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2"><TruckIcon className="h-5 w-5 text-green-600" /> Delivery by 24 May to 110001</div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Tabs & Related Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area (Tabs) */}
          <div className="lg:col-span-8 border border-gray-200 rounded-xl bg-white overflow-hidden">
            
            {/* Tab Headers */}
            <div className="flex items-center gap-8 px-6 border-b border-gray-200 overflow-x-auto">
              {['Overview', 'Specifications', `Reviews (${product.reviews})`, `Q&A (${product.questions})`].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              
              {/* Left Side: Descriptions */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Product Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {product.desc}
                  </p>
                </div>
              </div>

              {/* Right Side: Specs Table */}
              <div className="flex-1">
                <div className="border border-gray-200 rounded text-sm">
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="flex border-b border-gray-200 last:border-0">
                      <div className="w-1/2 bg-[#f8f9fa] p-3 text-gray-600 border-r border-gray-200 font-medium">{spec.label}</div>
                      <div className="w-1/2 p-3 text-gray-900">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Dynamic Related Products */}
          <div className="lg:col-span-4 bg-[#fafafa] border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">You May Also Like</h3>
            
            <div className="space-y-4">
              {relatedProducts.map((item, idx) => (
                <Link href={`/product/${item.id}`} key={idx}>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 flex gap-4 hover:border-blue-300 transition-colors cursor-pointer shadow-sm mb-4">
                    <div className="h-16 w-16 bg-gray-50 rounded flex items-center justify-center p-1 shrink-0">
                      <img src={item.images[0]} alt={item.name} className="max-h-full max-w-full mix-blend-multiply object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{item.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-gray-900 text-sm">₹{item.price.toFixed(2)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}