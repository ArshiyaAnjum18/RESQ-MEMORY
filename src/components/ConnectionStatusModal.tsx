import React from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Server, 
  ExternalLink 
} from 'lucide-react';
import { HindsightHealthResult, HindsightConnectionState } from '../types/rescue.ts';

interface ConnectionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HindsightHealthResult | null;
  onTestConnection: () => Promise<void>;
  isTesting: boolean;
}

export const ConnectionStatusModal: React.FC<ConnectionStatusModalProps> = ({
  isOpen,
  onClose,
  health,
  onTestConnection,
  isTesting,
}) => {
  if (!isOpen) return null;

  const state: HindsightConnectionState = health?.state || 'NOT CONFIGURED';
  const isConnected = health?.connected && state === 'CONNECTED';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isConnected 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-tactical uppercase tracking-wider">
                Hindsight Cloud Diagnostics
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Authenticated Persistent Memory Bank Test
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout Banner */}
        <div className={`p-4 rounded-xl border space-y-1.5 ${
          isConnected
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : state === 'AUTH ERROR' || state === 'BANK NOT FOUND' || state === 'CONNECTION ERROR'
            ? 'bg-red-950/40 border-red-500/50 text-red-200'
            : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono font-bold text-sm">
              {isConnected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : state === 'NOT CONFIGURED' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span>STATUS: HINDSIGHT: {state}</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              isConnected ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
            }`}>
              {isConnected ? 'AUTHENTICATED' : 'ACTION REQUIRED'}
            </span>
          </div>

          <p className="text-xs font-sans text-neutral-300 leading-relaxed pt-1">
            {isConnected
              ? 'Successfully authenticated with Hindsight Cloud. Real persistent memories are actively retained, recalled, and reflected across missions.'
              : state === 'NOT CONFIGURED'
              ? 'HINDSIGHT_API_KEY is not configured. Running in transparent demo fallback mode.'
              : `Connection issue: ${health?.lastError || 'Unable to complete authenticated handshake.'}`}
          </p>
        </div>

        {/* Diagnostics Specs Matrix */}
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
              <span className="text-neutral-500">BANK IDENTIFIER:</span>
              <strong className="text-white font-mono">{health?.bankId || 'resq-mem-disaster-response-v1'}</strong>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
              <span className="text-neutral-500">API ENDPOINT:</span>
              <span className="text-neutral-300 text-[11px] truncate max-w-[280px]" title={health?.endpoint}>
                {health?.endpoint || 'https://api.hindsight.vectorize.io/v1/...'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
              <span className="text-neutral-500">TOTAL STORED MEMORIES:</span>
              <strong className="text-amber-400 font-bold">{health?.totalMemories ?? 0} missions</strong>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
              <span className="text-neutral-500">LAST SUCCESSFUL OPERATION:</span>
              <span className="text-emerald-400 text-[11px] text-right truncate max-w-[260px]">
                {health?.lastSuccessfulOperation || 'Initial handshake pending'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500">LAST CHECK TIMESTAMP:</span>
              <span className="text-neutral-400 text-[11px]">
                {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
          </div>

          {/* Error Message Section if failed */}
          {health?.lastError && !isConnected && (
            <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl space-y-1">
              <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                ERROR DIAGNOSTIC MESSAGE:
              </div>
              <div className="text-xs text-red-200 font-sans leading-relaxed">
                {health.lastError}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <button
            onClick={onTestConnection}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'TESTING AUTHENTICATION...' : 'TEST HINDSIGHT CONNECTION'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
