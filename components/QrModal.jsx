"use client";
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2 } from 'lucide-react';

const QrModal = ({ isOpen, onClose, shortUrl, shortCode }) => {
    if (!isOpen) return null;

    const downloadQR = () => {
        const svg = document.getElementById('qr-code-svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${shortCode}-qr.png`;
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                    <h2 className="text-xl font-black tracking-tight">QR IDENTITY.</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <div className="p-12 flex flex-col items-center">
                    <div className="p-6 bg-white border border-zinc-100 rounded-3xl shadow-inner mb-8">
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={shortUrl}
                            size={200}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest text-center mb-12">
                        Target: <span className="text-black">{shortCode}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button
                            onClick={downloadQR}
                            className="flex items-center justify-center gap-2 bg-black text-white font-black py-4 rounded-2xl text-xs hover:bg-zinc-800 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            IMAGE
                        </button>
                        <button
                            onClick={() => navigator.clipboard.writeText(shortUrl)}
                            className="flex items-center justify-center gap-2 border border-zinc-200 text-black font-black py-4 rounded-2xl text-xs hover:bg-zinc-50 transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                            COPY
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrModal;
