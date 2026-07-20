"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createAdminClient } from '@/utils/supabase/client';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

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
  variant_id: string | null;
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
  const supabase = createAdminClient();

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
  const [newCategoryName, setNewCategoryName] = useState('');

  // Advanced UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  // Fetch initial data on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch Products with relations
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, category_id, product_variants(id, sku, base_price, inventory(quantity)), product_images(url)')
      .order('created_at', { ascending: false });
      
    if (!productsError && productsData) {
      const flattened = productsData.map((p: any) => {
        const variant = Array.isArray(p.product_variants) ? p.product_variants[0] : p.product_variants;
        const inv = variant ? (Array.isArray(variant.inventory) ? variant.inventory[0] : variant.inventory) : null;
        const img = Array.isArray(p.product_images) ? p.product_images[0] : p.product_images;
        
        return {
          id: p.id,
          variant_id: variant?.id || null,
          name: p.name,
          sku: variant?.sku || '',
          price: variant?.base_price || 0,
          stock: inv?.quantity || 0,
          category_id: p.category_id,
          image_url: img?.url || '',
        };
      });
      setProducts(flattened);
    } else if (productsError) {
      console.error(productsError);
    }

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

    if (editingId) {
      // UPDATE existing
      let finalCategoryId = formData.category_id || null;
      if (formData.category_id === 'NEW' && newCategoryName.trim() !== '') {
        const catSlug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const { data: newCat, error: catErr } = await supabase.from('categories').insert([{
          name: newCategoryName.trim(),
          slug: catSlug
        }]).select().single();
        
        if (catErr) {
          alert('Error creating new category: ' + catErr.message);
          setIsSaving(false);
          return;
        }
        finalCategoryId = newCat.id;
      }

      const currentProduct = products.find(p => p.id === editingId);
      const variant_id = currentProduct?.variant_id;

      const { error: pErr } = await supabase.from('products').update({
        name: formData.name,
        category_id: finalCategoryId,
      }).eq('id', editingId);

      if (!pErr && variant_id) {
         await supabase.from('product_variants').update({
           sku: formData.sku,
           base_price: parseFloat(formData.price),
         }).eq('id', variant_id);
         
         await supabase.from('inventory').update({
           quantity: parseInt(formData.stock)
         }).eq('variant_id', variant_id);
         
         await supabase.from('product_images').delete().eq('product_id', editingId);
         if (formData.image_url) {
           await supabase.from('product_images').insert([{ product_id: editingId, url: formData.image_url }]);
         }
      } else if (pErr) {
        alert('Supabase Error: ' + pErr.message);
      }
      
      setIsModalOpen(false);
      await fetchData();
    } else {
      // INSERT new
      let finalCategoryId = formData.category_id || null;
      if (formData.category_id === 'NEW' && newCategoryName.trim() !== '') {
        const catSlug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const { data: newCat, error: catErr } = await supabase.from('categories').insert([{
          name: newCategoryName.trim(),
          slug: catSlug
        }]).select().single();
        
        if (catErr) {
          alert('Error creating new category: ' + catErr.message);
          setIsSaving(false);
          return;
        }
        finalCategoryId = newCat.id;
      }
      
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      
      const { data: pData, error: pErr } = await supabase.from('products').insert([{
        name: formData.name,
        slug: slug,
        category_id: finalCategoryId,
      }]).select().single();
      
      if (pErr || !pData) {
         alert('Error creating product: ' + pErr?.message);
      } else {
         const { data: vData, error: vErr } = await supabase.from('product_variants').insert([{
            product_id: pData.id,
            sku: formData.sku,
            base_price: parseFloat(formData.price),
         }]).select().single();
         
         if (!vErr && vData) {
            await supabase.from('inventory').insert([{
               variant_id: vData.id,
               quantity: parseInt(formData.stock)
            }]);
         }
         
         if (formData.image_url) {
            await supabase.from('product_images').insert([{ product_id: pData.id, url: formData.image_url }]);
         }
         
         setIsModalOpen(false);
         await fetchData();
      }
    }
    
    setIsSaving(false);
  };

  // Derived state: Filtered & Sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category_id === selectedCategory);
    }

    // 3. Status Filter
    if (selectedStatus !== "All") {
      result = result.filter(p => {
        const status = p.stock === 0 ? 'Out of Stock' : p.stock < 20 ? 'Low Stock' : 'Active';
        return status === selectedStatus;
      });
    }

    // 4. Sorting
    switch (sortOption) {
      case "Name (A-Z)":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Name (Z-A)":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Price (Low to High)":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price (High to Low)":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Stock (Lowest First)":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "Stock (Highest First)":
        result.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break; 
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedStatus, sortOption]);

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

      {/* Advanced Toolbar */}
      <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 overflow-hidden">
        <div className="p-4 bg-gray-50/50 flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full lg:w-96 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          {/* Filters & Sorts */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex items-center flex-1 lg:flex-none">
              <FunnelIcon className="h-4 w-4 text-gray-400 absolute left-3 pointer-events-none" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full lg:w-48 pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="relative flex items-center flex-1 lg:flex-none">
              <FunnelIcon className="h-4 w-4 text-gray-400 absolute left-3 pointer-events-none" />
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full lg:w-48 pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="relative flex items-center w-full lg:w-auto">
              <ArrowsUpDownIcon className="h-4 w-4 text-gray-400 absolute left-3 pointer-events-none" />
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full lg:w-56 pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="Newest">Sort by: Newest</option>
                <option value="Name (A-Z)">Name (A-Z)</option>
                <option value="Name (Z-A)">Name (Z-A)</option>
                <option value="Price (Low to High)">Price (Low to High)</option>
                <option value="Price (High to Low)">Price (High to Low)</option>
                <option value="Stock (Lowest First)">Stock (Lowest First)</option>
                <option value="Stock (Highest First)">Stock (Highest First)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden">
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
                {processedProducts.map((product) => {
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
                    <option value="NEW" className="font-bold text-blue-600">+ Create New Category...</option>
                  </select>
                </div>

                {formData.category_id === 'NEW' && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in-up">
                    <label className="block text-sm font-bold text-blue-900 mb-1">New Category Name *</label>
                    <input required type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="e.g. Microcontrollers" />
                  </div>
                )}

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