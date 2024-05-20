// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";

const Sidebar = () => {
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <h1>Seller</h1>
      </div>
      <List>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <ListItem button>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        <Link
          to="/Property"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem button>
            <ListItemText primary="Property" />
          </ListItem>
        </Link>
        <Link
          to="/interestedSeller"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem button>
            <ListItemText primary="Interested" />
          </ListItem>
        </Link>
        <Link to="/logout" style={{ textDecoration: "none", color: "inherit" }}>
          <ListItem button>
            <ListItemText primary="Logout" />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default Sidebar;
