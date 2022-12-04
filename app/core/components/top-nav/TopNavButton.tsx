import { Button } from "@mui/material"
import { TopNavItem } from "./TopNavConstants"
import { TopNavDropdown } from "./TopNavDropdown"

export const TopNavButton = ({
  link,
  name,
  subnav,
}: {
  link?: string
  name: string
  subnav?: TopNavItem[]
}) => (
  <>
    {subnav ? (
      <TopNavDropdown {...{ name, subnav }} />
    ) : (
      <Button color="secondary" href={link} sx={{ my: 2, display: "block" }} variant="text">
        {name}
      </Button>
    )}
  </>
)
