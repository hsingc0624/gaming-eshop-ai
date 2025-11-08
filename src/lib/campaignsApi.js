import { api } from "./api";

export async function listCampaigns(page = 1) {
  const { data } = await api.get(`/api/campaigns?page=${page}`);
  return data;
}

export async function getCampaignMetrics(days = 30) {
  const { data } = await api.get(`/api/campaigns/metrics?days=${days}`);
  return data;
}

export async function scheduleCampaign(id, iso) {
  const { data } = await api.post(`/api/campaigns/${id}/schedule`, {
    scheduled_at: iso,
  });
  return data;
}

export const createCampaign = async (payload) => {
  const { data } = await api.post(`/api/campaigns`, payload);
  return data;
};

export async function sendTestCampaign(id, email) {
  await api.post(`/api/campaigns/${id}/send-test`, { email });
}
