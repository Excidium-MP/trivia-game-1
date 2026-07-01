"use client";

import { QRCodeCanvas } from "qrcode.react";

export function QRDisplay({ url, size = 220 }: { url: string; size?: number }) {
  return (
    <div className="inline-block rounded-2xl bg-white p-4">
      <QRCodeCanvas value={url} size={size} includeMargin={false} level="M" />
    </div>
  );
}
