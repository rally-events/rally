import { StatusBar } from "expo-status-bar"
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { TRPCProvider } from "./src/providers/TRPCProvider"
import { AuthProvider, useAuth } from "./src/providers/AuthProvider"
import AuthScreen from "./src/screens/AuthScreen"
import AccountScreen from "./src/screens/AccountScreen"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {user ? <AccountScreen /> : <AuthScreen />}
      <StatusBar style="auto" />
    </View>
  )
}

export default function App() {
  return (
    <TRPCProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TRPCProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
})
