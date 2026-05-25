import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'

export default function App() {
  const [prayer, setPrayer] = useState('')

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>Faith media operating system</Text>
        <Text style={styles.title}>GodRealm</Text>
        <Text style={styles.copy}>
          Prayer, testimony, worship, giving, and creator discovery connected to your Render API.
        </Text>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Prayer Feed</Text>
          <TextInput
            multiline
            value={prayer}
            onChangeText={setPrayer}
            placeholder="Share what is on your spirit..."
            placeholderTextColor="#746d60"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Post prayer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>API</Text>
          <Text style={styles.muted}>{API_URL}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 22, gap: 18 },
  kicker: { color: '#c9a84c', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' },
  title: { color: '#f2ecd8', fontSize: 52, lineHeight: 56 },
  copy: { color: '#b8ad9a', fontSize: 16, lineHeight: 24 },
  panel: { borderColor: '#24201a', borderWidth: 1, borderRadius: 8, padding: 16, backgroundColor: '#111' },
  panelTitle: { color: '#f2ecd8', fontSize: 20, marginBottom: 12 },
  input: { minHeight: 110, color: '#f2ecd8', borderColor: '#24201a', borderWidth: 1, borderRadius: 8, padding: 12 },
  button: { marginTop: 12, borderColor: '#c9a84c66', borderWidth: 1, borderRadius: 8, padding: 13 },
  buttonText: { color: '#c9a84c', textAlign: 'center' },
  muted: { color: '#8f8777' },
})
