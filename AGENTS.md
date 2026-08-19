# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# UI Styling Rules
- ALWAYS use the scaling utility functions from `src/Util/Scale` for styling components.
- Use `scale()` for widths, margins, paddings, and icon sizes.
- Use `verticalScale()` for heights.
- Use `moderateScale()` for font sizes.
- Never use hardcoded numeric values for dimensions in stylesheets without wrapping them in these functions.
