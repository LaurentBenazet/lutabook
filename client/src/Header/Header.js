import { Link, useParams } from 'react-router-dom';

import "./Header.css";

const HeaderLink = ({ page }) => {
  const title = page.charAt(0).toUpperCase() + page.slice(1);
  return <Link to={`/${page}`} className="headerlink-title">
    {title}
  </Link>;
};

const Header = () => {
  const page = useParams().page || 'home';

  return (
    <div className="header">
      <HeaderLink page="home" selected={page === "home"} />
      <HeaderLink page="about" selected={page === "about"} />
      <HeaderLink page="contact" selected={page === "contact"} />
    </div>
  );
};

export default Header;