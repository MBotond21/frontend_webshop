import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'
import { NavLink } from 'react-router';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function Navi() {
  const { user, validate, logout } = useContext(AuthContext);
  const [loggedin, setLoggedin] = useState<boolean>(false);

  useEffect(() => {
    const validateUser = async () => {
      await validate();
      setLoggedin(!!user?.userName);
    };
    validateUser();
  }, [user?.userName, validate]);

  const handelAcc = (e: any) => {
    e.preventDefault();
    console.log(user?.token);
    setLoggedin(!!user?.userName);
  }

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
                <a className="nav-link dropdown-toggle" href='#' id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => handelAcc(e)}>
                  Fiók
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {
                    loggedin ? (
                      <>
                        <li><NavLink to={'/account'} className="dropdown-item">Részletek</NavLink></li>
                        <li><NavLink to={'/'} className="dropdown-item" onClick={logout}>Kilépés</NavLink></li>
                      </>
                    ) : (
                      <>
                        <li><NavLink to={'/register'} className="dropdown-item">Regisztráció</NavLink></li>
                        <li><NavLink to={'/login'} className="dropdown-item">Bejelentkezés</NavLink></li>
                      </>
                    )
                  }
                </ul>
              </li>
              <li className="nav-item">
                <NavLink to={'/cart'} className="nav-link"><i className="bi bi-cart"></i></NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
