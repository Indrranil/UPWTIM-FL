export interface Analytics {
  items: {
    total: number;
    lost: number;
    found: number;
    recovered: number;
  };
  claims: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  reports: {
    total: number;
    pending: number;
    resolved: number;
  };
  users: number;
}

export interface AdminModeration {
  id: string;
  status: string;
  adminNotes?: string;
  adminId?: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  itemId: string;
  reporterId: string;
  reason: string;
  description: string;
  status: string;
  adminId?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
