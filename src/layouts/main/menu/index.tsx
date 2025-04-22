import { Box } from "@mui/material";

import * as styles from "./styles";
import { SideMenuItem } from "../../../types";
import { MenuItemView } from "./menu-item";
import { menus } from "./menu-data";
import { MenuItemCollapseView } from "./menu-item-collapse";
import { useAppSelector } from "../../../hooks";
import logo from "../../../assets/images/logo.jpg";

export const Menu = () => {
  const { collapsed } = useAppSelector((state) => state.global);

  if (collapsed === false)
    return (
      <Box sx={styles.mainContainerStyle}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Box
            component="img"
            src={logo} // Dùng biến import
            alt="Logo"
            sx={{ width: "100px" }}
          />
        </Box>
        <Box sx={styles.menuContainerStyle}>
          {menus.map((item: SideMenuItem, i: number) => {
            return (
              <MenuItemView item={item} keyRender={`menu-${i}`} level={0} />
            );
          })}
        </Box>
      </Box>
    );

  if (collapsed === true) {
    return (
      <Box sx={styles.collapseContainerStyle}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Box
            component="img"
            src={logo} // Dùng biến import
            alt="Logo"
            sx={{ width: "70px" }}
          />
        </Box>
        <Box sx={styles.menuCollapseContainerStyle}>
          {menus.map((item: SideMenuItem, i: number) => {
            return (
              <MenuItemCollapseView
                item={item}
                keyRender={`menu-${i}`}
                level={0}
              />
            );
          })}
        </Box>
      </Box>
    );
  }
};
