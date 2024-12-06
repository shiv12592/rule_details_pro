import React from 'react';
import './styles.css'; // Ensure you define styles for the new classes in this file

const SecondaryNavBar = () => {
  return (
    <header className="secondary-navigation">
      <ul className="secondary-nav-menu">
        {/* Home Menu */}
        <li className="secondary-nav-item">
          <a href="#home" className="secondary-nav-link">Home</a>
        </li>

        {/* Actions Menu */}
        <li className="secondary-nav-item dropdown">
          <a href="#actions" className="secondary-nav-link dropdown-toggle">
            Actions
          </a>
          <ul className="dropdown-menu secondary-dropdown">
            <li className="dropdown-item">
              <a href="#attestation" className="dropdown-link">Attestation</a>
            </li>
            <li className="dropdown-item">
              <a href="#execution" className="dropdown-link">Execution</a>
            </li>
          </ul>
        </li>

        {/* Audit Menu */}
        <li className="secondary-nav-item dropdown">
          <a href="#audit" className="secondary-nav-link dropdown-toggle">
            Audit
          </a>
          <ul className="dropdown-menu secondary-dropdown">
            <li className="dropdown-item">
              <a href="#audit-logs" className="dropdown-link">Audit Logs</a>
            </li>
            <li className="dropdown-item">
              <a href="#audit-info" className="dropdown-link">Audit Info</a>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
};

const MainComponent = () => {
  return (
    <>
      {/* Primary Navigation */}
      <nav
        className="nav-horizontal nav-header nav-large nav-sticky nav-inverse dls-bright-blue-bg"
        data-toggle="nav"
        data-responsive="true"
      >
        <div className="nav-overlay" />
        <div className="nav-brand">
          <h1 className="heading-4" id="dls-app-components">
            <div
              className="dls-white icon-hover"
              onClick={() => void navigateHomeView()}
            >
              IAM Rules Service
            </div>
          </h1>
        </div>
        <div className="flex-inline pad-2-r">
          <div className="icon icon-sm dls-white dls-icon-account pad-1-r" />
          <div className="dls-white text-capitalize">{fullName}</div>
        </div>
        <button
          className="nav-burger hidden-md-up"
          title="Close menu"
          aria-haspopup="true"
          aria-expanded="false"
        />
        <ul className="nav-menu">
          {enableViewAs && <li className="nav-item">...</li>}
          <li className="nav-item">...</li>
        </ul>
        <div className={`menu ${appSearchModal ? 'active' : 'inactive'}`}>...</div>
      </nav>

      {/* Secondary Navigation */}
      <SecondaryNavBar />
    </>
  );
};

export default MainComponent;



/* Secondary Navigation Styling */
.secondary-navigation {
    background-color: #f4f4f4; /* Light background */
    padding: 10px 20px;
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
  }
  
  .secondary-nav-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: space-around;
  }
  
  .secondary-nav-item {
    position: relative;
  }
  
  .secondary-nav-link {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    padding: 8px 15px;
    transition: color 0.3s ease;
  }
  
  .secondary-nav-link:hover {
    color: #007bff; /* Blue hover color */
  }
  
  /* Dropdown Styling */
  .dropdown-menu.secondary-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 10px;
    margin: 0;
    border: 1px solid #ddd;
  }
  
  .dropdown-item {
    margin: 5px 0;
  }
  
  .dropdown-link {
    text-decoration: none;
    color: #333;
    padding: 5px 10px;
    display: block;
  }
  
  .dropdown-link:hover {
    color: #007bff;
  }
  
  /* Show dropdown on hover */
  .secondary-nav-item.dropdown:hover .dropdown-menu.secondary-dropdown {
    display: block;
  }
  