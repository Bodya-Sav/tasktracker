import { Badge } from "./badge";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, Hourglass, LayoutList } from "lucide-react";

interface BottomTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  counts: {
    todo: number;
    in_progress: number;
    done: number;
  };
}

const tabs = [
  { value: "todo", label: "To Do", icon: LayoutList },
  { value: "in_progress", label: "In Progress", icon: Hourglass },
  { value: "done", label: "Done", icon: CheckCheck },
];

export function BottomTabs({
  activeTab,
  onTabChange,
  counts,
}: BottomTabsProps) {
  return (
    <div className="fixed bottom-6 inset-x-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="relative flex w-full justify-evenly h-16 rounded-[28px] bg-muted/95 px-2 py-0 border border-muted-foreground/20">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`relative flex-1 text-base py-3 data-[state=active]:text-white transition-all duration-200 ${activeTab === tab.value ? "" : ""}`}>
              {activeTab === tab.value && (
                <motion.div
                  layout="position"
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#8A2BE2] to-[#00FFFF] shadow"
                  transition={{ type: "tween", ease: "easeInOut", duration: 0 }}
                />
              )}
              <span className="relative z-10 flex items-center">
                <tab.icon />
                <AnimatePresence>
                  {activeTab === tab.value && (
                    <motion.span
                      key={`${tab.value}-text`}
                      initial={{ opacity: 0, width: 0, marginLeft: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        width: "auto",
                        marginLeft: "0.5rem",
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 700,
                          damping: 30,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        width: 0,
                        marginLeft: 0,
                        transition: { duration: 0.2 },
                      }}>
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {activeTab === tab.value && (
                  <Badge variant="secondary" className="ml-2">
                    {counts[tab.value as keyof typeof counts]}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export default BottomTabs;
