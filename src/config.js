export const useLocal = USE_LOCAL === 'true';
export const baseUrl = USE_LOCAL === 'true' ? LOCAL_BASE_URL : S3_BASE_URL;