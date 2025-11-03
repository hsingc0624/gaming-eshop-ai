import styles from "./AddProduct.module.css";
import FormField from "../components/forms/FormField";
import ImagesEditor from "../components/product/ImagesEditor";
import VariantsEditor from "../components/product/VariantsEditor";
import { useProductForm } from "../hooks/useProductForm";

export default function AddProduct({ onClose, onSaved }) {
  const {
    form,
    setField,
    errors,
    refs,
    categories,
    images,
    setImages,
    variants,
    setVariants,
    submit,
    disableSubmit,
  } = useProductForm({ onSaved, onClose });

  return (
    <div className={styles.page}>
      {onClose && (
        <button
          type="button"
          aria-label="Close"
          className={styles.closeX}
          onClick={onClose}
        >
          ×
        </button>
      )}

      <div className={styles.breadcrumb}>
        Products / <b>Add Product</b>
      </div>
      <h1 className={styles.title}>Add Product</h1>

      <div className={styles.formGrid}>
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Product Details</h3>

          <FormField
            label="Product Name"
            required
            error={errors.name}
            hint={!form.name.trim() ? "Required" : ""}
          >
            <input
              ref={refs.name}
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. GamePad Pro"
              aria-invalid={!!errors.name}
              aria-required="true"
              required
            />
          </FormField>

          <FormField
            label="Slug"
            required
            error={errors.slug}
            hint={
              !(form.slug.trim() || form.name.trim())
                ? "Required (auto from name if empty)"
                : ""
            }
          >
            <input
              ref={refs.slug}
              className={`${styles.input} ${
                errors.slug ? styles.inputError : ""
              }`}
              value={form.slug}
              onChange={(e) =>
                setField(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")
                )
              }
              placeholder="auto-generated"
              aria-invalid={!!errors.slug}
              aria-required="true"
              required
            />
          </FormField>

          <div className={styles.row2}>
            <div>
              <FormField label="SKU">
                <input
                  className={styles.input}
                  value={form.sku}
                  onChange={(e) => setField("sku", e.target.value)}
                />
              </FormField>
            </div>
            <div>
              <FormField label="Price" error={errors.price}>
                <input
                  ref={refs.price}
                  className={`${styles.input} ${
                    errors.price ? styles.inputError : ""
                  }`}
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  aria-invalid={!!errors.price}
                />
              </FormField>
            </div>
          </div>

          <div className={styles.row2}>
            <div>
              <FormField label="Sale Price">
                <input
                  className={styles.input}
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  value={form.sale_price}
                  onChange={(e) => setField("sale_price", e.target.value)}
                />
              </FormField>
            </div>
            <div>
              <FormField label="Status">
                <select
                  className={styles.input}
                  value={form.is_active ? "1" : "0"}
                  onChange={(e) =>
                    setField("is_active", e.target.value === "1")
                  }
                >
                  <option value="1">Published</option>
                  <option value="0">Draft</option>
                </select>
              </FormField>
            </div>
          </div>

          <div className={styles.row2}>
            <div>
              <FormField label="Category">
                <select
                  className={styles.input}
                  value={form.category_slug}
                  onChange={(e) => setField("category_slug", e.target.value)}
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div>
              <FormField label="Stock (simple)">
                <input
                  className={styles.input}
                  type="number"
                  placeholder="Optional if variants"
                  value={form.stock}
                  onChange={(e) => setField("stock", e.target.value)}
                />
              </FormField>
            </div>
          </div>
        </section>

        <ImagesEditor images={images} setImages={setImages} />
        <VariantsEditor variants={variants} setVariants={setVariants} />
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.secondary}`}
          disabled={disableSubmit}
          onClick={() => submit(false)}
        >
          Save Draft
        </button>
        <button
          className={`${styles.btn} ${styles.primary}`}
          disabled={disableSubmit}
          onClick={() => submit(true)}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
