import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import {
  getActiveFirebaseConfig,
  saveCustomFirebaseConfig,
  isFirebaseConfigured,
  FirebaseConfig,
} from '../../services/firebase';
import { firestoreService } from '../../services/firestoreService';
import {
  X,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UploadCloud,
  ExternalLink,
  Save,
  Trash2,
  Server,
  Zap,
} from 'lucide-react';

export const FirebaseConfigModal: React.FC = () => {
  const { isConfigModalOpen, setConfigModalOpen, refreshConfigState } = useAuth();
  const {
    activeWorkspace,
    devTasks,
    prds,
    feedback,
    decisions,
    secondBrainNotes,
    securityFindings,
    qaTestCases,
    bugs,
    contextBlocks,
    showToast,
  } = useProject();

  const [config, setConfig] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  useEffect(() => {
    if (isConfigModalOpen) {
      setConfig(getActiveFirebaseConfig());
      setTestResult(null);
      setSeedResult(null);
    }
  }, [isConfigModalOpen]);

  if (!isConfigModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomFirebaseConfig(config);
    refreshConfigState();
    showToast('Firebase configuration saved successfully!', 'success');
  };

  const handleClear = () => {
    saveCustomFirebaseConfig(null);
    setConfig(getActiveFirebaseConfig());
    refreshConfigState();
    showToast('Custom Firebase configuration cleared', 'info');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await firestoreService.testConnection();
      setTestResult(res);
      if (res.ok) {
        showToast('Firebase connection test passed!', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: e.message || 'Connection failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!isFirebaseConfigured()) {
      showToast('Please configure and save Firebase credentials first', 'error');
      return;
    }

    setSeeding(true);
    setSeedResult(null);

    try {
      const res = await firestoreService.seedWorkspaceData(activeWorkspace.id, {
        workspaceMeta: activeWorkspace,
        devTasks,
        prds,
        feedback,
        decisions,
        notes: secondBrainNotes,
        securityFindings,
        qaTestCases,
        bugs,
        contextBlocks,
      });

      if (res.success) {
        const msg = `Successfully seeded ${res.seededCount} workspace items to Cloud Firestore!`;
        setSeedResult(msg);
        showToast(msg, 'success');
      } else {
        setSeedResult(`Failed: ${res.error}`);
        showToast(`Seeding error: ${res.error}`, 'error');
      }
    } catch (e: any) {
      setSeedResult(`Error: ${e.message}`);
      showToast(`Seeding error: ${e.message}`, 'error');
    } finally {
      setSeeding(false);
    }
  };

  const configured = isFirebaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-[#e5e5e5] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#171717] to-[#262626] text-white p-6 pb-5 shrink-0">
          <button
            onClick={() => setConfigModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e65c00] mb-1.5">
            <Cloud className="w-4 h-4" />
            <span>Cloud Backend & Database Configuration</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight">Firebase Realtime OS Backend</h2>
          <p className="text-xs text-neutral-300 mt-1">
            Connect your Google Firebase project to enable live multi-user real-time sync, Auth, and Firestore persistence.
          </p>

          {/* Status Badge */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                configured
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{configured ? 'Backend Active (Cloud Connected)' : 'Local Mode (Mock / Seed Data)'}</span>
            </div>
            {configured && config.projectId && (
              <span className="text-xs text-neutral-400 font-mono">
                Project: <strong className="text-white">{config.projectId}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick instructions */}
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-neutral-600" />
                How to obtain your Firebase credentials
              </span>
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[#e65c00] hover:underline flex items-center gap-1 font-medium text-[11px]"
              >
                Firebase Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              1. Create a project in the Firebase Console and enable <strong>Authentication</strong> (Google & Email/Password) and <strong>Cloud Firestore</strong> (test mode or production rules).<br />
              2. Go to <strong>Project Settings</strong> → <strong>General</strong> → <strong>Your apps</strong> → Add Web app (`&lt;/&gt;`) and copy the config values below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={config.apiKey || ''}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Project ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={config.projectId || ''}
                  onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                  placeholder="my-signalslab-project"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={config.authDomain || ''}
                  onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                  placeholder="my-project.firebaseapp.com"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">App ID</label>
                <input
                  type="text"
                  value={config.appId || ''}
                  onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                  placeholder="1:123456789:web:abcdef"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Storage Bucket (Optional)</label>
                <input
                  type="text"
                  value={config.storageBucket || ''}
                  onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
                  placeholder="my-project.appspot.com"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Messaging Sender ID</label>
                <input
                  type="text"
                  value={config.messagingSenderId || ''}
                  onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to .env Defaults</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>

          {/* Cloud Operations & Diagnostic Actions */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
            <h3 className="font-bold text-neutral-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              Cloud Operations & Tools
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Test Connection Button */}
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !configured}
                className="p-3 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl font-semibold text-neutral-800 flex items-center gap-2 transition-colors disabled:opacity-50 text-left"
              >
                {testing ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <div>
                  <div className="font-semibold">Test Connection</div>
                  <div className="text-[10px] text-neutral-500 font-normal">Verify Cloud Firestore ping</div>
                </div>
              </button>

              {/* Seed Database Button */}
              <button
                type="button"
                onClick={handleSeedDatabase}
                disabled={seeding || !configured}
                className="p-3 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl font-semibold text-neutral-800 flex items-center gap-2 transition-colors disabled:opacity-50 text-left"
              >
                {seeding ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-600" />
                ) : (
                  <UploadCloud className="w-4 h-4 text-indigo-600" />
                )}
                <div>
                  <div className="font-semibold">Seed Workspace to Cloud</div>
                  <div className="text-[10px] text-neutral-500 font-normal">Upload initial sample data</div>
                </div>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  testResult.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {seedResult && (
              <div className="p-2.5 rounded-xl border bg-indigo-50 border-indigo-200 text-indigo-900 text-xs flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{seedResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 shrink-0">
          <span>Dev Atlas Cloud OS — Persistent Cross-Device Memory</span>
          <button
            type="button"
            onClick={() => setConfigModalOpen(false)}
            className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
