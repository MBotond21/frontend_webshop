import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import { NavLink } from 'react-router';
import { useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function Navi() {
  const { user, validate, logout } = useContext(AuthContext);
  const loggedin = !!user?.userName;

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        await validate();
      } else {
        console.log("No token found, skipping validation.");
      }
    };

    loadUserData();
  }, [validate]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleAccountClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      await validate();
    },
    [validate]
  );

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink to={'/'} className="navbar-brand">WebShop</NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to={'/'} className="nav-link active" aria-current="page">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={'/vasarolj'} className="nav-link">Termékek</NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={handleAccountClick}
                >
                  Fiók
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {loggedin ? (
                    <>
                      <li><NavLink to={'/account'} className="dropdown-item">Részletek</NavLink></li>
                      <li><NavLink to={'/'} className="dropdown-item" onClick={handleLogout}>Kilépés</NavLink></li>
                    </>
                  ) : (
                    <>
                      <li><NavLink to={'/register'} className="dropdown-item">Regisztráció</NavLink></li>
                      <li><NavLink to={'/login'} className="dropdown-item">Bejelentkezés</NavLink></li>
                    </>
                  )}
                </ul>
              </li>
              {
                loggedin ? (
                  <li className="nav-item">
                    <NavLink to={'/cart'} className="nav-link"><i className="bi bi-cart"></i></NavLink>
                  </li>
                ): (
                  <></>
                )
              }
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}