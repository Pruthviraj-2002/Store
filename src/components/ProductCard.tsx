import React from 'react';
import Link from 'next/link';
import { ShoppingCartIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';

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
  const { cartItems, addToCart, updateQuantity, removeFromCart, setQuickViewProduct, showToast } = useStore();

  const cartItem = cartItems.find((item) => item.id === product.id);
  const qtyInCart = cartItem ? cartItem.qty : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock',
      img: product.image_url || product.img || '',
    };
    addToCart(item, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div 
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer overflow-hidden"
      onClick={() => setQuickViewProduct(product)}
    >
      
      {/* --- FOCUSED IMAGE SECTION --- */}
      <div className="relative bg-[#f8f9fa] pt-[85%] w-full flex items-center justify-center overflow-hidden">
        {/* Product Image */}
        <img 
          src={product.image_url || product.img || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-contain p-3 sm:p-5 group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-multiply"
        />
        
        {/* Scarcity Badge */}
        {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
            Only {product.stock} Left
          </div>
        )}
      </div>

      {/* --- CONTENT & ACTION BAR SECTION --- */}
      <div className="p-5 flex flex-col flex-grow relative z-20 bg-white">
        
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{product.category || 'Component'}</p>
        
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Action Bar (Always Visible) */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</span>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              ₹{Number(product.price).toFixed(2)}
            </span>
          </div>

          <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            {qtyInCart > 0 ? (
              <div className="flex items-center justify-between bg-blue-50 rounded-xl border border-blue-100 overflow-hidden h-10 w-[100px]">
                <button 
                  onClick={() => qtyInCart === 1 ? removeFromCart(product.id) : updateQuantity(product.id, qtyInCart - 1)}
                  className="px-3 h-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center justify-center"
                >
                  <MinusIcon className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm font-bold text-blue-900 w-6 text-center">
                  {qtyInCart}
                </span>
                <button 
                  onClick={() => updateQuantity(product.id, qtyInCart + 1)}
                  className="px-3 h-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center justify-center"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="bg-gray-900 hover:bg-blue-600 text-white rounded-xl h-10 px-4 flex items-center gap-2 font-bold text-sm transition-colors shadow-sm"
              >
                <ShoppingCartIcon className="h-4 w-4" />
                Add
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}