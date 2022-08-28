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
  const [tab, setTab] = useState(0);
  const [{ sock }, dispatch] = useStateValue();

  useEffect(() => {
    console.log("render console");
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className="tabContainer">
      <Box sx={{ borderBottom: 1, borderColor: "divider", position: "fixed", width: "100%", background: "white" }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="예약" {...a11yProps(0)} sx={{ fontWeight: "bold" }} />
          <Tab label="트럭" {...a11yProps(1)} sx={{ fontWeight: "bold" }} />
        </Tabs>
      </Box>
      <Box>
        <TabPanel value={tab} index={0}>
          <Reservation tab={tab}></Reservation>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Truck tab={tab}></Truck>
        </TabPanel>
      </Box>
    </div>
  );
}

export default Console;
