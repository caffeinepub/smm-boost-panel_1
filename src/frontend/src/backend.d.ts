export interface AdminInfo {
  id: bigint;
  email: string;
  role: string;
  createdAt: bigint;
}

export interface LoginResult {
  token: string;
  admin: AdminInfo;
}

export interface backendInterface {
  adminLogin(
    email: string,
    password: string,
    ipAddress: string
  ): Promise<{ ok: LoginResult } | { err: string }>;

  getAdminMe(
    sessionToken: string
  ): Promise<{ ok: AdminInfo } | { err: string }>;

  adminLogout(
    sessionToken: string
  ): Promise<{ ok: string } | { err: string }>;

  checkSession(
    sessionToken: string
  ): Promise<{ ok: AdminInfo } | { err: string }>;

  addAdmin(
    email: string,
    password: string,
    role: string
  ): Promise<{ ok: AdminInfo } | { err: string }>;
}
