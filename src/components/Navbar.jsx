import "../styles/vars.css";
import styles from "../styles/Navbar.module.css"; // Create a separate CSS file for navbar styles

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>Drop-EZ</h1>
      <ul className={styles.navLinks}>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
        <li>
          <button className={styles.loginBtn}>Login</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
