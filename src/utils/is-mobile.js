import bowser from 'bowser'

const browser = bowser.getParser(window.navigator.userAgent)
export default browser.getPlatformType(true) === 'mobile'
