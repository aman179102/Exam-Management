import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import api from '../../utils/api';
import styles from '../../styles/AnalyticsTab.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/results/analytics');
      setAnalytics(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading analytics...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!analytics) return <div className={styles.error}>No analytics data available</div>;

  // Test Performance Chart Data
  const testPerformanceData = {
    labels: analytics.testAnalytics.map(test => test.testTitle),
    datasets: [
      {
        label: 'Average Score (%)',
        data: analytics.testAnalytics.map(test => test.averageScore.toFixed(1)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Number of Attempts',
        data: analytics.testAnalytics.map(test => test.attempts),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  };

  const testPerformanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Test Performance Overview',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Average Score (%)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Number of Attempts',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Student Progress Chart Data (for selected student)
  const studentNames = Object.keys(analytics.studentProgress);
  const selectedStudentData = selectedStudent && analytics.studentProgress[selectedStudent] 
    ? analytics.studentProgress[selectedStudent].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  const studentProgressData = {
    labels: selectedStudentData.map((_, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: `${selectedStudent} Progress`,
        data: selectedStudentData.map(result => result.score),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const studentProgressOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Student Progress: ${selectedStudent || 'Select a student'}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (%)',
        },
      },
    },
  };

  // Grade Distribution Data
  const gradeDistribution = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'F': 0 };
  analytics.testAnalytics.forEach(test => {
    test.scores.forEach(score => {
      if (score >= 90) gradeDistribution['A+']++;
      else if (score >= 80) gradeDistribution['A']++;
      else if (score >= 70) gradeDistribution['B']++;
      else if (score >= 60) gradeDistribution['C']++;
      else gradeDistribution['F']++;
    });
  });

  const gradeDistributionData = {
    labels: Object.keys(gradeDistribution),
    datasets: [
      {
        data: Object.values(gradeDistribution),
        backgroundColor: [
          '#4CAF50', // A+
          '#8BC34A', // A
          '#FFC107', // B
          '#FF9800', // C
          '#F44336', // F
        ],
        borderWidth: 2,
      },
    ],
  };

  const gradeDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Grade Distribution',
      },
    },
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Student Progress Analytics</h2>
      
      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h3>Total Tests</h3>
          <p className={styles.summaryValue}>{analytics.summary.totalTests}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Students</h3>
          <p className={styles.summaryValue}>{analytics.summary.totalStudents}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Attempts</h3>
          <p className={styles.summaryValue}>{analytics.summary.totalAttempts}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Average Score</h3>
          <p className={styles.summaryValue}>{analytics.summary.averageScore.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Test Performance Chart */}
        <div className={styles.chartCard}>
          <Bar data={testPerformanceData} options={testPerformanceOptions} />
        </div>

        {/* Grade Distribution Chart */}
        <div className={styles.chartCard}>
          <Doughnut data={gradeDistributionData} options={gradeDistributionOptions} />
        </div>

        {/* Student Progress Chart */}
        <div className={styles.chartCard}>
          <div className={styles.studentSelector}>
            <label htmlFor="studentSelect">Select Student:</label>
            <select
              id="studentSelect"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className={styles.select}
            >
              <option value="">-- Select Student --</option>
              {studentNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          {selectedStudent && (
            <Line data={studentProgressData} options={studentProgressOptions} />
          )}
          {!selectedStudent && (
            <div className={styles.placeholder}>
              <p>Select a student to view their progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentActivity}>
        <h3>Recent Test Submissions</h3>
        <div className={styles.activityList}>
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityInfo}>
                <strong>{activity.studentName}</strong> completed <em>{activity.testTitle}</em>
              </div>
              <div className={styles.activityScore}>
                Score: {activity.score.toFixed(1)}%
              </div>
              <div className={styles.activityDate}>
                {new Date(activity.submittedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Details Table */}
      <div className={styles.testDetails}>
        <h3>Test Performance Details</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Attempts</th>
              <th>Unique Students</th>
              <th>Average Score</th>
              <th>Highest Score</th>
              <th>Lowest Score</th>
            </tr>
          </thead>
          <tbody>
            {analytics.testAnalytics.map((test, index) => (
              <tr key={index}>
                <td>{test.testTitle}</td>
                <td>{test.attempts}</td>
                <td>{test.uniqueStudents}</td>
                <td>{test.averageScore.toFixed(1)}%</td>
                <td>{Math.max(...test.scores).toFixed(1)}%</td>
                <td>{Math.min(...test.scores).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsTab;
