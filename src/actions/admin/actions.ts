"use server";

import { API_ROUTES } from "@/constants/api-routes";
import { cuppcakeEndpointResponseMapper } from "@/contracts/api-response/cuppcake-api-core";
import type { IAppActionResponse } from "@/contracts/api-response/types";
import { abstractGetAction } from "@/helpers/actions/action.helper";
import type { IGetActionOptions } from "@/types/i-action.types";
import type { ICatalogStats } from "./models/catalog-stats.schema";

export const adminCatalogStatsGet = async (
  options: IGetActionOptions = {},
): Promise<IAppActionResponse<ICatalogStats>> =>
  abstractGetAction<ICatalogStats>(
    {
      url: API_ROUTES.admin.stats,
      params: { method: "GET", cache: "no-store" },
      authMode: "required",
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );
