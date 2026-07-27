"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { generateCustomQrSvg } from "@/lib/qr-generator";
import Link from "next/link";
import {
  QrCode,
  LayoutDashboard,
  BarChart3,
  FolderClosed,
  Megaphone,
  CreditCard,
  Users,
  Settings,
  Sliders,
  KeyRound,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Smartphone,
  Calendar,
  LogOut,
  Download,
  FolderOpen,
  Edit2,
  Trash2,
  Lock,
  ChevronRight,
  CheckCircle,
  Copy,
  ExternalLink,
  Info
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

type Tab = "overview" | "qrs" | "analytics" | "folders" | "campaigns" | "billing" | "team" | "apikeys" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // App states
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Data list states
  const [qrs, setQrs] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>({
    metrics: { totalScans: 0, uniqueScans: 0, repeatVisitors: 0, conversionRate: 0 },
    timeline: [],
    devices: [],
    countries: [],
    referrers: []
  });

  // Modal and active selection states
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderFilter, setSelectedFolderFilter] = useState("all");
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState("all");
  
  // Form states for Create/Edit
  const [qrName, setQrName] = useState("");
  const [qrType, setQrType] = useState("DYNAMIC");
  const [qrContentType, setQrContentType] = useState("WEBSITE");
  const [qrDestUrl, setQrDestUrl] = useState("https://");
  const [qrFolderId, setQrFolderId] = useState("");
  const [qrCampaignId, setQrCampaignId] = useState("");
  const [qrScanLimit, setQrScanLimit] = useState("");
  const [qrExpiry, setQrExpiry] = useState("");
  const [qrPassword, setQrPassword] = useState("");
  const [qrStyling, setQrStyling] = useState<any>({
    primaryColor: "#6d28d9",
    secondaryColor: "#3b82f6",
    isGradient: true,
    dotStyle: "rounded",
    eyeOuterStyle: "rounded",
    eyeInnerStyle: "circle",
    margin: 30
  });

  // Advanced Redirect Rule form states
  const [rules, setRules] = useState<any[]>([]);
  const [newRuleType, setNewRuleType] = useState("DEVICE"); // DEVICE, COUNTRY, LANGUAGE, AB_TEST
  const [newRuleKey, setNewRuleKey] = useState(""); // iOS, US, EN, or percentage weighting
  const [newRuleUrl, setNewRuleUrl] = useState("https://");

  // Notification dropdown state
  const [showNotifications, setShowNotifications] = useState(false);

  // General Create folder/campaign form states
  const [newFolderName, setNewFolderName] = useState("");
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignDesc, setNewCampaignDesc] = useState("");

  // Api key form states
  const [newKeyName, setNewKeyName] = useState("");

  // Command palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Toast alert notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth and initial data check
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setUser(data.user);
          loadAllData();
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadAllData = () => {
    setLoading(true);
    
    // Fetch QR Codes
    fetch("/api/qrs")
      .then((res) => res.json())
      .then((data) => setQrs(data.qrs || []))
      .catch(() => {});

    // Fetch Folders
    fetch("/api/folders")
      .then((res) => res.json())
      .then((data) => setFolders(data.folders || []))
      .catch(() => {});

    // Fetch Campaigns
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns || []))
      .catch(() => {});

    // Fetch Developer Keys
    fetch("/api/apikeys")
      .then((res) => res.json())
      .then((data) => setApiKeys(data.apiKeys || []))
      .catch(() => {});

    // Fetch Invoices
    fetch("/api/billing/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data.invoices || []))
      .catch(() => {});

    // Fetch Analytics Summary
    fetch("/api/analytics/summary?days=7")
      .then((res) => res.json())
      .then((data) => setAnalyticsData(data))
      .catch(() => {});

    // Mock Notifications Feed
    setNotifications([
      { id: "1", title: "New scan detected", message: "A user scanned your 'Menu Link' from California, US.", time: "10 mins ago", unread: true },
      { id: "2", title: "Spike in traffic", message: "Your QR code 'Summer Camp' scan rate jumped 150% in the last hour.", time: "1 hr ago", unread: true },
      { id: "3", title: "Campaign Launched", message: "Campaign 'Food Festival 2026' was successfully set up.", time: "1 day ago", unread: false }
    ]);

    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  // CREATE QR CODE HANDLER
  const handleCreateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrName) {
      showToast("Please fill in the QR code name", "error");
      return;
    }

    try {
      const payload = {
        name: qrName,
        type: qrType,
        qrType: qrContentType,
        originalUrl: qrDestUrl,
        folderId: qrFolderId || null,
        campaignId: qrCampaignId || null,
        scanLimit: qrScanLimit || null,
        expiresAt: qrExpiry || null,
        password: qrPassword || null,
        styling: qrStyling,
      };

      const res = await fetch("/api/qrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("QR Code created successfully!");
      setIsQrModalOpen(false);
      resetQrForm();
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Failed to create QR Code", "error");
    }
  };

  // UPDATE QR CODE HANDLER (including dynamic destination URL & redirect rules)
  const handleUpdateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQr) return;

    try {
      const payload = {
        name: qrName,
        originalUrl: qrDestUrl,
        folderId: qrFolderId || null,
        campaignId: qrCampaignId || null,
        scanLimit: qrScanLimit || null,
        expiresAt: qrExpiry || null,
        password: qrPassword || null,
        styling: qrStyling,
        redirectRules: rules,
      };

      const res = await fetch(`/api/qrs/${selectedQr.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("QR Code settings updated!");
      setIsDetailsModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Failed to update QR Code", "error");
    }
  };

  // DELETE QR CODE HANDLER
  const handleDeleteQr = async (id: string) => {
    if (!confirm("Are you sure you want to delete this QR Code? All tracking logs will be permanently deleted.")) return;

    try {
      const res = await fetch(`/api/qrs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("QR Code deleted!");
      setIsDetailsModalOpen(false);
      loadAllData();
    } catch {
      showToast("Failed to delete QR Code", "error");
    }
  };

  // CREATE FOLDER HANDLER
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName) return;

    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName }),
      });
      if (!res.ok) throw new Error("Folder creation failed");
      showToast("Folder created!");
      setNewFolderName("");
      loadAllData();
    } catch {
      showToast("Failed to create folder", "error");
    }
  };

  // CREATE CAMPAIGN HANDLER
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName) return;

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCampaignName, description: newCampaignDesc }),
      });
      if (!res.ok) throw new Error("Campaign creation failed");
      showToast("Campaign created!");
      setNewCampaignName("");
      setNewCampaignDesc("");
      loadAllData();
    } catch {
      showToast("Failed to create campaign", "error");
    }
  };

  // CREATE DEVELOPER API KEY
  const handleGenerateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    try {
      const res = await fetch("/api/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      if (!res.ok) throw new Error("Token generation failed");
      showToast("API Key created!");
      setNewKeyName("");
      loadAllData();
    } catch {
      showToast("Failed to generate API Key", "error");
    }
  };

  // REVOKE API KEY
  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API Key? Any application relying on this token will immediately fail.")) return;

    try {
      const res = await fetch(`/api/apikeys?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Revocation failed");
      showToast("API Key revoked");
      loadAllData();
    } catch {
      showToast("Failed to revoke key", "error");
    }
  };

  // BILLING PLAN UPGRADE SIMULATION
  const handleUpgradePlan = async (plan: string) => {
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUser(data.user);
      showToast(`Successfully upgraded to ${plan}!`);
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Failed to upgrade", "error");
    }
  };

  // ADD REDIRECT RULE
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleKey || !newRuleUrl.startsWith("http")) {
      showToast("Please enter a valid rule value and destination URL", "error");
      return;
    }

    const newRule = {
      type: newRuleType,
      key: newRuleKey,
      destinationUrl: newRuleUrl,
    };

    setRules([...rules, newRule]);
    setNewRuleKey("");
    setNewRuleUrl("https://");
    showToast("Rule configuration added to queue. Remember to save changes!");
  };

  // REMOVE REDIRECT RULE
  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const resetQrForm = () => {
    setQrName("");
    setQrType("DYNAMIC");
    setQrContentType("WEBSITE");
    setQrDestUrl("https://");
    setQrFolderId("");
    setQrCampaignId("");
    setQrScanLimit("");
    setQrExpiry("");
    setQrPassword("");
    setQrStyling({
      primaryColor: "#6d28d9",
      secondaryColor: "#3b82f6",
      isGradient: true,
      dotStyle: "rounded",
      eyeOuterStyle: "rounded",
      eyeInnerStyle: "circle",
      margin: 30
    });
  };

  const openEditModal = (qr: any) => {
    setSelectedQr(qr);
    setQrName(qr.name);
    setQrType(qr.type);
    setQrContentType(qr.qrType);
    setQrDestUrl(qr.originalUrl || "https://");
    setQrFolderId(qr.folderId || "");
    setQrCampaignId(qr.campaignId || "");
    setQrScanLimit(qr.scanLimit || "");
    setQrExpiry(qr.expiresAt ? new Date(qr.expiresAt).toISOString().split("T")[0] : "");
    setQrPassword("");
    
    // Parse styling JSON safely
    try {
      setQrStyling(JSON.parse(qr.stylingJson));
    } catch {
      setQrStyling({
        primaryColor: "#6d28d9",
        secondaryColor: "#3b82f6",
        isGradient: true,
        dotStyle: "rounded",
        eyeOuterStyle: "rounded",
        eyeInnerStyle: "circle",
        margin: 30
      });
    }

    setRules(qr.redirectRules || []);
    setIsDetailsModalOpen(true);
  };

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Link copied to clipboard!");
  };

  // Filtered QR codes list
  const filteredQrs = qrs.filter((qr) => {
    const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          qr.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (qr.originalUrl && qr.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFolder = selectedFolderFilter === "all" || 
                          (selectedFolderFilter === "none" && !qr.folderId) ||
                          qr.folderId === selectedFolderFilter;

    const matchesCampaign = selectedCampaignFilter === "all" ||
                            (selectedCampaignFilter === "none" && !qr.campaignId) ||
                            qr.campaignId === selectedCampaignFilter;

    return matchesSearch && matchesFolder && matchesCampaign;
  });

  const [modalTab, setModalTab] = useState<"content" | "design" | "brand">("content");

  const renderDesignAndBrandFields = () => {
    if (modalTab === "design") {
      return (
        <div className="space-y-4 pt-2">
          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-3xs font-semibold text-zinc-400 block mb-1">Primary Color</label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={qrStyling.primaryColor || "#6d28d9"}
                  onChange={(e) => setQrStyling((p: any) => ({ ...p, primaryColor: e.target.value }))}
                  className="w-8 h-8 border-0 rounded cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={qrStyling.primaryColor || "#6d28d9"}
                  onChange={(e) => setQrStyling((p: any) => ({ ...p, primaryColor: e.target.value }))}
                  className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-850 rounded text-xs font-mono text-zinc-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-3xs font-semibold text-zinc-400 block mb-1">Secondary Color</label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={qrStyling.secondaryColor || "#3b82f6"}
                  onChange={(e) => setQrStyling((p: any) => ({ ...p, secondaryColor: e.target.value }))}
                  disabled={!qrStyling.isGradient}
                  className="w-8 h-8 border-0 rounded cursor-pointer shrink-0 disabled:opacity-50"
                />
                <input
                  type="text"
                  value={qrStyling.secondaryColor || "#3b82f6"}
                  onChange={(e) => setQrStyling((p: any) => ({ ...p, secondaryColor: e.target.value }))}
                  disabled={!qrStyling.isGradient}
                  className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-850 rounded text-xs font-mono text-zinc-900 dark:text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>
          
          <label className="flex items-center gap-1.5 text-2xs text-zinc-455 cursor-pointer font-semibold">
            <input
              type="checkbox"
              checked={qrStyling.isGradient ?? true}
              onChange={(e) => setQrStyling((p: any) => ({ ...p, isGradient: e.target.checked }))}
              className="rounded border-zinc-350 accent-purple-650"
            />
            <span>Enable Color Gradient</span>
          </label>

          {/* Dots Pattern */}
          <div>
            <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Dot Style</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "square", label: "Squares" },
                { id: "rounded", label: "Rounded" },
                { id: "dots", label: "Circles" }
              ].map((dot) => (
                <button
                  type="button"
                  key={dot.id}
                  onClick={() => setQrStyling((p: any) => ({ ...p, dotStyle: dot.id }))}
                  className={`py-1.5 border text-3xs font-bold rounded-lg cursor-pointer ${
                    (qrStyling.dotStyle || "square") === dot.id
                      ? "bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-500"
                  }`}
                >
                  {dot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eyes Style */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Outer Eye</label>
              <select
                value={qrStyling.eyeOuterStyle || "square"}
                onChange={(e) => setQrStyling((p: any) => ({ ...p, eyeOuterStyle: e.target.value }))}
                className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-850 rounded-lg text-xs text-zinc-900 dark:text-white"
              >
                <option value="square">Square</option>
                <option value="rounded">Rounded</option>
                <option value="circle">Circle</option>
              </select>
            </div>
            <div>
              <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Inner Eye</label>
              <select
                value={qrStyling.eyeInnerStyle || "square"}
                onChange={(e) => setQrStyling((p: any) => ({ ...p, eyeInnerStyle: e.target.value }))}
                className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-850 rounded-lg text-xs text-zinc-900 dark:text-white"
              >
                <option value="square">Square</option>
                <option value="rounded">Rounded</option>
                <option value="circle">Circle</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
          </div>

          {/* Quiet Zone / Margin */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400">Quiet Zone (Margin)</label>
              <span className="text-3xs font-mono text-zinc-500 font-bold">{qrStyling.margin !== undefined ? qrStyling.margin : 30}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={qrStyling.margin !== undefined ? qrStyling.margin : 30}
              onChange={(e) => setQrStyling((p: any) => ({ ...p, margin: parseInt(e.target.value) }))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-650"
            />
          </div>
        </div>
      );
    }

    if (modalTab === "brand") {
      return (
        <div className="space-y-4 pt-2">
          {/* Logo */}
          <div>
            <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">Center Logo Link</label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={qrStyling.logoUrl || ""}
              onChange={(e) => setQrStyling((p: any) => ({ ...p, logoUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-850 rounded-xl text-xs text-zinc-900 dark:text-white"
            />
          </div>

          {/* Frames */}
          <div>
            <label className="text-3xs font-bold uppercase tracking-wider text-zinc-455 block mb-2">Border Frame Style</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: "none", label: "No Frame" },
                { id: "simple", label: "Simple" },
                { id: "phone", label: "Phone" },
                { id: "speech", label: "Speech" }
              ].map((frm) => (
                <button
                  type="button"
                  key={frm.id}
                  onClick={() => setQrStyling((p: any) => ({ ...p, frameStyle: frm.id }))}
                  className={`py-1.5 border text-3xs font-bold rounded-lg cursor-pointer ${
                    (qrStyling.frameStyle || "none") === frm.id
                      ? "bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-500"
                  }`}
                >
                  {frm.label}
                </button>
              ))}
            </div>

            {(qrStyling.frameStyle || "none") !== "none" && (
              <div className="mt-3">
                <label className="text-3xs font-semibold text-zinc-505 block mb-1">Frame Text</label>
                <input
                  type="text"
                  maxLength={18}
                  value={qrStyling.frameText || "SCAN ME"}
                  onChange={(e) => setQrStyling((p: any) => ({ ...p, frameText: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-850 rounded-xl text-xs text-zinc-900 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // Recharts color list
  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#ef4444"];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-200">
      
      {/* Toast Alert Box */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-55 p-4 rounded-xl border flex items-center gap-3 shadow-2xl animate-bounce ${
          toast.type === "success" 
            ? "bg-emerald-950/90 border-emerald-500/20 text-emerald-400" 
            : toast.type === "error" 
            ? "bg-red-950/90 border-red-500/20 text-red-400" 
            : "bg-zinc-900/90 border-zinc-700 text-zinc-300"
        }`}>
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* DASHBOARD NAVBAR TOP */}
      <nav className="h-16 sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/50 dark:border-zinc-900/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white">
              <QrCode className="w-4.5 h-4.5" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-zinc-900 dark:text-white">QRFlow</span>
          </Link>
          <span className="text-zinc-300 dark:text-zinc-800">/</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{user.name || user.email}</span>
            <span className={`text-4xs px-2 py-0.5 rounded-full font-bold uppercase ${
              user.subscriptionPlan === "FREE" 
                ? "bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400" 
                : "bg-purple-600/15 text-purple-600 dark:text-purple-400"
            }`}>
              {user.subscriptionPlan === "FREE" ? "Free" : "Premium"} Plan
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 border border-zinc-200 dark:border-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all text-zinc-600 dark:text-zinc-400 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <span className="font-heading font-bold text-sm">Notifications</span>
                  <button 
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, unread: false })));
                      showToast("All notifications marked read");
                    }} 
                    className="text-2xs text-purple-400 hover:underline"
                  >
                    Mark read
                  </button>
                </div>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-4 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 ${n.unread ? "bg-purple-500/5" : ""}`}>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                        {n.unread && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0" />}
                        {n.title}
                      </h4>
                      <p className="text-2xs text-zinc-500 mt-1 leading-normal">{n.message}</p>
                      <span className="text-3xs text-zinc-400 mt-2 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search shortcuts info */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-450 dark:text-zinc-500 px-3 py-1.5 border border-zinc-200 dark:border-zinc-900 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-850 rounded border border-zinc-350 dark:border-zinc-750 text-4xs font-mono">Ctrl K</kbd>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 border border-zinc-200 dark:border-zinc-900 rounded-lg text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* DASHBOARD SPLIT GRID LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDE NAVIGATION BAR */}
        <aside className="w-64 border-r border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950/40 p-4 hidden md:flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-3xs font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-650 px-3">
                Workspace
              </span>
              <nav className="mt-2 space-y-1">
                {[
                  { tab: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
                  { tab: "qrs", label: "QR Codes", icon: <QrCode className="w-4 h-4" /> },
                  { tab: "analytics", label: "Geo Analytics", icon: <BarChart3 className="w-4 h-4" /> },
                  { tab: "folders", label: "Folders", icon: <FolderClosed className="w-4 h-4" /> },
                  { tab: "campaigns", label: "Campaigns", icon: <Megaphone className="w-4 h-4" /> }
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => { setActiveTab(item.tab as Tab); setSelectedQr(null); }}
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === item.tab
                        ? "bg-purple-600/10 text-purple-600 dark:text-purple-400"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900/60 text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <span className="text-3xs font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-650 px-3">
                Manage
              </span>
              <nav className="mt-2 space-y-1">
                {[
                  { tab: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
                  { tab: "team", label: "Team Space", icon: <Users className="w-4 h-4" /> },
                  { tab: "apikeys", label: "Developer Keys", icon: <KeyRound className="w-4 h-4" /> },
                  { tab: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> }
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => { setActiveTab(item.tab as Tab); setSelectedQr(null); }}
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === item.tab
                        ? "bg-purple-600/10 text-purple-600 dark:text-purple-400"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900/60 text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="p-3 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">{user.email.split("@")[0]}</span>
            </div>
            <span className="text-3xs text-zinc-500 block mt-0.5">{user.email}</span>
          </div>
        </aside>

        {/* MAIN VIEWS WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* VIEW: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Dashboard Headline */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold font-heading">Workspace Overview</h1>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400">Review recent scans and create marketing actions.</p>
                </div>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/15 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create QR Code</span>
                </button>
              </div>

              {/* Stats KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total QR Scans", value: analyticsData.metrics.totalScans, icon: <TrendingUp className="w-4 h-4 text-purple-400" />, desc: "Scans over the last 7 days" },
                  { label: "Unique Visitors", value: analyticsData.metrics.uniqueScans, icon: <Users className="w-4 h-4 text-blue-400" />, desc: "Unique user IP logs" },
                  { label: "Conversion Rate", value: `${analyticsData.metrics.conversionRate}%`, icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, desc: "Unique scans to total scans" },
                  { label: "Active QRs", value: qrs.length, icon: <QrCode className="w-4 h-4 text-indigo-400" />, desc: "Static and Dynamic codes" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-zinc-500">{stat.label}</span>
                      <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center">{stat.icon}</div>
                    </div>
                    <span className="text-2xl font-bold font-heading text-zinc-900 dark:text-white block">{stat.value}</span>
                    <span className="text-4xs text-zinc-500 mt-1 block">{stat.desc}</span>
                  </div>
                ))}
              </div>

              {/* Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recharts Area Timeline */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                  <h3 className="text-sm font-bold font-heading mb-4">Daily Scan Activity</h3>
                  <div className="h-60 w-full">
                    {analyticsData.timeline && analyticsData.timeline.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.timeline}>
                          <defs>
                            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }} />
                          <Area type="monotone" dataKey="scans" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-500">No scan traffic logs available for this period.</div>
                    )}
                  </div>
                </div>

                {/* Device Breakdown Pie */}
                <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                  <h3 className="text-sm font-bold font-heading mb-4">Device Distribution</h3>
                  <div className="h-44 flex items-center justify-center">
                    {analyticsData.devices && analyticsData.devices.some((d: any) => d.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.devices.filter((d: any) => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {analyticsData.devices.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-xs text-zinc-500">No device data logged.</div>
                    )}
                  </div>
                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 text-2xs font-semibold text-zinc-500 pt-4 border-t border-zinc-200 dark:border-zinc-850">
                    {analyticsData.devices.map((device: any, index: number) => (
                      <div key={device.name} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{device.name}: {device.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent QRs list summary */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold font-heading">Recent QR Codes</h3>
                  <button onClick={() => setActiveTab("qrs")} className="text-xs font-semibold text-purple-400 flex items-center gap-1 hover:underline">
                    <span>View all codes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-zinc-200 dark:divide-zinc-850">
                  {qrs.slice(0, 4).map((qr) => (
                    <div key={qr.id} className="py-3.5 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-650 dark:text-zinc-350">
                          <QrCode className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 dark:text-white">{qr.name}</h4>
                          <span className="text-3xs text-zinc-450 dark:text-zinc-500 block mt-0.5 uppercase tracking-wider">{qr.type} • {qr.qrType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="font-bold text-zinc-900 dark:text-white block">{qr._count?.analytics || 0}</span>
                          <span className="text-3xs text-zinc-500 block">Scans</span>
                        </div>
                        <button
                          onClick={() => openEditModal(qr)}
                          className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {qrs.length === 0 && (
                    <div className="text-center py-6 text-xs text-zinc-500">No QR codes created yet. Click 'Create QR Code' to launch your first link!</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: QR CODES LIST & MANAGEMENT */}
          {activeTab === "qrs" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold font-heading">My QR Codes</h1>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400">Launch and customize static or dynamic scan codes.</p>
                </div>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create QR Code</span>
                </button>
              </div>

              {/* Filters panel */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white dark:bg-zinc-900/40 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search name or shortcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <select
                    value={selectedFolderFilter}
                    onChange={(e) => setSelectedFolderFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs"
                  >
                    <option value="all">All Folders</option>
                    <option value="none">Unassigned</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedCampaignFilter}
                    onChange={(e) => setSelectedCampaignFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs"
                  >
                    <option value="all">All Campaigns</option>
                    <option value="none">Unassigned</option>
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="text-right flex items-center justify-end text-3xs text-zinc-500 font-semibold">
                  Found {filteredQrs.length} codes
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQrs.map((qr) => {
                  const shortRedirect = `${window.location.origin}/r/${qr.shortCode}`;
                  
                  // Resolve QR Content
                  const qrContent = qr.type === "DYNAMIC" ? shortRedirect : (qr.staticData || " ");
                  
                  // Parse styling
                  let stylingOpts = {};
                  try {
                    stylingOpts = JSON.parse(qr.stylingJson || "{}");
                  } catch (e) {
                    stylingOpts = {};
                  }
                  
                  // Generate SVG String
                  let qrSvg = "";
                  try {
                    qrSvg = generateCustomQrSvg(qrContent, stylingOpts);
                  } catch (e) {
                    console.error("Failed to generate custom QR SVG", e);
                  }

                  const downloadCardSvg = () => {
                    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `qrflow-${qr.name.replace(/\s+/g, '-').toLowerCase()}-${qr.shortCode}.svg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  };

                  const downloadCardPng = () => {
                    const img = new Image();
                    const svgBlob = new Blob([qrSvg], { type: "image/svg+xml;charset=utf-8" });
                    const url = URL.createObjectURL(svgBlob);
                    
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      canvas.width = 1000;
                      canvas.height = 1000;
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        ctx.fillStyle = "transparent";
                        ctx.fillRect(0, 0, 1000, 1000);
                        ctx.drawImage(img, 0, 0, 1000, 1000);
                        
                        const pngUrl = canvas.toDataURL("image/png");
                        const link = document.createElement("a");
                        link.href = pngUrl;
                        link.download = `qrflow-${qr.name.replace(/\s+/g, '-').toLowerCase()}-${qr.shortCode}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                      URL.revokeObjectURL(url);
                    };
                    img.src = url;
                  };

                  return (
                    <div
                      key={qr.id}
                      className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative"
                    >
                      <div className="flex gap-4 items-start">
                        {/* Left: Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-4xs px-2 py-0.5 rounded-full font-bold uppercase ${
                              qr.type === "STATIC" 
                                ? "bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-500" 
                                : "bg-purple-600/10 text-purple-600 dark:text-purple-400"
                            }`}>
                              {qr.type}
                            </span>
                            <span className="text-4xs text-zinc-550 uppercase tracking-widest font-semibold">{qr.qrType}</span>
                          </div>

                          <h3 className="font-heading font-bold text-base text-zinc-900 dark:text-white leading-tight mb-2 truncate" title={qr.name}>{qr.name}</h3>
                          
                          {/* Dynamic URL / Static representation */}
                          {qr.type === "DYNAMIC" ? (
                            <div className="space-y-1">
                              <span className="text-3xs text-zinc-450 dark:text-zinc-505 uppercase font-semibold">Redirect Link</span>
                              <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-lg text-2xs text-zinc-650 dark:text-zinc-350 font-mono">
                                <span className="truncate max-w-[70%]">{shortRedirect}</span>
                                <div className="flex gap-1 shrink-0">
                                  <button onClick={() => handleCopyText(shortRedirect)} className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer">
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <a href={shortRedirect} target="_blank" rel="noreferrer" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                              <span className="text-3xs text-zinc-450 dark:text-zinc-505 uppercase font-semibold block pt-1.5">Destination</span>
                              <span className="text-2xs font-mono text-zinc-550 block truncate">{qr.originalUrl}</span>
                            </div>
                          ) : (
                            <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg text-2xs text-zinc-550 font-mono truncate">
                              {qr.staticData}
                            </div>
                          )}
                        </div>

                        {/* Right: Visual QR and downloads */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div 
                            className="w-24 h-24 p-2 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-850 rounded-xl flex items-center justify-center text-zinc-900 dark:text-white"
                            dangerouslySetInnerHTML={{ __html: qrSvg }}
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={downloadCardPng}
                              className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-3xs rounded-md border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                              title="Download PNG"
                            >
                              PNG
                            </button>
                            <button
                              onClick={downloadCardSvg}
                              className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-3xs rounded-md border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                              title="Download SVG"
                            >
                              SVG
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-850 flex justify-between items-center">
                        <div className="text-zinc-500">
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">{qr._count?.analytics || 0}</span>
                          <span className="text-3xs ml-1">scans</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            qr.status === "ACTIVE" ? "bg-emerald-500" : "bg-zinc-500"
                          }`} />
                          <span className="text-3xs text-zinc-450 uppercase font-bold mr-2">{qr.status}</span>
                          <button
                            onClick={() => openEditModal(qr)}
                            className="py-1 px-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-semibold text-2xs rounded-lg flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Manage</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredQrs.length === 0 && (
                  <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
                    No QR Codes match your query. Click 'Create QR Code' to launch a new redirect configuration.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: GEO ANALYTICS DETAILS */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold font-heading">Geo Scan Analytics</h1>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400">Examine geographical, client-device, and timeline metrics.</p>
                </div>
                <div className="flex gap-3">
                  <select className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-xl text-xs">
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                  </select>
                  <button 
                    onClick={() => {
                      // Generate and download a mock CSV file
                      const headers = "Date,Scans,Unique Visitors\n";
                      const rows = analyticsData.timeline.map((t: any) => `${t.date},${t.scans},${t.unique}`).join("\n");
                      const blob = new Blob([headers + rows], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "qrflow-analytics.csv";
                      link.click();
                      URL.revokeObjectURL(url);
                      showToast("CSV Export generated successfully!");
                    }}
                    className="py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 font-semibold text-xs rounded-xl flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Timeline chart */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold font-heading mb-6">Traffic Over Time</h3>
                <div className="h-64 w-full">
                  {analyticsData.timeline && analyticsData.timeline.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.timeline}>
                        <defs>
                          <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="scans" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-zinc-550">No scan traffic logs available for this period.</div>
                  )}
                </div>
              </div>

              {/* Geographic breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Countries list */}
                <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold font-heading mb-6">Top Scan Countries</h3>
                  <div className="space-y-4">
                    {analyticsData.countries && analyticsData.countries.length > 0 ? (
                      analyticsData.countries.map((c: any, i: number) => {
                        const maxVal = Math.max(...analyticsData.countries.map((co: any) => co.value)) || 1;
                        const pct = Math.round((c.value / maxVal) * 100);
                        return (
                          <div key={c.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>{c.name}</span>
                              <span>{c.value} scans</span>
                            </div>
                            <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-xs text-zinc-500">No geo data found.</div>
                    )}
                  </div>
                </div>

                {/* Referrers list */}
                <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold font-heading mb-6">Top Referring Domains</h3>
                  <div className="space-y-4">
                    {analyticsData.referrers && analyticsData.referrers.length > 0 ? (
                      analyticsData.referrers.map((ref: any) => (
                        <div key={ref.name} className="flex justify-between items-center text-xs font-semibold py-2 border-b border-zinc-100 dark:border-zinc-850">
                          <span className="text-zinc-650 dark:text-zinc-350">{ref.name}</span>
                          <span className="font-mono text-zinc-900 dark:text-white">{ref.value} scans</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-zinc-500">No referrer data found.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: FOLDER MANAGEMENT */}
          {activeTab === "folders" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold font-heading">Folder Management</h1>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 font-semibold">Group and organize your static or dynamic QR link channels.</p>
                </div>
              </div>

              {/* Create folder inline form */}
              <form onSubmit={handleCreateFolder} className="flex gap-3 bg-white dark:bg-zinc-900/40 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <input
                  type="text"
                  placeholder="Create new folder name (e.g. 'Social Campaigns', 'Menu Packs')..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  disabled={!newFolderName}
                  className="py-2 px-4 bg-purple-650 hover:bg-purple-600 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  Create Folder
                </button>
              </form>

              {/* Folders grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {folders.map((folder) => (
                  <div key={folder.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl relative shadow-sm">
                    <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-zinc-900 dark:text-white mb-1">{folder.name}</h3>
                    <span className="text-xs text-zinc-450 dark:text-zinc-500 block mb-6">{folder._count?.qrs || 0} QR codes inside</span>
                    
                    <button
                      onClick={() => {
                        setSelectedFolderFilter(folder.id);
                        setActiveTab("qrs");
                      }}
                      className="py-1.5 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 font-semibold text-2xs rounded-lg transition-all w-full text-center cursor-pointer"
                    >
                      View codes in folder
                    </button>
                  </div>
                ))}
                {folders.length === 0 && (
                  <div className="col-span-full py-16 text-center text-zinc-550 text-sm">
                    No folders created yet. Organize your QR Codes in folders today!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: CAMPAIGN PORTAL */}
          {activeTab === "campaigns" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold font-heading">Campaign Manager</h1>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400">Launch marketing campaigns to group, track, and export scan metrics.</p>
                </div>
              </div>

              {/* Create campaign form */}
              <form onSubmit={handleCreateCampaign} className="space-y-4 bg-white dark:bg-zinc-900/40 p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-450 block">Launch New Campaign</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Campaign Name (e.g. 'Black Friday 2026')..."
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Campaign Description (e.g. 'Summer collection codes')..."
                    value={newCampaignDesc}
                    onChange={(e) => setNewCampaignDesc(e.target.value)}
                    className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newCampaignName}
                  className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all cursor-pointer"
                >
                  Create Campaign
                </button>
              </form>

              {/* Campaigns list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-blue-650/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-white mb-2">{camp.name}</h3>
                      <p className="text-zinc-550 dark:text-zinc-400 text-xs mb-4">{camp.description || "No description provided."}</p>
                      <span className="text-2xs text-zinc-500 block mb-6">{camp._count?.qrs || 0} QR codes linked</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedCampaignFilter(camp.id);
                        setActiveTab("qrs");
                      }}
                      className="py-2 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 font-semibold text-xs rounded-xl transition-all w-full text-center cursor-pointer"
                    >
                      Inspect Campaign QRs
                    </button>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <div className="col-span-full py-16 text-center text-zinc-550 text-sm">
                    No marketing campaigns created yet. Start bundling dynamic links into unified campaigns!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: BILLING & SUBSCRIPTIONS */}
          {activeTab === "billing" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-heading">Billing & Subscription</h1>
                <p className="text-xs text-zinc-550 dark:text-zinc-400">Upgrade or edit subscription tiers and view payment histories.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[250px] h-[250px] bg-purple-650/5 rounded-full blur-[80px] pointer-events-none" />
                <div>
                  <span className="text-3xs font-extrabold uppercase tracking-widest text-purple-400 block mb-1">Current Membership Plan</span>
                  <h2 className="text-3xl font-heading font-extrabold tracking-tight mb-2 uppercase">
                    {user.subscriptionPlan === "FREE" ? "Free" : "Premium"} Plan
                  </h2>
                  <p className="text-zinc-550 dark:text-zinc-455 text-xs">Your plan is active and renews automatically.</p>
                </div>
                {user.subscriptionPlan === "FREE" && (
                  <button
                    onClick={() => handleUpgradePlan("STARTER")}
                    className="py-2.5 px-4 bg-purple-650 hover:bg-purple-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-650/15 cursor-pointer"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>

              {/* Tier plans comparison grid */}
              <div className="grid grid-cols-1 gap-6 max-w-sm">
                {[
                  { name: "Premium Plan", price: "₹299", code: "STARTER", desc: "Unlimited Dynamic QR codes, custom styling, rules, & deep analytics", active: user.subscriptionPlan !== "FREE" },
                ].map((tier) => (
                  <div
                    key={tier.code}
                    className={`bg-white dark:bg-zinc-900/40 border rounded-2xl p-6 flex flex-col justify-between relative shadow-sm ${
                      tier.active ? "border-purple-500 shadow-md" : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    <div>
                      <h3 className="font-heading font-bold text-base text-zinc-900 dark:text-white mb-1">{tier.name}</h3>
                      <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">{tier.price}</span>
                        <span className="text-zinc-550 text-4xs">/mo</span>
                      </div>
                      <p className="text-zinc-550 dark:text-zinc-400 text-xs mb-6 leading-normal">{tier.desc}</p>
                    </div>
                    {tier.active ? (
                      <div className="py-2 w-full bg-emerald-500/10 text-emerald-400 text-center font-bold rounded-xl text-xs border border-emerald-500/20">
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpgradePlan(tier.code)}
                        className="py-2.5 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/10 cursor-pointer"
                      >
                        Choose Premium Plan
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Invoices List */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold font-heading mb-6">Payment History</h3>
                <div className="divide-y divide-zinc-250 dark:divide-zinc-850">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="py-3.5 flex items-center justify-between text-xs font-semibold">
                      <div className="flex gap-4">
                        <span className="text-zinc-650 dark:text-zinc-350">{inv.id}</span>
                        <span className="text-zinc-500">{inv.date}</span>
                        <span className="text-zinc-500 font-mono">Plan: {inv.plan}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-bold text-zinc-900 dark:text-white">{inv.amount}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-3xs font-bold uppercase">{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DEVELOPER TOKENS */}
          {activeTab === "apikeys" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-heading">Developer API Keys</h1>
                <p className="text-xs text-zinc-550 dark:text-zinc-400">Generate developer keys to trigger scan operations and create dynamic QR links programmatically.</p>
              </div>

              {/* key creator form */}
              <form onSubmit={handleGenerateApiKey} className="flex gap-3 bg-white dark:bg-zinc-900/40 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <input
                  type="text"
                  placeholder="Key Name (e.g. 'Zapier sync', 'Node server app')..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  disabled={!newKeyName}
                  className="py-2 px-4 bg-purple-650 hover:bg-purple-600 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  Generate Token
                </button>
              </form>

              {/* keys list */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold font-heading mb-6">Active Developer Keys</h3>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-850">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="py-4 flex items-center justify-between text-xs font-semibold">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{key.name}</h4>
                        <div className="flex items-center gap-2 mt-1.5 font-mono text-zinc-500">
                          <span>{key.key.substring(0, 10)}************************</span>
                          <button onClick={() => handleCopyText(key.key)} className="p-1 hover:bg-zinc-800 rounded">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-zinc-550">Created {new Date(key.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="py-1 px-2.5 border border-red-500/20 hover:bg-red-500/5 text-red-550 rounded font-semibold transition-all cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                  {apiKeys.length === 0 && (
                    <div className="text-center py-8 text-xs text-zinc-500">No developer API keys active. Generate one above to access developer routes.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS VIEW */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-heading">Workspace Settings</h1>
                <p className="text-xs text-zinc-550 dark:text-zinc-400">Configure profile, notification thresholds, and security parameters.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-6">
                <div className="border-b border-zinc-200 dark:border-zinc-850 pb-4">
                  <h3 className="font-heading font-bold text-sm mb-1">Profile Details</h3>
                  <p className="text-zinc-500 text-2xs">Update your display name and communications email.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-550 block mb-1">Display Name</label>
                    <input
                      type="text"
                      defaultValue={user.name || ""}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-550 block mb-1">Billing Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => showToast("Profile settings saved successfully!")}
                    className="py-2 px-4 bg-purple-650 hover:bg-purple-650/90 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: TEAM SPACE */}
          {activeTab === "team" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-heading">Team Workspace</h1>
                <p className="text-xs text-zinc-550 dark:text-zinc-400">Invite colleagues, set permission values, and coordinate dynamic designs.</p>
              </div>

              {/* Team list */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-850 pb-4">
                  <div>
                    <h3 className="font-heading font-bold text-sm mb-1">Team Workspace Members</h3>
                    <p className="text-zinc-500 text-2xs">These individuals have shared access to generate and modify campaigns.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const email = prompt("Enter the email address of the team member you wish to invite:");
                      if (email) {
                        showToast(`Invited ${email} to workspace. Verification pending.`);
                      }
                    }}
                    className="py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-2xs rounded-lg cursor-pointer"
                  >
                    Invite Colleague
                  </button>
                </div>

                <div className="divide-y divide-zinc-200 dark:divide-zinc-850">
                  <div className="py-3 flex justify-between items-center text-xs font-semibold">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white block">{user.name || "Owner User"} (You)</span>
                      <span className="text-zinc-500 text-3xs">{user.email}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-purple-600/10 text-purple-400 text-3xs font-bold uppercase">OWNER</span>
                  </div>
                  <div className="py-3 flex justify-between items-center text-xs font-semibold opacity-60">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white block">Sarah Connor</span>
                      <span className="text-zinc-500 text-3xs">sarah@company.com</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-3xs font-bold uppercase">EDITOR</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: CREATE QR CODE */}
      {isQrModalOpen && (() => {
        // Resolve preview QR contents
        const previewContent = qrType === "DYNAMIC" 
          ? `${window.location.origin}/r/preview` 
          : (qrContentType === "WIFI" 
              ? `WIFI:T:WPA;S:${qrDestUrl};P:;;` 
              : qrContentType === "PHONE" 
              ? `tel:${qrDestUrl}` 
              : qrDestUrl);

        let previewSvg = "";
        try {
          previewSvg = generateCustomQrSvg(previewContent, qrStyling);
        } catch (e) {
          console.error(e);
        }

        const downloadPreviewSvg = () => {
          const blob = new Blob([previewSvg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `qrflow-preview.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        };

        const downloadPreviewPng = () => {
          const img = new Image();
          const svgBlob = new Blob([previewSvg], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(svgBlob);
          
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1000;
            canvas.height = 1000;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.fillStyle = "transparent";
              ctx.fillRect(0, 0, 1000, 1000);
              ctx.drawImage(img, 0, 0, 1000, 1000);
              
              const pngUrl = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = pngUrl;
              link.download = `qrflow-preview.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
            URL.revokeObjectURL(url);
          };
          img.src = url;
        };

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold font-heading text-zinc-900 dark:text-white">Create QR Code</h2>
                <button type="button" onClick={() => setIsQrModalOpen(false)} className="text-zinc-400 hover:text-zinc-200 text-xs">Close</button>
              </div>
              
              <form onSubmit={handleCreateQr}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Form Fields with Homepage style Tab selector */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Header Tabs */}
                    <div className="flex border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl overflow-hidden p-0.5">
                      {[
                        { id: "content", label: "Content" },
                        { id: "design", label: "Design" },
                        { id: "brand", label: "Branding" }
                      ].map(tab => (
                        <button
                          type="button"
                          key={tab.id}
                          onClick={() => setModalTab(tab.id as any)}
                          className={`flex-grow py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            modalTab === tab.id
                              ? "bg-purple-600 text-white font-bold shadow-sm"
                              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {modalTab === "content" && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-3xs font-bold text-zinc-505 block mb-1.5 uppercase tracking-wider">QR Code Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Menu Card Q4"
                            value={qrName}
                            onChange={(e) => setQrName(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-3xs font-bold text-zinc-505 block mb-1.5 uppercase tracking-wider">QR Mode Type</label>
                            <select
                              value={qrType}
                              onChange={(e) => setQrType(e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white font-semibold"
                            >
                              <option value="DYNAMIC">Dynamic (Premium)</option>
                              <option value="STATIC">Static (Free)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-3xs font-bold text-zinc-505 block mb-1.5 uppercase tracking-wider">Folder / Workspace</label>
                            <select
                              value={qrFolderId}
                              onChange={(e) => setQrFolderId(e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white font-semibold"
                            >
                              <option value="">None</option>
                              {folders.map((f) => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Interactive Data type Row matching homepage selector */}
                        <div>
                          <label className="text-3xs font-bold text-zinc-505 block mb-2 uppercase tracking-wider">QR Data Type</label>
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              { id: "WEBSITE", label: "URL", icon: (
                                <svg className="w-4.5 h-4.5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                              )},
                              { id: "TEXT", label: "Text", icon: (
                                <svg className="w-4.5 h-4.5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="17" y1="10" x2="3" y2="10" />
                                  <line x1="21" y1="6" x2="3" y2="6" />
                                  <line x1="21" y1="14" x2="3" y2="14" />
                                  <line x1="17" y1="18" x2="3" y2="18" />
                                </svg>
                              )},
                              { id: "WIFI", label: "WiFi", icon: (
                                <svg className="w-4.5 h-4.5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                                  <line x1="12" y1="20" x2="12.01" y2="20" />
                                </svg>
                              )},
                              { id: "PHONE", label: "Call", icon: (
                                <svg className="w-4.5 h-4.5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                              )},
                              { id: "SMS", label: "SMS", icon: (
                                <svg className="w-4.5 h-4.5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                              )}
                            ].map((type) => (
                              <button
                                type="button"
                                key={type.id}
                                onClick={() => setQrContentType(type.id)}
                                className={`py-3 flex flex-col items-center justify-center border rounded-xl cursor-pointer transition-all ${
                                  qrContentType === type.id
                                    ? "bg-purple-650/15 border-purple-500 text-purple-650 dark:text-purple-400 font-bold shadow-sm"
                                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-500 font-semibold"
                                }`}
                              >
                                {type.icon}
                                <span className="text-4xs uppercase tracking-wider">{type.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-3xs font-bold text-zinc-505 block mb-1.5 uppercase tracking-wider">
                            {qrContentType === "WEBSITE" ? "Destination URL" : 
                             qrContentType === "TEXT" ? "Plain Text Content" :
                             qrContentType === "WIFI" ? "WiFi SSID Network" :
                             qrContentType === "PHONE" ? "Phone Number" : "SMS Content / Code"}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={qrContentType === "WEBSITE" ? "https://yourlink.com" : "Details..."}
                            value={qrDestUrl}
                            onChange={(e) => setQrDestUrl(e.target.value)}
                            className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-3xs font-bold text-zinc-505 block mb-1.5 uppercase tracking-wider">Assign Campaign</label>
                            <select
                              value={qrCampaignId}
                              onChange={(e) => setQrCampaignId(e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white font-semibold"
                            >
                              <option value="">None</option>
                              {campaigns.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          {qrType === "DYNAMIC" && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-3xs font-bold text-zinc-505 block mb-1 uppercase tracking-wider">Scan Limit</label>
                                <input
                                  type="number"
                                  placeholder="e.g. 500"
                                  value={qrScanLimit}
                                  onChange={(e) => setQrScanLimit(e.target.value)}
                                  className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-3xs font-bold text-zinc-505 block mb-1 uppercase tracking-wider">Expiry Date</label>
                                <input
                                  type="date"
                                  value={qrExpiry}
                                  onChange={(e) => setQrExpiry(e.target.value)}
                                  className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {renderDesignAndBrandFields()}
                  </div>

                  {/* Right Column: Card Preview matching screenshot */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex flex-col items-center shadow-lg">
                      <span className="text-4xs font-bold uppercase tracking-widest text-zinc-500 mb-4 font-heading">Realtime Live Preview</span>
                      
                      <div 
                        className="w-44 h-44 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-900 mb-6"
                        dangerouslySetInnerHTML={{ __html: previewSvg }}
                      />
                      
                      <div className="space-y-2.5 w-full">
                        <button
                          type="button"
                          onClick={downloadPreviewPng}
                          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all uppercase tracking-wider"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          <span>Download PNG (High-Res)</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={downloadPreviewSvg}
                          className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all uppercase tracking-wider"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          <span>Download Vector SVG</span>
                        </button>
                      </div>

                      <span className="text-4xs text-zinc-500 text-center font-semibold block pt-4 leading-relaxed">
                        {qrType === "STATIC" 
                          ? "Static codes are 100% free and never expire. To create tracking links and update URL destinations anytime, sign up for a dynamic account."
                          : "Dynamic codes track scan analytics, geo locations, devices, and allow modifying destinations anytime without altering the QR image."}
                      </span>
                    </div>
                  </div>

                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-850 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(false)}
                    className="px-4 py-2 border border-zinc-250 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-650 hover:bg-purple-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Generate QR
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* MODAL: QR DETAILS & ADVANCED REDIRECT RULES */}
      {isDetailsModalOpen && selectedQr && (() => {
        const shortRedirect = `${window.location.origin}/r/${selectedQr.shortCode}`;
        const previewContent = selectedQr.type === "DYNAMIC" 
          ? shortRedirect 
          : (selectedQr.staticData || " ");

        let previewSvg = "";
        try {
          previewSvg = generateCustomQrSvg(previewContent, qrStyling);
        } catch (e) {
          console.error(e);
        }

        const downloadPreviewSvg = () => {
          const blob = new Blob([previewSvg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `qrflow-${selectedQr.name.replace(/\s+/g, '-').toLowerCase()}-${selectedQr.shortCode}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        };

        const downloadPreviewPng = () => {
          const img = new Image();
          const svgBlob = new Blob([previewSvg], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(svgBlob);
          
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1000;
            canvas.height = 1000;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.fillStyle = "transparent";
              ctx.fillRect(0, 0, 1000, 1000);
              ctx.drawImage(img, 0, 0, 1000, 1000);
              
              const pngUrl = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = pngUrl;
              link.download = `qrflow-${selectedQr.name.replace(/\s+/g, '-').toLowerCase()}-${selectedQr.shortCode}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
            URL.revokeObjectURL(url);
          };
          img.src = url;
        };

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-3xs font-extrabold uppercase tracking-widest text-purple-400 block mb-1">Redirect Configurator</span>
                  <h2 className="text-lg font-bold font-heading text-zinc-900 dark:text-white">{selectedQr.name} ({selectedQr.shortCode})</h2>
                </div>
                <button 
                  onClick={() => handleDeleteQr(selectedQr.id)}
                  className="py-1 px-2.5 bg-red-650/10 border border-red-500/25 text-red-400 hover:bg-red-650/20 rounded font-semibold text-2xs cursor-pointer"
                >
                  Delete QR
                </button>
              </div>

              <form onSubmit={handleUpdateQr}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Details & Advanced Redirect Rules */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Header Tabs matching homepage style */}
                    <div className="flex border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl overflow-hidden p-0.5">
                      {[
                        { id: "content", label: "Content" },
                        { id: "design", label: "Design" },
                        { id: "brand", label: "Branding" }
                      ].map(tab => (
                        <button
                          type="button"
                          key={tab.id}
                          onClick={() => setModalTab(tab.id as any)}
                          className={`flex-grow py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            modalTab === tab.id
                              ? "bg-purple-600 text-white font-bold shadow-sm"
                              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {modalTab === "content" && (
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-3xs font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Edit QR Name</label>
                            <input
                              type="text"
                              required
                              value={qrName}
                              onChange={(e) => setQrName(e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-3xs font-bold text-zinc-500 block mb-1 uppercase tracking-wider">
                              {selectedQr.type === "DYNAMIC" ? "Target Redirect URL" : "Data Content"}
                            </label>
                            <input
                              type="text"
                              required
                              value={qrDestUrl}
                              onChange={(e) => setQrDestUrl(e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none text-zinc-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>

                        {selectedQr.type === "DYNAMIC" && (
                          <div className="border-t border-zinc-200 dark:border-zinc-850 pt-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-455 block mb-3 flex items-center gap-1.5">
                              <Globe className="w-4 h-4 text-purple-400" />
                              <span>Advanced Redirect Rules ({rules.length})</span>
                            </h3>

                            {/* Queue new rule form */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end bg-zinc-50 dark:bg-zinc-950/40 p-3 border border-zinc-200 dark:border-zinc-850 rounded-xl mb-4">
                              <div>
                                <label className="text-3xs text-zinc-555 block mb-1 font-bold">Rule Type</label>
                                <select
                                  value={newRuleType}
                                  onChange={(e) => setNewRuleType(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-2xs text-zinc-900 dark:text-white"
                                >
                                  <option value="DEVICE">Device Match</option>
                                  <option value="COUNTRY">Country Match</option>
                                  <option value="LANGUAGE">Language Match</option>
                                  <option value="AB_TEST">A/B Weighted Split</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-3xs text-zinc-555 block mb-1 font-bold">
                                  {newRuleType === "DEVICE" ? "Device (iOS/Android)" : 
                                   newRuleType === "COUNTRY" ? "Country (US/GB/IN)" : 
                                   newRuleType === "LANGUAGE" ? "Lang Code (EN/ES)" : "Weight (0-100)"}
                                </label>
                                <input
                                  type="text"
                                  placeholder={newRuleType === "DEVICE" ? "iOS" : newRuleType === "COUNTRY" ? "US" : "30"}
                                  value={newRuleKey}
                                  onChange={(e) => setNewRuleKey(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-2xs text-zinc-900 dark:text-white font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 flex gap-2">
                                <div className="flex-1">
                                  <label className="text-3xs text-zinc-555 block mb-1 font-bold">Redirect URL</label>
                                  <input
                                    type="url"
                                    placeholder="https://alternative-link.com"
                                    value={newRuleUrl}
                                    onChange={(e) => setNewRuleUrl(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-2xs text-zinc-900 dark:text-white font-mono"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAddRule}
                                  className="py-1.5 px-3 bg-purple-650 hover:bg-purple-600 text-white rounded-lg text-2xs font-semibold cursor-pointer shrink-0"
                                >
                                  Add Rule
                                </button>
                              </div>
                            </div>

                            {/* Listing Queued Rules */}
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {rules.map((rule, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-2xs font-semibold">
                                  <div className="flex items-center gap-4">
                                    <span className="px-2 py-0.5 bg-purple-550/15 text-purple-400 rounded uppercase font-bold text-3xs">{rule.type}</span>
                                    <span className="text-zinc-650 dark:text-zinc-350">Key: <span className="font-mono text-zinc-900 dark:text-white">{rule.key}</span></span>
                                    <span className="text-zinc-500 truncate max-w-[200px] font-mono">{rule.destinationUrl}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveRule(idx)}
                                    className="p-1 text-red-500 hover:bg-red-550/15 rounded cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              {rules.length === 0 && (
                                <div className="text-center py-4 text-3xs text-zinc-500">No rule constraints active. Dynamic redirection relies on default destination URL.</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {renderDesignAndBrandFields()}
                  </div>

                  {/* Right Column: Style Customizer & Live Preview matching screenshot */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex flex-col items-center shadow-lg">
                      <span className="text-4xs font-bold uppercase tracking-widest text-zinc-500 mb-4 font-heading">Realtime Live Preview</span>
                      
                      <div 
                        className="w-44 h-44 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-900 mb-6"
                        dangerouslySetInnerHTML={{ __html: previewSvg }}
                      />
                      
                      <div className="space-y-2.5 w-full">
                        <button
                          type="button"
                          onClick={downloadPreviewPng}
                          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all uppercase tracking-wider"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          <span>Download PNG (High-Res)</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={downloadPreviewSvg}
                          className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all uppercase tracking-wider"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          <span>Download Vector SVG</span>
                        </button>
                      </div>

                      <span className="text-4xs text-zinc-500 text-center font-semibold block pt-4 leading-relaxed">
                        {selectedQr.type === "STATIC" 
                          ? "Static codes are 100% free and never expire. To create tracking links and update URL destinations anytime, sign up for a dynamic account."
                          : "Dynamic codes track scan analytics, geo locations, devices, and allow modifying destinations anytime without altering the QR image."}
                      </span>
                    </div>
                  </div>

                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-850 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="px-4 py-2 border border-zinc-250 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-650 hover:bg-purple-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Save QR Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* COMMAND PALETTE DIALOG */}
      {isCommandPaletteOpen && (
        <div 
          className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setIsCommandPaletteOpen(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative border-b border-zinc-200 dark:border-zinc-800">
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search QR codes..."
                className="w-full pl-10 pr-4 py-4 bg-transparent text-sm focus:outline-none text-zinc-900 dark:text-white"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="p-2 max-h-80 overflow-y-auto">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-650 px-3 py-1.5 block">Search Results</span>
              {qrs.filter(q => q.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5).map(qr => (
                <button
                  key={qr.id}
                  onClick={() => { openEditModal(qr); setIsCommandPaletteOpen(false); }}
                  className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl flex items-center justify-between text-xs font-semibold cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-4 h-4 text-purple-400" />
                    <span>{qr.name}</span>
                  </div>
                  <span className="text-3xs text-zinc-500 font-mono">{qr.shortCode}</span>
                </button>
              ))}
              
              <span className="text-3xs font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-650 px-3 py-1.5 block mt-2">Tab Controls</span>
              {[
                { tab: "overview", label: "Go to Dashboard Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
                { tab: "qrs", label: "Inspect QR Codes list", icon: <QrCode className="w-4 h-4" /> },
                { tab: "analytics", label: "Examine Analytics logs", icon: <BarChart3 className="w-4 h-4" /> },
                { tab: "billing", label: "View Subscription Invoice & Plans", icon: <CreditCard className="w-4 h-4" /> },
              ].map(cmd => (
                <button
                  key={cmd.tab}
                  onClick={() => { setActiveTab(cmd.tab as Tab); setIsCommandPaletteOpen(false); }}
                  className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl flex items-center gap-3 text-xs font-semibold cursor-pointer"
                >
                  {cmd.icon}
                  <span>{cmd.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-850 flex justify-between items-center text-4xs text-zinc-450 font-bold">
              <span>Search everywhere</span>
              <span>ESC to Close</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
