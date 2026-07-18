import React from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';

// Make sure your interface accepts the slug!
interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  img?: string;
  category?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    // This stops the click from navigating to the product page when they just want to add to cart
    e.preventDefault(); 
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock',
      img: product.image_url || product.img || '',
    };
    addToCart(cartItem, 1);
    alert('Added to cart!');
  };

  // Determine the correct URL path (prefer slug, fallback to ID)
  const productUrl = `/product/${product.slug || product.id}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative group">
      
      {/* 1. THE LINK WRAPPER: Clicking the image goes to the product page */}
      <Link href={productUrl} className="block relative pt-[100%] bg-white border-b border-gray-100 overflow-hidden">
        <img 
          src={product.image_url || product.img || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 mb-1">{product.category || 'Hardware'}</p>
        
        {/* 2. THE TITLE LINK: Clicking the title goes to the product page */}
        <Link href={productUrl} className="block mb-2">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-[#0d52bc] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-gray-900">₹{Number(product.price).toFixed(2)}</span>
          </div>
          
          {/* Add to Cart Button (isolated so it doesn't trigger navigation) */}
          <button 
            onClick={handleAddToCart}
            className="p-2 bg-gray-50 hover:bg-[#0d52bc] hover:text-white text-gray-600 rounded border border-gray-200 hover:border-[#0d52bc] transition-colors"
            title="Add to Cart"
          >
            <ShoppingCartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}