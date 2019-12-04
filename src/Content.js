import React from 'react'
import { View, Text } from 'react-native'
import { palette } from './constants'
import styles from './styles'

export function Content({ title, substitute }) {
  return (
    <View style={styles.content}>
      <Text style={styles.substitute}>{substitute}</Text>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  )
}
