import { supabase } from './supabase';
import { Product, Category, Order, NavMenu, Page, Offer, ContactSettings } from '../types';

/**
 * Data Access Object for Supabase
 * Provides a clean interface for database operations
 */

export const ProductDAO = {
  async getAll() {
    const { data, error } = await supabase.from('products').select('*').eq('is_deleted', false);
    if (error) throw error;
    return data as Product[];
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Product;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'ACTIVE')
      .eq('is_deleted', false)
      .limit(10);
    if (error) throw error;
    return data as Product[];
  },

  async upsert(product: Partial<Product>) {
    const { data, error } = await supabase.from('products').upsert(product).select().single();
    if (error) throw error;
    return data as Product;
  },

  async softDelete(id: string) {
    const { error } = await supabase
      .from('products')
      .update({ is_deleted: true, deletedAt: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }
};

export const CategoryDAO = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true });
    if (error) throw error;
    return data as Category[];
  },

  async upsert(category: Partial<Category>) {
    const { data, error } = await supabase.from('categories').upsert(category).select().single();
    if (error) throw error;
    return data as Category;
  },

  async delete(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  }
};

export const OrderDAO = {
  async getAll() {
    const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data as Order[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`id.eq.${id},orderNumber.eq.${id}`)
      .single();
    if (error) throw error;
    return data as Order;
  },

  async create(order: Partial<Order>) {
    const { data, error } = await supabase.from('orders').insert(order).select().single();
    if (error) throw error;
    return data as Order;
  },

  async update(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Order;
  }
};

export const SettingsDAO = {
  async getStoreSettings() {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 'store').single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.data || null;
  },

  async updateStoreSettings(settings: any) {
    const { error } = await supabase.from('settings').upsert({ id: 'store', data: settings, updatedAt: new Date().toISOString() });
    if (error) throw error;
  },

  async getContactSettings() {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 'contact').single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.data || null;
  },

  async updateContactSettings(settings: Partial<ContactSettings>) {
    const { error } = await supabase.from('settings').upsert({ id: 'contact', data: settings, updatedAt: new Date().toISOString() });
    if (error) throw error;
  }
};

export const MenuDAO = {
  async getAll() {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('order', { ascending: true });
    if (error) throw error;
    return data as NavMenu[];
  },

  async upsert(menu: Partial<NavMenu>) {
    const { data, error } = await supabase.from('menus').upsert(menu).select().single();
    if (error) throw error;
    return data as NavMenu;
  }
};
