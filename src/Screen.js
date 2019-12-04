/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { SafeAreaView, View, StyleSheet, AsyncStorage } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import axios from 'axios'
import moment from 'moment'
import Animated from 'react-native-reanimated'
import { BarIndicator } from 'react-native-indicators'
import styles from './styles'
import { Card } from './Card'
import { SCREEN_WIDTH, runSpring, SCREEN_HEIGHT, API_URL, titleCase, palette, TRANSLATION_THRESHOLD } from './constants'

const {
  add,
  multiply,
  neq,
  cond,
  eq,
  event,
  lessThan,
  greaterThan,
  and,
  call,
  set,
  clockRunning,
  Clock,
  Value,
  concat,
  interpolate,
  Extrapolate,
  stopClock
} = Animated

const toRadians = angle => angle * (Math.PI / 180)
const ROTATE_WIDTH = SCREEN_WIDTH * Math.sin(toRadians(90 - 15)) + SCREEN_HEIGHT * Math.sin(toRadians(15))

export default class Screen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.translationX = new Value(0)
    this.translationY = new Value(0)
    this.velocityX = new Value(0)
    this.offsetY = new Value(0)
    this.offsetX = new Value(0)
    this.gestureState = new Value(State.UNDETERMINED)
    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationX: this.translationX,
            translationY: this.translationY,
            velocityX: this.velocityX,
            state: this.gestureState
          }
        }
      ],
      { useNativeDriver: true }
    )
    this._initTinderCard()
  }

  state = {
    profile: null
  }

  componentDidMount = () => {
    // check the offline like list stored in async storage
    AsyncStorage.getItem('LIKELIST').then(res => {
      console.log(JSON.parse(res))
    })
    this.fetchProfile()
  }

  fetchProfile = () => {
    this.setState({ profile: null }, () => {
      axios.get(API_URL).then(res => {
        const { results } = res.data
        const {
          seed,
          user: {
            name: { first, last },
            email,
            password,
            picture,
            phone,
            dob,
            location: { street }
          }
        } = results[0]

        const profile = {
          seed,
          name: titleCase(first + ' ' + last),
          email,
          password,
          picture,
          phone,
          dob: moment(parseFloat(dob)).format('D/M/YYYY'),
          street: titleCase(street)
        }
        this.setState({ profile })
      })
    })
  }

  _initTinderCard = () => {
    const { translationX, velocityX, translationY, gestureState, offsetX, offsetY } = this
    // re-initialize config to default value
    gestureState.setValue(State.UNDETERMINED)
    translationX.setValue(0)
    translationY.setValue(0)
    velocityX.setValue(0)
    offsetY.setValue(0)
    offsetX.setValue(0)

    const clockX = new Clock()
    const clockY = new Clock()

    const finalTranslateX = add(translationX, multiply(0.2, velocityX))

    // setting snapPoint for below condition
    const snapPoint = cond(
      lessThan(finalTranslateX, -TRANSLATION_THRESHOLD),
      -ROTATE_WIDTH,
      cond(greaterThan(finalTranslateX, TRANSLATION_THRESHOLD), ROTATE_WIDTH, 0)
    )

    // check the condition and make animation for translateX
    this.translateX = cond(
      eq(gestureState, State.END),
      [
        set(translationX, runSpring(clockX, translationX, snapPoint)),
        set(offsetX, translationX),
        cond(and(eq(clockRunning(clockX), 0), neq(translationX, 0)), [call([translationX], this._onSwiped)]),
        translationX
      ],
      cond(eq(gestureState, State.BEGAN), [stopClock(clockX), translationX], translationX)
    )

    // check the condition and make animation for translateY
    this.translateY = cond(
      eq(gestureState, State.END),
      [set(translationY, runSpring(clockY, translationY, 0)), set(offsetY, translationY), translationY],
      cond(eq(gestureState, State.BEGAN), [stopClock(clockY), translationY], translationY)
    )
  }

  // function handle swipe card to left/right
  _onSwiped = ([translateX]) => {
    const { profile } = this.state
    const isLiked = translateX > 0 // translateX > 0 -> user swiped card to the right
    if (isLiked) {
      this._storeLikeList(profile) // store the liked card into offline list
    }
    this.fetchProfile() // fetch new random profile
    this._initTinderCard() // re-initialize the animation configuration of card view
  }

  // function store the liked profile into like list in async storage
  _storeLikeList = async newProfile => {
    let likeList = []
    try {
      let oldList = await AsyncStorage.getItem('LIKELIST')
      if (oldList !== null) {
        likeList = JSON.parse(oldList)
      }
      likeList.push(newProfile)
      await AsyncStorage.setItem('LIKELIST', JSON.stringify(likeList))
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { profile } = this.state
    const { translateX, translateY, onGestureEvent } = this

    // interpolate translateX to get corresponding rotateZ -> similar to Tinder App
    const rotateZ = concat(
      interpolate(translateX, {
        inputRange: [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2],
        outputRange: [15, -15],
        extrapolate: Extrapolate.CLAMP
      }),
      'deg'
    )
    const likeOpacity = interpolate(translateX, {
      inputRange: [0, SCREEN_WIDTH / 4],
      outputRange: [0, 1]
    })
    const nopeOpacity = interpolate(translateX, {
      inputRange: [-SCREEN_WIDTH / 4, 0],
      outputRange: [1, 0]
    })

    // animated style for Animated View
    const style = {
      ...StyleSheet.absoluteFillObject,
      zIndex: 500,
      transform: [{ translateX }, { translateY }, { rotateZ }]
    }
    return (
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.rootHeader} />
        <View style={styles.cardContainer}>
          {profile ? (
            <PanGestureHandler onHandlerStateChange={onGestureEvent} onGestureEvent={onGestureEvent}>
              <Animated.View {...{ style }}>
                <Card {...{ profile, likeOpacity, nopeOpacity }} />
              </Animated.View>
            </PanGestureHandler>
          ) : (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <BarIndicator size={40} color={palette.GREEN} count={6} />
            </View>
          )}
        </View>
      </SafeAreaView>
    )
  }
}
