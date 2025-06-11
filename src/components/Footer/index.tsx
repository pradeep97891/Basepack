import './Footer.scss';

const Footer = () => {
  return (
    <div className="cls-footer">
      <p className="cls-footer-text">Powered by Infiniti Software Solutions</p>
      <p className="cls-footer-text">Copyright @ 2021 - {new Date().getFullYear()}. All rights Reserved</p>
    </div>
  );
};

export { Footer };
