import React from "react";

export default function ProgressBar({ loading }: { loading: boolean }) {
  return (
    <div className={`fixed top-0 left-0 w-full h-1 z-[9999] transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-full bg-green-500 animate-progress-bar" style={{ width: loading ? '100%' : '0%' }} />
      <style jsx>{`
        @keyframes progress-bar {
          0% { width: 0%; }
          80% { width: 90%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress-bar 1.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
      `}</style>
    </div>
  );
} 