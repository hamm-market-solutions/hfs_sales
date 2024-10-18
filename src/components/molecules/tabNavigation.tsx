import { Tabs, Tab } from "@nextui-org/tabs";

export default function TabNavigation({
  tabs,
  activeTabIndexState,
}: {
  tabs: {
    key: string;
    name: string;
    node: React.ReactNode;
  }[];
  activeTabIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
}) {
  return (
    <div className="multi-section-fade-out">
      <Tabs
        disabledKeys={tabs
          .slice(activeTabIndexState[0] + 1, tabs.length)
          .map((section) => section.key)}
        placement="start"
        selectedKey={
          activeTabIndexState[0] > tabs.length - 1
            ? tabs[tabs.length - 1].key
            : tabs[activeTabIndexState[0]].key
        }
        onSelectionChange={(key) => {
          activeTabIndexState[1](
            tabs.findIndex((section) => section.key === key),
          );
        }}
      >
        {tabs.map((section) => (
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
