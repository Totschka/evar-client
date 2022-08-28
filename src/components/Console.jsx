import { Box, Tabs, Tab, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { actionType } from "../constants";
import { useStateValue } from "../StateProvider";
import "./Console.css";
import TabPanel from "./TabPanel";
import Reservation from "./Reservation";
import Truck from "./Truck";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Console() {
  //const [tab, setTab] = useState(0);
  const [{ sock, selectedTab }, dispatch] = useStateValue();

  useEffect(() => {
    console.log("render console");
  }, []);

  const handleTabChange = (event, newValue) => {
    dispatch({ type: actionType.SELECT_TAB, payload: newValue });
  };

  return (
    <div className="tabContainer">
      <Box sx={{ borderBottom: 1, borderColor: "divider", position: "fixed", width: "100%", background: "white" }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="예약" {...a11yProps(0)} sx={{ fontWeight: "bold" }} />
          <Tab label="트럭" {...a11yProps(1)} sx={{ fontWeight: "bold" }} />
        </Tabs>
      </Box>
      <Box>
        <TabPanel value={selectedTab} index={0}>
          <Reservation tab={selectedTab}></Reservation>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Truck tab={selectedTab}></Truck>
        </TabPanel>
      </Box>
    </div>
  );
}

export default Console;
