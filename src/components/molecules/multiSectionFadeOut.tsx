"use client";

import { Tabs, Tab } from "@nextui-org/tabs";

export default function MultiSectionFadeOut({
  sections,
  activeSectionIndex,
}: {
  sections: {
    key: string;
    name: string;
    node: React.ReactNode;
  }[];
  activeSectionIndex: number;
}) {
  return (
    <div className="multi-section-fade-out">
      <Tabs
        disabledKeys={sections
          .slice(activeSectionIndex + 1, sections.length)
          .map((section) => section.key)}
        placement="start"
      >
        {sections.map((section) => (
          <Tab
            key={section.key}
            className="bg-transparent"
            title={section.name}
          >
            {section.node}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
