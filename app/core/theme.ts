// ref: https://github.com/blitz-js/blitz/blob/8e0c9d76b50a37949a53dd9ca16f113b4c0170b9/recipes/material-ui/templates/core/styles/theme.ts
import { red } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#6700EB",
    },
    secondary: {
      main: "#FFFFFF",
    },
    error: {
      main: red.A400,
    },
  },
})

export default theme
