import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from '../styles/TestResult.module.css';

const TestResult = () => {
  const location = useLocation();
  const { score, totalQuestions } = location.state || { score: 0, totalQuestions: 0 };
  
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: '#4CAF50' };
    if (percentage >= 80) return { grade: 'A', color: '#8BC34A' };
    if (percentage >= 70) return { grade: 'B', color: '#FFC107' };
    if (percentage >= 60) return { grade: 'C', color: '#FF9800' };
    return { grade: 'F', color: '#F44336' };
  };
  
  const gradeInfo = getGrade(percentage);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎉 Test Completed!</h2>
      <p className={styles.subtitle}>Here's how you performed:</p>
      
      <div className={styles.resultCard}>
        <div className={styles.scoreSection}>
          <div className={styles.scoreCircle}>
            <span className={styles.score}>{score}</span>
            <span className={styles.scoreOf}>out of {totalQuestions}</span>
          </div>
          
          <div className={styles.percentageSection}>
            <span className={styles.percentage}>{percentage}%</span>
            <span 
              className={styles.grade} 
              style={{ color: gradeInfo.color }}
            >
              Grade: {gradeInfo.grade}
            </span>
          </div>
        </div>
        
        <div className={styles.feedback}>
          {percentage >= 80 && <p className={styles.excellentFeedback}>🌟 Excellent work! Keep it up!</p>}
          {percentage >= 60 && percentage < 80 && <p className={styles.goodFeedback}>👍 Good job! Room for improvement.</p>}
          {percentage < 60 && <p className={styles.improveFeedback}>📚 Keep studying and try again!</p>}
        </div>
      </div>
      
      <div className={styles.actions}>
        <Link to="/student/tests" className={styles.backButton}>Take Another Test</Link>
        <Link to="/student" className={styles.dashboardButton}>Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default TestResult;
