import React from "react"

import { Avatar, Box, IconButton, Tooltip } from "@mui/material"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"

export const TopNavRightRegion = () => {
  const currentUser = useCurrentUser()

  return currentUser ? (
    <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1, justifyContent: "end" }}>
      <Tooltip title="Profile">
        <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
          <Avatar>H</Avatar>
        </IconButton>
      </Tooltip>
    </Box>
  ) : (
    <></>
  )
}
