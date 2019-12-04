import React from 'react'
import { View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { palette } from './constants'
import styles from './styles'

// Custome Icon with Line above chosen icon
export function CustomIcon({ item, index, option }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flex: 1, alignItems: 'center', marginBottom: 20, opacity: index === option ? 1 : 0 }}>
        <View style={styles.triangular} />
        <View style={styles.line} />
      </View>

      <FontAwesome
        name={item}
        size={index > 3 ? 38 : 28}
        color={index === option ? palette.GREEN : palette.GREY_TYPO}
      />
    </View>
  )
}
