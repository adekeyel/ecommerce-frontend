const Footer = () => (
  <footer className="footer">
    <div className="container flex-between">
      <span>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</span>
      <span>Built with React, Vite &amp; MongoDB</span>
    </div>
  </footer>
);

export default Footer;
