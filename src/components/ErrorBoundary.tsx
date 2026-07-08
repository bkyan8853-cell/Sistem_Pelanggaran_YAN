import * as React from "react";
import { ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw, Copy, Check } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public props!: Props;
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false
  };
  public setState!: (
    state: Partial<State> | ((state: State) => Partial<State>),
    callback?: () => void
  ) => void;

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    localStorage.clear(); // Clear storage in case corrupt auth/settings caused the crash
    window.location.reload();
  };

  private handleCopy = () => {
    const errorDetails = `
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
    `.trim();
    
    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-800">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-red-900 leading-tight">Terjadi Kesalahan Aplikasi</h2>
                <p className="text-xs text-red-700/80 font-medium mt-0.5">Runtime client error detected</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Aplikasi SIPPS mendeteksi adanya error pada browser Anda. Coba bersihkan cache data lokal dengan tombol di bawah atau salin detail kesalahan untuk dilaporkan.
              </p>

              {this.state.error && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pesan Kesalahan:</div>
                  <div className="p-3.5 bg-slate-900 text-rose-400 font-mono text-[11px] rounded-xl overflow-x-auto select-all leading-normal whitespace-pre-wrap max-h-40 border border-slate-950">
                    {this.state.error.message}
                  </div>
                </div>
              )}

              {this.state.error?.stack && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detail Stack Trace:</div>
                  <div className="p-3.5 bg-slate-950 text-slate-300 font-mono text-[9px] rounded-xl overflow-auto leading-relaxed max-h-48 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <button
                  onClick={this.handleReset}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset Sesi & Muat Ulang</span>
                </button>
                
                <button
                  onClick={this.handleCopy}
                  className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-200"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500" />
                      <span>Salin Detail Error</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
