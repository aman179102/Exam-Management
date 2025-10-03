import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../../styles/Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>ExamPlatform</NavLink>
      <div className={styles.navLinks}>
        <NavLink to="/gallery" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Gallery</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Contact</NavLink>
        {token && (
          <>
            {role === 'admin' ? (
              <NavLink to="/admin" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Dashboard</NavLink>
            ) : (
              <>
                <NavLink to="/student" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Dashboard</NavLink>
                <NavLink to="/student/tests" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Tests</NavLink>
              </>
            )}
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </>
        )} 
        {!token && (
            <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
