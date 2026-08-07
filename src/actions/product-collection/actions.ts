"use server";

import { API_ROUTES } from "@/constants/api-routes";
import { cuppcakeEndpointResponseMapper } from "@/contracts/api-response/cuppcake-api-core";
import type { IAppActionResponse } from "@/contracts/api-response/types";
import { abstractGetAction } from "@/helpers/actions/action.helper";
import type { IGetActionOptions } from "@/types/i-action.types";
import {
  type IProductCollection,
  type IProductCollectionsGetManyFilters,
  ProductCollectionsGetManyFiltersSchema,
} from "./models/product-collection.schema";

export const productCollectionsGetMany = async (
  options: IGetActionOptions<IProductCollectionsGetManyFilters> = {},
): Promise<IAppActionResponse<IProductCollection[]>> =>
  abstractGetAction<IProductCollection[], IProductCollectionsGetManyFilters>(
    {
      url: API_ROUTES.productCollections.getMany,
      params: { method: "GET", cache: "no-store" },
      isPublic: true,
      isArray: true,
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
      queryFilterSchema: ProductCollectionsGetManyFiltersSchema,
    },
  );

export const productCollectionsGetOne = async (
  collectionId: string,
  options: IGetActionOptions = {},
): Promise<IAppActionResponse<IProductCollection>> =>
  abstractGetAction<IProductCollection>(
    {
      url: API_ROUTES.productCollections.getOne(collectionId),
      params: { method: "GET", cache: "no-store" },
      isPublic: true,
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );
