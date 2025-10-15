import { useAppDispatch } from '@/lib/redux/hooks'
import { setUser } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import React, { ReactNode, useEffect } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user && data.session.user.email && data.session.user.id) {
          dispatch(setUser({ email: data.session.user.email, id: data.session.user.id }))
          router.replace('/(root)/home')
        } else {
          router.replace('/(auth)/sign-in')
        }
      } catch (error) {
        console.error('Error checking initial session:', error)
      }
    }

    checkInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && session.user.email && session.user.id) {
          dispatch(setUser({ email: session.user.email, id: session.user.id }))
          router.replace('/(root)/home')
        } else {
          router.replace('/(auth)/sign-in')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  })

  return <>{children}</>
}