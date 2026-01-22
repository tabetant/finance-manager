import { motion } from "motion/react";
import { Home, FileText, Library, User, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function BottomNavigation({ activeView, onViewChange }: NavigationProps) {
  const [isOnline, setIsOnline] = useState(true);

  const navItems = [
    { id: "orbit", label: "Home", icon: Home, description: "Orbit" },
    { id: "tickets", label: "Tickets", icon: FileText, description: "Submissions" },
    { id: "resources", label: "Resources", icon: Library, description: "Library" },
    { id: "profile", label: "Profile", icon: User, description: "Profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Offline Indicator */}
      {!isOnline && (
        <motion.div
          className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-xs font-mono flex items-center justify-center gap-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <WifiOff className="w-3 h-3" />
          Offline Mode Active • Changes will sync when online
        </motion.div>
      )}

      {/* Navigation Bar */}
      <div className="bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all touch-manipulation"
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-accent/10 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative">
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        isActive ? "text-accent" : "text-muted-foreground"
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-mono transition-colors ${
                      isActive ? "text-accent font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Connection Status Indicator */}
        <div className="absolute top-2 right-4 flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${isOnline ? "bg-accent" : "bg-destructive"}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="text-[10px] font-mono text-muted-foreground">
            {isOnline ? "Connected" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}
