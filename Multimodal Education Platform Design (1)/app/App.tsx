import { useState } from "react";
import { StudentView } from "./components/student-view";
import { TicketSubmission } from "./components/ticket-submission";
import { MentorDashboard } from "./components/mentor-dashboard";
import { BottomNavigation } from "./components/bottom-navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState("orbit");
  const [userRole, setUserRole] = useState<"student" | "mentor">("student");

  const renderView = () => {
    if (userRole === "student") {
      switch (activeView) {
        case "tickets":
          return <TicketSubmission />;
        default:
          return <StudentView />;
      }
    } else {
      return <MentorDashboard />;
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      {/* Role Switcher - Top Right */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <motion.button
          onClick={() => setUserRole("student")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all backdrop-blur-sm ${
            userRole === "student"
              ? "bg-accent text-accent-foreground shadow-lg"
              : "bg-card/50 border border-border text-foreground hover:bg-card/80"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Student
          </div>
        </motion.button>
        <motion.button
          onClick={() => setUserRole("mentor")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all backdrop-blur-sm ${
            userRole === "mentor"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card/50 border border-border text-foreground hover:bg-card/80"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Mentor
          </div>
        </motion.button>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${userRole}-${activeView}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNavigation activeView={activeView} onViewChange={setActiveView} />

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
