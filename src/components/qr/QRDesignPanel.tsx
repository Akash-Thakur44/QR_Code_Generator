import React, { useState } from "react";
import { type QRConfig } from "../../lib/qr-logic";
import { Palette, Layers, Eye, Image as ImageIcon } from "lucide-react";
import { CustomColorPicker } from "./CustomColorPicker";

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
    { name: "Link", value: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSdub25lJyBzdHJva2U9JyMwMDcwZjMnIHN0cm9rZS13aWR0aD0nMycgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJz48cGF0aCBkPSdNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MSc+PC9wYXRoPjxwYXRoIGQ9J00xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MSc+PC9wYXRoPjwvc3ZnPg==" },
    { name: "WiFi", value: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSdub25lJyBzdHJva2U9JyMxNzE3MTcnIHN0cm9rZS13aWR0aD0nMycgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJz48cGF0aCBkPSdNNSAxMi41NWExMSAxMSAwIDAgMSAxNC4wOCAwJz48L3BhdGg+PHBhdGggZD0nTTEuNDIgOWExNiAxNiAwIDAgMSAyMS4xNiAwJz48L3BhdGg+PHBhdGggZD0nTTguNTMgMTYuMTFhNiA2IDAgMCAxIDYuOTUgMCc+PC9wYXRoPjxsaW5lIHgxPScxMicgeTE9JzIwJyB4Mj0nMTIuMDEnIHkyPScyMCc+PC9saW5lPjwvc3ZnPg==" },
    { name: "WhatsApp", value: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSdub25lJyBzdHJva2U9JyMyNUQzNjYnIHN0cm9rZS13aWR0aD0nMicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJz48cGF0aCBkPSdNMjEgMTEuNWE4LjM4IDguMzggMCAwIDEtLjkgMy44IDguNSA4LjUgMCAwIDEtNy42IDQuNyA4LjM4IDguMzggMCAwIDEtMy44LS45TDMgMjFsMS45LTUuN2E4LjM4IDguMzggMCAwIDEtLjktMy44IDguNSA4LjUgMCAwIDEgNC43LTcuNiA4LjM4IDguMzggMCAwIDEgMy44LS45aC41YTguNDggOC40OCAwIDAgMSA4IDh2LjV6Jz48L3BhdGg+PC9zdmc+" },
    { name: "Email", value: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSdub25lJyBzdHJva2U9JyNlZTAwMDAnIHN0cm9rZS13aWR0aD0nMi41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnPjxwYXRoIGQ9J000IDRoMTZjMS4xIDAgMiAuOSAyIDJ2MTJjMCAxLjEtLjkgMi0yIDJINGMtMS4xIDAtMi0uOS0yLTJWNmMwLTEuMS45LTIgMi0yeic+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9JzIyLDYgMTIsMTMgMiw2Jz48L3BvbHlsaW5lPjwvc3ZnPg==" },
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
                {config.backgroundColor !== "transparent" ? (
                  <div className="flex-1">
                    <CustomColorPicker
                      color={config.backgroundColor}
                      onChange={(color) => updateConfig("backgroundColor", color)}
                      label="Background Color"
                    />
                  </div>
                ) : (
                  <div className="h-10 px-3 rounded-sm border border-hairline bg-canvas-soft text-mute flex items-center text-xs font-mono select-none flex-1">
                    Transparent Enabled
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => updateConfig("backgroundColor", config.backgroundColor === "transparent" ? "#ffffff" : "transparent")}
                  className={`text-xs px-3.5 py-2.5 rounded-sm border cursor-pointer font-semibold transition-all shrink-0 ${config.backgroundColor === "transparent" ? "bg-primary text-on-primary border-primary" : "bg-canvas text-body border-hairline hover:text-ink"
                    }`}
                >
                  {config.backgroundColor === "transparent" ? "Use Solid Color" : "Set Transparent"}
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
              <CustomColorPicker
                color={config.foregroundColor}
                onChange={(color) => updateConfig("foregroundColor", color)}
                label={config.gradientType === "none" ? "QR Color" : "Gradient Start Color"}
              />
            </div>

            {/* Gradient Extra Details */}
            {config.gradientType !== "none" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-mute">Gradient End Color</label>
                  <CustomColorPicker
                    color={config.gradientColor2}
                    onChange={(color) => updateConfig("gradientColor2", color)}
                    label="Gradient End Color"
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
