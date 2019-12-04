import React from 'react'
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native'
import Screen from './src/Screen'
import { palette } from './src/constants'

export default function App() {
  return (
    <React.Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: palette.BLACK }} />
      <Screen />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
