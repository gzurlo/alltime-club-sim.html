/**
 * Security Module
 * XSS prevention and input validation utilities
 */

/**
 * Security utilities for XSS prevention
 */
export const Security = {
  /**
   * Sanitize HTML to prevent XSS
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML
   */
  sanitize(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.textContent = String(html);
    return div.innerHTML;
  },

  /**
   * Sanitize but allow specific safe tags
   * @param {string} html - HTML string
   * @param {Array<string>} allowedTags - Tags to allow
   * @returns {string} Sanitized HTML with allowed tags
   */
  sanitizeWithTags(html, allowedTags = ['b', 'i', 'strong', 'em']) {
    if (!html) return '';

    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove dangerous elements
    const dangerous = div.querySelectorAll('script, iframe, object, embed, link');
    dangerous.forEach(el => el.remove());

    // Remove all attributes except class and id
    const allElements = div.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove element if not in allowed list
      if (!allowedTags.includes(el.tagName.toLowerCase())) {
        while (el.firstChild) {
          el.parentNode.insertBefore(el.firstChild, el);
        }
        el.remove();
        return;
      }

      // Remove dangerous attributes
      Array.from(el.attributes).forEach(attr => {
        if (!['class', 'id'].includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return div.innerHTML;
  },

  /**
   * Safe innerHTML replacement
   * @param {Element} element - Target element
   * @param {string} html - HTML to set
   * @param {boolean} allowTags - Allow safe HTML tags
   */
  setHTML(element, html, allowTags = false) {
    if (!element) return;
    const sanitized = allowTags ?
      this.sanitizeWithTags(html) :
      this.sanitize(html);
    element.innerHTML = sanitized;
  },

  /**
   * Safe text replacement
   * @param {Element} element - Target element
   * @param {string} text - Text to set
   */
  setText(element, text) {
    if (!element) return;
    element.textContent = String(text);
  },

  /**
   * Input validation helpers
   */
  validate: {
    /**
     * Validate manager name
     * @param {string} name - Manager name
     * @returns {boolean} Is valid
     */
    managerName(name) {
      const pattern = /^[a-zA-Z0-9\s]+$/;
      return pattern.test(name) && name.length >= 2 && name.length <= 30;
    },

    /**
     * Validate team name
     * @param {string} name - Team name
     * @returns {boolean} Is valid
     */
    teamName(name) {
      const pattern = /^[a-zA-Z0-9\s\-']+$/;
      return pattern.test(name) && name.length <= 50;
    },

    /**
     * Validate number within range
     * @param {number} value - Number to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} Is valid
     */
    number(value, min = 0, max = Infinity) {
      const num = Number(value);
      return !isNaN(num) && num >= min && num <= max;
    }
  }
};

export default Security;
