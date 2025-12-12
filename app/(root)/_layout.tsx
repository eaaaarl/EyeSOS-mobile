import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name='message'
        options={{
          title: 'Message',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name='alert'
        options={{
          href: null,
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tabs.Screen
        name='camera'
        options={{
          href: null,
          tabBarStyle: { display: 'none' }
        }}
      />
      {/* <Tabs.Screen
        name='message'
        options={{
          href: null,
          tabBarStyle: { display: 'none' }
        }}
      /> */}
    </Tabs>
  )
}