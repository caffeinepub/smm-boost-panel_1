import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Edit2,
  Eye,
  EyeOff,
  Facebook,
  HeadphonesIcon,
  Instagram,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Send,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
  Twitter,
  Users,
  Wallet,
  X,
  XCircle,
  Youtube,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "admin" | "user";
type View =
  | "login"
  | "register"
  | "dashboard"
  | "new-order"
  | "orders"
  | "add-funds"
  | "tickets"
  | "admin-dashboard"
  | "admin-users"
  | "admin-services"
  | "admin-orders"
  | "admin-recharges"
  | "admin-tickets";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  balance: number;
  createdAt: string;
}

interface Service {
  id: string;
  category: string;
  name: string;
  pricePerThousand: number;
  minOrder: number;
  maxOrder: number;
  enabled: boolean;
}

interface Order {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  link: string;
  quantity: number;
  price: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
}

interface Recharge {
  id: string;
  userId: string;
  username: string;
  amount: number;
  utrId: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

interface Ticket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  messages: { sender: string; text: string; time: string }[];
  status: "Open" | "Replied" | "Closed";
  createdAt: string;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_SERVICES: Service[] = [
  // Instagram
  {
    id: "ig1",
    category: "Instagram",
    name: "Instagram Followers",
    pricePerThousand: 89,
    minOrder: 100,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "ig2",
    category: "Instagram",
    name: "Instagram Likes",
    pricePerThousand: 29,
    minOrder: 50,
    maxOrder: 50000,
    enabled: true,
  },
  {
    id: "ig3",
    category: "Instagram",
    name: "Instagram Views",
    pricePerThousand: 19,
    minOrder: 100,
    maxOrder: 1000000,
    enabled: true,
  },
  {
    id: "ig4",
    category: "Instagram",
    name: "Instagram Story Views",
    pricePerThousand: 25,
    minOrder: 100,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "ig5",
    category: "Instagram",
    name: "Instagram Comments",
    pricePerThousand: 199,
    minOrder: 10,
    maxOrder: 1000,
    enabled: true,
  },
  {
    id: "ig6",
    category: "Instagram",
    name: "Instagram Saves",
    pricePerThousand: 49,
    minOrder: 50,
    maxOrder: 10000,
    enabled: true,
  },
  {
    id: "ig7",
    category: "Instagram",
    name: "Instagram Reel Views",
    pricePerThousand: 15,
    minOrder: 100,
    maxOrder: 1000000,
    enabled: true,
  },
  // YouTube
  {
    id: "yt1",
    category: "YouTube",
    name: "YouTube Views",
    pricePerThousand: 39,
    minOrder: 100,
    maxOrder: 1000000,
    enabled: true,
  },
  {
    id: "yt2",
    category: "YouTube",
    name: "YouTube Subscribers",
    pricePerThousand: 299,
    minOrder: 50,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "yt3",
    category: "YouTube",
    name: "YouTube Likes",
    pricePerThousand: 49,
    minOrder: 50,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "yt4",
    category: "YouTube",
    name: "YouTube Watch Hours",
    pricePerThousand: 599,
    minOrder: 100,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "yt5",
    category: "YouTube",
    name: "YouTube Comments",
    pricePerThousand: 249,
    minOrder: 5,
    maxOrder: 500,
    enabled: true,
  },
  // Telegram
  {
    id: "tg1",
    category: "Telegram",
    name: "Telegram Members",
    pricePerThousand: 149,
    minOrder: 100,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "tg2",
    category: "Telegram",
    name: "Telegram Post Views",
    pricePerThousand: 19,
    minOrder: 100,
    maxOrder: 1000000,
    enabled: true,
  },
  {
    id: "tg3",
    category: "Telegram",
    name: "Telegram Reactions",
    pricePerThousand: 59,
    minOrder: 50,
    maxOrder: 10000,
    enabled: true,
  },
  {
    id: "tg4",
    category: "Telegram",
    name: "Telegram Channel Subscribers",
    pricePerThousand: 199,
    minOrder: 100,
    maxOrder: 100000,
    enabled: true,
  },
  // Facebook
  {
    id: "fb1",
    category: "Facebook",
    name: "Facebook Page Likes",
    pricePerThousand: 99,
    minOrder: 100,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "fb2",
    category: "Facebook",
    name: "Facebook Post Likes",
    pricePerThousand: 39,
    minOrder: 50,
    maxOrder: 50000,
    enabled: true,
  },
  {
    id: "fb3",
    category: "Facebook",
    name: "Facebook Views",
    pricePerThousand: 29,
    minOrder: 100,
    maxOrder: 1000000,
    enabled: true,
  },
  {
    id: "fb4",
    category: "Facebook",
    name: "Facebook Followers",
    pricePerThousand: 79,
    minOrder: 100,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "fb5",
    category: "Facebook",
    name: "Facebook Comments",
    pricePerThousand: 199,
    minOrder: 5,
    maxOrder: 500,
    enabled: true,
  },
  {
    id: "fb6",
    category: "Facebook",
    name: "Facebook Shares",
    pricePerThousand: 149,
    minOrder: 10,
    maxOrder: 10000,
    enabled: true,
  },
  // Twitter
  {
    id: "tw1",
    category: "Twitter",
    name: "Twitter Followers",
    pricePerThousand: 129,
    minOrder: 100,
    maxOrder: 100000,
    enabled: true,
  },
  {
    id: "tw2",
    category: "Twitter",
    name: "Twitter Likes",
    pricePerThousand: 49,
    minOrder: 50,
    maxOrder: 50000,
    enabled: true,
  },
  {
    id: "tw3",
    category: "Twitter",
    name: "Twitter Retweets",
    pricePerThousand: 89,
    minOrder: 50,
    maxOrder: 10000,
    enabled: true,
  },
  {
    id: "tw4",
    category: "Twitter",
    name: "Twitter Views",
    pricePerThousand: 29,
    minOrder: 100,
    maxOrder: 1000000,
    enabled: true,
  },
];

const SEED_USERS: User[] = [
  {
    id: "admin1",
    name: "Admin",
    email: "admin@smmboost.in",
    username: "admin",
    password: "admin123",
    role: "admin",
    balance: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user1",
    name: "Demo User",
    email: "demo@example.com",
    username: "demo",
    password: "demo123",
    role: "user",
    balance: 500,
    createdAt: new Date().toISOString(),
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: "ord1",
    userId: "user1",
    serviceId: "ig1",
    serviceName: "Instagram Followers",
    link: "https://instagram.com/demouser",
    quantity: 500,
    price: 44.5,
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "ord2",
    userId: "user1",
    serviceId: "yt1",
    serviceName: "YouTube Views",
    link: "https://youtube.com/watch?v=demo",
    quantity: 1000,
    price: 39,
    status: "Processing",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ord3",
    userId: "user1",
    serviceId: "tg1",
    serviceName: "Telegram Members",
    link: "https://t.me/demochannel",
    quantity: 200,
    price: 29.8,
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
];

// ─── Storage Helpers ─────────────────────────────────────────────────────────
function initStorage() {
  if (!localStorage.getItem("smm_users")) {
    localStorage.setItem("smm_users", JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem("smm_services")) {
    localStorage.setItem("smm_services", JSON.stringify(SEED_SERVICES));
  }
  if (!localStorage.getItem("smm_orders")) {
    localStorage.setItem("smm_orders", JSON.stringify(SEED_ORDERS));
  }
  if (!localStorage.getItem("smm_tickets")) {
    localStorage.setItem("smm_tickets", JSON.stringify([]));
  }
  if (!localStorage.getItem("smm_recharges")) {
    localStorage.setItem("smm_recharges", JSON.stringify([]));
  }
}

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem("smm_users") || "[]");
}
function saveUsers(u: User[]) {
  localStorage.setItem("smm_users", JSON.stringify(u));
}
function getServices(): Service[] {
  return JSON.parse(localStorage.getItem("smm_services") || "[]");
}
function saveServices(s: Service[]) {
  localStorage.setItem("smm_services", JSON.stringify(s));
}
function getOrders(): Order[] {
  return JSON.parse(localStorage.getItem("smm_orders") || "[]");
}
function saveOrders(o: Order[]) {
  localStorage.setItem("smm_orders", JSON.stringify(o));
}
function getTickets(): Ticket[] {
  return JSON.parse(localStorage.getItem("smm_tickets") || "[]");
}
function saveTickets(t: Ticket[]) {
  localStorage.setItem("smm_tickets", JSON.stringify(t));
}
function getRecharges(): Recharge[] {
  return JSON.parse(localStorage.getItem("smm_recharges") || "[]");
}
function saveRecharges(r: Recharge[]) {
  localStorage.setItem("smm_recharges", JSON.stringify(r));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-4 h-4" />,
  YouTube: <Youtube className="w-4 h-4" />,
  Telegram: <Send className="w-4 h-4" />,
  Facebook: <Facebook className="w-4 h-4" />,
  Twitter: <Twitter className="w-4 h-4" />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Completed: "bg-green-500/20 text-green-400 border-green-500/30",
    Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    Open: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Replied: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    Approved: "bg-green-500/20 text-green-400 border-green-500/30",
    Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const USER_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "new-order", label: "New Order", icon: ShoppingCart },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "add-funds", label: "Add Funds", icon: Wallet },
  { id: "tickets", label: "Support", icon: MessageSquare },
];

