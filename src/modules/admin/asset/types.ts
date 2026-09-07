import type { IAsset } from "../../../models";
import type { TStoragePartition } from "./constants";

export type IAdminAsset = IAsset & {
  storage_key?: string | null;
  discarded_at?: string | null;
  discarded_by_id?: string | null;
  undiscarded_at?: string | null;
};

export interface IStorageStats {
  provider: string;
  bucket?: string;
  bucket_bytes?: number;
  bucket_objects?: number;
  partitions?: Record<TStoragePartition, { bytes: number; objects: number }>;
  disk_available_bytes?: number;
  disk_total_bytes?: number;
  disk_used_percent?: number | null;
  disk_free_percent?: number | null;
  node_capacity_bytes?: number;
  db_assets_count: number;
  db_assets_bytes: number;
}
