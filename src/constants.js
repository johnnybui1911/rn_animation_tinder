import { Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'

const { spring, cond, set, clockRunning, startClock, stopClock, Value } = Animated

export const API_URL = 'https://randomuser.me/api/0.4/?randomapi'

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height
export const TRANSLATION_THRESHOLD = SCREEN_WIDTH / 4

export const palette = {
  WHITE: '#FFF',
  GREY: '#F2F2F2',
  BLACK: '#2C2E31',
  GREY_TYPO: '#999999',
  GREEN: '#87B24A',
  RED_TINDER: '#ec5288',
  GREEN_TINDER: '#6ee3b4'
}

export function runSpring(clock, value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  }

  const config = {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.5,
    toValue: new Value(0)
  }

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ]
}

export function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ')
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  return splitStr.join(' ')
}
