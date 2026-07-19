"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase';
import { 
  MapPinIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const emptyAddress = {
  first_name: '',
  last_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'India',
  is_default: false,
  id: undefined
};

export default function ProfilePage() {
  const { user } = useStore();
  const router = useRouter();
  const supabase = supabaseBrowser!;

  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(emptyAddress);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAddresses(data);
    } else if (error && error.code !== '42P01') { // Ignore relation does not exist before SQL runs
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setErrorMsg('');

    try {
      // If setting as default, we might want to unset others first
      if (formData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      // If it's the first address, make it default automatically
      const isFirst = addresses.length === 0;

      let err;
      if (formData.id) {
        // Update existing
        const { error } = await supabase.from('user_addresses').update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          is_default: formData.is_default
        }).eq('id', formData.id);
        err = error;
      } else {
        // Insert new
        const { error } = await supabase.from('user_addresses').insert([{
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          user_id: user.id,
          is_default: formData.is_default || isFirst
        }]);
        err = error;
      }

      if (err) {
        if (err.code === '42P01') throw new Error('Database schema update required. Please execute user_addresses.sql in Supabase first.');
        throw err;
      }

      setIsModalOpen(false);
      setFormData(emptyAddress);
      await fetchAddresses();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    const { error } = await supabase.from('user_addresses').delete().eq('id', id);
    if (!error) {
      setAddresses(prev => prev.filter(a => a.id !== id));
    } else {
      alert(error.message);
    }
  };

  const handleMakeDefault = async (id: string) => {
    if (!user) return;
    // Unset current defaults
    await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
    // Set new default
    const { error } = await supabase.from('user_addresses').update({ is_default: true }).eq('id', id);
    if (!error) {
      await fetchAddresses();
    }
  };

  if (!user) return null; // Wait for redirect

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto w-full animate-fade-in-up">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-32">
              <div className="h-16 w-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-center font-bold text-gray-900 truncate mb-1">{user.email}</h2>
              <p className="text-center text-xs text-gray-500 mb-6">Customer Profile</p>
              
              <nav className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl transition-colors">
                  <MapPinIcon className="h-5 w-5" />
                  Saved Addresses
                </a>
                <a href="/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order History
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Saved Addresses</h1>
                <p className="text-sm text-gray-500 mt-1">Manage where your orders are shipped.</p>
              </div>
              <button 
                onClick={() => { setFormData(emptyAddress); setIsModalOpen(true); }}
                className="bg-gray-900 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm text-sm"
              >
                <PlusIcon className="h-5 w-5" />
                Add New Address
              </button>
            </div>

            {isLoading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No addresses saved</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">You haven't added any shipping addresses yet. Add one now to speed up checkout.</p>
                <button 
                  onClick={() => { setFormData(emptyAddress); setIsModalOpen(true); }}
                  className="bg-blue-50 text-blue-700 font-bold px-6 py-2.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`bg-white rounded-2xl border ${addr.is_default ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'} p-5 relative shadow-sm hover:shadow-md transition-shadow group flex flex-col`}>
                    
                    {addr.is_default && (
                      <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircleIcon className="h-4 w-4" /> Default
                      </span>
                    )}

                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{addr.first_name} {addr.last_name}</h4>
                      <p className="text-sm font-medium text-gray-600 mb-3">{addr.phone}</p>
                      <div className="text-sm text-gray-500 leading-relaxed">
                        <p>{addr.address_line1}</p>
                        {addr.address_line2 && <p>{addr.address_line2}</p>}
                        <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                        <p>{addr.country}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      {!addr.is_default ? (
                        <button 
                          onClick={() => handleMakeDefault(addr.id)}
                          className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Set as Default
                        </button>
                      ) : <div></div>}
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { setFormData(addr); setIsModalOpen(true); }}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                          title="Edit Address"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(addr.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Delete Address"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </main>
      <Footer />

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900">Add New Address</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 font-bold text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl flex items-start gap-3 border border-red-100">
                  <ExclamationCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{errorMsg}</p>
                </div>
              )}

              <form id="addressForm" onSubmit={handleSaveAddress} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">First Name *</label>
                    <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="Jane" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name *</label>
                    <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number *</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="+91 9876543210" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Address Line 1 *</label>
                  <input required type="text" value={formData.address_line1} onChange={e => setFormData({...formData, address_line1: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="Flat / House No. / Building" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Address Line 2</label>
                  <input type="text" value={formData.address_line2} onChange={e => setFormData({...formData, address_line2: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="Street / Area / Landmark (Optional)" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">City *</label>
                    <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="City" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">State *</label>
                    <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="State" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Postal Code *</label>
                    <input required type="text" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="000000" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Country *</label>
                    <input required type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium" placeholder="India" />
                  </div>
                </div>

                {addresses.length > 0 && (
                  <label className="flex items-center gap-3 p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.is_default}
                      onChange={e => setFormData({...formData, is_default: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Set as default shipping address</span>
                  </label>
                )}
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                form="addressForm" 
                disabled={isSaving} 
                className="bg-gray-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 active:scale-95"
              >
                {isSaving ? 'Saving...' : 'Save Address'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
