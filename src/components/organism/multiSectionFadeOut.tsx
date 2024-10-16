"use client";

import { useState } from "react";

export default function MultiSectionFadeOut({
  sections,
}: {
  sections: {
    name: string;
    node: React.ReactNode;
    // nextNodeLogic: () => boolean;
    // previousNodeLogic?: () => boolean;
  }[];
}) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(
    sections[currentSectionIndex],
  );

  //   if (currentSection.nextNodeLogic()) {
  //     setCurrentSectionIndex(currentSectionIndex + 1);
  //     setCurrentSection(sections[currentSectionIndex]);
  //   }
  //   if (currentSection.previousNodeLogic && currentSection.previousNodeLogic()) {
  //     setCurrentSectionIndex(currentSectionIndex - 1);
  //     setCurrentSection(sections[currentSectionIndex]);
  //   }

  //   const navigationItems = sections.map((section, index) => {
  //     return (
  //       <Button key={section.name} onClick={() => setCurrentSectionIndex(index)}>
  //         {section.name}
  //       </Button>
  //     );
  //   });

  return (
    <div className="multi-section-fade-out">
      {/* <ButtonGroup>{navigationItems}</ButtonGroup> */}
      {currentSection.node}
    </div>
  );
}
