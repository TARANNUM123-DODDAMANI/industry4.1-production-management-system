import React, { useState, useEffect } from 'react';
import productionService from '../../services/productionService';
import machineService from '../../services/machineService';
import { Search, Trophy, CalendarDays, Activity } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [operatorRanking, setOperatorRanking] = useState([]);
  const [topMachine, setTopMachine] = useState(null);
  const [dailyReport, setDailyReport] = useState([]);
  const [machineDateProd, setMachineDateProd] = useState(null);
  const [cycleData, setCycleData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState([]);

  // Form State for Queries
  const [dateSearch, setDateSearch] = useState(new Date().toISOString().split('T')[0]);
  const [mdSearch, setMdSearch] = useState({ machineCode: '', from: '', to: '' });
  const [cycleSearch, setCycleSearch] = useState({ machineCode: '', employeeId: '', from: '', to: '' });

  useEffect(() => {
    loadMachineDropdown();
    loadStaticWidgets();
  }, []);

  const loadMachineDropdown = async () => {
    try {
      const ms = await machineService.getAllMachines();
      setMachines(ms);
      if (ms.length > 0) setMdSearch(prev => ({ ...prev, machineCode: ms[0].machineCode }));
    } catch(err) {}
  };

  const loadStaticWidgets = async () => {
    try {
       // The backend `operator-ranking` returns a single object (Top Operator). 
       // We use `operator-performance` to get the full list of operators for the ranking board.
       const opList = await productionService.getOperatorPerformance();
       const top = await productionService.getTopMachine();
       
       // Sort the performance list manually to create a ranking board
       const sortedRanks = Array.isArray(opList) 
          ? opList.sort((a, b) => (b.totalOKParts || b.TotalOKParts || 0) - (a.totalOKParts || a.TotalOKParts || 0))
          : [];
       setOperatorRanking(sortedRanks);
       
       // Ensure topMachine is an object or null, not an array
       setTopMachine(Array.isArray(top) ? top[0] : top);
    } catch(e) {
      console.error(e);
    }
  };

  const handleDailyQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rep = await productionService.getDailyReport(dateSearch);
      setDailyReport(Array.isArray(rep) ? rep : []);
    } catch (e) {
      console.error('Daily report fail', e);
      setDailyReport([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMachineDateQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const stats = await productionService.getStatsByMachineAndDate(mdSearch.machineCode, mdSearch.from, mdSearch.to);
      setMachineDateProd(stats);
    } catch (e) {
      console.error('Machine date query fail', e);
      setMachineDateProd(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCycleQuery = async (e) => {
    e.preventDefault();
    try {
      const stats = await productionService.getStatsByMachineUserCycle(cycleSearch);
      setCycleData(stats);
    } catch(e) {
      setCycleData(null);
    }
  };

  return (
    <div className="reports-container page-container">
      <div className="page-header">
        <h1>Advanced Analytics & Reports</h1>
        <p>Deep-dive into operator performance, machine cycles, and chronological statistics</p>
      </div>

      <div className="reports-grid">
        {/* ROW 1: Static Overviews */}
        <div className="card report-card">
          <div className="report-header">
            <Trophy className="text-warning" size={24} />
            <h3>Operator Rankings</h3>
          </div>
          {operatorRanking.length === 0 ? <p>No rankings available.</p> : (
            <ul className="ranking-list">
              {operatorRanking.map((op, idx) => (
                <li key={idx} className="ranking-item">
                  <span className="rank-badge">#{idx + 1}</span>
                  <strong>{op.employeeId || op.EmployeeId || 'Unknown'}</strong>
                  <span className="badge badge-success" style={{marginLeft:'auto'}}>{op.totalOKParts || op.TotalOKParts || 0} OK</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card report-card">
          <div className="report-header">
            <Activity className="text-primary" size={24} />
            <h3>Top Performing Machine</h3>
          </div>
          {!topMachine ? <p>No data recorded yet.</p> : (
            <div className="top-machine-widget">
              <h1 className="machine-big">{topMachine.machineCode || topMachine.MachineCode || 'N/A'}</h1>
              <p>Top Producer in Factory</p>
              <div className="tm-stats">
                <div><span className="text-success">{topMachine.totalOkParts || topMachine.TotalOkParts || 0}</span> OK Parts</div>
                <div><span className="text-danger">{topMachine.totalNcParts || topMachine.TotalNcParts || 0}</span> NC Parts</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTER BUILDERS */}
      <div className="reports-grid" style={{marginTop: 'var(--space-6)'}}>
        
        {/* Daily Report Widget */}
        <div className="card report-card">
          <div className="report-header">
            <CalendarDays className="text-info" size={24} />
            <h3>Daily Report Search</h3>
          </div>
          <form className="report-form" onSubmit={handleDailyQuery}>
            <div className="form-group" style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input type="date" className="form-control" value={dateSearch} onChange={e => setDateSearch(e.target.value)} required />
              <button type="submit" className="btn btn-secondary"><Search size={16}/></button>
            </div>
          </form>

          {dailyReport.length > 0 && (
            <div className="sub-table-container">
              <table className="table">
                <thead><tr><th>Job ID</th><th>Machine</th><th>OK</th><th>NC</th></tr></thead>
                <tbody>
                  {dailyReport.map((r, i) => (
                    <tr key={i}>
                      <td>{r.jobId || r.JobId}</td><td>{r.machineCode || r.MachineCode}</td>
                      <td>{r.okParts || r.OkParts}</td><td>{r.ncParts || r.NcParts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Machine & Date Filter */}
        <div className="card report-card">
          <div className="report-header">
            <Activity className="text-warning" size={24} />
            <h3>Machine Production by Date</h3>
          </div>
          <form className="report-form" onSubmit={handleMachineDateQuery}>
            <div className="form-group">
              <label className="form-label">Machine</label>
              <select className="form-control" value={mdSearch.machineCode} onChange={e => setMdSearch({...mdSearch, machineCode: e.target.value})}>
                {machines.map(m => <option key={m.id} value={m.machineCode}>{m.machineName}</option>)}
              </select>
            </div>
            <div style={{display:'flex', gap:'var(--space-4)'}}>
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">From</label>
                <input type="date" className="form-control" required value={mdSearch.from} onChange={e => setMdSearch({...mdSearch, from: e.target.value})}/>
              </div>
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">To</label>
                <input type="date" className="form-control" required value={mdSearch.to} onChange={e => setMdSearch({...mdSearch, to: e.target.value})}/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Run Query</button>
          </form>

          {machineDateProd && (
            <div className="query-result-box" style={{marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)'}}>
              <h4 style={{marginBottom: '0.5rem'}}>Results</h4>
              <p><strong>OK Parts:</strong> <span className="text-success">{machineDateProd.totalOkParts || machineDateProd.TotalOkParts || 0}</span></p>
              <p><strong>NC Parts:</strong> <span className="text-danger">{machineDateProd.totalNcParts || machineDateProd.TotalNcParts || 0}</span></p>
            </div>
          )}
        </div>

        {/* Machine & Employee Cycle Filter */}
        <div className="card report-card" style={{gridColumn: '1 / -1'}}>
          <div className="report-header">
            <Activity className="text-primary" size={24} />
            <h3>Analyze Machine & Employee Cycles</h3>
          </div>
          <form className="report-form" onSubmit={handleCycleQuery}>
            <div style={{display:'flex', gap:'var(--space-4)', flexWrap: 'wrap'}}>
              <div className="form-group" style={{flex:1, minWidth: '200px'}}>
                <label className="form-label">Machine</label>
                <select className="form-control" value={cycleSearch.machineCode} onChange={e => setCycleSearch({...cycleSearch, machineCode: e.target.value})}>
                  {machines.map(m => <option key={m.id} value={m.machineCode}>{m.machineName}</option>)}
                </select>
              </div>
              <div className="form-group" style={{flex:1, minWidth: '200px'}}>
                <label className="form-label">Employee ID</label>
                <input type="text" className="form-control" required value={cycleSearch.employeeId} onChange={e => setCycleSearch({...cycleSearch, employeeId: e.target.value})}/>
              </div>
              <div className="form-group" style={{flex:1, minWidth: '200px'}}>
                <label className="form-label">From</label>
                <input type="datetime-local" className="form-control" required value={cycleSearch.from} onChange={e => setCycleSearch({...cycleSearch, from: e.target.value})}/>
              </div>
              <div className="form-group" style={{flex:1, minWidth: '200px'}}>
                <label className="form-label">To</label>
                <input type="datetime-local" className="form-control" required value={cycleSearch.to} onChange={e => setCycleSearch({...cycleSearch, to: e.target.value})}/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{marginTop:'var(--space-2)'}}>Run Cycle Query</button>
          </form>

          {cycleData && (
            <div className="query-result-box" style={{marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-6)'}}>
              <div>
                <h4 style={{marginBottom: '0.2rem', color: 'var(--text-muted)'}}>Cycle Worker</h4>
                <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{cycleData.employeeId || cycleData.EmployeeId}</p>
              </div>
              <div>
                <h4 style={{marginBottom: '0.2rem', color: 'var(--text-muted)'}}>Total OK</h4>
                <p style={{fontSize: '1.5rem', fontWeight: 'bold'}} className="text-success">{cycleData.totalOkParts || cycleData.TotalOkParts || 0}</p>
              </div>
              <div>
                <h4 style={{marginBottom: '0.2rem', color: 'var(--text-muted)'}}>Total NC</h4>
                <p style={{fontSize: '1.5rem', fontWeight: 'bold'}} className="text-danger">{cycleData.totalNcParts || cycleData.TotalNcParts || 0}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reports;
