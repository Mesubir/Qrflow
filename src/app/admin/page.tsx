"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateCustomQrSvg } from "@/lib/qr-generator";
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowLeft,
  Mail,
  UserCheck,
  CheckCircle,
  FileText,
  AlertTriangle,
  QrCode,
  Sliders,
  Plus,
  Copy,
  ExternalLink,
  Trash2,
  Globe,
  Download
} from "lucide-react";

type AdminTab = "users" | "qrs" | "logs" | "tickets";

export default function AdminPanelPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [loading, setLoading] = useState(true);

  // States
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [qrs, setQrs] = useState<any[]>([]);
  const [tickets, setTickets] = useState([
    { id: "T-1", name: "Bruce Wayne", email: "bruce@wayne.com", subject: "Custom Domain setup failing", status: "OPEN", priority: "HIGH" },
    { id: "T-2", name: "Clark Kent", email: "clark@dailyplanet.com", subject: "Invoice mismatch for Q3", status: "CLOSED", priority: "MEDIUM" },
    { id: "T-3", name: "Barry Allen", email: "barry@ccpd.org", subject: "Redirect speed latency", status: "OPEN", priority: "LOW" },
  ]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState<any>(null);

  // Form states for QR Creation/Editing
  const [qrName, setQrName] = useState("");
  const [qrType, setQrType] = useState("DYNAMIC");
  const [qrContentType, setQrContentType] = useState("WEBSITE");
  const [qrDestUrl, setQrDestUrl] = useState("https://");
  const [qrScanLimit, setQrScanLimit] = useState("");
  const [qrExpiry, setQrExpiry] = useState("");
  const [qrStyling, setQrStyling] = useState<any>({
    primaryColor: "#6d28d9",
    secondaryColor: "#3b82f6",
    isGradient: true,
    dotStyle: "rounded",
    eyeOuterStyle: "rounded",
    eyeInnerStyle: "circle",
    margin: 30,
    frameStyle: "none",
    frameText: "SCAN ME"
  });

  const [modalTab, setModalTab] = useState<"content" | "design" | "brand">("content");

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: "₹84,900",
    totalScans: 12450,
    activeSubs: 0,
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setIsAdmin(true);
          loadAdminData();
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  const loadAdminData = () => {
    setLoading(false);
    
    setUsers([
      { id: "u1", name: "Tony Stark", email: "tony@stark.com", plan: "PRO", status: "ACTIVE", joined: "2026-07-15" },
      { id: "u2", name: "Bruce Banner", email: "bruce@banner.com", plan: "STARTER", status: "ACTIVE", joined: "2026-07-20" },
      { id: "u3", name: "Steve Rogers", email: "steve@rogers.com", plan: "FREE", status: "ACTIVE", joined: "2026-07-22" },
      { id: "u4", name: "Natasha Romanoff", email: "natasha@shield.gov", plan: "BUSINESS", status: "ACTIVE", joined: "2026-07-25" },
    ]);

    setAuditLogs([
      { id: "l1", user: "tony@stark.com", action: "API_KEY_CREATE", details: "Generated key 'Stark Industries API'", time: "10 mins ago" },
      { id: "l2", user: "bruce@banner.com", action: "QR_UPDATE", details: "Redirect edited for code 'Gamma Lab'", time: "1 hr ago" },
      { id: "l3", user: "natasha@shield.gov", action: "BILLING_UPGRADE", details: "Upgraded plan to BUSINESS", time: "3 hrs ago" },
      { id: "l4", user: "steve@rogers.com", action: "QR_CREATE", details: "Created static QR 'Rescue Op'", time: "1 day ago" },
    ]);

    setQrs([
      {
        id: "qr1",
        name: "Vrinda Fertility",
        type: "DYNAMIC",
        qrType: "WEBSITE",
        shortCode: "LNNb8",
        originalUrl: "https://vrindafertility.com/",
        staticData: "",
        status: "ACTIVE",
        scans: 156,
        stylingJson: JSON.stringify({
          primaryColor: "#6d28d9",
          secondaryColor: "#3b82f6",
          isGradient: true,
          dotStyle: "rounded",
          eyeOuterStyle: "rounded",
          eyeInnerStyle: "circle",
          frameStyle: "none",
          frameText: "SCAN ME"
        })
      },
      {
        id: "qr2",
        name: "Stark Industries Portal",
        type: "DYNAMIC",
        qrType: "WEBSITE",
        shortCode: "Stark9",
        originalUrl: "https://starkindustries.com",
        staticData: "",
        status: "ACTIVE",
        scans: 1240,
        stylingJson: JSON.stringify({
          primaryColor: "#ef4444",
          secondaryColor: "#f59e0b",
          isGradient: true,
          dotStyle: "square",
          eyeOuterStyle: "square",
          eyeInnerStyle: "square",
          frameStyle: "simple",
          frameText: "IRON MAN"
        })
      },
      {
        id: "qr3",
        name: "Rescue Op Static Map",
        type: "STATIC",
        qrType: "TEXT",
        shortCode: "Rescue",
        originalUrl: "",
        staticData: "Coordinates: 40.7128N, 74.0060W",
        status: "ACTIVE",
        scans: 45,
        stylingJson: JSON.stringify({
          primaryColor: "#10b981",
          secondaryColor: "#059669",
          isGradient: false,
          dotStyle: "dots",
          eyeOuterStyle: "circle",
          eyeInnerStyle: "circle",
          frameStyle: "none",
          frameText: "SCAN ME"
        })
      }
    ]);

    setStats({
      totalUsers: 4,
      totalRevenue: "₹84,900",
      totalScans: 12450,
      activeSubs: 3,
    });
  };

  const handleResolveTicket = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: "CLOSED" } : t));
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openCreateModal = () => {
    setQrName("");
    setQrType("DYNAMIC");
    setQrContentType("WEBSITE");
    setQrDestUrl("https://");
    setQrScanLimit("");
    setQrExpiry("");
    setQrStyling({
      primaryColor: "#6d28d9",
      secondaryColor: "#3b82f6",
      isGradient: true,
      dotStyle: "rounded",
      eyeOuterStyle: "rounded",
      eyeInnerStyle: "circle",
      frameStyle: "none",
      frameText: "SCAN ME",
      margin: 30
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (qr: any) => {
    setSelectedQr(qr);
    setQrName(qr.name);
    setQrType(qr.type);
    setQrContentType(qr.qrType);
    setQrDestUrl(qr.type === "DYNAMIC" ? qr.originalUrl : qr.staticData);
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
        frameStyle: "none",
        frameText: "SCAN ME",
        margin: 30
      });
    }
    setIsEditModalOpen(true);
  };

  const handleCreateQrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQr = {
      id: `qr_${Date.now()}`,
      name: qrName,
      type: qrType,
      qrType: qrContentType,
      shortCode: Math.random().toString(36).substring(2, 7),
      originalUrl: qrType === "DYNAMIC" ? qrDestUrl : "",
      staticData: qrType === "STATIC" ? qrDestUrl : "",
      status: "ACTIVE",
      scans: 0,
      stylingJson: JSON.stringify(qrStyling)
    };
    setQrs([newQr, ...qrs]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateQrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQrs(qrs.map(q => q.id === selectedQr.id ? {
      ...q,
      name: qrName,
      originalUrl: qrType === "DYNAMIC" ? qrDestUrl : "",
      staticData: qrType === "STATIC" ? qrDestUrl : "",
      stylingJson: JSON.stringify(qrStyling)
    } : q));
    setIsEditModalOpen(false);
  };

  const handleDeleteQr = (id: string) => {
    setQrs(qrs.filter(q => q.id !== id));
    setIsEditModalOpen(false);
  };

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
                  className="flex-1 px-2 py-1 bg-zinc-950 border border-zinc-850 rounded text-xs font-mono text-white"
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
                  className="flex-1 px-2 py-1 bg-zinc-950 border border-zinc-850 rounded text-xs font-mono text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>
          
          <label className="flex items-center gap-1.5 text-2xs text-zinc-400 cursor-pointer font-semibold">
            <input
              type="checkbox"
              checked={qrStyling.isGradient ?? true}
              onChange={(e) => setQrStyling((p: any) => ({ ...p, isGradient: e.target.checked }))}
              className="rounded border-zinc-700 accent-purple-650"
            />
            <span>Enable Color Gradient</span>
          </label>

          {/* Dots Pattern */}
          <div>
            <label className="text-3xs font-bold uppercase tracking-wider text-zinc-450 block mb-2">Dot Style</label>
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
                      ? "bg-purple-600/10 border-purple-500 text-purple-400"
                      : "border-zinc-800 hover:bg-zinc-800 text-zinc-500"
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
              <label className="text-3xs font-bold uppercase tracking-wider text-zinc-450 block mb-1">Outer Eye</label>
              <select
                value={qrStyling.eyeOuterStyle || "square"}
                onChange={(e) => setQrStyling((p: any) => ({ ...p, eyeOuterStyle: e.target.value }))}
                className="w-full px-2 py-1.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white"
              >
                <option value="square">Square</option>
                <option value="rounded">Rounded</option>
                <option value="circle">Circle</option>
              </select>
            </div>
            <div>
              <label className="text-3xs font-bold uppercase tracking-wider text-zinc-455 block mb-1">Inner Eye</label>
              <select
                value={qrStyling.eyeInnerStyle || "square"}
                onChange={(e) => setQrStyling((p: any) => ({ ...p, eyeInnerStyle: e.target.value }))}
                className="w-full px-2 py-1.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white"
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
            <label className="text-3xs font-bold uppercase tracking-wider text-zinc-450 block mb-1.5">Center Logo Link</label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={qrStyling.logoUrl || ""}
              onChange={(e) => setQrStyling((p: any) => ({ ...p, logoUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white font-semibold"
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
                      ? "bg-purple-600/10 border-purple-500 text-purple-400"
                      : "border-zinc-800 hover:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {frm.label}
                </button>
              ))}
            </div>

            {(qrStyling.frameStyle || "none") !== "none" && (
              <div className="mt-3">
                <label className="text-3xs font-semibold text-zinc-400 block mb-1">Frame Text</label>
                <input
                  type="text"
                  maxLength={18}
                  value={qrStyling.frameText || "SCAN ME"}
                  onChange={(e) => setQrStyling((p: any) => ({ ...p, frameText: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white font-semibold"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans transition-all">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP HEADER */}
      <nav className="h-16 border-b border-zinc-800 bg-zinc-950/40 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-400" />
          <h1 className="font-heading font-extrabold text-lg tracking-tight">QRFlow Admin Console</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border border-zinc-800 rounded-lg overflow-hidden text-2xs font-semibold">
            {[
              { id: "users", label: "Users Overview" },
              { id: "qrs", label: "Platform QR Codes" },
              { id: "logs", label: "Security Logs" },
              { id: "tickets", label: "Support Tickets" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3 py-1.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-purple-650 text-white font-bold"
                    : "bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "System Users", value: stats.totalUsers, icon: <Users className="w-4 h-4 text-purple-400" />, desc: "Total accounts registered" },
            { label: "Monthly Revenue", value: stats.totalRevenue, icon: <DollarSign className="w-4 h-4 text-emerald-400" />, desc: "Simulated MRR" },
            { label: "Platform Scans", value: stats.totalScans, icon: <TrendingUp className="w-4 h-4 text-blue-400" />, desc: "Dynamic redirects logged" },
            { label: "Active Subscriptions", value: stats.activeSubs, icon: <Activity className="w-4 h-4 text-pink-400" />, desc: "Premium tier subscriptions" },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 relative overflow-hidden shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-zinc-400">{stat.label}</span>
                <div className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center">{stat.icon}</div>
              </div>
              <span className="text-2xl font-bold font-heading text-white block">{stat.value}</span>
              <span className="text-4xs text-zinc-550 mt-1 block">{stat.desc}</span>
            </div>
          ))}
        </div>

        {/* TAB 1: USERS */}
        {activeTab === "users" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-md">
            <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Registered Accounts</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-4xs">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {users.map((u) => (
                    <tr key={u.id} className="text-zinc-350 hover:bg-zinc-850/20">
                      <td className="py-3 font-bold text-white">{u.name}</td>
                      <td className="py-3 font-mono">{u.email}</td>
                      <td className="py-3">
                        <span className={`text-4xs px-2 py-0.5 rounded-full font-bold uppercase ${
                          u.plan === "FREE" ? "bg-zinc-800 text-zinc-400" : "bg-purple-650/15 text-purple-450"
                        }`}>{u.plan}</span>
                      </td>
                      <td className="py-3 text-zinc-500 font-mono">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PLATFORM QR CODES (NEW VISUAL MONITOR) */}
        {activeTab === "qrs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold font-heading flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  <span>Platform Generated QR Codes ({qrs.length})</span>
                </h3>
                <p className="text-4xs text-zinc-500 font-semibold mt-1">Monitor, styling adjust, or delete scan links across the whole saas platform.</p>
              </div>
              <button
                onClick={openCreateModal}
                className="py-2 px-3 bg-purple-650 hover:bg-purple-600 text-white rounded-lg text-2xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create System QR</span>
              </button>
            </div>

            {/* Grid displaying visual QR codes and downloads */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrs.map((qr) => {
                const shortRedirect = `${window.location.origin}/r/${qr.shortCode}`;
                const qrContent = qr.type === "DYNAMIC" ? shortRedirect : (qr.staticData || " ");
                
                let stylingOpts = {};
                try {
                  stylingOpts = JSON.parse(qr.stylingJson || "{}");
                } catch {
                  stylingOpts = {};
                }

                let qrSvg = "";
                try {
                  qrSvg = generateCustomQrSvg(qrContent, stylingOpts);
                } catch (e) {
                  console.error(e);
                }

                const downloadCardSvg = () => {
                  const blob = new Blob([qrSvg], { type: "image/svg+xml" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `admin-${qr.name.replace(/\s+/g, '-').toLowerCase()}-${qr.shortCode}.svg`;
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
                      link.download = `admin-${qr.name.replace(/\s+/g, '-').toLowerCase()}-${qr.shortCode}.png`;
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
                    className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-all text-xs font-semibold"
                  >
                    <div className="flex gap-4 items-start">
                      {/* Left: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-4xs px-2 py-0.5 rounded-full font-bold uppercase ${
                            qr.type === "STATIC" 
                              ? "bg-zinc-800 text-zinc-400" 
                              : "bg-purple-650/15 text-purple-400"
                          }`}>
                            {qr.type}
                          </span>
                          <span className="text-4xs text-zinc-500 uppercase tracking-widest font-semibold">{qr.qrType}</span>
                        </div>

                        <h4 className="font-heading font-bold text-sm text-white leading-tight mb-2 truncate" title={qr.name}>{qr.name}</h4>
                        
                        {qr.type === "DYNAMIC" ? (
                          <div className="space-y-1">
                            <span className="text-4xs text-zinc-500 uppercase font-semibold">Redirect Link</span>
                            <div className="flex items-center justify-between bg-zinc-950 p-1.5 rounded text-2xs text-zinc-450 font-mono">
                              <span className="truncate max-w-[70%]">{shortRedirect}</span>
                              <div className="flex gap-1 shrink-0">
                                <button onClick={() => handleCopyText(shortRedirect)} className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded cursor-pointer">
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <span className="text-4xs text-zinc-500 uppercase font-semibold block pt-1.5">Destination</span>
                            <span className="text-2xs font-mono text-zinc-500 block truncate">{qr.originalUrl}</span>
                          </div>
                        ) : (
                          <div className="bg-zinc-950 p-2 rounded text-2xs text-zinc-500 font-mono truncate">
                            {qr.staticData}
                          </div>
                        )}
                      </div>

                      {/* Right: Visual QR rendering */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div 
                          className="w-20 h-20 p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center text-white"
                          dangerouslySetInnerHTML={{ __html: qrSvg }}
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={downloadCardPng}
                            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-4xs rounded border border-zinc-700 cursor-pointer"
                            title="Download PNG"
                          >
                            PNG
                          </button>
                          <button
                            onClick={downloadCardSvg}
                            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-4xs rounded border border-zinc-700 cursor-pointer"
                            title="Download SVG"
                          >
                            SVG
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-850 flex justify-between items-center">
                      <div className="text-zinc-500">
                        <span className="text-xs font-bold text-white">{qr.scans}</span>
                        <span className="text-4xs ml-1">scans</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          qr.status === "ACTIVE" ? "bg-emerald-500" : "bg-zinc-550"
                        }`} />
                        <span className="text-4xs text-zinc-500 uppercase font-bold mr-2">{qr.status}</span>
                        <button
                          onClick={() => openEditModal(qr)}
                          className="py-1 px-2 bg-zinc-800 hover:bg-zinc-750 text-white rounded text-2xs flex items-center gap-1 border border-zinc-700 cursor-pointer"
                        >
                          <Sliders className="w-2.5 h-2.5" />
                          <span>Manage</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: LOGS */}
        {activeTab === "logs" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-md">
            <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Platform Action Audits</span>
            </h3>

            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs font-semibold border-b border-zinc-850 pb-2">
                  <div className="flex justify-between items-center text-zinc-400 mb-1">
                    <span className="font-bold text-zinc-300">{log.user}</span>
                    <span className="text-3xs text-zinc-500 font-mono">{log.time}</span>
                  </div>
                  <p className="text-white"><span className="text-purple-400 font-mono font-bold mr-1.5">[{log.action}]</span> {log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TICKETS */}
        {activeTab === "tickets" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-md">
            <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Customer Help Desk Tickets</span>
            </h3>

            <div className="divide-y divide-zinc-850">
              {tickets.map((t) => (
                <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-semibold">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{t.subject}</span>
                      <span className={`text-4xs px-1.5 py-0.5 rounded font-bold uppercase ${
                        t.priority === "HIGH" ? "bg-red-500/10 text-red-400" : t.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-400" : "bg-zinc-800 text-zinc-400"
                      }`}>{t.priority}</span>
                    </div>
                    <span className="text-zinc-550 mt-1 block">Opened by {t.name} ({t.email}) • ID: {t.id}</span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-3xs font-bold uppercase ${t.status === "OPEN" ? "text-amber-400" : "text-zinc-500"}`}>{t.status}</span>
                    {t.status === "OPEN" && (
                      <button
                        onClick={() => handleResolveTicket(t.id)}
                        className="py-1 px-2.5 bg-emerald-650/10 hover:bg-emerald-650/20 text-emerald-450 border border-emerald-500/20 rounded font-semibold text-2xs transition-all cursor-pointer"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: CREATE QR CODE */}
      {isCreateModalOpen && (() => {
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-[#fafafa]">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold font-heading text-white">Create Platform QR</h2>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-zinc-200 text-xs">Close</button>
              </div>
              
              <form onSubmit={handleCreateQrSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Form Fields with Homepage style Tab selector */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Header Tabs */}
                    <div className="flex border border-zinc-800 bg-zinc-950/40 rounded-xl overflow-hidden p-0.5">
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
                              ? "bg-purple-650 text-white font-bold shadow-sm"
                              : "text-zinc-500 hover:text-zinc-400 dark:hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {modalTab === "content" && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-3xs font-bold text-zinc-400 block mb-1.5 uppercase tracking-wider">QR Code Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Menu Card Q4"
                            value={qrName}
                            onChange={(e) => setQrName(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs focus:outline-none text-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-3xs font-bold text-zinc-400 block mb-1.5 uppercase tracking-wider">QR Mode Type</label>
                          <select
                            value={qrType}
                            onChange={(e) => setQrType(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs focus:outline-none text-white font-semibold"
                          >
                            <option value="DYNAMIC">Dynamic (Premium)</option>
                            <option value="STATIC">Static (Free)</option>
                          </select>
                        </div>

                        {/* Interactive Data type Row matching homepage selector */}
                        <div>
                          <label className="text-3xs font-bold text-zinc-400 block mb-2 uppercase tracking-wider">QR Data Type</label>
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
                                    ? "bg-purple-650/15 border-purple-500 text-purple-400 font-bold shadow-sm"
                                    : "border-zinc-800 hover:bg-zinc-800 text-zinc-550 font-semibold"
                                }`}
                              >
                                {type.icon}
                                <span className="text-4xs uppercase tracking-wider">{type.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-3xs font-bold text-zinc-400 block mb-1.5 uppercase tracking-wider">
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
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs focus:outline-none text-white font-mono"
                          />
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

                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:bg-zinc-800 cursor-pointer"
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

      {/* MODAL: EDIT QR CODE */}
      {isEditModalOpen && selectedQr && (() => {
        const previewContent = selectedQr.type === "DYNAMIC" 
          ? `${window.location.origin}/r/${selectedQr.shortCode}` 
          : (qrDestUrl || " ");

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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-[#fafafa]">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-3xs font-extrabold uppercase tracking-widest text-purple-400 block mb-1">Platform Admin Controls</span>
                  <h2 className="text-lg font-bold font-heading text-white">{selectedQr.name} ({selectedQr.shortCode})</h2>
                </div>
                <button 
                  onClick={() => handleDeleteQr(selectedQr.id)}
                  className="py-1 px-2.5 bg-red-650/10 border border-red-500/25 text-red-400 hover:bg-red-650/20 rounded font-semibold text-2xs cursor-pointer"
                >
                  Delete QR
                </button>
              </div>

              <form onSubmit={handleUpdateQrSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Form Fields with Homepage style Tab selector */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Header Tabs */}
                    <div className="flex border border-zinc-800 bg-zinc-950/40 rounded-xl overflow-hidden p-0.5">
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
                              ? "bg-purple-650 text-white font-bold shadow-sm"
                              : "text-zinc-500 hover:text-zinc-400 dark:hover:text-white"
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
                            <label className="text-3xs font-bold text-zinc-400 block mb-1 uppercase tracking-wider">Edit QR Name</label>
                            <input
                              type="text"
                              required
                              value={qrName}
                              onChange={(e) => setQrName(e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs focus:outline-none text-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-3xs font-bold text-zinc-400 block mb-1 uppercase tracking-wider">
                              {selectedQr.type === "DYNAMIC" ? "Redirect Destination URL" : "Data Content"}
                            </label>
                            <input
                              type="text"
                              required
                              value={qrDestUrl}
                              onChange={(e) => setQrDestUrl(e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs focus:outline-none text-white font-mono"
                            />
                          </div>
                        </div>
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

                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:bg-zinc-800 cursor-pointer"
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

    </div>
  );
}
