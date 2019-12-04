/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { SafeAreaView, View, StyleSheet, AsyncStorage, StatusBar } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import axios from 'axios'
import moment from 'moment'
import Animated from 'react-native-reanimated'
import styles from './styles'
import { Card } from './Card'
import { SCREEN_WIDTH, runSpring, SCREEN_HEIGHT, API_URL, titleCase, palette } from './constants'

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
    profile: null,
    likeList: []
  }

  componentDidMount = () => {
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
    gestureState.setValue(State.UNDETERMINED)
    translationX.setValue(0)
    translationY.setValue(0)
    velocityX.setValue(0)
    offsetY.setValue(0)
    offsetX.setValue(0)

    const clockX = new Clock()
    const clockY = new Clock()

    const finalTranslateX = add(translationX, multiply(0.2, velocityX))
    const translationThreshold = SCREEN_WIDTH / 4

    const snapPoint = cond(
      lessThan(finalTranslateX, -translationThreshold),
      -ROTATE_WIDTH,
      cond(greaterThan(finalTranslateX, translationThreshold), ROTATE_WIDTH, 0)
    )

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

    this.translateY = cond(
      eq(gestureState, State.END),
      [set(translationY, runSpring(clockY, translationY, 0)), set(offsetY, translationY), translationY],
      cond(eq(gestureState, State.BEGAN), [stopClock(clockY), translationY], translationY)
    )
  }

  _onSwiped = ([translateX]) => {
    const { likeList, profile } = this.state
    const isLiked = translateX > 0
    if (isLiked) {
      this.setState({ likeList: [...likeList, profile] })
      this._storeLikeList(profile)
    }
    this.fetchProfile()
    this._initTinderCard()
  }

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

    const style = {
      ...StyleSheet.absoluteFillObject,
      zIndex: 900,
      transform: [{ translateX }, { translateY }, { rotateZ }]
    }
    return (
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.rootHeader} />
        <View style={styles.cardContainer}>
          <PanGestureHandler onHandlerStateChange={onGestureEvent} onGestureEvent={onGestureEvent}>
            <Animated.View {...{ style }}>
              <Card {...{ profile, likeOpacity, nopeOpacity }} />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </SafeAreaView>
    )
  }
}
