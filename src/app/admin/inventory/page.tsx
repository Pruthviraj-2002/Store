"use client";

import React, { useState } from 'react';
import { 
  FolderIcon,
  FolderOpenIcon,
  HomeIcon,
  ChevronRightIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

// --- HIERARCHICAL MOCK DATABASE ---
// Structured as Categories -> Subcategories -> Models -> Items
const HIERARCHY_DB: any = {
  "Semiconductors": {
    "Microcontrollers": {
      "STM32 Series": [
        { id: "p1", sku: "SKT-STM-103", name: "STM32F103C8T6", stock: 2450, price: 85.00, status: "Active" },
        { id: "p2", sku: "SKT-STM-104", name: "STM32F103CBT6", stock: 150, price: 125.60, status: "Active" }
      ],
      "ESP32 Series": [
        { id: "p3", sku: "SKT-ESP-002", name: "ESP32 Dev Board", stock: 120, price: 320.00, status: "Active" }
      ]
    },
    "Operational Amplifiers": {
      "LM Series": [
        { id: "p4", sku: "SKT-LM-358", name: "LM358P Dual Op-Amp", stock: 5120, price: 15.60, status: "Active" }
      ]
    }
  },
  "Passive Components": {
    "Resistors": {
      "Through-Hole": [
        { id: "p5", sku: "SKT-RES-10K", name: "10K Ohm Resistor", stock: 10000, price: 0.25, status: "Active" }
      ]
    },
    "Capacitors": {
      "Electrolytic": [
        { id: "p6", sku: "SKT-CAP-10U", name: "10uF 50V Capacitor", stock: 5, price: 2.50, status: "Low Stock" }
      ]
    }
  },
  "Development Boards": {
    "Arduino Ecosystem": {
      "Uno Series": [
        { id: "p7", sku: "SKT-ARD-001", name: "Arduino Uno R3", stock: 50, price: 850.00, status: "Active" }
      ]
    }
  }
};

export default function HierarchicalInventory() {
  // State to track our current depth in the hierarchy: e.g., ["Semiconductors", "Microcontrollers"]
  const [path, setPath] = useState<string[]>([]);
  
  // State for the "Add New" Modal stub
  const [showAddModal, setShowAddModal] = useState(false);

  // Helper to determine what level we are at
  const getLevelName = () => {
    if (path.length === 0) return "Category";
    if (path.length === 1) return "Subcategory";
    if (path.length === 2) return "Model";
    return "Item";
  };

  // Helper to safely navigate down the object tree based on our current path
  const getCurrentData = () => {
    let current = HIERARCHY_DB;
    for (const step of path) {
      if (current[step]) current = current[step];
      else return null;
    }
    return current;
  };

  const currentData = getCurrentData();
  const isFinalStage = Array.isArray(currentData);

  // Navigation Handlers
  const handleDrillDown = (name: string) => setPath([...path, name]);
  const handleBreadcrumbClick = (index: number) => setPath(path.slice(0, index));
  const goHome = () => setPath([]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header & Dynamic Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h1>
          <p className="text-sm text-gray-500">Organize your catalog by category, subcategory, and model.</p>
        </div>
        
        {/* The button dynamically changes based on the stage! */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shrink-0 shadow-sm"
        >
          <PlusIcon className="h-4 w-4 stroke-[3px]" /> Add {getLevelName()}
        </button>
      </div>

      {/* Dynamic Breadcrumbs */}
      <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg flex items-center gap-2 text-sm shadow-sm overflow-x-auto">
        <button 
          onClick={goHome}
          className={`flex items-center gap-1.5 transition-colors ${path.length === 0 ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-blue-600'}`}
        >
          <HomeIcon className="h-4 w-4" /> Root
        </button>
        
        {path.map((step, index) => (
          <React.Fragment key={index}>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 shrink-0" />
            <button 
              onClick={() => handleBreadcrumbClick(index + 1)}
              className={`whitespace-nowrap transition-colors ${index === path.length - 1 ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-blue-600'}`}
            >
              {step}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* --- RENDER STAGE 1, 2, or 3: The Folder Grid --- */}
      {!isFinalStage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.keys(currentData).map((folderName) => (
            <div 
              key={folderName}
              onClick={() => handleDrillDown(folderName)}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FolderOpenIcon className="h-6 w-6" />
                </div>
                <button className="text-gray-400 hover:text-gray-900" title="Edit Name">
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{folderName}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Contains {Object.keys(currentData[folderName]).length} items/folders
              </p>
            </div>
          ))}

          {/* Empty State / Add New Placeholder inside grid */}
          <div 
            onClick={() => setShowAddModal(true)}
            className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer min-h-35"
          >
            <PlusIcon className="h-8 w-8 mb-2" />
            <span className="font-bold text-sm">Add New {getLevelName()}</span>
          </div>
        </div>
      )}

      {/* --- RENDER FINAL STAGE (Items Table) --- */}
      {isFinalStage && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Item Name & SKU</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-900">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <CubeIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      No items in this model yet. Click "Add Item" to begin.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">₹{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 font-medium">{item.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors"><PencilSquareIcon className="h-5 w-5" /></button>
                          <button className="text-gray-400 hover:text-red-600 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD NEW MODAL (Stub) --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New {getLevelName()}</h2>
            <p className="text-sm text-gray-500 mb-6">
              You are adding a new {getLevelName().toLowerCase()} inside <span className="font-bold text-gray-900">{path.length > 0 ? path[path.length - 1] : 'Root'}</span>.
            </p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">{getLevelName()} Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900" placeholder={`Enter ${getLevelName().toLowerCase()} name...`} />
              </div>
              
              {isFinalStage && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">SKU / Part Number</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Price (₹)</label>
                      <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Initial Stock</label>
                      <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors"
              >
                Save {getLevelName()}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}