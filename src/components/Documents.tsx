import React, { useState } from 'react';
import { FarmDocument, Farm, DocType } from '../types';
import { FileText, Plus, Trash2, Calendar, Download, Eye, ExternalLink, HelpCircle } from 'lucide-react';

interface DocumentsProps {
  currentFarm: Farm;
  documents: FarmDocument[];
  onAddDocument: (doc: Omit<FarmDocument, 'id'>) => void;
  onDeleteDocument: (id: string) => void;
}

export const Documents: React.FC<DocumentsProps> = ({
  currentFarm,
  documents,
  onAddDocument,
  onDeleteDocument
}) => {
  const farmDocs = documents.filter(d => d.farmId === currentFarm.id);

  // States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<DocType>('Girdawari');
  const [newDesc, setNewDesc] = useState('');

  // Form submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    onAddDocument({
      farmId: currentFarm.id,
      title: newTitle,
      type: newType,
      uploadDate: new Date().toISOString().split('T')[0],
      description: newDesc
    });
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-documents" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Farm Documents Vault</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Store and access official agriculture records: Girdawari inspections, PMFBY insurance slips, and KCC loan summaries.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document (Simulate)</span>
        </button>
      </div>

      {/* Upload Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Upload New Document Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Document Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. SBI KCC Renewal Paper 2026"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Document Type *</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as DocType)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Girdawari">Girdawari (Official Inspection Sheet)</option>
                <option value="KCC">KCC (Kisan Credit Card Receipt)</option>
                <option value="PMFBY Insurance">PMFBY (Pradhan Mantri Insurance)</option>
                <option value="MFMB">MFMB Scheme Papers (Mera Fasal Mera Byora)</option>
                <option value="Land Records">Land Registry (Fard / Jamabandi)</option>
                <option value="Other">Other Certificate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Description / Memo Notes</label>
            <input
              type="text"
              placeholder="Provide key details e.g., verified on 3rd Baisakh, patwari Sh. Ram..."
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Save Document
            </button>
          </div>
        </form>
      )}

      {/* Docs layout list layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-emerald-200 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {doc.type}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{doc.uploadDate}</span>
              </div>
              <h3 className="font-extrabold text-slate-800 leading-tight mb-2 flex items-center space-x-1.5">
                <FileText className="w-5 h-5 text-slate-500" />
                <span>{doc.title}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed italic">{doc.description || 'No memo notes added.'}</p>
            </div>

            <div className="flex items-center space-x-2 border-t border-slate-50 pt-4 mt-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => alert(`Simulating document preview: "${doc.title}" was issued officially. Secure Cloud copy hash exists.`)}
                className="flex-1 flex items-center justify-center space-x-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 rounded-lg transition"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View File</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Download simulated! Document file data exported to internal memory cache.')}
                className="bg-slate-50 hover:bg-slate-105 border border-slate-200 text-slate-700 p-1.5 rounded-lg transition"
                title="Download Document"
              >
                <Download className="w-4 h-4 text-slate-500" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this document from vault?')) {
                    onDeleteDocument(doc.id);
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 p-1.5 rounded-lg transition"
                title="Delete Document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {farmDocs.length === 0 && (
          <div className="col-span-full border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-2">
            <FileText className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No documents saved for this farm.</p>
            <p className="text-xs">Click "Upload Document" to manage land files, KCC receipts or PMFBY bills.</p>
          </div>
        )}
      </div>

      {/* Official Government Schemes Help Block */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
        <h3 className="font-extrabold text-slate-800 text-xs flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Farmers' Document Schemes Guide</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-normal font-medium text-slate-600">
          <div className="space-y-1">
            <p><strong className="text-slate-800">1. Girdawari (Official Crop Inspection):</strong> Issued by the Patwari twice a year (Kharif and Rabi). Essential to prove sowing for PMFBY claims or bank limits.</p>
            <p><strong className="text-slate-800">2. Mera Fasal Mera Byora (MFMB):</strong> Mandatory portal registration in Haryana to sell crop at MSP directly in mandi. Check eligibility matches!</p>
          </div>
          <div className="space-y-1">
            <p><strong className="text-slate-800">3. PMFBY (Pradhan Mantri Insurance):</strong> Covers yields loss against weather, hail storm or droughts. Premium receipt should be uploaded before sowing limit ends.</p>
            <p><strong className="text-slate-800">4. KCC (Kisan Credit Card Loan):</strong> Renewal required annually to ensure interest subvention (subsidy). Keep passbook up to date.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
