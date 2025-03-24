import ky from "ky";

export const fetcher = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  return ky(endpoint, options).json<T>();
};
