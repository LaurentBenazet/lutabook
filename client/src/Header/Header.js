import { Link, useParams } from 'react-router-dom';

import "./Header.css";

const HeaderLink = ({ page }) => {
  const title = page.charAt(0).toUpperCase() + page.slice(1);
  return <Link to={`/${page}`} className="headerLink-title">
    {title}
  </Link>;
};

const Header = () => {
  const page = useParams().page || 'home';

  return (
    <div className="header">
      <HeaderLink page="profile" selected={page === "profile"} />
      <HeaderLink page="login" selected={page === "login"} />
    </div>
  );
};

export default Header;