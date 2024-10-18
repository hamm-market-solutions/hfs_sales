"use client";

import { routes } from "@/config/routes";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TabNavigation({
  tabs,
}: {
  tabs: {
    key: string;
    name: string;
    node: React.ReactNode;
    state: [string, (value: string) => void];
    oldState: [string, (value: string) => void];
  }[];
}) {
  const [activeTagIndex, setActiveTabIndex] = useState(0);

  tabs.forEach((tab, index) => {
    if (index === activeTagIndex) {
      if (tab.state[0] !== tab.oldState[0]) {
        tab.oldState[1](tab.state[0]);
        setActiveTabIndex(activeTagIndex + 1);
      }
    }
  });

  // clear all states after and inclusive the active tab
  // tabs.forEach((section, index) => {
  //   if (index >= activeTagIndex) {
  //     section.state[1]("");
  //   }
  // });

  return (
    <div className="multi-section-fade-out">
      <Tabs
        disabledKeys={tabs
          .slice(activeTagIndex + 1, tabs.length)
          .map((section) => section.key)}
        placement="start"
        selectedKey={
          activeTagIndex > tabs.length - 1
            ? tabs[tabs.length - 1].key
            : tabs[activeTagIndex].key
        }
        onSelectionChange={(key) => {
          const activeTabToBe = tabs.findIndex(
            (section) => section.key === key,
          );

          tabs[activeTagIndex].oldState[1]("");
          tabs[activeTagIndex].state[1]("");
          setActiveTabIndex(activeTabToBe);
        }}
      >
        {tabs.map((section) => (
          <Tab
            key={section.key}
            className="bg-transparent"
            title={section.name}
          >
            <Button
              className={`${section.key}-tab-node`}
              onPress={() => {
                console.log(section.key);

                section.state[1](section.key);
              }}
            >
              {section.node}
            </Button>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
