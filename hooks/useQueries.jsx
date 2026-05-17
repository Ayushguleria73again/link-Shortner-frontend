import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

/**
 * User & Profile Hooks
 */
export function useUserAuth() {
  return useQuery({
    queryKey: ['userAuth'],
    queryFn: async () => {
      const [userRes, profileRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/profile/me')
      ]);
      return {
        ...userRes.data.data,
        plan: userRes.data.data?.plan || 'free',
        username: profileRes.data.data?.username,
        profile: profileRes.data.data
      };
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData) => {
      return api.post('/profile', profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userAuth']);
      queryClient.invalidateQueries(['hubData']);
    },
  });
}

/**
 * Campaign Hooks
 */
export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns');
      return data.data || [];
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignData) => {
      return api.post('/campaigns', campaignData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      toast.success('Campaign created successfully');
    },
    onError: () => {
      toast.error('Could not create campaign');
    }
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return api.delete(`/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      toast.success('Campaign deleted');
    },
    onError: () => {
      toast.error('Delete failed');
    }
  });
}

/**
 * URL Hooks
 */
export function useUrls() {
  return useQuery({
    queryKey: ['urls'],
    queryFn: async () => {
      const { data } = await api.get('/url');
      return data.data || [];
    },
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return api.delete(`/url/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['urls']);
    },
  });
}

/**
 * Analytics Hooks
 */
export function useLinkAnalytics(shortCode, range = '7d') {
  return useQuery({
    queryKey: ['analytics', shortCode, range],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/${shortCode}?range=${range}`);
      return data.data;
    },
    enabled: !!shortCode,
    refetchInterval: shortCode ? 5000 : false,
  });
}

export function useOverviewAnalytics(enabled = false, range = '7d') {
  return useQuery({
    queryKey: ['overviewAnalytics', range],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/overview?range=${range}`);
      return data.data;
    },
    enabled: enabled,
    refetchInterval: enabled ? 8000 : false,
  });
}

/**
 * Settings & Auth Extensions
 */
export function useUpdateBranding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (brandingData) => {
      return api.put('/auth/branding', brandingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userAuth']);
      toast.success('Branding updated.');
    },
    onError: () => {
      toast.error('Could not save branding.');
    }
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settingsData) => {
      return api.put('/auth/settings', settingsData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userAuth']);
      toast.success('Settings updated successfully.');
    },
    onError: () => {
      toast.error('Could not save settings.');
    }
  });
}

export function useGenerateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/api-key');
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userAuth']);
      toast.success('Your new API key is ready.');
    },
    onError: () => {
      toast.error('Key generation failed.');
    }
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      return api.delete('/auth/me');
    },
    onSuccess: () => {
      toast.success('Account deleted.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
    onError: () => {
      toast.error('Could not delete account. Please contact support.');
    }
  });
}

/**
 * Domain Hooks
 */
export function useDomains() {
  return useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const { data } = await api.get('/domains');
      return data.data || [];
    },
  });
}

export function useAddDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (domain) => {
      return api.post('/domains', { domain });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['domains']);
      toast.success('Domain registered. Please configure DNS.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to add domain');
    }
  });
}

export function useVerifyDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return api.post(`/domains/${id}/verify`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['domains']);
      toast.success('Domain verified successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Verification failed');
    }
  });
}

export function useDeleteDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return api.delete(`/domains/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['domains']);
      toast.success('Domain removed.');
    },
    onError: () => {
      toast.error('Failed to remove domain');
    }
  });
}

/**
 * Analytics Hooks
 */
export function useTopPerformers() {
  return useQuery({
    queryKey: ['topPerformers'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/performers');
      return data.data || [];
    },
  });
}

export function useActivityStream(shortCode = 'ALL', page = 1) {
  return useQuery({
    queryKey: ['activityStream', shortCode, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page });
      if (shortCode !== 'ALL') params.append('shortCode', shortCode);
      const { data } = await api.get(`/analytics/activity?${params.toString()}`);
      return data;
    },
  });
}

export function useUpdateUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/url/${id}`, data);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['urls']);
      queryClient.invalidateQueries(['linkAnalytics', data.shortCode]);
      toast.success('Configuration synchronized.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  });
}

export function useShortenUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shortenData) => {
      const res = await api.post('/url/shorten', shortenData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['urls']);
      toast.success('Link generated successfully.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to shorten URL');
    }
  });
}

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  });
}

export function useSignup() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (userData) => {
      const res = await api.post('/auth/signup', userData);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Account creation failed');
    }
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
    router.push('/login');
  };
}

export function useRegister() {
  return useMutation({
    mutationFn: async (userData) => {
      const res = await api.post('/auth/register', userData);
      return res.data;
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  });
}

export function useVerifyOtp() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (verifyData) => {
      const res = await api.post('/auth/verify', verifyData);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
      toast.success('Verification successful.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Verification failed');
    }
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: async (emailData) => {
      const res = await api.post('/auth/resend-otp', emailData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('New code sent to your email.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to resend code');
    }
  });
}

/**
 * Hub Hooks
 */
export function useHubData(username) {
  return useQuery({
    queryKey: ['hubData', username],
    queryFn: async () => {
      const hubRes = await api.get(`/profile/${username}`);
      return hubRes.data.data?.links || [];
    },
    enabled: !!username,
  });
}
