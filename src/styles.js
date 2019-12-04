import { StyleSheet } from 'react-native'
import { palette, SCREEN_HEIGHT, SCREEN_WIDTH } from './constants'

const RESPONSIVE_IMAGE_SIZE = Math.round(Math.sqrt((SCREEN_HEIGHT * SCREEN_WIDTH) / 9))

export default StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: palette.WHITE },
  rootHeader: { height: '30%', backgroundColor: palette.BLACK },
  cardContainer: {
    margin: 12,
    zIndex: 100,
    height: '50%'
  },
  card: {
    ...StyleSheet.absoluteFill,
    backgroundColor: palette.GREY,
    top: '-20%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 4,
    elevation: 1
  },
  upperCard: {
    flex: 1,
    backgroundColor: palette.GREY,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: palette.GREY_TYPO,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  lowerCard: {
    flex: 2,
    backgroundColor: palette.WHITE,
    alignItems: 'center'
  },
  personImage: {
    top: '-110%',
    width: RESPONSIVE_IMAGE_SIZE,
    height: RESPONSIVE_IMAGE_SIZE,
    borderRadius: RESPONSIVE_IMAGE_SIZE / 2,
    backgroundColor: palette.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.GREY_TYPO,
    zIndex: 100
  },
  imageContainer: {
    width: RESPONSIVE_IMAGE_SIZE - 10,
    height: RESPONSIVE_IMAGE_SIZE - 10,
    borderRadius: (RESPONSIVE_IMAGE_SIZE - 10) / 2,
    backgroundColor: palette.GREY
  },
  header: { flex: 1, alignItems: 'center' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  like: {
    padding: 8
  },
  likeLabel: {
    fontSize: 28,
    color: palette.GREEN_TINDER,
    fontWeight: 'bold'
  },
  nope: {
    padding: 8
  },
  nopeLabel: {
    fontSize: 28,
    color: palette.RED_TINDER,
    fontWeight: 'bold'
  },
  triangular: {
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 4,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: palette.GREEN
  },
  line: {
    height: 2,
    width: 30,
    backgroundColor: palette.GREEN
  },
  title: { fontSize: 34, marginTop: 6, textAlign: 'center', fontWeight: '500' },
  substitute: {
    fontSize: 22,
    color: palette.GREY_TYPO,
    textAlign: 'center',
    fontWeight: '500'
  }
})
