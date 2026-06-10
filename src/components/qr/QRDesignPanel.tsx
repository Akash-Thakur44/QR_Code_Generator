import React, { useState } from "react";
import { type QRConfig } from "../../lib/qr-logic";
import { Palette, Layers, Eye, Image as ImageIcon } from "lucide-react";

interface QRDesignPanelProps {
  config: QRConfig;
  onChange: (newConfig: QRConfig) => void;
}

export const QRDesignPanel: React.FC<QRDesignPanelProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<"colors" | "styles" | "eyes" | "logo">("colors");

  const updateConfig = (key: keyof QRConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const sampleLogos = [
    { name: "None", value: undefined },
    { name: "Link", value: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230070f3' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'></path><path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'></path></svg>" },
    { name: "WiFi", value: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23171717' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M5 12.55a11 11 0 0 1 14.08 0'></path><path d='M1.42 9a16 16 0 0 1 21.16 0'></path><path d='M8.53 16.11a6 6 0 0 1 6.95 0'></path><line x1='12' y1='20' x2='12.01' y2='20'></line></svg>" },
    { name: "WhatsApp", value: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2325D366' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'></path></svg>" },
    { name: "Email", value: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ee0000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path><polyline points='22,6 12,13 2,6'></polyline></svg>" },
  ];

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          updateConfig("logoUrl", uploadEvent.target.result as string);
          updateConfig("logoSize", 18); // Default percentage size
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-hairline bg-canvas rounded-lg shadow-level-2 overflow-hidden flex flex-col h-full">
      {/* Tabs Selector Header */}
      <div className="flex border-b border-hairline bg-canvas-soft">
        <button
          onClick={() => setActiveTab("colors")}
          className={`flex-1 py-3 px-2 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${activeTab === "colors" ? "border-primary text-ink bg-canvas" : "border-transparent text-body hover:text-ink"
            }`}
        >
          <Palette className="h-3.5 w-3.5" />
          Colors
        </button>
        <button
          onClick={() => setActiveTab("styles")}
          className={`flex-1 py-3 px-2 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${activeTab === "styles" ? "border-primary text-ink bg-canvas" : "border-transparent text-body hover:text-ink"
            }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Body
        </button>
        <button
          onClick={() => setActiveTab("eyes")}
          className={`flex-1 py-3 px-2 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${activeTab === "eyes" ? "border-primary text-ink bg-canvas" : "border-transparent text-body hover:text-ink"
            }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Eyes
        </button>
        <button
          onClick={() => setActiveTab("logo")}
          className={`flex-1 py-3 px-2 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${activeTab === "logo" ? "border-primary text-ink bg-canvas" : "border-transparent text-body hover:text-ink"
            }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Logo
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 space-y-6 flex-1 overflow-y-auto min-h-[300px]">
        {/* TAB 1: COLORS */}
        {activeTab === "colors" && (
          <div className="space-y-5">
            {/* Background Fill */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-mute">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.backgroundColor === "transparent" ? "#ffffff" : config.backgroundColor}
                  onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                  className="h-9 w-9 rounded-sm border border-hairline cursor-pointer p-0"
                />
                <button
                  onClick={() => updateConfig("backgroundColor", config.backgroundColor === "transparent" ? "#ffffff" : "transparent")}
                  className={`text-xs px-3 py-1.5 rounded-sm border cursor-pointer ${config.backgroundColor === "transparent" ? "bg-primary text-on-primary border-primary" : "bg-canvas text-body border-hairline hover:text-ink"
                    }`}
                >
                  Transparent
                </button>
              </div>
            </div>

            {/* Foreground Styling */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-mute">Fill Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(["none", "linear", "radial"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateConfig("gradientType", type)}
                    className={`text-xs py-2 border rounded-sm capitalize cursor-pointer transition-colors ${config.gradientType === type ? "bg-primary text-on-primary border-primary font-semibold" : "bg-canvas text-body border-hairline hover:text-ink"
                      }`}
                  >
                    {type === "none" ? "Solid" : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Solid / Start Color Picker */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-mute">
                {config.gradientType === "none" ? "QR Color" : "Gradient Start Color"}
              </label>
              <input
                type="color"
                value={config.foregroundColor}
                onChange={(e) => updateConfig("foregroundColor", e.target.value)}
                className="h-10 w-full rounded-sm border border-hairline cursor-pointer p-0"
              />
            </div>

            {/* Gradient Extra Details */}
            {config.gradientType !== "none" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-mute">Gradient End Color</label>
                  <input
                    type="color"
                    value={config.gradientColor2}
                    onChange={(e) => updateConfig("gradientColor2", e.target.value)}
                    className="h-10 w-full rounded-sm border border-hairline cursor-pointer p-0"
                  />
                </div>

                {config.gradientType === "linear" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-mute">
                      <span>Angle</span>
                      <span>{config.gradientAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={config.gradientAngle}
                      onChange={(e) => updateConfig("gradientAngle", parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 2: BODY STYLE */}
        {activeTab === "styles" && (
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-mute">Pattern Shapes</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: "squares", name: "Classic Squares", desc: "Traditional standard block layout" },
                { id: "dots", name: "Modern Dots", desc: "Rounded circular dots design" },
                { id: "rounded", name: "Smooth Rounded", desc: "Soft rectangular corners" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => updateConfig("bodyStyle", style.id)}
                  className={`text-left p-4 border rounded-lg cursor-pointer transition-colors ${config.bodyStyle === style.id ? "bg-canvas border-neutral-800 shadow-level-2" : "bg-canvas-soft border-hairline hover:bg-canvas"
                    }`}
                >
                  <div className="text-sm font-semibold text-ink">{style.name}</div>
                  <div className="text-xs text-body mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EYE STYLE */}
        {activeTab === "eyes" && (
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-mute">Finder Pattern Eyes</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: "square", name: "Square Corner", desc: "Hard borders, standard eyeball" },
                { id: "rounded", name: "Rounded Corner", desc: "Soft border frames, rounded eyeball" },
                { id: "circle", name: "Circular Eye", desc: "Ring eyewall and circular eyeball" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => updateConfig("eyeStyle", style.id)}
                  className={`text-left p-4 border rounded-lg cursor-pointer transition-colors ${config.eyeStyle === style.id ? "bg-canvas border-neutral-800 shadow-level-2" : "bg-canvas-soft border-hairline hover:bg-canvas"
                    }`}
                >
                  <div className="text-sm font-semibold text-ink">{style.name}</div>
                  <div className="text-xs text-body mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LOGO */}
        {activeTab === "logo" && (
          <div className="space-y-5">
            {/* Custom Upload */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-mute">Upload Custom Logo</label>
              <div className="border-2 border-dashed border-hairline hover:border-hairline-strong rounded-lg p-6 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <ImageIcon className="h-8 w-8 text-mute mx-auto mb-2" />
                <span className="text-xs text-body block font-medium">Select PNG, JPG, or SVG</span>
                <span className="text-[10px] text-mute block mt-1">Recommended square format</span>
              </div>
            </div>

            {/* Templates */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-mute">Preset Template Icons</label>
              <div className="grid grid-cols-5 gap-2">
                {sampleLogos.map((logo) => (
                  <button
                    key={logo.name}
                    onClick={() => {
                      updateConfig("logoUrl", logo.value);
                      updateConfig("logoSize", logo.value ? 18 : undefined);
                    }}
                    className={`p-2 border rounded-sm text-xs font-semibold cursor-pointer transition-all flex items-center justify-center ${config.logoUrl === logo.value ? "bg-primary text-on-primary border-primary" : "bg-canvas text-body border-hairline hover:text-ink"
                      }`}
                  >
                    {logo.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Size Adjuster */}
            {config.logoUrl && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-mute">
                  <span>Overlay Scale</span>
                  <span>{config.logoSize || 18}%</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={config.logoSize || 18}
                  onChange={(e) => updateConfig("logoSize", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="text-[10px] text-mute block">Over-scaling may affect code readability. Always scan to verify.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
