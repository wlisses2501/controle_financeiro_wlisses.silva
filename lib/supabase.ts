
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mttzywctkvzbpwnsyljf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHp5d2N0a3Z6YnB3bnN5bGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjQ3NDIsImV4cCI6MjA4MjYwMDc0Mn0.bWu9HfJDj4wDMZGQAbIV4QesR7ZPrupF-S965H1v76s';

export const supabase = createClient(supabaseUrl, supabaseKey);
