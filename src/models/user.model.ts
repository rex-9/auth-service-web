import type {
  AdminRoleName,
  IUserPermissionMap,
} from "../modules/admin/role/types";

export interface IUser {
  id: string;
  username: string;
  name: string;
  email: string;
  provider: string;
  bio?: string;
  avatar_url?: string;
  role?: string;
  roles?: string[];
  role_ids?: string[];
  role_names?: AdminRoleName[];
  permissions?: IUserPermissionMap | string[];
  is_admin?: boolean;
  is_super_admin?: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}
