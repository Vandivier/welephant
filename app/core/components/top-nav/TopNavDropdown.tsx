import React from "react"

import { Button, Menu, MenuItem, SvgIcon } from "@mui/material"

import { TopNavDropDownProps, TopNavLink } from "./TopNavConstants"

export const TopNavDropdownIcon = () => (
  <SvgIcon
    style={{
      margin: "0 0 0 0.75rem",
      verticalAlign: "-0.55rem",
    }}
  >
    <path
      d="M4.29648 8.21L6.88648 10.8C7.27648 11.19 7.90648 11.19 8.29648 10.8L10.8865 8.21C11.5165 7.58 11.0665 6.5 10.1765 6.5H4.99648C4.10648 6.5 3.66648 7.58 4.29648 8.21Z"
      fill="#8E8391"
    />
  </SvgIcon>
)

export const TopNavDropdown = ({ name, subnav }: TopNavDropDownProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSubnavClick = () => {
    setAnchorEl(null)
    handleClose()
  }

  // color, sx, and variant are manually synced with TopNavButton
  return subnav && Array.isArray(subnav) ? (
    <>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        color="secondary"
        id="basic-button"
        onClick={handleClick}
        sx={{ my: 2, display: "block" }}
        variant="text"
      >
        {name}
        <TopNavDropdownIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="basic-menu"
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        onClose={handleClose}
        open={open}
      >
        {subnav.map(({ name, link }: TopNavLink) => (
          <MenuItem component="a" href={link && `/${link}`} key={name} onClick={handleSubnavClick}>
            {name}
          </MenuItem>
        ))}
      </Menu>
    </>
  ) : null
}
