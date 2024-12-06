import React from 'react';

const SecondaryNavBar = () => {
  return (
    <nav
      className="nav-horizontal nav-header nav-large nav-sticky nav-inverse dls-bright-blue-bg secondary-nav"
      data-toggle="nav"
      data-responsive="true"
    >
      <ul className="nav-menu">
        {/* Home Menu */}
        <li className="nav-item">
          <a href="#home" className="nav-link">Home</a>
        </li>

        {/* Actions Menu */}
        <li className="nav-item dropdown">
          <a href="#actions" className="nav-link" aria-expanded="false">
            Actions
          </a>
          <ul className="dropdown-menu">
            <li className="dropdown-item">
              <a href="#attestation">Attestation</a>
            </li>
            <li className="dropdown-item">
              <a href="#execution">Execution</a>
            </li>
          </ul>
        </li>

        {/* Audit Menu */}
        <li className="nav-item dropdown">
          <a href="#audit" className="nav-link" aria-expanded="false">
            Audit
          </a>
          <ul className="dropdown-menu">
            <li className="dropdown-item">
              <a href="#audit-logs">Audit Logs</a>
            </li>
            <li className="dropdown-item">
              <a href="#audit-info">Audit Info</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

const MainComponent = () => {
  return (
    <>
      <nav
        className="nav-horizontal nav-header nav-large nav-sticky nav-inverse dls-bright-blue-bg"
        data-toggle="nav"
        data-responsive="true"
      >
        {/* Existing Navigation Bar */}
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

      {/* Second Navigation Bar */}
      <SecondaryNavBar />
    </>
  );
};

export default MainComponent;
