import styles from "../../pages/AddProduct.module.css";

export default function FieldError({ error, hint }) {
  if (error) return <div className={styles.errorText}>{error}</div>;
  if (hint) return <div className={styles.helperText}>{hint}</div>;
  return null;
}
