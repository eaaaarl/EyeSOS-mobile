import { Link } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Link className='text-center font-semibold' href={'/(auth)/welcome'}>GO TO WELCOME</Link>
    </SafeAreaView>
  )
}