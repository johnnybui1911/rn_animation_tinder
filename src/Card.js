import React from 'react'
import { View, TouchableOpacity, Image, ActivityIndicator, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { palette } from './constants'
import styles from './styles'
import { Content } from './Content'
import { CustomIcon } from './CustomIcon'

export function Card({ profile, likeOpacity, nopeOpacity }) {
  const [option, setOption] = React.useState(0)
  const handlePressIcon = item => {
    setOption(item)
  }

  React.useEffect(() => {
    setOption(0)
  }, [profile])

  const renderContent = () => {
    if (profile) {
      const { name, password, phone, street, dob } = profile
      const infoArray = [
        {
          title: name,
          substitute: 'Hi, My name is'
        },
        {
          title: dob,
          substitute: 'My birthday is'
        },
        {
          title: street,
          substitute: 'My address is'
        },
        {
          title: phone,
          substitute: 'My phone number is'
        },
        {
          title: password,
          substitute: 'My password is'
        }
      ]
      return <Content {...infoArray[option]} />
    }
    return (
      <View style={styles.content}>
        <ActivityIndicator size={'large'} color={palette.GREEN} />
      </View>
    )
  }

  const picture = profile ? profile.picture : ''
  return (
    <View style={styles.card}>
      <View style={styles.upperCard}>
        <Animated.View style={[styles.like, { opacity: likeOpacity }]}>
          <Text style={styles.likeLabel}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.nope, { opacity: nopeOpacity }]}>
          <Text style={styles.nopeLabel}>NOPE</Text>
        </Animated.View>
      </View>
      <View style={styles.lowerCard}>
        {/* Render header with profile image */}
        <View style={styles.header}>
          <View style={styles.personImage}>
            <View style={styles.imageContainer}>
              {picture ? (
                <Image
                  source={{
                    uri: picture
                  }}
                  style={styles.imageContainer}
                />
              ) : null}
            </View>
          </View>
        </View>
        {/* Render body part */}
        {renderContent()}
        <View style={styles.footer}>
          {/* Render icon list */}
          {['user-o', 'calendar', 'map', 'phone', 'lock'].map((item, index) => (
            <TouchableOpacity key={item} onPress={() => handlePressIcon(index)} style={{ padding: 12 }}>
              <CustomIcon {...{ item, index, option }} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )
}
