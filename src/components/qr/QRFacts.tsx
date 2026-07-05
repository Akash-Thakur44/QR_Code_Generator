import React from "react";
import { Card } from "../ui/Card";

export type QRType = "url" | "wifi" | "vcard" | "whatsapp" | "email" | "sms" | "phone" | "location" | "text";

interface FactData {
  q1: string;
  a1: React.ReactNode;
  q2: string;
  a2: React.ReactNode;
  tipTitle: string;
  tips: React.ReactNode[];
}

const factsMap: Record<QRType, FactData> = {
  url: {
    q1: "What is a URL QR Code?",
    a1: "A URL QR code is a two-dimensional barcode containing a web address. When scanned by a mobile device camera or lens, the browser automatically opens the linked site, eliminating the need to type complex strings.",
    q2: "How to create a URL QR code?",
    a2: (
      <ol className="space-y-2 list-decimal list-inside leading-relaxed">
        <li>Enter your target website link (e.g. <code>https://example.com</code>).</li>
        <li>Customize the design: choose shapes, eye corners, and colors.</li>
        <li>Upload your custom branding logo in the center panel.</li>
        <li>Scan the live preview with your mobile camera to test.</li>
        <li>Download the final file as SVG or high-resolution PNG.</li>
      </ol>
    ),
    tipTitle: "Best practices for link QR codes",
    tips: [
      <><strong>Ensure High Contrast:</strong> The foreground shape must be significantly darker than the background canvas (a dark theme on a white canvas is best).</>,
      <><strong>Test scan spacing:</strong> Keep a clean "quiet zone" border around the barcode so scanners recognize the patterns easily.</>,
      <><strong>Consider Dynamic Codes:</strong> If you are printing codes on paper or packaging, choose Dynamic mode so you can change the target destination later without reprinting.</>
    ]
  },
  wifi: {
    q1: "How does a WiFi QR code work?",
    a1: "WiFi QR codes encode your network name (SSID), security type (such as WPA or WEP), and password in a standardized text structure: <code>WIFI:S:NetworkName;T:WPA;P:SecretPassword;;</code>. When an iPhone or Android camera scans this matrix, it interprets the security configuration and prompts the user to join the network.",
    q2: "Is it safe to share my Wi-Fi via QR?",
    a2: "Yes! The QR code does not broadcast your credentials over the internet; it simply stores the text locally in the visual pattern. Only users who physically scan the printed card or screen can read the barcode data to connect.",
    tipTitle: "SSID & Password Tips",
    tips: [
      <><strong>Exact spelling matches:</strong> Ensure your network SSID name exactly matches case-sensitivity (e.g. <code>MyWiFi</code> vs <code>mywifi</code>) or the scan connection will fail.</>,
      <><strong>Hidden Networks:</strong> If your router broadcasts a hidden SSID, some mobile devices may require you to select "Hidden Network" manual options, although standard setups join automatically.</>,
      <><strong>Print & Frame:</strong> Download as a clean SVG, print, and place inside your guest rooms or office lounge for a premium user experience.</>
    ]
  },
  vcard: {
    q1: "What is a vCard QR Code?",
    a1: "A vCard QR code stores contact information formatted according to the Virtual Card (vCard) file specification (version 3.0). When scanned by modern smartphones, the camera app displays an option to \"Add to Contacts,\" importing first/last names, telephone numbers, emails, job roles, company lines, and site links instantly.",
    q2: "Why use contact QR codes?",
    a2: "Traditional paper business cards get lost or thrown away in seconds. Placing a vCard QR code on the back of your business cards, flyers, email footers, or presentation slides lets peers save your records directly in their address books.",
    tipTitle: "vCard Styling & Formatting Advice",
    tips: [
      <><strong>Character Limits:</strong> vCards contain substantial text payload which increases the barcode density (making the squares smaller). Keep details concise to ensure quick scanning on older devices.</>,
      <><strong>Clean SVG Downloads:</strong> Download as a clean vector SVG to ensure the small square modules remain razor sharp when printed on paper cards or banners.</>,
      <><strong>Add a Logo:</strong> Place your personal portrait or company brand logo in the quiet center zone to establish immediate trust.</>
    ]
  },
  whatsapp: {
    q1: "How does a WhatsApp QR Code work?",
    a1: "WhatsApp QR codes utilize the official WhatsApp click-to-chat API. The QR code encodes a URL like <code>https://wa.me/phone?text=message</code>. When scanned, the WhatsApp application opens automatically on the user's phone, initiating a chat directly with the specified recipient and filling the input text box.",
    q2: "Why use WhatsApp QR codes?",
    a2: "Ideal for customer support lines, local restaurants receiving orders, event registrations, and direct lead generation campaigns. It allows clients to message you with one tap, removing all friction from communication.",
    tipTitle: "Formatting WhatsApp Numbers",
    tips: [
      <><strong>Include Country Codes:</strong> Enter your full phone number including your country code (e.g. <code>15551234567</code> for US, do not include leading zeroes, plus symbols, or hyphens).</>,
      <><strong>Pre-fill useful prompts:</strong> Set helpful templates for your users (e.g., "Hello, I am interested in booking a table," or "I need assistance with my order").</>,
      <><strong>Branding:</strong> Add the official WhatsApp logo preset from our Logo panel to let scanner users know where the QR code points.</>
    ]
  },
  email: {
    q1: "How does an Email QR Code work?",
    a1: "Email QR codes utilize standard mail headers structured as a <code>mailto:recipient?subject=Title&body=Message</code> URI. When scanned, the smartphone interprets the syntax and opens the default email application (such as Apple Mail, Gmail, or Outlook) with all fields pre-completed.",
    q2: "What are the benefits of email QRs?",
    a2: "Perfect for newsletter subscriptions, feedback forms, customer support inquiries, or RSVP registrations. It removes friction by pre-typing standard responses so clients just tap \"Send.\"",
    tipTitle: "Email Customization Best Practices",
    tips: [
      <><strong>Ensure Address Accuracy:</strong> Triple-check the spelling of the recipient's email address to guarantee messages route successfully.</>,
      <><strong>Payload Size considerations:</strong> Complex body texts increase the barcode size. Keep text simple to maintain fast scan capability.</>,
      <><strong>Branding:</strong> Pick our red mail envelope template icon from the Logo panel to make the QR target clear.</>
    ]
  },
  sms: {
    q1: "What is an SMS QR Code?",
    a1: "An SMS QR code encodes a text message string structured as: <code>SMSTO:PhoneNumber:MessageText</code>. When scanned by a mobile device, the native messaging application opens with the recipient's phone number filled out and the message pre-typed in the draft input box.",
    q2: "Do SMS QR codes require internet?",
    a2: "No! SMS QR codes are fully static and work offline. The information is read directly by the camera and parsed locally on the device, drafting a normal carrier-network SMS without needing active web connectivity.",
    tipTitle: "Key SMS Design Tips",
    tips: [
      <><strong>Verify Carrier Compatibility:</strong> Always input the full recipient number including country code (e.g. <code>+15551234567</code>) so that devices can route the text message correctly.</>,
      <><strong>Character lengths:</strong> Keep messages concise. Standard SMS structures draft up to 160 characters easily, but longer texts increase code complexity.</>,
      <><strong>Mobile Usability:</strong> Excellent for marketing campaigns, feedback collections, and joining automated SMS mailing lists with one scan.</>
    ]
  },
  phone: {
    q1: "What is a Phone QR Code?",
    a1: "A Phone QR code encodes a phone call number formatted as a standard <code>tel:phone</code> link. When scanned, the smartphone displays a button to directly place a call to the specified number without needing to type it.",
    q2: "Where are phone call QR codes used?",
    a2: "Excellent for customer support, service hotlines, emergency contacts, local business cards, or delivery service calls where instant human communication is needed.",
    tipTitle: "Phone Number QR Guidelines",
    tips: [
      <><strong>Use international formats:</strong> Include the country code (e.g., <code>+1</code> or <code>+91</code>) so users can dial your number correctly from any location worldwide.</>,
      <><strong>No letters or extensions:</strong> Ensure you only input numerical digits and a leading <code>+</code>. Extensions or symbols (other than <code>+</code>) are not supported by standard dialers.</>,
      <><strong>Offline Scans:</strong> Phone QR codes are fully static, meaning they do not require an internet connection to parse and trigger the dialer prompt on a smartphone.</>
    ]
  },
  location: {
    q1: "What is a Location QR Code?",
    a1: "A Location QR code encodes latitude and longitude decimal values structured in a standardized format: <code>geo:latitude,longitude</code>. When scanned, the smartphone prompts to launch your default navigation app (Google Maps, Apple Maps, or Waze) pre-centered on the coordinates.",
    q2: "Why use map location codes?",
    a2: "Perfect for printing on wedding invitations, event banners, flyers, and real-estate listings. Scanners get direct driving direction pathways, bypassing the need to type complex street addresses.",
    tipTitle: "Key Location Formatting Tips",
    tips: [
      <><strong>Decimal coordinate format:</strong> Double check your coordinate inputs (e.g. Latitude <code>40.7128</code> and Longitude <code>-74.0060</code> for New York City). Avoid using degrees-minutes-seconds.</>,
      <><strong>Offline Capability:</strong> Geo codes are fully static and work offline, opening mapping software locally using cached GPS signals if cellular connection is weak.</>,
      <><strong>Branding:</strong> Add our custom map pin icon from the Logo panel to make the QR target clear.</>
    ]
  },
  text: {
    q1: "What is a Text QR Code?",
    a1: "A Text QR code is a static code that stores plain, raw text details. When scanned, the smartphone parses the visual code and displays the raw text content inside a reader box or allows copying it to the clipboard.",
    q2: "When should I use plain text QR codes?",
    a2: "Perfect for serial numbers, product documentation, secret codes, offline messages, WiFi passwords in custom formats, or any basic structured data where no web redirects are desired.",
    tipTitle: "Text Payload & Layout Advice",
    tips: [
      <><strong>Keep it concise:</strong> The longer the text message, the denser the QR code layout becomes, which can reduce scanner read speeds on older phone camera lenses.</>,
      <><strong>Unicode Support:</strong> Plain text codes fully support emojis, special characters, and multiple languages, storing them locally in UTF-8 format.</>,
      <><strong>Fully Offline:</strong> Plain text QR codes require absolutely no internet connection. The data is retrieved entirely locally from the visual barcode elements.</>
    ]
  }
};

export const QRFacts: React.FC<{ qrType: QRType }> = ({ qrType }) => {
  const data = factsMap[qrType] || factsMap.url;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">{data.q1}</h2>
          <p className="text-sm text-body leading-relaxed">{data.a1}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">{data.q2}</h2>
          <div className="text-sm text-body leading-relaxed">{data.a2}</div>
        </div>
      </div>

      <Card level={2} rounded="lg" className="bg-canvas p-8 text-left">
        <h3 className="text-lg font-semibold text-ink mb-3">{data.tipTitle}</h3>
        <ul className="text-sm text-body space-y-3 list-disc list-inside leading-relaxed">
          {data.tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
