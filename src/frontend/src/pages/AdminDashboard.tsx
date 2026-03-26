import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { SmmPanel } from "../App";
import { useAuth } from "../context/AuthContext";

export function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Mode Banner */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20 shrink-0 z-50"
        data-ocid="admin.panel"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <Badge
            variant="outline"
            className="border-primary/40 text-primary text-xs font-semibold"
          >
            Admin Mode
          </Badge>
          {admin && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {admin.email}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 text-xs h-7"
          data-ocid="admin.delete_button"
        >
          {isLoggingOut ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <LogOut className="h-3 w-3" />
          )}
          Logout
        </Button>
      </div>

      {/* Existing SMM Panel */}
      <div className="flex-1 min-h-0">
        <SmmPanel />
      </div>
    </div>
  );
}
