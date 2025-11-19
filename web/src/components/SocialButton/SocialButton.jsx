import styles from './SocialButton.module.css'

function SocialButton({ label, initials }) {
  return (
    <button type="button" className={styles.button}>
      <span className={styles.badge}>{initials}</span>
      {label}
    </button>
  )
}

export default SocialButton

