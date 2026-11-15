# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# UI Styling Rules
- ALWAYS use the scaling utility functions from `src/Util/Scale` for styling components.
- Use `scale()` for widths, margins, paddings, and icon sizes.
- Use `verticalScale()` for heights.
- Use `moderateScale()` for font sizes.
- Never use hardcoded numeric values for dimensions in stylesheets without wrapping them in these functions.

# Asset Import/Export Rules
- NEVER directly deep-require or import asset files (images, icons, lottie json) directly from file paths in screens or components.
- ALWAYS export assets from the central `index.ts` within the respective asset directory.
- ALWAYS import assets via their `index.ts` barrel export.

