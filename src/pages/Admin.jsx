import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function Admin() {
  const [phase, setPhase] = useState('checking')
  const navigate = useNavigate()

  useEffect(() => {
    async function bootstrap() {
      const sessionResult = await supabase.auth.getSession()
      const sessionUser = sessionResult.data.session?.user

      if (!sessionUser) {
        setPhase('denied')
        return
      }

      const curatorResult = await supabase
        .from('curators')
        .select('role, approved')
        .eq('user_id', sessionUser.id)
        .maybeSingle()

      const isAdminUser = curatorResult.data?.role === 'admin' && curatorResult.data?.approved === true

      if (!isAdminUser) {
        setPhase('denied')
        return
      }

      setPhase('ready')
    }
    bootstrap()
  }, [])

  return (
    <main style={{ padding: '64px 32px' }}>
      <h1 style={{ fontSize: '48px' }}>HI — Admin page is rendering</h1>
      <p>Current phase: <strong>{phase}</strong></p>
    </main>
  )
}