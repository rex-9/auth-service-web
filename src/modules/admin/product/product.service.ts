import AppRoutes from "../../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services";
import {
  IAdminProduct,
  IAdminProductFormValues,
  IAdminProductListParams,
} from "./types";

export type AdminProductResponse =
  | IJsonApiResource<IAdminProduct>
  | { product: IAdminProduct };

class ProductService {
  async getProducts(
    params?: IAdminProductListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminProduct>[]>>> {
    return api.get<IJsonApiResource<IAdminProduct>[]>(
      AppRoutes.server.protected.admin.PAYMENT_PRODUCTS,
      params
        ? {
            page: params.page,
            limit: params.limit,
            sort_by: params.sort_by,
            sort_order: params.sort_order,
          }
        : undefined,
    );
  }

  async getProduct(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminProductResponse>>> {
    return api.get<AdminProductResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.PAYMENT_PRODUCT_DETAIL, id),
    );
  }

  async getDiscardedProducts(
    params?: IAdminProductListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminProduct>[]>>> {
    return api.get<IJsonApiResource<IAdminProduct>[]>(
      AppRoutes.server.protected.admin.DISCARDED_PAYMENT_PRODUCTS,
      params
        ? {
            page: params.page,
            limit: params.limit,
            sort_by: params.sort_by,
            sort_order: params.sort_order,
          }
        : undefined,
    );
  }

  async createProduct(
    values: IAdminProductFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminProductResponse>>> {
    return api.post<AdminProductResponse>(
      AppRoutes.server.protected.admin.PAYMENT_PRODUCTS,
      { product: values },
    );
  }

  async updateProduct(
    id: string,
    values: IAdminProductFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminProductResponse>>> {
    return api.put<AdminProductResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.PAYMENT_PRODUCT_DETAIL, id),
      {
        product: values,
      },
    );
  }

  async discardProduct(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.post<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.PAYMENT_PRODUCT_DISCARD, id),
    );
  }

  async undiscardProduct(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminProductResponse>>> {
    return api.post<AdminProductResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.PAYMENT_PRODUCT_UNDISCARD, id),
    );
  }
}

export default new ProductService();
