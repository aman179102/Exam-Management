import React, { useState } from 'react';
import UsersTab from '../components/admin/UsersTab';
import ExamsTab from '../components/admin/ExamsTab';
import ClassLinksTab from '../components/admin/ClassLinksTab';
import TestsTab from '../components/admin/TestsTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import styles from '../styles/AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />;
      case 'exams':
        return <ExamsTab />;
      case 'classLinks':
        return <ClassLinksTab />;
      case 'tests':
        return <TestsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return <UsersTab />;
    }
  };

  const getButtonClass = (tabName) => {
    return activeTab === tabName ? styles.navButtonActive : styles.navButton;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Admin Dashboard</h1>
          <nav className={styles.nav}>
            <button onClick={() => setActiveTab('users')} className={getButtonClass('users')}>
              Users
            </button>
            <button onClick={() => setActiveTab('exams')} className={getButtonClass('exams')}>
              Exams
            </button>
            <button onClick={() => setActiveTab('classLinks')} className={getButtonClass('classLinks')}>
              Class Links
            </button>
            <button onClick={() => setActiveTab('tests')} className={getButtonClass('tests')}>
              Tests
            </button>
            <button onClick={() => setActiveTab('analytics')} className={getButtonClass('analytics')}>
              Analytics
            </button>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
