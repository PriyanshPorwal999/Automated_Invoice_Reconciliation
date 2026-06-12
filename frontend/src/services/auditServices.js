import api from "./api";

export const getDashboard =
  async () => {
    const res =
      await api.get("/dashboard");

    return res.data;
  };

export const getLogs =
  async () => {
    const res =
      await api.get("/audit-logs");

    return res.data;
  };

export const getEmails =
  async () => {
    const res =
      await api.get("/email-history");

    return res.data;
  };

export const uploadDocument =
  async (formData) => {
    const res =
      await api.post(
        "/audit-document",
        formData
      );

    return res.data;
  };