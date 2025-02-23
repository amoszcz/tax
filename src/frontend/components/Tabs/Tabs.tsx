// Tabs.tsx
import React, { useState } from "react";
import "./Tabs.css";

interface TabsProps {
  children: (React.ReactElement | null)[];
  defaultTab?: number;
}

interface TabProps {
  label: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = () => null;

export const Tabs: React.FC<TabsProps> = ({ children, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && child.type === Tab,
    )
    .map((child) => child.props);

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab]?.children}</div>
    </div>
  );
};
