import styles from './QuickStartCard.module.css'

function QuickStartCard() {
  return (
    <div className={styles.card}>
      <p className={styles.tag}>🎯 Quick Start</p>
      <div className={styles.body}>
        <h4>New to BusMate?</h4>
        <p>
          Click <strong>“Try Demo Account”</strong> to explore the platform instantly, or sign up to create your personal
          account and start booking tickets.
        </p>
        <button type="button">Try Demo Account</button>
      </div>
    </div>
  )
}

export default QuickStartCard

