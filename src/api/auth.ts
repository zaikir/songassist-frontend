import type { AxiosInstance } from 'axios';
import type { User } from 'src/types/entities';

export default (axiosInstance: AxiosInstance) => {
  async function getAuthData() {
    try {
      const [{ data: user }] = await Promise.all([
        axiosInstance.get<User | null>('/users/me'),
        // axiosInstance.get<Project[]>('/projects'),
      ]);

      return { user };
    } catch {
      return { user: null };
    }
  }

  // ----------------------------------------------------------------------

  type SupertokensSuccessResponse = {
    status: 'OK';
  };

  type SupertokensErrorResponse = {
    message: string;
  };

  async function sendPasswordlessAuthEmail(email: string) {
    const { data } = await axiosInstance.post<
      SupertokensSuccessResponse | SupertokensErrorResponse
    >('/signinup/code', {
      email,
    });

    if ('message' in data) {
      throw new Error(data.message);
    }

    if (data.status !== 'OK') {
      throw new Error('Something went wrong. Please try again later');
    }

    return data;
  }

  // ----------------------------------------------------------------------

  async function signOut() {
    await axiosInstance.post('/auth/signout');
  }

  // ----------------------------------------------------------------------

  async function verifyEmailAuth(linkCode: string, preAuthSessionId: string) {
    const consumeResponse = await axiosInstance.post<
      SupertokensSuccessResponse | SupertokensErrorResponse
    >('signinup/code/consume', {
      linkCode,
      preAuthSessionId,
    });

    if ('message' in consumeResponse.data) {
      throw new Error(consumeResponse.data.message);
    }

    if (consumeResponse.data.status !== 'OK') {
      throw new Error('Something went wrong. Please try again later');
    }
  }

  // ----------------------------------------------------------------------

  async function getGoogleSignInUrl() {
    const {
      data: { urlWithQueryParams: authUrl },
    } = await axiosInstance.get('authorisationurl', {
      params: {
        thirdPartyId: 'google',
        redirectURIOnProviderDashboard: `${window.location.origin}/auth/google-verify`,
      },
    });

    return authUrl;
  }

  // ----------------------------------------------------------------------

  async function getGithubSignInUrl() {
    const {
      data: { urlWithQueryParams: authUrl },
    } = await axiosInstance.get('authorisationurl', {
      params: {
        thirdPartyId: 'github',
        redirectURIOnProviderDashboard: `${window.location.origin}/auth/github-verify`,
      },
    });

    return authUrl;
  }

  // ----------------------------------------------------------------------

  async function verifyGoogleAuth() {
    await axiosInstance.post<SupertokensSuccessResponse | SupertokensErrorResponse>('signinup', {
      thirdPartyId: 'google',
      redirectURIInfo: {
        redirectURIOnProviderDashboard: window.location.origin + window.location.pathname,
        redirectURIQueryParams: Object.fromEntries(
          new URLSearchParams(window.location.search).entries()
        ),
      },
    });
  }

  // ----------------------------------------------------------------------

  async function verifyGithubAuth() {
    await axiosInstance.post<SupertokensSuccessResponse | SupertokensErrorResponse>('signinup', {
      thirdPartyId: 'github',
      redirectURIInfo: {
        redirectURIOnProviderDashboard: window.location.origin + window.location.pathname,
        redirectURIQueryParams: Object.fromEntries(
          new URLSearchParams(window.location.search).entries()
        ),
      },
    });
  }

  return {
    getAuthData,
    sendPasswordlessAuthEmail,
    signOut,
    verifyEmailAuth,
    verifyGoogleAuth,
    verifyGithubAuth,
    getGoogleSignInUrl,
    getGithubSignInUrl,
  };
};
