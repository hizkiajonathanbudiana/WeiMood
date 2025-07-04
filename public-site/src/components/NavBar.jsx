import { Link } from "react-router";

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/"></Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
}
export default NavBar;
