import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://pwkmfcyfinqsalwwblcx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3a21mY3lmaW5xc2Fsd3dibGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjUyMDAsImV4cCI6MjA5ODU0MTIwMH0.KQdCnmGCqSjEQRb6LaY8rJqVwA5pCmfkoXzu4E4WUDQ'
  )
}