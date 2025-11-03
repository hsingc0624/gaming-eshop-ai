import FieldError from "./FieldError";
import styles from "../../pages/AddProduct.module.css";

export default function FormField({
  label,
  required,
  error,
  hint,
  children,
}) {
  return (
    <div>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.req}>*</span>}
        </label>
      )}
      {children}
      <FieldError error={error} hint={hint} />
    </div>
  );
}
