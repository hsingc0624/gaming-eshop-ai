import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/api";

const toCents = (v) => (v ? Math.round(Number(v) * 100) : null);
const slugify = (s) =>
  s
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function useProductForm({ onSaved, onClose } = {}) {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    price: "",
    sale_price: "",
    stock: "",
    category_slug: "",
    is_active: true,
  });

  const refs = {
    name: useRef(null),
    slug: useRef(null),
    price: useRef(null),
  };

  useEffect(() => {
    api.get("/api/categories").then(({ data }) => setCategories(data || []));
  }, []);

  const setField = (field, val) => {
    setForm((f) => {
      const updated = { ...f, [field]: val };
      if (field === "name" && (f.slug === "" || f.slug === slugify(f.name))) {
        updated.slug = slugify(val);
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    const effectiveSlug = form.slug.trim() || slugify(form.name || "");
    if (!effectiveSlug) nextErrors.slug = "Slug is required.";
    return nextErrors;
  };

  const focusFirstError = (errs) => {
    const order = ["name", "slug", "price"];
    for (const k of order) {
      if (errs[k] && refs[k]?.current) {
        refs[k].current.focus();
        refs[k].current.scrollIntoView({ block: "center", behavior: "smooth" });
        break;
      }
    }
  };

  const toPayload = (publish = true) => ({
    name: form.name,
    slug: form.slug || slugify(form.name),
    description: "",
    price_cents: toCents(form.price) ?? 0,
    sale_price_cents: toCents(form.sale_price),
    is_active: publish ? !!form.is_active : false,
    categories: form.category_slug ? [form.category_slug] : [],
    images: images.map((url, i) => ({ url, position: i })),
    variants: variants.map((v) => ({
      sku: v.sku,
      price_cents: toCents(v.price) ?? 0,
      stock: Number(v.stock) || 0,
      options: v.options,
    })),
  });

  const submit = async (publish = true) => {
    const nextErrors = validate();
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = toPayload(publish);
      const { data } = await api.post("/api/products", payload);

      onSaved?.(data);
      setForm({
        name: "",
        slug: "",
        sku: "",
        price: "",
        sale_price: "",
        stock: "",
        category_slug: "",
        is_active: true,
      });
      setImages([]);
      setVariants([]);
      setErrors({});
      onClose?.();
    } catch (e) {
      const apiErrors = e?.response?.data?.errors || e?.response?.data || {};
      const mapped = {};
      Object.entries(apiErrors).forEach(([field, msgs]) => {
        if (Array.isArray(msgs)) mapped[field] = msgs[0];
        else if (typeof msgs === "string") mapped[field] = msgs;
      });
      if (Object.keys(mapped).length) {
        setErrors((prev) => ({ ...prev, ...mapped }));
        focusFirstError(mapped);
      } else {
        alert("Create failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const disableSubmit = useMemo(
    () =>
      saving ||
      !!errors.name ||
      !!errors.slug ||
      !form.name.trim() ||
      !(form.slug.trim() || slugify(form.name || "")),
    [saving, errors, form]
  );

  return {
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
    saving,
  };
}
