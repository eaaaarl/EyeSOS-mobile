import { Link } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
  return (
    <SafeAreaView>
      <Link href={'/(root)/home'}>GO TO HOME</Link>
      <Text>index</Text>
    </SafeAreaView>
  )
}