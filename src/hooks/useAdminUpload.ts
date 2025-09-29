import { api } from "../lib/api";
import type {
  MultipleUploadResponse,
  UploadedFile,
  UploadResponse,
} from "../types/admin";

// Hook pour l'upload d'images
export const useAdminUpload = () => {
  const uploadSingle = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/admin/upload/single", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };

  const uploadMultiple = async (
    files: File[],
  ): Promise<MultipleUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post("/admin/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };

  const deleteImage = async (filename: string) => {
    const response = await api.delete(`/admin/upload/${filename}`);
    return response.data;
  };

  const listImages = async (): Promise<{ images: UploadedFile[] }> => {
    const response = await api.get("/admin/upload");
    return response.data;
  };

  const getImageInfo = async (
    filename: string,
  ): Promise<{ image: UploadedFile }> => {
    const response = await api.get(`/admin/upload/info/${filename}`);
    return response.data;
  };

  return {
    uploadSingle,
    uploadMultiple,
    deleteImage,
    listImages,
    getImageInfo,
  };
};
