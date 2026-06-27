"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State for Adding a New Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Development Boards");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Fetch Inventory from Supabase
  const fetchInventory = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching admin inventory:", error);
    } else if (data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle Form Submission (Insert into Database)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("products").insert([
      {
        sku,
        name,
        brand,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        status: parseInt(stock) > 0 ? "Active" : "Out of Stock",
        description,
        image_url: imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
      },
    ]);

    if (error) {
      alert("Error adding product: " + error.message);
    } else {
      // Clear form and reload
      setIsModalOpen(false);
      setSku("");
      setName("");
      setBrand("");
      setPrice("");
      setStock("");
      setDescription("");
      setImageUrl("");
      fetchInventory(); // Refresh the table list cleanly
    }
  };

  // Handle Delete Operation
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this component from inventory?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        alert("Error deleting item: " + error.message);
      } else {
        fetchInventory();
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Manage your components, stock quantities, and pricing.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm font-medium text-sm transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-1.5" />
          Add Component
        </button>
      </div>

      {/* Database Inventory Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-900">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Component</th>
                <th className="px-6 py-4">SKU / Brand</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img src={product.image_url} alt="" className="w-10 h-10 object-cover rounded-lg bg-gray-100" />
                    <span className="font-semibold text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs text-gray-500">{product.sku}</div>
                    <div className="text-xs text-gray-400">{product.brand}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 font-medium">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 10 ? "bg-green-50 text-green-700" : product.stock > 0 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Component Modal Slider/Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Component</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">SKU Code</label>
                  <input required type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKT-IC-555" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Brand/Mfg</label>
                  <input required type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Texas Instruments" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Component Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="NE555 Timer IC" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Price (INR)</label>
                  <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="35" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Stock Qty</label>
                  <input required type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="150" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white">
                  <option>Development Boards</option>
                  <option>Single Board Computers</option>
                  <option>Sensors</option>
                  <option>Integrated Circuits</option>
                  <option>Displays</option>
                  <option>Prototyping</option>
                  <option>Passive Components</option>
                  <option>Power Management</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Image URL</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://unsplash.com/..." className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Technical Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm">Save Component</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}