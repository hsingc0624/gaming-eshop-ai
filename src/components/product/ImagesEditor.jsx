import { useState } from "react";
import styles from "../../pages/AddProduct.module.css";

export default function ImagesEditor({ images, setImages }) {
  const [img, setImg] = useState("");

  const addImage = () => {
    if (!img) return;
    setImages((arr) => [...arr, img]);
    setImg("");
  };

  const removeAt = (idx) => {
    setImages((arr) => arr.filter((_, i) => i !== idx));
  };

  return (
    <section className={styles.card}>
      <h3 className={styles.sectionTitle}>Images</h3>

      <div className={styles.imageRow}>
        <input
          className={styles.input}
          placeholder="Paste image URL"
          value={img}
          onChange={(e) => setImg(e.target.value)}
        />
        <button
          type="button"
          className={`${styles.btn} ${styles.secondary}`}
          onClick={addImage}
        >
          Add
        </button>
      </div>

      <div className={styles.thumbList}>
        {images.map((u, i) => (
          <div key={i} className={styles.thumb}>
            <img src={u} alt="" />
            <button
              type="button"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={() => removeAt(i)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
