"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const emptyForm = {
  name: '',
  sku: '',
  price: '',
  stock: '',
  category_id: '',
  image_url: ''
};

// Define our TypeScript interfaces based on your database schema
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  img?: string | null;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductManager() {
  const supabase = createClient();

  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState(emptyForm);

  // Fetch initial data on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch Products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!productsError && productsData) setProducts(productsData);

    // Fetch Categories for the dropdown
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name');
      
    if (!categoriesError && categoriesData) setCategories(categoriesData);
    
    setIsLoading(false);
  };

  // Open modal for a NEW product
  const handleAddNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  // Open modal to EDIT an existing product
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id || '',
      image_url: product.image_url || ''
    });
    setIsModalOpen(true);
  };

  // Delete a product
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this component?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert('Error deleting product.');
    }
  };

  // Save (Insert or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category_id: formData.category_id || null,
      image_url: formData.image_url || null
    };

    if (editingId) {
      // UPDATE existing
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (!error) {
        setIsModalOpen(false);
        await fetchData();
      } else {
        alert('Supabase Error: ' + error.message);
        console.error('Full Error:', error);
      }
    } else {
      // INSERT new
      const { error } = await supabase.from('products').insert([payload]);
      if (!error) {
        setIsModalOpen(false);
        await fetchData();
      } else {
        alert('Supabase Error: ' + error.message);
        console.error('Full Error:', error);
      }
    }
    
    setIsSaving(false);
  };

  return (
    <div className="p-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Product Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your storefront catalog and stock levels.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
        >
          + Add Component
        </button>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Loading inventory...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-bold text-gray-900 mb-2">No products found</p>
            <p>Click "Add Component" to stock your first item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const imageSrc = product.image_url || product.img || '';
                  return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                        {imageSrc ? (
                          <img src={imageSrc} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-xs">No Img</span>
                        )}
                      </div>
                      <span className="font-bold text-gray-900">{product.name}</span>
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-500">{product.sku}</td>
                    <td className="p-4 font-bold text-gray-900">₹{product.price}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 font-bold text-sm">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 font-bold text-sm">Delete</button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Overlay for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">
                {editingId ? 'Edit Component' : 'Add New Component'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 font-bold text-xl">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="e.g. 555 Timer IC" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">SKU (Unique ID) *</label>
                    <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono" placeholder="IC-555-DIP8" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹) *</label>
                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="25.00" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity *</label>
                    <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white">
                    <option value="">Select a category (Optional)</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="https://example.com/image.jpg" />
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button type="submit" form="productForm" disabled={isSaving} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-400 active:scale-95">
                {isSaving ? 'Saving...' : 'Save Component'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}