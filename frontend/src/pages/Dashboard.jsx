import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Users as UsersIcon, Layers } from "lucide-react";
import api from "../api/axios";
import modulesConfig from "../config/modulesConfig";

const PIE_COLORS = ["#2563eb", "#f97316", "#16a34a", "#9333ea", "#4f46e5", "#0d9488", "#dc2626", "#0891b2"];

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [trend, setTrend] = useState([]);
  const [activities, setActivities] = useState([]);
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        const [summaryRes, trendRes, activitiesRes] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/trend"),
          api.get("/activities/recent?limit=8"),
        ]);
        setSummary(summaryRes.data);
        setTrend(trendRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        console.error(err);
      }
      // Users list requires admin; fail silently for non-admins
      try {
        const usersRes = await api.get("/users");
        setUserCount(usersRes.data.length);
      } catch {
        setUserCount(null);
      }
      setLoading(false);
    }
    loadAll();
  }, []);

  const totalRecords = Object.values(summary).reduce((a, b) => a + b, 0);

  const distributionData = Object.entries(modulesConfig).map(([key, cfg]) => ({
    name: cfg.title,
    value: summary[key] ?? 0,
  })).filter((d) => d.value > 0);

  return (
    <div className="page">
      <div className="page-header-block">
        <h2>Dashboard</h2>
        <p className="page-subtitle">Overview of Samruddhi Plaza tracking &amp; inventory activity</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card-grid">
            <div className="stat-card">
              <div className="stat-icon blue"><Layers size={20} /></div>
              <div>
                <div className="stat-value">{totalRecords}</div>
                <div className="stat-label">Total Records</div>
              </div>
            </div>

            {Object.entries(modulesConfig).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div className="stat-card" key={key}>
                  <div className={`stat-icon ${cfg.color}`}><Icon size={20} /></div>
                  <div>
                    <div className="stat-value">{summary[key] ?? 0}</div>
                    <div className="stat-label">{cfg.title}</div>
                  </div>
                </div>
              );
            })}

            {userCount !== null && (
              <div className="stat-card">
                <div className="stat-icon teal"><UsersIcon size={20} /></div>
                <div>
                  <div className="stat-value">{userCount}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>
            )}
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <h3>Monthly Activity Trend</h3>
              {trend.every((t) => t.count === 0) ? (
                <p className="empty-note">No activity data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trend}>
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} name="Records added" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="chart-card">
              <h3>Records Distribution by Module</h3>
              {distributionData.length === 0 ? (
                <p className="empty-note">No data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={distributionData} dataKey="value" nameKey="name" outerRadius={85} label>
                      {distributionData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="activity-card">
            <h3>Recent Activities</h3>
            {activities.length === 0 ? (
              <p className="empty-note">No recent activity yet.</p>
            ) : (
              <ul className="activity-list">
                {activities.map((a) => (
                  <li key={a._id}>
                    <span className="activity-user">{a.userName}</span>{" "}
                    <span className="activity-action">{a.action}</span>
                    {a.module ? <span className="activity-module"> · {a.module}</span> : null}
                    <div className="activity-time">
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
