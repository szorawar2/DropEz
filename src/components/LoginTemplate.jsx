import styles from "../styles/LoginTemplate.module.css";

function LoginTemplate() {
  return (
    <div className={styles.screen1}>
      <svg
        className={styles.logo}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        width="300"
        height="300"
        viewBox="0 0 640 480"
        xmlSpace="preserve"
      >
        {/* SVG content remains the same */}
      </svg>

      <div className={styles.email}>
        <label htmlFor="email">Email Address</label>
        <div className={styles.sec2}>
          <ion-icon name="mail-outline"></ion-icon>
          <input type="email" name="email" placeholder="Username@gmail.com" />
        </div>
      </div>

      <div className={styles.password}>
        <label htmlFor="password">Password</label>
        <div className={styles.sec2}>
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input
            className={styles.pas}
            type="password"
            name="password"
            placeholder="············"
          />
          <ion-icon className={styles.showHide} name="eye-outline"></ion-icon>
        </div>
      </div>

      <button className={styles.login}>Login</button>

      <div className={styles.footer}>
        <span>Sign up</span>
        <span>Forgot Password?</span>
      </div>
    </div>
  );
}

export default LoginTemplate;
