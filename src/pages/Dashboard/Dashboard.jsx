import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import StatCard from "../../components/StatCard";
import ProductsTable from "../../components/ProductsTable";
import Modal from "../../components/Modal";
import AddProduct from "../AddProduct";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);

  async function loadCategories() {
    const { data } = await api.get("/api/categories");
    setCategories(data || []);
  }

  async function loadProducts(page = 1) {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    params.set("include_inactive", "1");
    params.set("per_page", 10);
    params.set("page", String(page));

    const { data } = await api.get(`/api/products?${params.toString()}`);
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    setProducts(rows);
    setMeta({
      current_page: data.current_page ?? 1,
      last_page: data.last_page ?? 1,
    });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [filters.category, filters.search]);

  const filtered = useMemo(() => {
    if (!filters.status) return products;
    const active = filters.status === "active";
    return products.filter((p) => Boolean(p.is_active) === active);
  }, [products, filters.status]);

  function handleDeleted(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTimeout(() => {
      if (products.length === 1 && meta.current_page > 1) {
        loadProducts(meta.current_page - 1);
      }
    }, 0);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>

      <section className={styles.statsGrid}>
        <StatCard label="Total Sales" value="—" />
        <StatCard label="Orders" value="—" />
        <StatCard label="Products" value={String(filtered.length)} />
        <StatCard label="Users" value="—" />
      </section>

      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2 className={styles.subHeading}>Products</h2>
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={() => setShowAddModal(true)}
          >
            + Add Product
          </button>
        </div>

        <div className={styles.filters}>
          <select
            className={styles.input}
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value }))
            }
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className={styles.input}
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <input
            className={styles.input}
            placeholder="Search name..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
        </div>

        <ProductsTable rows={filtered} onDelete={handleDeleted} />

        <div className={styles.pagination}>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={() => loadProducts(Math.max(1, meta.current_page - 1))}
            disabled={meta.current_page <= 1}
          >
            Prev
          </button>
          <span className={styles.pageInfo}>
            Page {meta.current_page} / {meta.last_page}
          </span>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={() =>
              loadProducts(Math.min(meta.last_page, meta.current_page + 1))
            }
            disabled={meta.current_page >= meta.last_page}
          >
            Next
          </button>
        </div>
      </section>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <AddProduct
          onClose={() => setShowAddModal(false)}
          onSaved={() => {
            loadProducts(meta.current_page || 1);
          }}
        />
      </Modal>
    </div>
  );
}