const ADMIN_NAV = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "admin-users", label: "Users", icon: Users },
  { id: "admin-services", label: "Services", icon: Settings },
  { id: "admin-orders", label: "Orders", icon: Package },
  { id: "admin-recharges", label: "Recharges", icon: CreditCard },
  { id: "admin-tickets", label: "Tickets", icon: MessageSquare },
];

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  user: User;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

function Sidebar({
  view,
  setView,
  user,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const nav = user.role === "admin" ? ADMIN_NAV : USER_NAV;

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-display font-bold text-sm text-foreground leading-tight">
            SMM Boost
          </div>
          <div className="text-xs text-muted-foreground">Panel</div>
        </div>
        <button
          type="button"
          className="ml-auto lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* User pill */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.name}</div>
            {user.role === "user" && (
              <div className="text-xs text-primary font-semibold">
                {formatINR(user.balance)}
              </div>
            )}
            {user.role === "admin" && (
              <div className="text-xs text-yellow-400 font-semibold">
                Administrator
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => {
              setView(item.id as View);
              setMobileOpen(false);
            }}
            className={`sidebar-nav-item w-full ${view === item.id ? "active" : ""}`}
            data-ocid={`nav.${item.id}.link`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          type="button"
          onClick={onLogout}
          className="sidebar-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          data-ocid="nav.logout.button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-sidebar border-r border-border h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border flex flex-col animate-fade-in">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage({ user }: { user: User }) {
  const orders = getOrders().filter((o) => o.userId === user.id);
  const stats = [
    {
      label: "Total Balance",
      value: formatINR(user.balance),
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "Pending").length.toString(),
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === "Completed").length.toString(),
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold">
          Welcome back, {user.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's an overview of your account.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={i}
            className="stat-card hover:border-primary/30 transition-colors"
            data-ocid={"dashboard.stat.card"}
          >
            <div
              className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}
            >
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-xl font-display font-bold ${s.color}`}>
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  #
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Service
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  Qty
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Price
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o, idx) => (
                <tr
                  key={o.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  data-ocid={`dashboard.orders.item.${idx + 1}`}
                >
                  <td className="px-5 py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="px-5 py-3 font-medium max-w-[150px] truncate">
                    {o.serviceName}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                    {o.quantity.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-primary font-semibold">
                    {formatINR(o.price)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-muted-foreground"
                    data-ocid="dashboard.orders.empty_state"
                  >
                    No orders yet. Place your first order!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── New Order Page ───────────────────────────────────────────────────────────
function NewOrderPage({
  user,
  onOrderPlaced,
}: { user: User; onOrderPlaced: (newBalance: number) => void }) {
  const services = getServices().filter((s) => s.enabled);
  const categories = [
    "Instagram",
    "YouTube",
    "Telegram",
    "Facebook",
    "Twitter",
  ];
  const [activeCategory, setActiveCategory] = useState("Instagram");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [loading, setLoading] = useState(false);

  const categoryServices = services.filter(
    (s) => s.category === activeCategory,
  );
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const totalPrice = selectedService
    ? (quantity / 1000) * selectedService.pricePerThousand
    : 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    const first = services.find((s) => s.category === activeCategory);
    setSelectedServiceId(first?.id || "");
    setQuantity(first?.minOrder || 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (selectedService) setQuantity(selectedService.minOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId]);

  const handlePlaceOrder = () => {
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }
    if (!link.trim()) {
      toast.error("Please enter a link/URL");
      return;
    }
    if (
      quantity < selectedService.minOrder ||
      quantity > selectedService.maxOrder
    ) {
      toast.error(
        `Quantity must be between ${selectedService.minOrder} and ${selectedService.maxOrder}`,
      );
      return;
    }
    if (user.balance < totalPrice) {
      toast.error("Insufficient balance. Please add funds.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      const newBalance = user.balance - totalPrice;
      users[idx].balance = newBalance;
      saveUsers(users);

      const orders = getOrders();
      orders.push({
        id: genId(),
        userId: user.id,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        link,
        quantity,
        price: Number.parseFloat(totalPrice.toFixed(2)),
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
      saveOrders(orders);
      onOrderPlaced(newBalance);
      toast.success("Order placed successfully!");
      setLink("");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold">New Order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Choose a service and boost your social media presence.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="bg-card border border-border rounded-xl p-5">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-ocid={`order.${cat.toLowerCase()}.tab`}
              >
                {CATEGORY_ICONS[cat]}
                <span className="hidden sm:inline">{cat}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-5 space-y-5">
              {/* Service select */}
              <div className="space-y-2">
                <Label>Select Service</Label>
                <div className="grid gap-2">
                  {categoryServices.map((svc) => (
                    <button
                      type="button"
                      key={svc.id}
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${
                        selectedServiceId === svc.id
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-muted/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                      data-ocid={"order.service.button"}
                    >
                      <span className="font-medium">{svc.name}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-primary font-semibold">
                          {formatINR(svc.pricePerThousand)}/1K
                        </span>
                        <span className="text-muted-foreground">
                          Min: {svc.minOrder.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedService && (
                <>
                  {/* Link */}
                  <div className="space-y-2">
                    <Label htmlFor="order-link">Link / URL</Label>
                    <Input
                      id="order-link"
                      placeholder="https://instagram.com/yourusername"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="bg-muted/30"
                      data-ocid="order.link.input"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Quantity</Label>
                      <span className="text-sm text-muted-foreground">
                        {quantity.toLocaleString("en-IN")} / max{" "}
                        {selectedService.maxOrder.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <Slider
                      min={selectedService.minOrder}
                      max={Math.min(selectedService.maxOrder, 10000)}
                      step={selectedService.minOrder}
                      value={[quantity]}
                      onValueChange={([v]) => setQuantity(v)}
                      className="[&_[role=slider]]:bg-primary"
                    />
                    <Input
                      type="number"
                      value={quantity}
                      min={selectedService.minOrder}
                      max={selectedService.maxOrder}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="bg-muted/30 w-40"
                      data-ocid="order.quantity.input"
                    />
                  </div>

                  {/* Price calculator */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Total Price
                      </div>
                      <div className="text-2xl font-display font-bold text-primary">
                        {formatINR(totalPrice)}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>Balance: {formatINR(user.balance)}</div>
                      <div>
                        After:{" "}
                        {formatINR(Math.max(0, user.balance - totalPrice))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-yellow font-semibold"
                    data-ocid="order.submit_button"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// ─── Orders Page ──────────────────────────────────────────────────────────────
function OrdersPage({ user }: { user: User }) {
  const [filter, setFilter] = useState("All");
  const allOrders = getOrders().filter((o) => o.userId === user.id);
  const statuses = ["All", "Pending", "Processing", "Completed", "Cancelled"];
  const filtered =
    filter === "All" ? allOrders : allOrders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track all your orders in one place.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
            data-ocid={"orders.filter.tab"}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="orders.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  #
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Service
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  Link
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Qty
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, idx) => (
                <tr
                  key={o.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  data-ocid={`orders.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium max-w-[150px] truncate">
                    {o.serviceName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[120px] truncate hidden md:table-cell">
                    {o.link}
                  </td>
                  <td className="px-4 py-3">
                    {o.quantity.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-primary font-semibold">
                    {formatINR(o.price)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {new Date(o.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                    data-ocid="orders.empty_state"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Add Funds Page ───────────────────────────────────────────────────────────
function AddFundsPage({ user }: { user: User }) {
  const [amount, setAmount] = useState("");
  const [utrId, setUtrId] = useState("");
  const [loading, setLoading] = useState(false);
  const recharges = getRecharges().filter((r) => r.userId === user.id);

  const handleSubmit = () => {
    if (!amount || Number(amount) < 10) {
      toast.error("Minimum recharge amount is ₹10");
      return;
    }
    if (!utrId.trim()) {
      toast.error("Please enter UTR/Transaction ID");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const r = getRecharges();
      r.push({
        id: genId(),
        userId: user.id,
        username: user.username,
        amount: Number(amount),
        utrId: utrId.trim(),
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
      saveRecharges(r);
      toast.success(
        "Recharge request submitted! Funds will be added after verification.",
      );
      setAmount("");
      setUtrId("");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Add Funds</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Top up your wallet via UPI payment.
        </p>
      </div>

      {/* QR Code Card */}
      <div className="bg-card border-2 border-blue-500/40 rounded-xl p-6 glow-blue">
        <div className="text-center mb-5">
          <h2 className="font-display font-bold text-lg">Pay via UPI</h2>
          <p className="text-muted-foreground text-sm">
            Scan the QR code using any UPI app
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-xl shadow-glow-blue">
            <img
              src="/assets/uploads/img_20260325_184702-019d28cc-a5ed-74ba-a898-c8ccb2a1509c-1.jpg"
              alt="UPI QR Code"
              className="w-52 h-52 object-contain rounded-lg"
            />
          </div>
        </div>

        <div className="bg-muted/40 rounded-lg p-4 text-sm space-y-2 mb-5">
          <h3 className="font-semibold text-foreground mb-2">How to Pay:</h3>
          {[
            "Open any UPI app (PhonePe, GPay, Paytm, etc.)",
            "Scan this QR code",
            "Enter the amount you want to add",
            "Complete the payment",
            "Copy the UTR/Transaction ID and enter below",
          ].map((step, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static ordered list
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              className="flex items-start gap-2 text-muted-foreground"
            >
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (min ₹10)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-muted/30"
              data-ocid="funds.amount.input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="utr">UTR / Transaction ID</Label>
            <Input
              id="utr"
              placeholder="Enter 12-digit UTR number"
              value={utrId}
              onChange={(e) => setUtrId(e.target.value)}
              className="bg-muted/30"
              data-ocid="funds.utr.input"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow-yellow"
            data-ocid="funds.submit_button"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            {loading ? "Submitting..." : "Submit Recharge Request"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            ⏱ Funds will be added within 1-2 hours after verification
          </p>
        </div>
      </div>

      {/* Recharge History */}
      {recharges.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-semibold">Recharge History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    UTR ID
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recharges.map((r, idx) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/50"
                    data-ocid={`funds.recharge.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-primary font-semibold">
                      {formatINR(r.amount)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {r.utrId}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tickets Page ─────────────────────────────────────────────────────────────
function TicketsPage({ user }: { user: User }) {
  const [tickets, setTickets] = useState<Ticket[]>(() =>
    getTickets().filter((t) => t.userId === user.id),
  );
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = () =>
    setTickets(getTickets().filter((t) => t.userId === user.id));

  const handleCreate = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const all = getTickets();
      const ticket: Ticket = {
        id: genId(),
        userId: user.id,
        username: user.username,
        subject,
        messages: [
          {
            sender: user.username,
            text: message,
            time: new Date().toISOString(),
          },
        ],
        status: "Open",
        createdAt: new Date().toISOString(),
      };
      all.push(ticket);
      saveTickets(all);
      refresh();
      setSubject("");
      setMessage("");
      toast.success("Ticket created!");
      setLoading(false);
    }, 500);
  };

  const handleReply = () => {
    if (!reply.trim() || !activeTicket) return;
    const all = getTickets();
    const idx = all.findIndex((t) => t.id === activeTicket.id);
    all[idx].messages.push({
      sender: user.username,
      text: reply,
      time: new Date().toISOString(),
    });
    saveTickets(all);
    setReply("");
    setActiveTicket(all[idx]);
    refresh();
  };

  if (activeTicket) {
    const current =
      getTickets().find((t) => t.id === activeTicket.id) || activeTicket;
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTicket(null)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm"
        >
          ← Back to tickets
        </button>
        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold">{current.subject}</h2>
              <p className="text-xs text-muted-foreground">
                Ticket #{current.id}
              </p>
            </div>
            <StatusBadge status={current.status} />
          </div>
          <div className="p-5 space-y-3 max-h-80 overflow-y-auto">
            {current.messages.map((m, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={i}
                className={`flex gap-3 ${m.sender === user.username ? "flex-row-reverse" : ""}`}
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs flex-shrink-0">
                  {m.sender[0].toUpperCase()}
                </div>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-xl text-sm ${m.sender === user.username ? "bg-primary/20 text-foreground" : "bg-muted/50 text-foreground"}`}
                >
                  <p>{m.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(m.time).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {current.status !== "Closed" && (
            <div className="px-5 py-4 border-t border-border flex gap-2">
              <Textarea
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="bg-muted/30 text-sm resize-none"
                rows={2}
                data-ocid="ticket.reply.textarea"
              />
              <Button
                onClick={handleReply}
                className="self-end bg-primary text-primary-foreground"
                data-ocid="ticket.reply.submit_button"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold">Support Tickets</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Get help from our support team.
        </p>
      </div>

      {/* Create ticket */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold">Create New Ticket</h3>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Describe your issue briefly"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-muted/30"
            data-ocid="ticket.subject.input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ticket-msg">Message</Label>
          <Textarea
            id="ticket-msg"
            placeholder="Provide details..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="bg-muted/30"
            data-ocid="ticket.message.textarea"
          />
        </div>
        <Button
          onClick={handleCreate}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="ticket.submit_button"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4 mr-2" />
          )}
          Submit Ticket
        </Button>
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {tickets.map((t, idx) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setActiveTicket(t)}
            className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all"
            data-ocid={`ticket.item.${idx + 1}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.messages.length} message(s) ·{" "}
                  {new Date(t.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <StatusBadge status={t.status} />
            </div>
          </button>
        ))}
        {tickets.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="ticket.empty_state"
          >
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No tickets yet. Create one if you need help.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const users = getUsers().filter((u) => u.role === "user");
  const orders = getOrders();
  const recharges = getRecharges();
  const revenue = orders
    .filter((o) => o.status === "Completed")
    .reduce((a, b) => a + b.price, 0);

  const stats = [
    {
      label: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Revenue",
      value: formatINR(revenue),
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Pending Recharges",
      value: recharges.filter((r) => r.status === "Pending").length.toString(),
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Overview of the entire platform.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={i}
            className="stat-card hover:border-primary/30 transition-colors"
          >
            <div
              className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}
            >
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-xl font-display font-bold ${s.color}`}>
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  User
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Service
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o, idx) => (
                <tr
                  key={o.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.orders.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {o.userId}
                  </td>
                  <td className="px-4 py-3 font-medium">{o.serviceName}</td>
                  <td className="px-4 py-3 text-primary font-semibold">
                    {formatINR(o.price)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Users ──────────────────────────────────────────────────────────────
function AdminUsers() {
  const [users, setUsers] = useState<User[]>(() =>
    getUsers().filter((u) => u.role === "user"),
  );
  const [editId, setEditId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState("");

  const handleSave = (id: string) => {
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === id);
    all[idx].balance = Number(editBalance);
    saveUsers(all);
    setUsers(all.filter((u) => u.role === "user"));
    setEditId(null);
    toast.success("Balance updated!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">Manage Users</h1>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="admin.users.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Username
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Balance
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Orders
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const orders = getOrders().filter((o) => o.userId === u.id);
                return (
                  <tr
                    key={u.id}
                    className="border-b border-border/50"
                    data-ocid={`admin.users.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 font-medium">{u.username}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.name}
                    </td>
                    <td className="px-4 py-3">
                      {editId === u.id ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            value={editBalance}
                            onChange={(e) => setEditBalance(e.target.value)}
                            className="h-7 w-28 bg-muted/30 text-xs"
                            data-ocid="admin.users.balance.input"
                          />
                          <button
                            type="button"
                            onClick={() => handleSave(u.id)}
                            className="text-green-400 hover:text-green-300"
                            data-ocid="admin.users.save_button"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-primary font-semibold">
                          {formatINR(u.balance)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {orders.length}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(u.id);
                          setEditBalance(u.balance.toString());
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        data-ocid="admin.users.edit_button"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                    data-ocid="admin.users.empty_state"
                  >
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Services ───────────────────────────────────────────────────────────
function AdminServices() {
  const [services, setServices] = useState<Service[]>(getServices);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const toggleService = (id: string) => {
    const all = getServices();
    const idx = all.findIndex((s) => s.id === id);
    all[idx].enabled = !all[idx].enabled;
    saveServices(all);
    setServices([...all]);
  };

  const handleSavePrice = (id: string) => {
    const all = getServices();
    const idx = all.findIndex((s) => s.id === id);
    all[idx].pricePerThousand = Number(editPrice);
    saveServices(all);
    setServices([...all]);
    setEditId(null);
    toast.success("Price updated!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">Manage Services</h1>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="admin.services.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Service
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Price/1K
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, idx) => (
                <tr
                  key={s.id}
                  className="border-b border-border/50"
                  data-ocid={`admin.services.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.category}
                  </td>
                  <td className="px-4 py-3">
                    {editId === s.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="h-7 w-24 bg-muted/30 text-xs"
                          data-ocid="admin.services.price.input"
                        />
                        <button
                          type="button"
                          onClick={() => handleSavePrice(s.id)}
                          className="text-green-400"
                          data-ocid="admin.services.save_button"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-primary font-semibold">
                        {formatINR(s.pricePerThousand)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={s.enabled ? "Approved" : "Cancelled"}
                    />
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(s.id);
                        setEditPrice(s.pricePerThousand.toString());
                      }}
                      className="text-muted-foreground hover:text-primary"
                      data-ocid="admin.services.edit_button"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleService(s.id)}
                      className={`text-xs px-2 py-1 rounded border transition-all ${s.enabled ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-green-500/30 text-green-400 hover:bg-green-500/10"}`}
                      data-ocid="admin.services.toggle"
                    >
                      {s.enabled ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Orders ─────────────────────────────────────────────────────────────
function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(getOrders);

  const updateStatus = (id: string, status: Order["status"]) => {
    const all = getOrders();
    const idx = all.findIndex((o) => o.id === id);
    all[idx].status = status;
    saveOrders(all);
    setOrders([...all]);
    toast.success("Order status updated!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">All Orders</h1>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Service
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  User
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Qty
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Update
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr
                  key={o.id}
                  className="border-b border-border/50"
                  data-ocid={`admin.all_orders.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium max-w-[130px] truncate">
                    {o.serviceName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                    {o.userId}
                  </td>
                  <td className="px-4 py-3">
                    {o.quantity.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-primary font-semibold">
                    {formatINR(o.price)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(o.id, e.target.value as Order["status"])
                      }
                      className="text-xs bg-muted border border-border rounded px-2 py-1 text-foreground"
                      data-ocid="admin.orders.status.select"
                    >
                      {["Pending", "Processing", "Completed", "Cancelled"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                    data-ocid="admin.all_orders.empty_state"
                  >
                    No orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Recharges ──────────────────────────────────────────────────────────
function AdminRecharges() {
  const [recharges, setRecharges] = useState<Recharge[]>(getRecharges);

  const handle = (id: string, action: "Approved" | "Rejected") => {
    const all = getRecharges();
    const idx = all.findIndex((r) => r.id === id);
    if (action === "Approved") {
      const users = getUsers();
      const uIdx = users.findIndex((u) => u.id === all[idx].userId);
      if (uIdx !== -1) {
        users[uIdx].balance += all[idx].amount;
        saveUsers(users);
      }
    }
    all[idx].status = action;
    saveRecharges(all);
    setRecharges([...all]);
    toast.success(`Recharge ${action.toLowerCase()}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">Recharge Requests</h1>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  User
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  UTR ID
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recharges.map((r, idx) => (
                <tr
                  key={r.id}
                  className="border-b border-border/50"
                  data-ocid={`admin.recharges.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{r.username}</td>
                  <td className="px-4 py-3 text-primary font-semibold">
                    {formatINR(r.amount)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {r.utrId}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handle(r.id, "Approved")}
                          className="text-xs px-2.5 py-1 rounded border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all"
                          data-ocid="admin.recharges.confirm_button"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handle(r.id, "Rejected")}
                          className="text-xs px-2.5 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                          data-ocid="admin.recharges.cancel_button"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {recharges.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                    data-ocid="admin.recharges.empty_state"
                  >
                    No recharge requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Tickets ────────────────────────────────────────────────────────────
function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(getTickets);
  const [active, setActive] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");

  const refresh = () => setTickets(getTickets());

  const handleReply = () => {
    if (!reply.trim() || !active) return;
    const all = getTickets();
    const idx = all.findIndex((t) => t.id === active.id);
    all[idx].messages.push({
      sender: "Admin",
      text: reply,
      time: new Date().toISOString(),
    });
    all[idx].status = "Replied";
    saveTickets(all);
    setActive(all[idx]);
    setReply("");
    refresh();
    toast.success("Reply sent!");
  };

  const closeTicket = (id: string) => {
    const all = getTickets();
    const idx = all.findIndex((t) => t.id === id);
    all[idx].status = "Closed";
    saveTickets(all);
    refresh();
    setActive(null);
    toast.success("Ticket closed.");
  };

  if (active) {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <button
          type="button"
          onClick={() => setActive(null)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm"
        >
          ← Back
        </button>
        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold">{active.subject}</h2>
              <p className="text-xs text-muted-foreground">
                From: {active.username}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={active.status} />
              {active.status !== "Closed" && (
                <button
                  type="button"
                  onClick={() => closeTicket(active.id)}
                  className="text-xs text-muted-foreground hover:text-red-400"
                  data-ocid="admin.tickets.close_button"
                >
                  Close
                </button>
              )}
            </div>
          </div>
          <div className="p-5 space-y-3 max-h-80 overflow-y-auto">
            {active.messages.map((m, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={i}
                className={`flex gap-3 ${m.sender === "Admin" ? "flex-row-reverse" : ""}`}
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs flex-shrink-0">
                  {m.sender[0].toUpperCase()}
                </div>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-xl text-sm ${m.sender === "Admin" ? "bg-primary/20" : "bg-muted/50"}`}
                >
                  <p className="font-medium text-xs text-muted-foreground mb-1">
                    {m.sender}
                  </p>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          {active.status !== "Closed" && (
            <div className="px-5 py-4 border-t border-border flex gap-2">
              <Textarea
                placeholder="Reply to user..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="bg-muted/30 text-sm resize-none"
                rows={2}
                data-ocid="admin.tickets.reply.textarea"
              />
              <Button
                onClick={handleReply}
                className="self-end bg-primary text-primary-foreground"
                data-ocid="admin.tickets.reply.submit_button"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">Support Tickets</h1>
      <div className="space-y-3">
        {tickets.map((t, idx) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setActive(t)}
            className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all"
            data-ocid={`admin.tickets.item.${idx + 1}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-muted-foreground">
                  From: {t.username} ·{" "}
                  {new Date(t.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <StatusBadge status={t.status} />
            </div>
          </button>
        ))}
        {tickets.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="admin.tickets.empty_state"
          >
            No tickets.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({
  onLogin,
  setView,
}: { onLogin: (user: User) => void; setView: (v: View) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        (u) => u.username === username && u.password === password,
      );
      if (!user) {
        toast.error("Invalid username or password");
        setLoading(false);
        return;
      }
      localStorage.setItem("smm_current_user", user.id);
      onLogin(user);
      toast.success(`Welcome back, ${user.name}!`);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left brand panel */}
        <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 bg-gradient-to-br from-background via-card to-background border-r border-border relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, oklch(0.795 0.184 91.2) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="font-display font-bold text-xl text-foreground">
                  SMM Boost Panel
                </div>
                <div className="text-xs text-muted-foreground">
                  India's #1 SMM Panel
                </div>
              </div>
            </div>
            <h2 className="font-display font-bold text-4xl leading-tight mb-4">
              Grow Your Social Media
              <br />
              <span className="text-primary">Instantly</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Affordable, fast, and reliable SMM services for all major
              platforms.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Star, label: "10K+ Orders", sub: "Served daily" },
                { icon: TrendingUp, label: "99.9%", sub: "Uptime" },
                { icon: HeadphonesIcon, label: "24/7", sub: "Support" },
              ].map((s, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-display font-bold text-foreground">
                    {s.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm space-y-8 animate-fade-in">
            {/* Mobile logo */}
            <div className="lg:hidden text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display font-bold text-2xl">
                SMM Boost Panel
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Grow Your Social Media Instantly
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-7 space-y-5">
              <h2 className="font-display font-bold text-xl">Sign In</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="bg-muted/30"
                    data-ocid="login.username.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="bg-muted/30 pr-10"
                      data-ocid="login.password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow-yellow"
                data-ocid="login.submit_button"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="text-primary hover:underline font-medium"
                  data-ocid="login.register.link"
                >
                  Register now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} SMM Boost Panel. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────
function RegisterPage({ setView }: { setView: (v: View) => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!form.name || !form.email || !form.username || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      if (users.find((u) => u.username === form.username)) {
        toast.error("Username already taken");
        setLoading(false);
        return;
      }
      users.push({
        id: genId(),
        ...form,
        role: "user",
        balance: 0,
        createdAt: new Date().toISOString(),
      });
      saveUsers(users);
      toast.success("Account created! Please sign in.");
      setView("login");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Join SMM Boost Panel today
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-7 space-y-4">
          {(
            [
              {
                id: "name",
                label: "Full Name",
                placeholder: "Your name",
                type: "text",
              },
              {
                id: "email",
                label: "Email",
                placeholder: "your@email.com",
                type: "email",
              },
              {
                id: "username",
                label: "Username",
                placeholder: "Choose a username",
                type: "text",
              },
              {
                id: "password",
                label: "Password",
                placeholder: "Min 6 characters",
                type: "password",
              },
            ] as const
          ).map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`reg-${field.id}`}>{field.label}</Label>
              <Input
                id={`reg-${field.id}`}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.id]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [field.id]: e.target.value }))
                }
                className="bg-muted/30"
                data-ocid={`register.${field.id}.input`}
              />
            </div>
          ))}

          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow-yellow"
            data-ocid="register.submit_button"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setView("login")}
              className="text-primary hover:underline font-medium"
              data-ocid="register.login.link"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    initStorage();
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const uid = localStorage.getItem("smm_current_user");
    if (!uid) return null;
    return getUsers().find((u) => u.id === uid) || null;
  });
  const [view, setView] = useState<View>(() => {
    const uid = localStorage.getItem("smm_current_user");
    if (!uid) return "login";
    const user = getUsers().find((u) => u.id === uid);
    return user
      ? user.role === "admin"
        ? "admin-dashboard"
        : "dashboard"
      : "login";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setView(user.role === "admin" ? "admin-dashboard" : "dashboard");
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("smm_current_user");
    setCurrentUser(null);
    setView("login");
    toast.success("Logged out successfully.");
  }, []);

  const handleOrderPlaced = useCallback(
    (newBalance: number) => {
      if (!currentUser) return;
      const updated = { ...currentUser, balance: newBalance };
      setCurrentUser(updated);
    },
    [currentUser],
  );

  // Public routes
  if (!currentUser) {
    return (
      <>
        <Toaster position="top-right" theme="dark" />
        {view === "register" ? (
          <RegisterPage setView={setView} />
        ) : (
          <LoginPage onLogin={handleLogin} setView={setView} />
        )}
      </>
    );
  }

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return <DashboardPage user={currentUser} />;
      case "new-order":
        return (
          <NewOrderPage user={currentUser} onOrderPlaced={handleOrderPlaced} />
        );
      case "orders":
        return <OrdersPage user={currentUser} />;
      case "add-funds":
        return <AddFundsPage user={currentUser} />;
      case "tickets":
        return <TicketsPage user={currentUser} />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "admin-users":
        return <AdminUsers />;
      case "admin-services":
        return <AdminServices />;
      case "admin-orders":
        return <AdminOrders />;
      case "admin-recharges":
        return <AdminRecharges />;
      case "admin-tickets":
        return <AdminTickets />;
      default:
        return <DashboardPage user={currentUser} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar
          view={view}
          setView={setView}
          user={currentUser}
          onLogout={handleLogout}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              data-ocid="nav.menu.button"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
              <span className="capitalize">
                {view.replace("admin-", "").replace("-", " ")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{currentUser.name}</span>
                {currentUser.role === "user" && (
                  <span className="text-xs font-bold text-primary">
                    {formatINR(currentUser.balance)}
                  </span>
                )}
                {currentUser.role === "admin" && (
                  <Badge className="bg-primary/20 text-primary border-none text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {renderContent()}
            <footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} SMM Boost Panel. Built with love
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
