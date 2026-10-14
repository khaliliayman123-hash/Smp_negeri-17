import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetSession = () => {
    try {
      localStorage.removeItem('hds_current_user');
    } catch (e) {
      console.warn('Could not clear hds_current_user:', e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle size={32} />
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-slate-800">Terjadi Kendala Memuat Data</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Sistem mendeteksi kendala pada sesi aktif siswa/pengguna saat memuat profil atau database.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                <p className="text-[10px] font-mono text-slate-600 break-all">
                  {this.state.error.message || 'Unknown error'}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw size={14} /> Muat Ulang
              </button>
              <button
                type="button"
                onClick={this.handleResetSession}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <LogOut size={14} /> Keluar / Login Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
