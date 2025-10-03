import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import io from 'socket.io-client';
import styles from '../styles/StudentDashboard.module.css';

const socket = io('http://localhost:5000');

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, resultsRes, linksRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/results/my-results'),
          api.get('/classlinks'),
        ]);
        setUser(userRes.data);
        setResults(resultsRes.data);
        setLinks(linksRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();

    socket.on('new-class-link', (newLink) => {
      setLinks((prevLinks) => [newLink, ...prevLinks]);
    });

    return () => socket.off('new-class-link');
  }, []);


  const getPerformanceSummary = () => {
    if (results.length === 0) return { average: 0, completed: 0 };
    const totalScore = results.reduce((acc, r) => acc + r.score, 0);
    return {
      average: (totalScore / results.length).toFixed(2),
      completed: results.length,
    };
  };

  const performance = getPerformanceSummary();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome, {user?.username}!</h1>
      </header>
      
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Tests Completed</h3>
          <p className={styles.cardValue}>{performance.completed}</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Average Score</h3>
          <p className={styles.cardValue}>{performance.average}%</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Take Tests</h3>
          <Link to="/student/tests" className={styles.actionButton}>
            View Available Tests
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Class Links</h3>
        <ul className={styles.list}>
          {links.map(link => (
            <li key={link._id} className={styles.listItem}>
              <p className={styles.linkTitle}>{link.title}</p>
              <a href={link.link} target="_blank" rel="noopener noreferrer" className={styles.link}>Join Class</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;

