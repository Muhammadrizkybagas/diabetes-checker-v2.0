import { createClient } from '@supabase/supabase-js';

// Mengambil variabel lingkungan yang sudah kita buat di .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi sederhana agar tidak error jika variabel lupa diisi
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL dan Anon Key harus diisi di file .env.local');
}

// Inisialisasi koneksi (Client)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);