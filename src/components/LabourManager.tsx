import React, { useState } from 'react';
import { Labour, Farm, AttendanceRecord } from '../types';
import { Plus, Trash2, Edit2, CheckCircle2, XCircle, DollarSign, Calendar, Phone, Award } from 'lucide-react';

interface LabourManagerProps {
  currentFarm: Farm;
  labourTeam: Labour[];
  onAddLabour: (labour: Omit<Labour, 'id'>) => void;
  onUpdateLabour: (labour: Labour) => void;
  onDeleteLabour: (id: string) => void;
}

export const LabourManager: React.FC<LabourManagerProps> = ({
  currentFarm,
  labourTeam,
  onAddLabour,
  onUpdateLabour,
  onDeleteLabour
}) => {
  const farmLabour = labourTeam.filter(l => l.farmId === currentFarm.id);

  // States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLabour, setEditingLabour] = useState<Labour | null>(null);

  // Add inputs
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWage, setNewWage] = useState<number>(400);
  const [newAdvance, setNewAdvance] = useState<number>(0);

  // Attendance logging helper states
  const [selectedLabour, setSelectedLabour] = useState<Labour | null>(null);
  const [attDate, setAttDate] = useState('2026-06-09');
  const [attStatus, setAttStatus] = useState<'Present' | 'Absent' | 'Half Day'>('Present');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    onAddLabour({
      farmId: currentFarm.id,
      name: newName,
      phone: newPhone,
      dailyWage: newWage,
      advancePaid: newAdvance,
      attendance: []
    });
    setNewName('');
    setNewPhone('');
    setNewWage(400);
    setNewAdvance(0);
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabour) return;
    onUpdateLabour(editingLabour);
    setEditingLabour(null);
  };

  const handleLogAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabour) return;

    // Wage calculation factor
    let wageEarned = selectedLabour.dailyWage;
    if (attStatus === 'Absent') wageEarned = 0;
    else if (attStatus === 'Half Day') wageEarned = selectedLabour.dailyWage / 2;

    const newRecord: AttendanceRecord = {
      date: attDate,
      status: attStatus,
      wageEarned
    };

    // Remove old for same date if and when re-entering
    const filteredAttendance = selectedLabour.attendance.filter(r => r.date !== attDate);

    const updatedLabour: Labour = {
      ...selectedLabour,
      attendance: [newRecord, ...filteredAttendance]
    };

    onUpdateLabour(updatedLabour);
    setSelectedLabour(updatedLabour); // refresh active view
    alert(`Attendance saved: Sh. ${selectedLabour.name} was marked "${attStatus}" on ${attDate} (Earnings: ₹${wageEarned})`);
  };

  // Math totals for summary card
  const totalAdvanceAcrossLabour = farmLabour.reduce((sum, l) => sum + l.advancePaid, 0);
  const totalWagesEarned = farmLabour.reduce((sum, l) => {
    return sum + l.attendance.reduce((s, a) => s + a.wageEarned, 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-labour" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-pulse" />
            <span>Majuuri & Labour Registry</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain daily attendance timesheets, track advance cash, and auto-calculate labor budget wages for <span className="text-emerald-700 font-bold">{currentFarm.name}</span>.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Hire / Add Worker</span>
        </button>
      </div>

      {/* Numerical summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 text-slate-100 rounded-3xl p-5 shadow-lg border-2 border-slate-800">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Registered</span>
          <p className="text-2xl font-black">{farmLabour.length} workers</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Wages Accrued</span>
          <p className="text-2xl font-black text-emerald-400">₹{totalWagesEarned.toLocaleString()}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Advance Paid out</span>
          <p className="text-2xl font-black text-amber-400">₹{totalAdvanceAcrossLabour.toLocaleString()}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Net Due Out</span>
          <p className="text-2xl font-black text-rose-400">₹{Math.max(0, totalWagesEarned - totalAdvanceAcrossLabour).toLocaleString()}</p>
        </div>
      </div>

      {/* Add Worker Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Add Worker Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Worker Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ram Singh"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Mobile No.</label>
              <input
                type="text"
                placeholder="e.g. 98124-xxxxx"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Daily Wage Rate (₹/day) *</label>
              <input
                type="number"
                required
                min="10"
                value={newWage}
                onChange={e => setNewWage(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Advance Cash Paid upfront (₹)</label>
              <input
                type="number"
                min="0"
                value={newAdvance}
                onChange={e => setNewAdvance(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
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
              Save Worker Profile
            </button>
          </div>
        </form>
      )}

      {/* Edit Worker Profile */}
      {editingLabour && (
        <form onSubmit={handleEditSubmit} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-amber-800 text-sm">Edit Worker Profile: {editingLabour.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Daily Wage (₹)</label>
              <input
                type="number"
                required
                min="50"
                value={editingLabour.dailyWage}
                onChange={e => setEditingLabour({ ...editingLabour, dailyWage: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Advance Balance (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={editingLabour.advancePaid}
                onChange={e => setEditingLabour({ ...editingLabour, advancePaid: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Phone</label>
              <input
                type="text"
                required
                value={editingLabour.phone}
                onChange={e => setEditingLabour({ ...editingLabour, phone: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingLabour(null)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Update Profile
            </button>
          </div>
        </form>
      )}

      {/* Main split: Team table, Attendance logger and balance calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Workers directory list */}
        <div className="lg:col-span-2 bg-white border border-slate-100 shadow-xs rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Workers Timesheet & Balance Directory</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-extrabold pb-2 uppercase tracking-wide">
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Phone</th>
                  <th className="py-2.5">Wage Daily Rate</th>
                  <th className="py-2.5">Advance Hold</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {farmLabour.map((l) => {
                  const workerEarnings = l.attendance.reduce((s, a) => s + a.wageEarned, 0);
                  return (
                    <tr key={l.id} className="hover:bg-slate-50 transition-all">
                      <td className="py-3">
                        <span className="font-extrabold text-slate-950 block">{l.name}</span>
                        <span className="text-[10px] text-emerald-700 font-bold">Total earnings: ₹{workerEarnings}</span>
                      </td>
                      <td className="py-3 text-slate-500 font-mono flex items-center space-x-1 mt-1.5"><Phone className="w-3 h-3 text-slate-400" /> <span>{l.phone || '--'}</span></td>
                      <td className="py-3 font-bold text-slate-800">₹{l.dailyWage}/day</td>
                      <td className="py-3 font-extrabold text-amber-700">₹{l.advancePaid.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <div className="inline-flex space-x-1">
                          <button
                            type="button"
                            onClick={() => setSelectedLabour(l)}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-2 py-1 rounded transition text-[10px] font-bold uppercase tracking-wider"
                          >
                            Mark Attendance
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingLabour(l)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 p-1 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this labour worker registration?')) {
                                onDeleteLabour(l.id);
                                if (selectedLabour?.id === l.id) {
                                  setSelectedLabour(null);
                                }
                              }
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1 rounded border border-rose-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {farmLabour.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      No labour workers are added. Hire first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Marker right panel */}
        <div className="space-y-4">
          {selectedLabour ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 leading-tight">Mark log: {selectedLabour.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Wage computation register register</p>
              </div>

              {/* Logger form */}
              <form onSubmit={handleLogAttendance} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Log Attendance row</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-1">Select Attendance Date</label>
                    <input
                      type="date"
                      required
                      value={attDate}
                      onChange={e => setAttDate(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-1">Work Status</label>
                    <select
                      value={attStatus}
                      onChange={e => setAttStatus(e.target.value as any)}
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                    >
                      <option value="Present">Present (Full Day Wage - ₹{selectedLabour.dailyWage})</option>
                      <option value="Half Day">Half Day (Half Wage - ₹{selectedLabour.dailyWage / 2})</option>
                      <option value="Absent">Absent (Zero Wage due)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded transition"
                >
                  Confirm Daily Present Log
                </button>
              </form>

              {/* Logs visual list summary */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">History logs</span>
                <div className="max-h-[150px] overflow-y-auto space-y-1.5 pr-1">
                  {selectedLabour.attendance.map((rec, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-semibold p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-800">{rec.date}</span>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${rec.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : rec.status === 'Half Day' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                          {rec.status}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-extrabold mt-0.5">₹{rec.wageEarned} earned</span>
                      </div>
                    </div>
                  ))}

                  {selectedLabour.attendance.length === 0 && (
                    <p className="text-center text-[11px] text-slate-400 py-6">No roster marked yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 space-y-2 py-12">
              <Calendar className="w-8 h-8 mx-auto text-slate-300" />
              <h4 className="text-xs font-bold text-slate-700">Roster register</h4>
              <p className="text-[11px] leading-tight">Click "Mark Attendance" on any worker row to create/edit attendance records and track daily salaries dynamically.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
