import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.loading} role="status" aria-label="Loading page" aria-busy="true">
      <span className={styles.srOnly}>Loading page content</span>
      <div className={styles.hero} aria-hidden="true">
        <div className={styles.inner}>
          <i className={`${styles.line} ${styles.short}`} />
          <i className={`${styles.line} ${styles.title}`} />
          <i className={`${styles.line} ${styles.titleSecond}`} />
          <i className={`${styles.line} ${styles.copy}`} />
          <i className={`${styles.line} ${styles.button}`} />
        </div>
      </div>
      <section className={styles.section} aria-hidden="true">
        <div className={styles.inner}>
          <i className={`${styles.line} ${styles.sectionTitle}`} />
          <div className={styles.grid}>
            {[0, 1, 2].map((item) => (
              <div className={styles.card} key={item}>
                <i className={`${styles.line} ${styles.image}`} />
                <i className={`${styles.line} ${styles.cardTitle}`} />
                <i className={`${styles.line} ${styles.cardCopy}`} />
                <i className={`${styles.line} ${styles.cardCopyShort}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
