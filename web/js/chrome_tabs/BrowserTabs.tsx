import React from "react";
import { AppBar, Tabs, makeStyles, Theme } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { usePrefs } from "../../../apps/repository/js/persistence_layer/PrefsHook";
import { ChromeTab } from "./ChromeTab";
import { BrowserTabContent } from "./BrowserTabContent";
import {
  useBrowserTabsCallbacks,
  useBrowserTabsStore
} from "./BrowserTabsStore";

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    paddingTop: "2px",
    textTransform: "none",
    minHeight: "1.2em",
    flexShrink: 1,
    flexGrow: 1
  },
  tabsIndicator: {
    backgroundColor: "transparent"
  }
}));

export const BrowserTabs = () => {
  const classes = useStyles();

  const history = useHistory();

  const prefs = usePrefs();

  // Array of tab positions
  // Indexed by positionIndex
  const tabPositionRef = React.useRef([-1]);

  // BrowserTabsStore interface
  const { activeTab, tabs, tabContents } = useBrowserTabsStore([
    "activeTab",
    "tabs",
    "tabContents"
  ]);
  const {
    setActiveTab,
    addTab,
    removeTab,
    swapTabs
  } = useBrowserTabsCallbacks();

  // Invalidate tab positions when new tabs are added
  React.useEffect(() => {
    while (tabs.length > tabPositionRef.current.length) {
      tabPositionRef.current.push(-1);
      tabPositionRef.current.fill(-1);
    }
  }, [tabs.length]);

  // Update url when activeTab changes
  React.useEffect(() => {
    if (activeTab) {
      history.push(tabs[activeTab].url);
    } 
  }, [activeTab]);

  // Do not render if tabbed is disabled
  if (!prefs.value) {
    return null;
  }

  const tabbed = prefs.value.get('tabbed');
  if (!tabbed.isPresent() || tabbed.get() === "false") {
    return null;
  }

  // Change tabs
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  // Close tab
  const closeTab = (positionIndex: number) => {
    // If the current tab was deleted, switch to previous tab
    if (activeTab === positionIndex) {
      const newActiveTab = Math.max(activeTab - 1, 0);
      setActiveTab(newActiveTab);
    }

    // Create callback function that finishes removal
    const finishClose = () => {
      removeTab(positionIndex);

      tabPositionRef.current = tabPositionRef.current.splice(positionIndex, 1);
      tabPositionRef.current.fill(-1);
    };

    return finishClose;
  };

  // Handling tab dragging
  const handleUpdateX = (x: number, positionIndex: number) => {
    tabPositionRef.current[positionIndex] = x;
  };
  const getUpdateX = (): boolean => {
    return tabPositionRef.current.includes(-1);
  };
  const handleDrag = (x: number, positionIndex: number): boolean => {
    const calculateMidpoint = (leftIndex: number) => {
      const val1 = tabPositionRef.current[leftIndex] / 2;
      const val2 = tabPositionRef.current[leftIndex + 1] / 2;
      return val1 + val2;
    };

    if (positionIndex > 0) {
      const leftBoundary = calculateMidpoint(positionIndex - 1);
      if (x < leftBoundary) {
        swapTabs(positionIndex, positionIndex - 1);
        setActiveTab(positionIndex - 1);
        return true;
      }
    }

    if (positionIndex < tabPositionRef.current.length - 1) {
      const rightBoundary = calculateMidpoint(positionIndex);
      if (x > rightBoundary) {
        swapTabs(positionIndex, positionIndex + 1);
        setActiveTab(positionIndex + 1);
        return true;
      }
    }

    return false;
  };

  return (
    <div
      style={{
        /* height: "600px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1 */
      }}
    >
      <AppBar
        position="static"
        color="default"
        style={{ flexDirection: "row" }}
      >
        <Tabs
          className={classes.tabs}
          classes={{ indicator: classes.tabsIndicator }}
          value={activeTab}
          onChange={handleChange}
          scrollButtons="off"
          aria-label="scrollable auto tabs example"
        >
          {tabs.map((tabDescriptor, positionIndex) => (
            <ChromeTab
              label={tabDescriptor.title}
              url={tabDescriptor.url}
              positionIndex={positionIndex}
              onChange={handleChange}
              tabIndex={tabDescriptor.tabContentIndex}
              currentValue={activeTab!}
              key={tabDescriptor.tabContentIndex}
              onClose={() => closeTab(positionIndex)}
              onUpdateX={handleUpdateX}
              shouldUpdateX={getUpdateX()}
              onDrag={handleDrag}
            />
          ))}
        </Tabs>
      </AppBar>
      {/*tabContents.map(
        (tabContentDescriptor, tabContentIndex) =>
          tabContentDescriptor.url !== undefined && (
            <BrowserTabContent
              value={tabs[activeTab!].tabContentIndex}
              index={tabContentIndex}
              key={tabContentIndex}
            >
              <iframe
                src={tabContentDescriptor.url}
                frameBorder="0"
                style={{ flexGrow: 1 }}
              />
            </BrowserTabContent>
          )
      )*/}
    </div>
  );
};
