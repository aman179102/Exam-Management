import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import io from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const socket = io('http://localhost:5000');

const DashboardTab = () => {
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/results');
        setResults(res.data);
      } catch (err) {
        console.error('Failed to fetch results', err);
      }
    };
    fetchResults();

    socket.on('new-result', (newResult) => {
      setResults((prevResults) => [...prevResults, newResult]);
    });

    return () => socket.off('new-result');
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      const processedData = processResultsForChart(results);
      setChartData(processedData);
    }
  }, [results]);

  const processResultsForChart = (results) => {
    const examStats = {};
    results.forEach(result => {
      const examTitle = result.exam.title;
      if (!examStats[examTitle]) {
        examStats[examTitle] = { totalScore: 0, count: 0 };
      }
      examStats[examTitle].totalScore += result.score;
      examStats[examTitle].count++;
    });

    return Object.keys(examStats).map(title => ({
      name: title,
      'Average Score': (examStats[title].totalScore / examStats[title].count).toFixed(2),
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Live Student Performance</h2>
      <div className="bg-white p-6 rounded-lg shadow" style={{ height: '400px' }}>
        <h3 className="text-lg font-medium mb-4">Average Score by Exam</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Average Score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardTab;

