export interface User {
  id: string;
  email: string;
  firstName: string;
  avatar: string;
  isAdmin?: boolean;
  isViewer?: boolean;

  [key: string]: unknown;
}
