import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import styles from '../styles/Tests.module.css';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get('/tests');
        setTests(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tests:', error);
        setError('Failed to load tests. Please try again.');
        setLoading(false);
      }
    };

    fetchTests();

    // Set up socket connection for real-time test updates
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

    socket.on('new-test', (newTest) => {
      setTests((prevTests) => [...prevTests, newTest]);
    });

    return () => {
      socket.off('new-test');
      socket.disconnect();
    };
  }, []);

  if (loading) return <div className={styles.loading}>Loading tests...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Tests</h2>
      {tests.length === 0 ? (
        <div className={styles.noTests}>
          <p>No tests available at the moment.</p>
          <p>Check back later for new tests!</p>
        </div>
      ) : (
        <div className={styles.testsGrid}>
          {tests.map((test) => (
            <div key={test._id} className={styles.testCard}>
              <h3 className={styles.testTitle}>{test.title}</h3>
              <p className={styles.testDescription}>{test.description}</p>
              <div className={styles.testMeta}>
                <span>⏱️ Time Limit: {test.timeLimit} minutes</span>
                {test.questions && <span>📝 {test.questions.length} Questions</span>}
              </div>
              <Link to={`/student/tests/${test._id}`} className={styles.takeTestButton}>
                Start Test
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tests;
