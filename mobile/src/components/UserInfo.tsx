import React from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { api } from "../lib/api"

export default function UserInfo() {
  const { data: user, isLoading, error } = api.user.getUserInfo.useQuery()

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>React Native - User Info</Text>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user information...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.title}>React Native Error</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>React Native - User Info</Text>
        <Text>No user data available</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native - User Info</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>
          <Text style={styles.bold}>Name:</Text> {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Email:</Text> {user.email}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>User ID:</Text> {user.id}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Email Verified:</Text>{" "}
          {user.supabaseMetadata.we_verified_email ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  errorContainer: {
    borderColor: "#ff6b6b",
    backgroundColor: "#ffe0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  errorText: {
    color: "#d63031",
    fontSize: 14,
  },
})
