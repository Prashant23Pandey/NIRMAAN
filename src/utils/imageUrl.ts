import { API_BASE_URL } from '../services/api';

import defaultWorkerAvatar from '../assets/images/workers/master_mason.jpg';

export const getPhotoUrl = (photoPath?: string | null): string => {
  if (!photoPath || photoPath.trim() === '') {
    return defaultWorkerAvatar;
  }
  const clean = photoPath.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  // Strip trailing /api to get backend root URL
  const baseBackendUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${baseBackendUrl}/${clean.replace(/^\//, '')}`;
};
