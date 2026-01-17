import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ComponentName - A reusable React component
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {Function} props.onAction - Callback function for actions
 * @param {boolean} props.isLoading - Loading state
 */
const ComponentName = ({
  title = 'Default Title',
  onAction,
  isLoading = false,
  children
}) => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  // Effect for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API call
        // const response = await fetch('/api/data');
        // const result = await response.json();
        // setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle click events
  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
    if (onAction) {
      onAction(count + 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="component-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="component-container">
      {/* Header */}
      <header className="component-header">
        <h2 className="component-title">{title}</h2>
        <button
          className="component-button"
          onClick={handleClick}
          disabled={isLoading}
        >
          Click me ({count})
        </button>
      </header>

      {/* Content */}
      <main className="component-content">
        {data ? (
          <div className="component-data">
            <h3>Data loaded successfully!</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          <div className="component-placeholder">
            <p>No data available. Click the button to interact.</p>
          </div>
        )}

        {/* Render children if provided */}
        {children && (
          <div className="component-children">
            {children}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="component-footer">
        <p className="component-info">
          Component rendered at {new Date().toLocaleTimeString()}
        </p>
      </footer>
    </div>
  );
};

// PropTypes for type checking
ComponentName.propTypes = {
  title: PropTypes.string,
  onAction: PropTypes.func,
  isLoading: PropTypes.bool,
  children: PropTypes.node
};

// Default props
ComponentName.defaultProps = {
  title: 'My Component',
  isLoading: false
};

export default ComponentName;