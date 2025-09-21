import { View, ActivityIndicator } from "react-native"
import React, { useEffect } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "@/context/AuthContext"

const Index = () => {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/home")
      } else {
        router.replace("/login")
      }
    }
  }, [user, loading, router])
  
  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#0033FF" />
      </View>
    )
  }

  return null
}

export default Index
