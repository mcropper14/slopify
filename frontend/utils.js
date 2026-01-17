// JavaScript Utility Library
// A collection of useful helper functions for modern web development

/**
 * DOM Utilities
 */
export const DOM = {
  /**
   * Get element by selector
   */
  $(selector, context = document) {
    return context.querySelector(selector);
  },

  /**
   * Get elements by selector
   */
  $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  },

  /**
   * Create element with attributes and content
   */
  create(tag, attrs = {}, content = '') {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });

    // Set content
    if (content) {
      element.innerHTML = content;
    }

    return element;
  },

  /**
   * Add event listener with optional options
   */
  on(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
  },

  /**
   * Toggle class on element
   */
  toggleClass(element, className) {
    element.classList.toggle(className);
  }
};

/**
 * HTTP Utilities
 */
export const HTTP = {
  /**
   * Make GET request
   */
  async get(url, options = {}) {
    const response = await fetch(url, { ...options, method: 'GET' });
    return response.json();
  },

  /**
   * Make POST request
   */
  async post(url, data, options = {}) {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  /**
   * Make PUT request
   */
  async put(url, data, options = {}) {
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  /**
   * Make DELETE request
   */
  async delete(url, options = {}) {
    const response = await fetch(url, { ...options, method: 'DELETE' });
    return response.json();
  }
};

/**
 * Array Utilities
 */
export const ArrayUtils = {
  /**
   * Remove duplicates from array
   */
  unique(arr) {
    return [...new Set(arr)];
  },

  /**
   * Shuffle array elements
   */
  shuffle(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Group array items by key
   */
  groupBy(arr, key) {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  /**
   * Chunk array into smaller arrays
   */
  chunk(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
};

/**
 * String Utilities
 */
export const StringUtils = {
  /**
   * Capitalize first letter
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert to camelCase
   */
  camelCase(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  },

  /**
   * Convert to kebab-case
   */
  kebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  /**
   * Truncate string with ellipsis
   */
  truncate(str, length, ending = '...') {
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    }
    return str;
  }
};

/**
 * Date Utilities
 */
export const DateUtils = {
  /**
   * Format date to readable string
   */
  format(date, options = {}) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  timeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return this.format(date);
  }
};

/**
 * Validation Utilities
 */
export const Validation = {
  /**
   * Check if email is valid
   */
  isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Check if URL is valid
   */
  isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if string is empty (after trimming)
   */
  isEmpty(str) {
    return !str || str.trim().length === 0;
  },

  /**
   * Check if value is between min and max
   */
  isBetween(value, min, max) {
    return value >= min && value <= max;
  }
};

/**
 * Local Storage Utilities
 */
export const Storage = {
  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear all localStorage
   */
  clear() {
    localStorage.clear();
  }
};

// Default export for convenience
export default {
  DOM,
  HTTP,
  ArrayUtils,
  StringUtils,
  DateUtils,
  Validation,
  Storage
};