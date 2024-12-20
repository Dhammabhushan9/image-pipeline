import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface ImagePair {
  _id: string;
  originalImage: string;
  maskImage: string;
  createdAt: string;
}

export const uploadImages = async (originalImage: string, maskImage: string): Promise<ImagePair> => {
  const response = await axios.post(`${API_URL}/images`, {
    originalImage,
    maskImage
  });
  return response.data;
};

export const getImagePairs = async (): Promise<ImagePair[]> => {
  const response = await axios.get(`${API_URL}/images`);
  return response.data;
};