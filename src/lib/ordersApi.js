import { api } from "./api";

export async function fetchOrder(number) {
  const { data } = await api.get(`/api/orders/${number}`);
  return data;
}

export async function updateOrder(number, payload) {
  const { data } = await api.patch(`/api/orders/${number}`, payload);
  return data;
}

export async function refundOrder(number) {
  const { data } = await api.post(`/api/orders/${number}/refund`);
  return data;
}
