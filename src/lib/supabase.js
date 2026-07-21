import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://usuphspqzdcaotbyzmft.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzdXBoc3BxemRjYW90Ynl6bWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NDQ0MDgsImV4cCI6MjEwMDIyMDQwOH0.qMhNxLoPwFjPL1hbKLF_co-Bqq6u8kEcl4zLzdhiTVI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
