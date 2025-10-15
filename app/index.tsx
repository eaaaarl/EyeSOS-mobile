import { image } from '@/constant/image';
import { useRouter } from 'expo-router'; // or your navigation library
import React, { useEffect } from 'react';
import { Image, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    // Simulate loading/initialization
    const timer = setTimeout(() => {
      // Redirect to your desired screen
      router.replace('/(auth)/welcome')
    }, 2000) // 2 second delay

    return () => clearTimeout(timer)
  }, [router])

  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Image
        source={image.logo}
        className='w-full h-full'
        resizeMode='contain'
      />
    </View>
  )
}