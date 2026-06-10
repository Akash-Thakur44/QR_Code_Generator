import React, { useRef } from "react";
import { type QRConfig, generateQRSVG } from "../../lib/qr-logic";
import { Download, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface QRPreviewPanelProps {
  data: string;
  config: QRConfig;
  shortCode?: string;
  isDynamic?: boolean;
}

export const QRPreviewPanel: React.FC<QRPreviewPanelProps> = ({
  data,
  config,
  shortCode,
  isDynamic = false,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  // Generate SVG string
  const svgContent = generateQRSVG(data || "https://realqrcodegenerator.com", config);

  // Download SVG
  const downloadSVG = () => {
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `realqr-${isDynamic ? "dynamic" : "static"}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download PNG (rasterize SVG using virtual canvas)
  const downloadPNG = () => {
    const svgElement = previewRef.current?.querySelector("svg");
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const blobURL = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200; // High resolution
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Handle transparent background
        if (config.backgroundColor === "transparent") {
          ctx.clearRect(0, 0, 1200, 1200);
        } else {
          ctx.fillStyle = config.backgroundColor;
          ctx.fillRect(0, 0, 1200, 1200);
        }

        ctx.drawImage(img, 0, 0, 1200, 1200);

        const pngURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngURL;
        link.download = `realqr-${isDynamic ? "dynamic" : "static"}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(blobURL);
    };
    img.src = blobURL;
  };

  // Basic Contrast check notice
  const isTooSimilar = config.foregroundColor === config.backgroundColor;

  return (
    <div className="space-y-6">
      <Card level={2} rounded="lg" className="flex flex-col items-center justify-center p-8 bg-canvas min-h-[300px]">
        {/* Live SVG container */}
        <div
          ref={previewRef}
          className="w-full max-w-[200px] h-full aspect-square flex items-center justify-center mb-6 shadow-sm border border-hairline p-2 bg-white rounded-md"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {isTooSimilar && (
          <div className="flex items-start gap-2 text-warning bg-warning-soft/40 border border-warning-soft p-3 rounded-md text-xs mb-4 w-full">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>Warning:</strong> Same colors selected. Foreground and background colors must have high contrast to remain scannable.
            </span>
          </div>
        )}

        {isDynamic && shortCode && (
          <div className="text-center w-full bg-canvas-soft border border-hairline py-2 px-3 rounded-sm text-xs mb-6 select-all">
            <span className="font-mono text-mute">Shortened redirection link:</span>
            <div className="font-semibold text-link mt-0.5">
              realqrcodegenerator.com/r/{shortCode}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 w-full">
          <Button variant="secondary" size="md" onClick={downloadSVG} className="flex gap-2 text-xs">
            <Download className="h-3.5 w-3.5" />
            SVG Vector
          </Button>
          <Button variant="primary" size="md" onClick={downloadPNG} className="flex gap-2 text-xs">
            <Download className="h-3.5 w-3.5" />
            PNG Image
          </Button>
        </div>
      </Card>

      <div className="flex items-center gap-2 p-3 bg-canvas-soft border border-hairline rounded-lg text-xs text-body">
        <AlertCircle className="h-4 w-4 text-mute shrink-0" />
        <span>Scan the live preview with your mobile camera to test scannability before downloading or printing.</span>
      </div>
    </div>
  );
};
