import styles from "../../pages/AddProduct.module.css";

export default function VariantsEditor({ variants, setVariants }) {
  const addVariant = () => {
    setVariants((v) => [
      ...v,
      { sku: "", price: "", stock: "", options: { color: "", size: "" } },
    ]);
  };

  const patch = (i, patchObj) => {
    setVariants((arr) => {
      const cp = [...arr];
      cp[i] = { ...cp[i], ...patchObj };
      return cp;
    });
  };

  const patchOption = (i, key, val) => {
    setVariants((arr) => {
      const cp = [...arr];
      cp[i] = { ...cp[i], options: { ...cp[i].options, [key]: val } };
      return cp;
    });
  };

  const removeAt = (i) => {
    setVariants((arr) => arr.filter((_, idx) => idx !== i));
  };

  return (
    <section className={styles.card}>
      <h3 className={styles.sectionTitle} style={{ marginTop: 16 }}>
        Variants
      </h3>

      {variants.map((v, i) => (
        <div key={i} className={styles.variantRow}>
          <input
            className={styles.input}
            placeholder="Color"
            value={v.options.color}
            onChange={(e) => patchOption(i, "color", e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Size"
            value={v.options.size}
            onChange={(e) => patchOption(i, "size", e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="SKU"
            value={v.sku}
            onChange={(e) => patch(i, { sku: e.target.value })}
          />
          <input
            className={styles.input}
            type="number"
            step="0.01"
            placeholder="Price"
            value={v.price}
            onChange={(e) => patch(i, { price: e.target.value })}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Stock"
            value={v.stock}
            onChange={(e) => patch(i, { stock: e.target.value })}
          />
          <button
            type="button"
            className={`${styles.btn} ${styles.secondary}`}
            onClick={() => removeAt(i)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        className={`${styles.btn} ${styles.secondary}`}
        onClick={addVariant}
      >
        + Add Variant
      </button>
    </section>
  );
}
