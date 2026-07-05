import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";

interface CustomColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

// Helper: hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace(/^#/, "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  
  // Default to black if invalid hex
  if (!/^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    return { h: 0, s: 0, l: 0 };
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Helper: HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k_val = k(n);
    const color = l - a * Math.max(Math.min(k_val - 3, 9 - k_val, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
  color,
  onChange,
  label = "Select Color",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hsl, setHsl] = useState(() => hexToHsl(color));
  const [hexInput, setHexInput] = useState(color);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync state with prop updates
  useEffect(() => {
    setHsl(hexToHsl(color));
    setHexInput(color);
  }, [color]);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const presetSolids = [
    "#171717", // Ink / Dark
    "#0070f3", // Blue
    "#7928ca", // Violet
    "#ee0000", // Red
    "#f5a623", // Orange
    "#10b981", // Green
    "#00dfd8", // Cyan
    "#ff0080", // Pink
    "#f59e0b", // Amber
  ];

  const presetSofts = [
    "#ffffff", // White
    "#f5f5f5", // Light Gray
    "#888888", // Mute Gray
    "#d3e5ff", // Blue Soft
    "#d8ccf1", // Violet Soft
    "#f7d4d6", // Red Soft
    "#ffefcf", // Orange Soft
    "#d1fae5", // Green Soft
    "#e0f2fe", // Cyan Soft
  ];

  const handleHslChange = (h: number, s: number, l: number) => {
    const newHex = hslToHex(h, s, l);
    setHsl({ h, s, l });
    setHexInput(newHex);
    onChange(newHex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val) || /^#[0-9a-fA-F]{3}$/.test(val)) {
      onChange(val);
      setHsl(hexToHsl(val));
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger swatched button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 h-10 px-3 rounded-sm border border-hairline bg-canvas hover:bg-canvas-soft hover:border-hairline-strong transition-all cursor-pointer text-left outline-none text-sm text-ink"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-5 w-5 rounded-sm border border-hairline shadow-sm shrink-0"
            style={{
              backgroundColor: color === "transparent" ? "#ffffff" : color,
              backgroundImage: color === "transparent" ? "linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%), linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%)" : undefined,
              backgroundSize: color === "transparent" ? "8px 8px" : undefined,
              backgroundPosition: color === "transparent" ? "0 0, 4px 4px" : undefined,
            }}
          />
          <span className="font-mono text-xs uppercase text-body">{color}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-mute transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Color Picker */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-72 bg-canvas border border-hairline rounded-lg shadow-level-4 p-4 space-y-4 outline-none animate-in fade-in slide-in-from-top-1 duration-100">
          {/* Header Label */}
          {label && (
            <div className="text-[10px] font-mono uppercase tracking-wider text-mute border-b border-hairline pb-1.5 flex items-center justify-between">
              <span>{label}</span>
              <button
                type="button"
                onClick={() => {
                  onChange("#171717");
                  setHsl(hexToHsl("#171717"));
                  setHexInput("#171717");
                }}
                className="hover:text-ink cursor-pointer"
                title="Reset to default"
              >
                <RefreshCw className="h-2.5 w-2.5" />
              </button>
            </div>
          )}

          {/* Curated Swatches Grid */}
          <div className="space-y-2">
            <div className="text-[9px] font-mono uppercase tracking-wider text-mute">Presets</div>
            <div className="grid grid-cols-9 gap-1.5">
              {presetSolids.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange(preset);
                    setHsl(hexToHsl(preset));
                    setHexInput(preset);
                  }}
                  className={`h-5 w-5 rounded-sm border cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                    color.toLowerCase() === preset.toLowerCase() ? "border-ink scale-105 ring-1 ring-ink/20" : "border-hairline"
                  }`}
                  style={{ backgroundColor: preset }}
                  title={preset}
                />
              ))}
              {presetSofts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange(preset);
                    setHsl(hexToHsl(preset));
                    setHexInput(preset);
                  }}
                  className={`h-5 w-5 rounded-sm border cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                    color.toLowerCase() === preset.toLowerCase() ? "border-ink scale-105 ring-1 ring-ink/20" : "border-hairline"
                  }`}
                  style={{ backgroundColor: preset }}
                  title={preset}
                />
              ))}
            </div>
          </div>

          {/* HSL Sliders */}
          <div className="space-y-3 pt-2 border-t border-hairline">
            <div className="text-[9px] font-mono uppercase tracking-wider text-mute">Adjust Color</div>
            
            {/* Hue Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-body">
                <span>Hue</span>
                <span>{hsl.h}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => handleHslChange(parseInt(e.target.value), hsl.s, hsl.l)}
                className="w-full h-2 rounded-lg cursor-pointer appearance-none"
                style={{
                  background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
              />
            </div>

            {/* Saturation Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-body">
                <span>Saturation</span>
                <span>{hsl.s}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => handleHslChange(hsl.h, parseInt(e.target.value), hsl.l)}
                className="w-full h-2 rounded-lg cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, hsl(${hsl.h}, 0%, 50%), hsl(${hsl.h}, 100%, 50%))`,
                }}
              />
            </div>

            {/* Lightness Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-body">
                <span>Lightness</span>
                <span>{hsl.l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => handleHslChange(hsl.h, hsl.s, parseInt(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, #000000, hsl(${hsl.h}, ${hsl.s}%, 50%), #ffffff)`,
                }}
              />
            </div>
          </div>

          {/* Hex Input field */}
          <div className="flex items-center gap-2 pt-2 border-t border-hairline">
            <span className="text-[10px] font-mono uppercase text-mute shrink-0">HEX</span>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              placeholder="#FFFFFF"
              className="w-full h-7 text-xs px-2 rounded-sm border border-hairline bg-canvas font-mono outline-none focus:border-hairline-strong text-ink"
            />
          </div>
        </div>
      )}
    </div>
  );
};
