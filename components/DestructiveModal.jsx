"use client";
import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DestructiveModal({ isOpen, onClose, onConfirm, title, description, confirmText = "Delete", loading = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="w-8 h-8 text-rose-500" />
                    </div>

                    <h3 className="text-xl font-black text-rose-500 uppercase tracking-tight mb-2">
                        {title}
                    </h3>

                    <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed">
                        {description}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
