import React, { useState, useEffect } from "react";
import { type QRConfig, defaultConfig } from "../../lib/qr-logic";
import { QRDesignPanel } from "./QRDesignPanel";
import { QRPreviewPanel } from "./QRPreviewPanel";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { 
  Link as LinkIcon, 
  Wifi, 
  User, 
  MessageSquare, 
  Mail, 
  Phone as PhoneIcon, 
  MapPin, 
  AlignLeft, 
  Sparkles,
  Lock,
  Globe
} from "lucide-react";

interface QRGeneratorShellProps {
  isLoggedIn?: boolean;
  defaultType?: QRType;
}

type QRType = "url" | "wifi" | "vcard" | "whatsapp" | "email" | "sms" | "phone" | "location" | "text";

export const QRGeneratorShell: React.FC<QRGeneratorShellProps> = ({ 
  isLoggedIn = false, 
  defaultType = "url" 
}) => {
  // Config state
  const [config, setConfig] = useState<QRConfig>(defaultConfig);
  const [qrType, setQrType] = useState<QRType>(defaultType);
  const [isDynamic, setIsDynamic] = useState<boolean>(false);
  const [payload, setPayload] = useState<string>("https://realqrcodegenerator.com");

  // Form Fields states
  const [url, setUrl] = useState("https://realqrcodegenerator.com");
  
  // WiFi states
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");

  // vCard states
  const [vcardFirstName, setVcardFirstName] = useState("");
  const [vcardLastName, setVcardLastName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardCompany, setVcardCompany] = useState("");
  const [vcardJobTitle, setVcardJobTitle] = useState("");
  const [vcardUrl, setVcardUrl] = useState("");

  // WhatsApp states
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");

  // Email states
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");

  // SMS states
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  // Phone state
  const [phoneNum, setPhoneNum] = useState("");

  // Location states
  const [locLat, setLocLat] = useState("");
  const [locLng, setLocLng] = useState("");

  // Plain Text state
  const [plainText, setPlainText] = useState("");

  // Build Payload whenever form fields change
  useEffect(() => {
    let rawData = "";
    switch (qrType) {
      case "url":
        rawData = url.trim();
        if (rawData && !/^https?:\/\//i.test(rawData)) {
          rawData = "https://" + rawData;
        }
        break;
      case "wifi":
        rawData = `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
        break;
      case "vcard":
        rawData = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLastName || ""};${vcardFirstName || ""}\nFN:${vcardFirstName || ""} ${vcardLastName || ""}\nORG:${vcardCompany || ""}\nTITLE:${vcardJobTitle || ""}\nTEL:${vcardPhone || ""}\nEMAIL:${vcardEmail || ""}\nURL:${vcardUrl || ""}\nEND:VCARD`;
        break;
      case "whatsapp":
        rawData = `https://wa.me/${waPhone.replace(/\+/g, "").trim()}?text=${encodeURIComponent(waMessage)}`;
        break;
      case "email":
        rawData = `mailto:${mailTo.trim()}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
        break;
      case "sms":
        rawData = `SMSTO:${smsPhone.trim()}:${smsMessage}`;
        break;
      case "phone":
        rawData = `tel:${phoneNum.trim()}`;
        break;
      case "location":
        rawData = `geo:${locLat.trim()},${locLng.trim()}`;
        break;
      case "text":
        rawData = plainText;
        break;
    }
    setPayload(rawData || "https://realqrcodegenerator.com");
  }, [
    qrType, url, wifiSsid, wifiPassword, wifiEncryption,
    vcardFirstName, vcardLastName, vcardPhone, vcardEmail, vcardCompany, vcardJobTitle, vcardUrl,
    waPhone, waMessage, mailTo, mailSubject, mailBody, smsPhone, smsMessage, phoneNum, locLat, locLng, plainText
  ]);

  // Handle saving QR Codes in database (Phase 1 Dynamic logic)
  const handleSaveDynamicQR = async () => {
    if (!isLoggedIn) {
      window.location.href = "/register?redirect=dashboard";
      return;
    }
    
    // Server-side create request
    try {
      const response = await fetch("/api/qr/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "dynamic",
          category: qrType,
          originalUrl: url.trim(),
          qrConfig: config,
        }),
      });

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        alert("Error saving dynamic QR code. Please try again.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const typesList = [
    { id: "url", name: "URL", icon: <LinkIcon className="h-4 w-4" /> },
    { id: "wifi", name: "Wi-Fi", icon: <Wifi className="h-4 w-4" /> },
    { id: "vcard", name: "vCard", icon: <User className="h-4 w-4" /> },
    { id: "whatsapp", name: "WhatsApp", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "email", name: "Email", icon: <Mail className="h-4 w-4" /> },
    { id: "sms", name: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "phone", name: "Phone", icon: <PhoneIcon className="h-4 w-4" /> },
    { id: "location", name: "Location", icon: <MapPin className="h-4 w-4" /> },
    { id: "text", name: "Text", icon: <AlignLeft className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto px-4 w-full">
      
      {/* Left Column: Type selection & Fields */}
      <div className="lg:col-span-5 space-y-6">
        <Card level={2} rounded="lg">
          <h2 className="text-sm font-mono uppercase tracking-wider text-mute mb-4">1. Content Type</h2>
          
          {/* Type Tabs Grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {typesList.map((type) => (
              <button
                key={type.id}
                onClick={() => setQrType(type.id)}
                className={`py-2 px-1 text-xs font-semibold rounded-sm border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  qrType === type.id ? "bg-primary text-on-primary border-primary" : "bg-canvas text-body border-hairline hover:text-ink"
                }`}
              >
                {type.icon}
                {type.name}
              </button>
            ))}
          </div>

          <h2 className="text-sm font-mono uppercase tracking-wider text-mute mb-4">2. Enter Details</h2>

          {/* Form Fields Render */}
          <div className="space-y-4">
            {qrType === "url" && (
              <Input
                label="Website URL"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            )}

            {qrType === "wifi" && (
              <div className="space-y-3">
                <Input
                  label="Network Name (SSID)"
                  placeholder="Home-Wifi"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="WPA Password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-body">Security Type</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                    className="h-10 text-sm px-3 rounded-sm border border-hairline bg-canvas outline-none focus:border-hairline-strong font-sans"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Unsecured (None)</option>
                  </select>
                </div>
              </div>
            )}

            {qrType === "vcard" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    placeholder="Jane"
                    value={vcardFirstName}
                    onChange={(e) => setVcardFirstName(e.target.value)}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={vcardLastName}
                    onChange={(e) => setVcardLastName(e.target.value)}
                  />
                </div>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 555-0199"
                  value={vcardPhone}
                  onChange={(e) => setVcardPhone(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="jane@company.com"
                  value={vcardEmail}
                  onChange={(e) => setVcardEmail(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Company"
                    placeholder="ACME Corp"
                    value={vcardCompany}
                    onChange={(e) => setVcardCompany(e.target.value)}
                  />
                  <Input
                    label="Job Title"
                    placeholder="Developer"
                    value={vcardJobTitle}
                    onChange={(e) => setVcardJobTitle(e.target.value)}
                  />
                </div>
                <Input
                  label="Website URL"
                  placeholder="https://company.com"
                  value={vcardUrl}
                  onChange={(e) => setVcardUrl(e.target.value)}
                />
              </div>
            )}

            {qrType === "whatsapp" && (
              <div className="space-y-3">
                <Input
                  label="WhatsApp Phone Number (with Country Code)"
                  placeholder="15550199"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-body">Pre-filled Message</label>
                  <textarea
                    placeholder="Hello! I scanned your QR Code."
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    className="p-3 text-sm rounded-sm border border-hairline bg-canvas outline-none focus:border-hairline-strong min-h-[80px] w-full"
                  />
                </div>
              </div>
            )}

            {qrType === "email" && (
              <div className="space-y-3">
                <Input
                  label="Recipient Email Address"
                  type="email"
                  placeholder="hello@company.com"
                  value={mailTo}
                  onChange={(e) => setMailTo(e.target.value)}
                />
                <Input
                  label="Email Subject"
                  placeholder="Inquiry from QR Code"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-body">Email Body</label>
                  <textarea
                    placeholder="Write details..."
                    value={mailBody}
                    onChange={(e) => setMailBody(e.target.value)}
                    className="p-3 text-sm rounded-sm border border-hairline bg-canvas outline-none focus:border-hairline-strong min-h-[80px] w-full"
                  />
                </div>
              </div>
            )}

            {qrType === "sms" && (
              <div className="space-y-3">
                <Input
                  label="Phone Number"
                  placeholder="+15550199"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-body">SMS Message</label>
                  <textarea
                    placeholder="Send this message..."
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="p-3 text-sm rounded-sm border border-hairline bg-canvas outline-none focus:border-hairline-strong min-h-[80px] w-full"
                  />
                </div>
              </div>
            )}

            {qrType === "phone" && (
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 555-0199"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
              />
            )}

            {qrType === "location" && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Latitude"
                  placeholder="40.7128"
                  value={locLat}
                  onChange={(e) => setLocLat(e.target.value)}
                />
                <Input
                  label="Longitude"
                  placeholder="-74.0060"
                  value={locLng}
                  onChange={(e) => setLocLng(e.target.value)}
                />
              </div>
            )}

            {qrType === "text" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-body">Plain Text</label>
                <textarea
                  placeholder="Write any plain text details..."
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  className="p-3 text-sm rounded-sm border border-hairline bg-canvas outline-none focus:border-hairline-strong min-h-[120px] w-full"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Static vs Dynamic Toggle Block */}
        <Card level={2} rounded="lg" className="border-l-4 border-l-link">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold text-ink flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-link" />
              Dynamic Campaigns
            </h3>
            <span className="text-[10px] font-mono font-medium text-link uppercase bg-link-bg-soft px-2.5 py-0.5 rounded-full">
              SaaS Advantage
            </span>
          </div>
          <p className="text-xs text-body mb-4">
            Dynamic QR codes redirect scans through a shortlink, allowing you to edit the destination link at any point in the future and access scanning analytics.
          </p>
          
          <div className="flex items-center justify-between border-t border-hairline pt-4">
            <span className="text-xs font-mono uppercase tracking-wider text-mute">QR Code Mode</span>
            <div className="inline-flex gap-2">
              <button
                onClick={() => setIsDynamic(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer ${
                  !isDynamic ? "bg-primary text-on-primary border-primary" : "bg-canvas text-body border-hairline hover:text-ink"
                }`}
              >
                Static (Offline)
              </button>
              <button
                onClick={() => setIsDynamic(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer flex items-center gap-1 ${
                  isDynamic ? "bg-primary text-on-primary border-primary" : "bg-canvas text-body border-hairline hover:text-ink"
                }`}
              >
                {!isLoggedIn && <Lock className="h-3 w-3" />}
                Dynamic (Editable)
              </button>
            </div>
          </div>

          {isDynamic && (
            <div className="mt-4 border-t border-hairline pt-4 space-y-3">
              {isLoggedIn ? (
                <Button variant="primary" size="sm" onClick={handleSaveDynamicQR} className="w-full">
                  Create Dynamic QR Code
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-[11px] text-body mb-3">You must be logged in to create Dynamic QR Codes.</p>
                  <a href="/register?redirect=dashboard" className="inline-block w-full">
                    <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3 text-link" />
                      Sign Up & Create Dynamic QR
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Center Column: Customizer config panel */}
      <div className="lg:col-span-4 h-full">
        <QRDesignPanel config={config} onChange={setConfig} />
      </div>

      {/* Right Column: Live preview & download triggers */}
      <div className="lg:col-span-3">
        <QRPreviewPanel data={payload} config={config} isDynamic={isDynamic} />
      </div>

    </div>
  );
};
