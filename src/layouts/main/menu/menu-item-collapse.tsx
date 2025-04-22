import { FC } from "react";
import { SideMenuItem } from "../../../types";

import * as styles from "./menu-collapse-item.styles";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { checkPermisison } from "../../../utils";

type MenuItemCollapseViewProps = {
  item: SideMenuItem;
  keyRender: string;
  level: number;
};

export const MenuItemCollapseView: FC<MenuItemCollapseViewProps> = ({
  item,
  keyRender,
  level,
}) => {
  const navigate = useNavigate();
  const { permission } = useAppSelector((state) => state.auth);
  const isSelected = window.location.href.includes(item.key);

  if (item.module && item.action && Array.isArray(item.action)) {
    const canVisible = checkPermisison(permission, item.module, item.action);
    if (!canVisible) return null;
  }

  if (item?.children.length > 0) {
    return (
      <Box>
        {item.children.map((child: SideMenuItem, i: number) => (
          <MenuItemCollapseView
            key={`submenu-${i}`}
            item={child}
            keyRender={`submenu-${i}`}
            level={level + 1}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      key={keyRender}
      sx={isSelected ? styles.selectedItem : styles.menuItemStyle}
      onClick={() => item.children.length === 0 && navigate(item.url)}
    >
      <Box sx={{ fontSize: "14px" }}>{item.icon}</Box>
      <Box sx={{ textAlign: "center", fontSize: "10px" }}>{item.text}</Box>
    </Box>
  );
};
