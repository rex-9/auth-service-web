import type { IAdminPermission, IAdminRole } from "../modules/admin/role/types";
import type { IJsonApiResource } from "./api.model";

export interface IUserIam {
  is_admin: boolean;
  is_super_admin: boolean;
  roles: IJsonApiResource<IAdminRole>[];
  admin_roles: IJsonApiResource<IAdminRole>[];
  non_admin_roles: IJsonApiResource<IAdminRole>[];
  permissions: IJsonApiResource<IAdminPermission>[];
  admin_permissions: IJsonApiResource<IAdminPermission>[];
  non_admin_permissions: IJsonApiResource<IAdminPermission>[];
}

export interface IUser {
  id: string;
  username: string;
  name: string;
  email: string;
  provider: string;
  bio?: string;
  avatar_url?: string;
  iam?: IUserIam;
  created_at: Date | string;
  updated_at: Date | string;
}
