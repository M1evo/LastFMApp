import React from 'react';

/**
 * Компонент подвала сайта с ссылками и информацией
 * @returns {JSX.Element} Footer
 */
export default function Footer(): JSX.Element {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <a href="/" className="footer-link">About Last.fm</a>
            <a href="/" className="footer-link">Contact Us</a>
            <a href="/" className="footer-link">Jobs</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Help</h4>
            <a href="/" className="footer-link">Track My Music</a>
            <a href="/" className="footer-link">Community Support</a>
            <a href="/" className="footer-link">Community Guidelines</a>
            <a href="/" className="footer-link">Help</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Goodies</h4>
            <a href="/" className="footer-link">Download Scrobbler</a>
            <a href="/" className="footer-link">Developer API</a>
            <a href="/" className="footer-link">Free Music Downloads</a>
            <a href="/" className="footer-link">Merchandise</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Account</h4>
            <a href="/" className="footer-link">Inbox</a>
            <a href="/" className="footer-link">Settings</a>
            <a href="/" className="footer-link">Last.fm Pro</a>
            <a href="/" className="footer-link">Logout</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Follow Us</h4>
            <a href="/" className="footer-link">Facebook</a>
            <a href="/" className="footer-link">Twitter</a>
            <a href="/" className="footer-link">Instagram</a>
            <a href="/" className="footer-link">YouTube</a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-languages">
            <a href="/" className="lang-link lang-active">English</a>
            <a href="/" className="lang-link">Deutsch</a>
            <a href="/" className="lang-link">Español</a>
            <a href="/" className="lang-link">Français</a>
            <a href="/" className="lang-link">Italiano</a>
            <a href="/" className="lang-link">日本語</a>
            <a href="/" className="lang-link">Polski</a>
            <a href="/" className="lang-link">Português</a>
            <a href="/" className="lang-link">Русский</a>
            <a href="/" className="lang-link">Svenska</a>
            <a href="/" className="lang-link">Türkçe</a>
            <a href="/" className="lang-link">简体中文</a>
          </div>
          <div className="footer-timezone">
            <span className="timezone-text">Time zone: </span>
            <span className="timezone-value">Europe/Moscow</span>
          </div>
          <div className="footer-legal">
            <span className="legal-text">CBS Interactive © 2025 Last.fm Ltd. All rights reserved</span>
            <span className="legal-separator">·</span>
            <a href="/" className="legal-link">Terms of Use</a>
            <span className="legal-separator">·</span>
            <a href="/" className="legal-link">Privacy Policy</a>
            <span className="legal-separator">·</span>
            <a href="/" className="legal-link">Legal Policies</a>
            <span className="legal-separator">·</span>
            <a href="/" className="legal-link">Cookie Details</a>
            <span className="legal-separator">·</span>
            <a href="/" className="legal-link">Jobs at Paramount</a>
            <span className="legal-separator">·</span>
            <a href="/" className="legal-link">Last.fm Music</a>
          </div>
        </div>
      </div>
    </footer>
  );
}