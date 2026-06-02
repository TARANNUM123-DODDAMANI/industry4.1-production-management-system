import React, { useEffect, useState } from 'react';
import productionService from '../../services/productionService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line } from 'recharts';
import { Activity, Wrench, CheckCircle, XCircle, X } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ ok: 0, nc: 0 });
  const [machineData, setMachineData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drilldown Modal State
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineOperators, setMachineOperators] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [okRes, ncRes, mSummary, rSummary, sSummary] = await Promise.all([
        productionService.getTotalOkCount(),
        productionService.getTotalNcCount(),
        productionService.getMachineSummary().catch(() => []),
        productionService.getRoleSummary().catch(() => []),
        productionService.getShiftSummary().catch(() => [])
      ]);
      
      setStats({ ok: okRes || 0, nc: ncRes || 0 });

      // Build out dynamic charts
      setMachineData(mSummary.length > 0 ? mSummary.map(m => ({
        name: m.machine || m.Machine || 'Unknown', 
        ok: m.totalOkParts || m.TotalOkParts || 0, 
        nc: m.totalNcParts || m.TotalNcParts || 0 
      })) : []);

      setRoleData(rSummary.length > 0 ? rSummary.map(r => ({
        name: r.role || r.Role || 'Role',
        ok: r.totalOkParts || r.TotalOkParts || 0,
        nc: r.totalNcParts || r.TotalNcParts || 0,
        total: r.totalProduction || r.TotalProduction || 0
      })) : []);

      setShiftData(sSummary.length > 0 ? sSummary.map(s => ({
        name: s.shift || s.Shift || 'Shift',
        ok: s.totalOkParts || s.TotalOkParts || 0,
        nc: s.totalNcParts || s.TotalNcParts || 0
      })) : []);

    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const openMachineDetails = async (machineItem) => {
    if (!machineItem || !machineItem.activePayload) return;
    const mName = machineItem.activePayload[0].payload.name;
    
    // Set UI placeholders quickly to render modal instantly
    setSelectedMachine({ machineCode: mName, ok: '...', nc: '...' });
    setShowMachineModal(true);
    setMachineOperators([]);

    try {
      // Trigger API endpoints
      const drillData = await productionService.getMachineSummary(); // Alternative is relying on stats if machine-specific doesn't exist
      const activeObj = drillData.find(m => m.machine === mName || m.Machine === mName);
      setSelectedMachine({ 
        machineCode: mName, 
        ok: activeObj?.totalOkParts || activeObj?.TotalOkParts || 0, 
        nc: activeObj?.totalNcParts || activeObj?.TotalNcParts || 0 
      });

      const operators = await productionService.getMachineUsers(mName);
      setMachineOperators(operators);
    } catch(e) {
      console.error(e);
    }
  };

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];
  const pieData = [
    { name: 'OK Parts', value: stats.ok },
    { name: 'NC Parts', value: stats.nc }
  ];

  if (loading) return <div style={{padding: 'var(--space-6)'}}>Loading dashboard...</div>;

  return (
    <div className="dashboard page-container">
      <div className="page-header" style={{marginBottom: '0'}}>
        <h1>Operations Dashboard</h1>
        <p>Interactive Production analytics (Click on a Machine bar for Live Details)</p>
      </div>

      <div className="stats-grid" style={{marginTop: 'var(--space-6)'}}>
        <div className="stat-card">
          <div className="stat-icon bg-success-light">
            <CheckCircle className="text-success" />
          </div>
          <div className="stat-details">
            <h3>Total OK</h3>
            <p className="stat-value">{stats.ok}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-danger-light">
            <XCircle className="text-danger" />
          </div>
          <div className="stat-details">
            <h3>Total NC</h3>
            <p className="stat-value">{stats.nc}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-primary-light">
            <Wrench className="text-primary" />
          </div>
          <div className="stat-details">
            <h3>Active Machines</h3>
            <p className="stat-value">{machineData.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-warning-light">
            <Activity className="text-warning" />
          </div>
          <div className="stat-details">
            <h3>Total Efficiency</h3>
            <p className="stat-value">
              {stats.ok + stats.nc > 0 
                ? ((stats.ok / (stats.ok + stats.nc)) * 100).toFixed(1) + '%' 
                : '0%'}
            </p>
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{marginTop: 'var(--space-4)'}}>
        
        {/* CLICKABLE MACHINE BAR CHART */}
        <div className="card chart-container" style={{gridColumn: '1 / -1'}}>
          <h3>Production per Machine <span style={{fontSize:'0.8rem', fontWeight:'normal', color:'var(--text-muted)'}}>(Interactive Drilldown)</span></h3>
          <div style={{ height: 350, width: '100%', cursor: 'pointer' }}>
            {machineData.length === 0 ? <p>No Machine Data</p> : (
              <ResponsiveContainer>
                <BarChart data={machineData} onClick={openMachineDetails}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'var(--bg-main)'}} />
                  <Legend />
                  <Bar dataKey="ok" name="OK Parts" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="nc" name="NC Parts" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* SHIFT COMPOSED CHART */}
        <div className="card chart-container">
          <h3>Shift Cycles</h3>
          <div style={{ height: 300, width: '100%' }}>
            {shiftData.length === 0 ? <p>No Shift Data</p> : (
            <ResponsiveContainer>
              <ComposedChart data={shiftData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ok" name="OK Output" fill="#3b82f6" />
                <Line type="monotone" dataKey="nc" name="NC Errors" stroke="#ef4444" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ROLE PERFORMANCE PIE */}
        <div className="card chart-container">
          <h3>Quality Ratio</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* DRILL DOWN MODAL */}
      {showMachineModal && (
        <div className="modal-overlay" style={{ position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div className="modal-content card" style={{ width: '450px', margin:0, animation: 'slideIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{margin:0, color: 'var(--primary)'}}>{selectedMachine?.machineCode} Details</h2>
              <button style={{background:'none', border:'none', cursor:'pointer'}} onClick={() => setShowMachineModal(false)}><X size={24}/></button>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)'}}>
              <div style={{flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', textAlign: 'center'}}>
                <h4 style={{margin: 0, color: 'var(--text-muted)'}}>OK Produced</h4>
                <p style={{margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#10b981'}}>{selectedMachine?.ok}</p>
              </div>
              <div style={{flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', textAlign: 'center'}}>
                <h4 style={{margin: 0, color: 'var(--text-muted)'}}>NC Errors</h4>
                <p style={{margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#ef4444'}}>{selectedMachine?.nc}</p>
              </div>
            </div>

            <div>
              <h4 style={{borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Operators Attached via Log</h4>
              {machineOperators.length === 0 ? (
                <p style={{color: 'var(--text-muted)'}}>No specific operators isolated for this machine yet.</p>
              ) : (
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                  {machineOperators.map((op, idx) => (
                    <li key={idx} style={{padding: '0.8rem', backgroundColor: 'var(--bg-main)', marginBottom: '0.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                       <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                         {idx + 1}
                       </div>
                       <strong>{op.operatorID || op.OperatorID || op.operatorEID || op.OperatorEID || 'Unknown User'}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
