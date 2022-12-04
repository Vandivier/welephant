export const SUBNAV_MANAGE: TopNavItem[] = [
  { name: "Tags", link: "/tags" },
  { name: "Users", link: "/users" },
]

export const TOP_NAV_BAR_HEIGHT = "70px"

export const TOP_NAV_ITEMS: TopNavItem[] = [
  { name: "Parties", link: "/parties" },
  { name: "Wishlists", link: "/wishlists" },
  // { name: "Manage", subnav: SUBNAV_MANAGE },
]

export type TopNavDropdown = { name: string; link?: undefined; subnav: TopNavItem[] }
export type TopNavDropDownProps = {
  name: string
  subnav: typeof SUBNAV_MANAGE
}
export type TopNavItem = TopNavLink | TopNavDropdown
export type TopNavLink = { name: string; link: string; subnav?: undefined }
