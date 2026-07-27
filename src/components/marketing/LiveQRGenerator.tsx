"use client";

import React, { useState, useEffect } from "react";
import { generateCustomQrSvg, QRStylingOptions } from "@/lib/qr-generator";
import { Link2, Wifi, AlignLeft, Phone, Mail, Download, Sliders, Palette, Layout, Settings } from "lucide-react";

type QRType = "WEBSITE" | "TEXT" | "WIFI" | "PHONE" | "SMS";

export default function LiveQRGenerator() {
  // Main Settings
  const [qrType, setQrType] = useState<QRType>("WEBSITE");
  const [url, setUrl] = useState("https://qrflow.com");
  const [text, setText] = useState("Hello World!");
  const [wifiSsid, setWifiSsid] = useState("HomeNetwork");
  const [wifiPassword, setWifiPassword] = useState("secret123");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [phone, setPhone] = useState("+1234567890");
  const [smsPhone, setSmsPhone] = useState("+1234567890");
  const [smsMessage, setSmsMessage] = useState("Hello via QR!");

  // Custom Styling
  const [primaryColor, setPrimaryColor] = useState("#6d28d9");
  const [secondaryColor, setSecondaryColor] = useState("#3b82f6");
  const [isGradient, setIsGradient] = useState(true);
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [gradientDirection, setGradientDirection] = useState<"to-right" | "to-bottom" | "diagonal">("diagonal");
  const [dotStyle, setDotStyle] = useState<"square" | "rounded" | "dots">("rounded");
  const [eyeOuterStyle, setEyeOuterStyle] = useState<"square" | "rounded" | "circle">("rounded");
  const [eyeInnerStyle, setEyeInnerStyle] = useState<"square" | "rounded" | "circle" | "diamond">("circle");
  const [logoUrl, setLogoUrl] = useState("");
  const [frameStyle, setFrameStyle] = useState<"none" | "simple" | "phone" | "speech">("none");
  const [frameText, setFrameText] = useState("SCAN ME");
  const [margin, setMargin] = useState(30);

  const [activeTab, setActiveTab] = useState<"content" | "design" | "brand">("content");
  const [svgString, setSvgString] = useState("");

  // Compile content based on type
  const getQRContent = () => {
    switch (qrType) {
      case "WEBSITE":
        return url;
      case "TEXT":
        return text;
      case "WIFI":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case "PHONE":
        return `tel:${phone}`;
      case "SMS":
        return `smsto:${smsPhone}:${smsMessage}`;
      default:
        return url;
    }
  };

  // Re-generate SVG whenever state variables change
  useEffect(() => {
    try {
      const qrContent = getQRContent();
      const options: QRStylingOptions = {
        primaryColor,
        secondaryColor,
        isGradient,
        gradientType,
        gradientDirection,
        backgroundColor: "transparent",
        dotStyle,
        eyeOuterStyle,
        eyeInnerStyle,
        logoUrl,
        frameStyle,
        frameText,
        margin,
      };
      
      const generatedSvg = generateCustomQrSvg(qrContent || " ", options);
      setSvgString(generatedSvg);
    } catch (e) {
      console.error("QR Generation error", e);
    }
  }, [
    qrType, url, text, wifiSsid, wifiPassword, wifiEncryption, phone, smsPhone, smsMessage,
    primaryColor, secondaryColor, isGradient, gradientType, gradientDirection,
    dotStyle, eyeOuterStyle, eyeInnerStyle, logoUrl, frameStyle, frameText, margin
  ]);

  // Trigger SVG Download
  const downloadSvg = () => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qrflow-${qrType.toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Trigger PNG Download using HTML5 Canvas drawing
  const downloadPng = () => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
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
        link.download = `qrflow-${qrType.toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
      {/* Settings Side */}
      <div className="lg:col-span-7 bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-all">
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 py-4 px-3 flex items-center justify-center gap-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "content"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Content</span>
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`flex-1 py-4 px-3 flex items-center justify-center gap-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "design"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Design</span>
          </button>
          <button
            onClick={() => setActiveTab("brand")}
            className={`flex-1 py-4 px-3 flex items-center justify-center gap-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "brand"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Branding</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Content configuration */}
          {activeTab === "content" && (
            <div className="space-y-6">
              {/* Selector Types */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
                  QR Data Type
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { type: "WEBSITE", label: "URL", icon: <Link2 className="w-4 h-4" /> },
                    { type: "TEXT", label: "Text", icon: <AlignLeft className="w-4 h-4" /> },
                    { type: "WIFI", label: "WiFi", icon: <Wifi className="w-4 h-4" /> },
                    { type: "PHONE", label: "Call", icon: <Phone className="w-4 h-4" /> },
                    { type: "SMS", label: "SMS", icon: <Mail className="w-4 h-4" /> },
                  ].map((t) => (
                    <button
                      key={t.type}
                      onClick={() => setQrType(t.type as QRType)}
                      className={`py-3 px-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        qrType === t.type
                          ? "bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic input blocks */}
              <div className="space-y-4 pt-2">
                {qrType === "WEBSITE" && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-2">Destination URL</label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                )}

                {qrType === "TEXT" && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-2">Text Content</label>
                    <textarea
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write any custom message or instructions..."
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                    />
                  </div>
                )}

                {qrType === "WIFI" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">Network Name (SSID)</label>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 block mb-1">Password</label>
                        <input
                          type="password"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 block mb-1">Security</label>
                        <select
                          value={wifiEncryption}
                          onChange={(e) => setWifiEncryption(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {qrType === "PHONE" && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                )}

                {qrType === "SMS" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">Recipient Number</label>
                      <input
                        type="text"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">Pre-filled Message</label>
                      <textarea
                        rows={2}
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Design configurations */}
          {activeTab === "design" && (
            <div className="space-y-6">
              {/* Colors Setup */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">Color Configuration</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 border-0 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Secondary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        disabled={!isGradient}
                        className="w-10 h-10 border-0 rounded-lg cursor-pointer disabled:opacity-50"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        disabled={!isGradient}
                        className="flex-1 px-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGradient}
                      onChange={(e) => setIsGradient(e.target.checked)}
                      className="rounded border-zinc-350 accent-purple-600"
                    />
                    <span>Enable Color Gradient</span>
                  </label>
                </div>
              </div>

              {/* Dot Shape */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">Dot Pattern</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "square", label: "Squares" },
                    { id: "rounded", label: "Rounded" },
                    { id: "dots", label: "Circles" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setDotStyle(p.id as any)}
                      className={`py-2 px-3 border text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        dotStyle === p.id
                          ? "bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-zinc-550 dark:text-zinc-400"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye Styles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Outer Eye Frame</label>
                  <select
                    value={eyeOuterStyle}
                    onChange={(e) => setEyeOuterStyle(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm"
                  >
                    <option value="square">Square</option>
                    <option value="rounded">Rounded</option>
                    <option value="circle">Circle</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Inner Eye Dot</label>
                  <select
                    value={eyeInnerStyle}
                    onChange={(e) => setEyeInnerStyle(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm"
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
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Quiet Zone (Margin)</label>
                  <span className="text-xs font-mono text-zinc-500 font-bold">{margin}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Branding & Custom frames */}
          {activeTab === "brand" && (
            <div className="space-y-6">
              {/* Logo Setup */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Overlay Brand Logo</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Enter image logo URL (e.g. SVG or PNG link)..."
                    className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm"
                  />
                  {logoUrl && (
                    <button
                      onClick={() => setLogoUrl("")}
                      className="px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 rounded-xl text-xs text-red-500 font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  We recommend a square image with a transparent background. High error correction matches branding overlays automatically.
                </p>
                {/* Predefined logos */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Presets:</span>
                  {[
                    { label: "Github", url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
                    { label: "Google", url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setLogoUrl(preset.url)}
                      className="px-2 py-1 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-xs text-zinc-650 dark:text-zinc-350 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Frame */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">Frame Border Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "none", label: "No Frame" },
                    { id: "simple", label: "Simple" },
                    { id: "phone", label: "Phone" },
                    { id: "speech", label: "Speech" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFrameStyle(f.id as any)}
                      className={`py-2 px-1 text-2xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        frameStyle === f.id
                          ? "bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-zinc-500"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {frameStyle !== "none" && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Frame Banner Text</label>
                    <input
                      type="text"
                      maxLength={18}
                      value={frameText}
                      onChange={(e) => setFrameText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Side */}
      <div className="lg:col-span-5 bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center transition-all sticky top-24">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6">
          Realtime Live Preview
        </span>

        {/* QR SVG Holder */}
        <div className="w-64 h-64 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/50 dark:border-zinc-850/50 rounded-xl p-4 flex items-center justify-center shadow-inner relative group">
          {svgString ? (
            <div
              className="w-full h-full text-zinc-900 dark:text-white"
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
          ) : (
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Downloads */}
        <div className="mt-8 w-full space-y-3">
          <button
            onClick={downloadPng}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/15"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG (High-Res)</span>
          </button>
          
          <button
            onClick={downloadSvg}
            className="w-full py-3 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-semibold rounded-xl flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Vector SVG</span>
          </button>
        </div>

        <p className="text-2xs text-zinc-400 mt-4 leading-normal">
          Static codes are 100% free and never expire. To create tracking links and update URL destinations anytime, sign up for a dynamic account.
        </p>
      </div>
    </div>
  );
}
