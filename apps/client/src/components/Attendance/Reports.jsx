import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Download, Filter, Calendar } from 'lucide-react';
import axios from 'axios';

const AttendanceReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [filteredReports, setFilteredReports] = useState([]);

  const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/attendance/history?days=90`, {
        withCredentials: true,
      });
      setReports(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    const days = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = reports.filter(
      (report) => new Date(report.date) >= cutoffDate
    );
    setFilteredReports(filtered);
  };

  const calculateStats = () => {
    const stats = {
      total: filteredReports.length,
      present: 0,
      absent: 0,
      leave: 0,
      idle: 0,
      workHours: 0,
    };

    filteredReports.forEach((report) => {
      switch (report.status) {
        case 'PRESENT':
          stats.present++;
          if (report.checkIn && report.checkOut) {
            const hours = (new Date(report.checkOut) - new Date(report.checkIn)) / 3600000;
            stats.workHours += hours;
          }
          break;
        case 'ABSENT':
          stats.absent++;
          break;
        case 'ON_LEAVE':
          stats.leave++;
          break;
        case 'IDLE':
          stats.idle++;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  const downloadCSV = () => {
    const stats = calculateStats();
    const csvContent = [
      ['Attendance Report'],
      ['Period', `Last ${dateRange} days`],
      ['Generated', new Date().toLocaleString()],
      [],
      ['Statistics'],
      ['Total Days', stats.total],
      ['Present', stats.present],
      ['Absent', stats.absent],
      ['Leave', stats.leave],
      ['Idle', stats.idle],
      ['Total Work Hours', stats.workHours.toFixed(2)],
      [],
      ['Daily Details'],
      ['Date', 'Status', 'Check-In', 'Check-Out', 'Duration (Hours)'],
      ...filteredReports.map((report) => {
        const duration =
          report.checkIn && report.checkOut
            ? ((new Date(report.checkOut) - new Date(report.checkIn)) / 3600000).toFixed(2)
            : '0';
        return [
          format(new Date(report.date), 'yyyy-MM-dd'),
          report.status,
          report.checkIn ? format(new Date(report.checkIn), 'HH:mm') : '-',
          report.checkOut ? format(new Date(report.checkOut), 'HH:mm') : '-',
          duration,
        ];
      }),
    ];

    const csvString = csvContent.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = calculateStats();

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'ON_LEAVE':
        return 'bg-blue-100 text-blue-800';
      case 'IDLE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Attendance Reports
            </h1>
            <p className="text-gray-600">
              Track your attendance history and statistics
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="60">Last 60 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1">Total Days</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1">Present</p>
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1">Absent</p>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1">Leave</p>
            <p className="text-2xl font-bold text-blue-600">{stats.leave}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1">Idle</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.idle}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1">Work Hours</p>
            <p className="text-2xl font-bold text-indigo-600">
              {stats.workHours.toFixed(1)}h
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Rate</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-600 h-4 rounded-full transition-all duration-300"
              style={{
                width: `${
                  stats.total > 0
                    ? ((stats.present / stats.total) * 100).toFixed(1)
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="mt-2 text-gray-600">
            {stats.total > 0
              ? `${((stats.present / stats.total) * 100).toFixed(1)}% attendance rate`
              : 'No data available'}
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Check-In
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Check-Out
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {format(new Date(report.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {report.checkIn
                          ? format(new Date(report.checkIn), 'HH:mm a')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {report.checkOut
                          ? format(new Date(report.checkOut), 'HH:mm a')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {report.checkIn && report.checkOut
                          ? `${(
                              (new Date(report.checkOut) - new Date(report.checkIn)) /
                              3600000
                            ).toFixed(2)}h`
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
