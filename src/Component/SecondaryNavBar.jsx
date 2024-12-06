import React, { useState } from 'react';

const SecondaryNavBar = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    setSelectedMenu(menuName); // Highlight the parent menu when a dropdown item is selected
  };

  return (
    <header className="secondary-navigation">
      <ul className="secondary-nav-menu">
        {/* Home Menu */}
        <li
          className={`secondary-nav-item ${selectedMenu === 'home' ? 'active' : ''}`}
          onClick={() => handleMenuClick('home')}
        >
          <a href="#home" className="secondary-nav-link">
            Home
          </a>
        </li>

        {/* Actions Menu */}
        <li
          className={`secondary-nav-item dropdown ${selectedMenu === 'actions' ? 'active' : ''}`}
        >
          <a href="#actions" className="secondary-nav-link dropdown-toggle">
            Actions
          </a>
          <ul className="dropdown-menu secondary-dropdown">
            <li className="dropdown-item">
              <a href="#attestation" onClick={() => handleMenuClick('actions')}>
                Attestation
              </a>
            </li>
            <li className="dropdown-item">
              <a href="#execution" onClick={() => handleMenuClick('actions')}>
                Execution
              </a>
            </li>
          </ul>
        </li>

        {/* Audit Menu */}
        <li
          className={`secondary-nav-item dropdown ${selectedMenu === 'audit' ? 'active' : ''}`}
        >
          <a href="#audit" className="secondary-nav-link dropdown-toggle">
            Audit
          </a>
          <ul className="dropdown-menu secondary-dropdown">
            <li className="dropdown-item">
              <a href="#audit-logs" onClick={() => handleMenuClick('audit')}>
                Audit Logs
              </a>
            </li>
            <li className="dropdown-item">
              <a href="#audit-info" onClick={() => handleMenuClick('audit')}>
                Audit Info
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
};

export default SecondaryNavBar;
