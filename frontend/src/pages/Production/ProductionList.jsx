import React, { useEffect, useState, useMemo } from 'react';
import productionService from '../../services/productionService';
import machineService from '../../services/machineService';
import shiftService from '../../services/shiftService';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { Plus, Trash2, Edit, X, Filter, CheckCircle, XCircle } from 'lucide-react';

const ProductionList = () => {
  const [allProductions, setAllProductions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter state
  const [filterMachine, setFilterMachine] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterShift, setFilterShift] = useState('');

  const currentUser = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    jobId: '',
    machineCode: '',
    shiftName: '',
    userEmployeeId: currentUser ? currentUser.employeeId : '',
    okParts: 0,
    ncParts: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodData, machData, shiftData, userData] = await Promise.all([
        productionService.getAllProduction(),
        machineService.getAllMachines().catch(() => []),
        shiftService.getAllShifts().catch(() => []),
        userService.getAllUsers().catch(() => [])
      ]);
      setAllProductions(Array.isArray(prodData) ? prodData : []);
      setMachines(Array.isArray(machData) ? machData : []);
      setShifts(Array.isArray(shiftData) ? shiftData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtered production list
  const filteredProductions = useMemo(() => {
    return allProductions.filter(p => {
      const mCode = p.machineCode || p.MachineName || '';
      const eId = p.userEmployeeId || p.EmployeeId || '';
      const sName = p.shiftName || p.ShiftName || '';
      return (
        (!filterMachine || mCode === filterMachine) &&
        (!filterEmployee || eId === filterEmployee) &&
        (!filterShift || sName === filterShift)
      );
    });
  }, [allProductions, filterMachine, filterEmployee, filterShift]);

  // Live stats from filtered productions
  const liveStats = useMemo(() => {
    return filteredProductions.reduce(
      (acc, p) => ({
        ok: acc.ok + (p.okParts || p.OkParts || 0),
        nc: acc.nc + (p.ncParts || p.NcParts || 0)
      }),
      { ok: 0, nc: 0 }
    );
  }, [filteredProductions]);

  const clearFilters = () => {
    setFilterMachine('');
    setFilterEmployee('');
    setFilterShift('');
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this production entry?')) return;
    try {
      await productionService.deleteProduction(jobId);
      loadData();
    } catch (err) {
      alert('Error deleting production entry');
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({
      jobId: '',
      machineCode: machines.length > 0 ? machines[0].machineCode : '',
      shiftName: shifts.length > 0 ? shifts[0].shiftName : '',
      userEmployeeId: currentUser ? currentUser.employeeId : '',
      okParts: 0,
      ncParts: 0
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setIsEditMode(true);
    setFormData({
      jobId: p.jobId,
      machineCode: p.machineCode,
      shiftName: p.shiftName,
      userEmployeeId: p.userEmployeeId,
      okParts: p.okParts,
      ncParts: p.ncParts
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await productionService.updateProduction(formData);
      } else {
        const payload = { ...formData, entryTime: new Date().toISOString() };
        await productionService.addProductionEntry(payload);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(isEditMode ? 'Error updating entry' : 'Error adding entry');
    }
  };

  const hasFilters = filterMachine || filterEmployee || filterShift;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div>
          <h1>Production Flow</h1>
          <p>Register and track manufacturing quantities</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> New Entry
        </button>
      </div>

      {/* Live Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', border: 'none' }}>
          <div className="stat-icon bg-success-light"><CheckCircle className="text-success" /></div>
          <div className="stat-details">
            <h3 style={{ color: '#065f46' }}>Total OK {hasFilters ? '(Filtered)' : ''}</h3>
            <p className="stat-value" style={{ color: '#065f46', fontSize: '2rem' }}>{liveStats.ok}</p>
          </div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', border: 'none' }}>
          <div className="stat-icon bg-danger-light"><XCircle className="text-danger" /></div>
          <div className="stat-details">
            <h3 style={{ color: '#7f1d1d' }}>Total NC {hasFilters ? '(Filtered)' : ''}</h3>
            <p className="stat-value" style={{ color: '#7f1d1d', fontSize: '2rem' }}>{liveStats.nc}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-primary-light"><Filter className="text-primary" /></div>
          <div className="stat-details">
            <h3>Showing Entries</h3>
            <p className="stat-value" style={{ fontSize: '2rem' }}>{filteredProductions.length} / {allProductions.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} /> Filters:
          </span>

          <select
            className="form-control"
            style={{ width: '180px', display: 'inline-block' }}
            value={filterMachine}
            onChange={e => setFilterMachine(e.target.value)}
          >
            <option value="">All Machines</option>
            {machines.map(m => (
              <option key={m.id} value={m.machineCode}>{m.machineName} ({m.machineCode})</option>
            ))}
          </select>

          <select
            className="form-control"
            style={{ width: '200px', display: 'inline-block' }}
            value={filterEmployee}
            onChange={e => setFilterEmployee(e.target.value)}
          >
            <option value="">All Employees</option>
            {users.map(u => (
              <option key={u.id || u.employeeId} value={u.employeeId}>{u.employeeId}</option>
            ))}
          </select>

          <select
            className="form-control"
            style={{ width: '180px', display: 'inline-block' }}
            value={filterShift}
            onChange={e => setFilterShift(e.target.value)}
          >
            <option value="">All Shifts</option>
            {shifts.map(s => (
              <option key={s.id} value={s.shiftName}>{s.shiftName}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              className="btn btn-secondary"
              onClick={clearFilters}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: 'var(--space-6)' }}>Loading production entries...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Machine</th>
                <th>Shift</th>
                <th>Operator</th>
                <th>OK Parts</th>
                <th>NC Parts</th>
                <th>Efficiency</th>
                <th>Time Rec.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductions.map(p => {
                const total = (p.okParts || 0) + (p.ncParts || 0);
                const eff = total > 0 ? ((p.okParts / total) * 100).toFixed(0) : 0;
                return (
                  <tr key={p.id || p.jobId}>
                    <td><strong>{p.jobId}</strong></td>
                    <td>{p.machineCode || p.MachineName}</td>
                    <td>{p.shiftName || p.ShiftName}</td>
                    <td>{p.userEmployeeId || p.EmployeeId}</td>
                    <td><span className="badge badge-success">{p.okParts || p.OkParts}</span></td>
                    <td><span className="badge badge-danger">{p.ncParts || p.NcParts}</span></td>
                    <td>
                      <span style={{
                        color: eff >= 80 ? '#10b981' : eff >= 50 ? '#f59e0b' : '#ef4444',
                        fontWeight: 700
                      }}>{eff}%</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(p.entryTime || p.EntryTime || new Date()).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-secondary" onClick={() => handleOpenEdit(p)}>
                          <Edit size={16} /> Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(p.jobId)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProductions.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                    {hasFilters ? 'No entries match the selected filters.' : 'No production entries found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '450px', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ margin: 0 }}>{isEditMode ? 'Update Production Parts' : 'Add Entry'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Job ID</label>
                <input type="text" className="form-control" required value={formData.jobId} onChange={e => setFormData({ ...formData, jobId: e.target.value })} disabled={isEditMode} />
              </div>
              <div className="form-group">
                <label className="form-label">Select Machine</label>
                <select className="form-control" value={formData.machineCode} onChange={e => setFormData({ ...formData, machineCode: e.target.value })} required disabled={isEditMode}>
                  <option value="">Select...</option>
                  {machines.map(m => <option key={m.id} value={m.machineCode}>{m.machineName} ({m.machineCode})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Shift</label>
                <select className="form-control" value={formData.shiftName} onChange={e => setFormData({ ...formData, shiftName: e.target.value })} required disabled={isEditMode}>
                  <option value="">Select...</option>
                  {shifts.map(s => <option key={s.id} value={s.shiftName}>{s.shiftName} ({s.startTime} - {s.endTime})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Operator (Employee ID)</label>
                <input type="text" className="form-control" required value={formData.userEmployeeId} onChange={e => setFormData({ ...formData, userEmployeeId: e.target.value })} disabled={isEditMode} />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">OK Parts</label>
                  <input type="number" className="form-control" value={formData.okParts} onChange={e => setFormData({ ...formData, okParts: parseInt(e.target.value) || 0 })} min="0" required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">NC Parts</label>
                  <input type="number" className="form-control" value={formData.ncParts} onChange={e => setFormData({ ...formData, ncParts: parseInt(e.target.value) || 0 })} min="0" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                {isEditMode ? 'Update Quantities' : 'Submit Production Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionList;
