import React, { Suspense } from "react"

import { AppBar, Box, Grid, Toolbar } from "@mui/material"

import { TopNavButton } from "./TopNavButton"
import { TopNavRightRegion } from "./TopNavRightRegion"
import { TOP_NAV_BAR_HEIGHT, TOP_NAV_ITEMS } from "./TopNavConstants"

export const TopNav = () => {
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar position="static" style={{ height: TOP_NAV_BAR_HEIGHT }}>
        <Toolbar>
          <Grid container spacing={0}>
            <Grid item xs={2}>
              <TopNavButton link="/" name="Home" subnav={undefined} />
            </Grid>
            <Grid item xs={8}>
              <Box
                sx={{ flexGrow: 1, display: { xs: "none", md: "flex", justifyContent: "center" } }}
              >
                {TOP_NAV_ITEMS.map(({ link, name, subnav }) => (
                  <TopNavButton key={name} {...{ link, name, subnav }} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Suspense fallback={<></>}>
                <TopNavRightRegion />
              </Suspense>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
