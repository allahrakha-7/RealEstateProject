export const fetchAPI = async (url, options = {}) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
    credentials: 'include',
    ...options,
  });

  const contentType = res.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    return data;
  } else {
    return { success: false, message: 'Invalid response format' };
  }
};
