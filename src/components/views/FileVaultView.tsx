import React from 'react';
import {
  FolderOpen,
  FileCode,
  FileText,
  Download,
  ExternalLink,
  HardDrive,
  User,
  Upload,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const FileVaultView: React.FC = () => {
  const { fileVault, showToast } = useProject();

  const handleDownload = (file: { fileName: string }) => {
    showToast(`Downloading asset: ${file.fileName}`, 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Project Asset Vault
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Immutable repository of OpenAPI contracts, architecture diagrams, PRD documentation PDFs, and brand design packages.
          </p>
        </div>

        <button
          onClick={() => showToast('File uploader initialized. Drag & drop schemas or contracts.', 'info')}
          className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)] self-start sm:self-auto"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Project Asset</span>
        </button>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fileVault.map((file) => (
          <div
            key={file.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                    <FileCode className="h-5 w-5 text-[#0070f3]" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#171717]">
                    {file.fileType}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8f8f8f]">
                  {(file.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>

              <h3 className="mt-3 font-sans font-semibold text-base sm:text-lg text-[#171717] truncate">
                {file.fileName}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs font-mono text-[#8f8f8f]">
                <div>Associated: <span className="text-[#171717] font-medium">{file.associatedFeature}</span></div>
                <div>Uploaded By: <span className="text-[#171717] font-medium">{file.uploadedBy}</span> • {file.uploadedAt}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f2f2f2] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#047857] font-medium">SHA-256 Verified</span>
              <button
                onClick={() => handleDownload(file)}
                className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-[#fafafa] px-3 py-1.5 text-xs font-mono text-[#171717] hover:bg-white hover:border-[#171717] transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Asset</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
