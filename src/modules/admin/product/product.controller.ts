import { IApiPagination, IJsonApiResource } from "../../../models";
import { AppLocales, translate } from "../../../locales";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import ProductService from "./product.service";
import {
  IAdminProduct,
  IAdminProductFormValues,
  IAdminProductListParams,
} from "./types";

class ProductController {
  async getProducts(params?: IAdminProductListParams): Promise<{
    success: boolean;
    products: IAdminProduct[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await ProductService.getProducts(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminProduct>(response);
      return { success: true, products: records, pagination };
    }

    return {
      success: false,
      products: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Products.Errors.LoadList),
      ),
    };
  }

  async getProduct(id: string): Promise<{
    success: boolean;
    product?: IAdminProduct;
    error?: string;
  }> {
    const response = await ProductService.getProduct(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const raw = "attributes" in data ? data : (data as { product?: IAdminProduct }).product ?? data;
      return {
        success: true,
        product: parseRecord<IAdminProduct>(raw as IJsonApiResource<IAdminProduct>),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Products.Errors.LoadOne),
      ),
    };
  }

  async getDiscardedProducts(params?: IAdminProductListParams): Promise<{
    success: boolean;
    products: IAdminProduct[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await ProductService.getDiscardedProducts(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminProduct>(response);
      return { success: true, products: records, pagination };
    }

    return {
      success: false,
      products: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Products.Errors.LoadList),
      ),
    };
  }

  async createProduct(values: IAdminProductFormValues): Promise<{
    success: boolean;
    product?: IAdminProduct;
    message?: string;
    error?: string;
  }> {
    const response = await ProductService.createProduct(values);
    const { status, data } = response.data || {};

    if (status?.success) {
      const raw = data
        ? "attributes" in data
          ? data
          : (data as { product?: IAdminProduct }).product ?? data
        : undefined;

      return {
        success: true,
        product: raw
          ? parseRecord<IAdminProduct>(raw as IJsonApiResource<IAdminProduct>)
          : undefined,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Products.Errors.Create),
      ),
    };
  }

  async updateProduct(
    id: string,
    values: IAdminProductFormValues,
  ): Promise<{
    success: boolean;
    product?: IAdminProduct;
    message?: string;
    error?: string;
  }> {
    const response = await ProductService.updateProduct(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const raw = "attributes" in data ? data : (data as { product?: IAdminProduct }).product ?? data;
      return {
        success: true,
        product: parseRecord<IAdminProduct>(raw as IJsonApiResource<IAdminProduct>),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Products.Errors.Update),
      ),
    };
  }

  async discardProduct(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await ProductService.discardProduct(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Products.Errors.Discard),
      ),
    };
  }

  async undiscardProduct(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await ProductService.undiscardProduct(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Products.Errors.Restore),
      ),
    };
  }
}

export default new ProductController();
