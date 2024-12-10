import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router';

export function Navi() {
  return (
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
          </ul>
        </div>
      </div>
    </nav>
  );
};
