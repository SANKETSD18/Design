import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device, e.g., iPhone X
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Used to scale widths, margins, paddings, and icons based on screen width
export const s = (size: number) => (width / guidelineBaseWidth) * size;

// Used to scale heights based on screen height
export const vs = (size: number) => (height / guidelineBaseHeight) * size;

// Used to scale fonts so they don't get disproportionately large on tablets or big screens
export const ms = (size: number, factor = 0.5) => size + (s(size) - size) * factor;