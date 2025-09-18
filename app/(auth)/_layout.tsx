import { Stack } from "expo-router"
import React from "react"

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="login" options={{ title: "Pharmacy Login" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
    </Stack>
  )
}

export default AuthLayout
