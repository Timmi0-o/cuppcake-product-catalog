"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { QUERY_ARRAY_SEPARATOR } from "@/constants/query-array-separator";
import { usePathname, useRouter } from "@/helpers/i18n/routing";

enum ENavigationMode {
  BY_REFRESH_SERVER = "BY_REFRESH_SERVER",
  BY_NO_REFRESH_SERVER = "BY_NO_REFRESH_SERVER",
}

interface IHandlePushKeyInSearchParamsInterface {
  key: string;
  value: string | null | number | object | undefined | boolean;
}

interface IHandlePushKeyInSearchParamsOptions {
  navigationMode?: keyof typeof ENavigationMode;
}

type IHandlePushKeyInSearchParamsProps =
  | IHandlePushKeyInSearchParamsInterface
  | IHandlePushKeyInSearchParamsInterface[];

interface IUseManageSearchParamsReturn {
  pathname: string;
  searchParams: URLSearchParams;
  handlePushKeyInSearchParams: (
    props: IHandlePushKeyInSearchParamsProps,
    options?: IHandlePushKeyInSearchParamsOptions,
  ) => void;
  buildQueryValue: (props: IHandlePushKeyInSearchParamsProps) => string;
  buildUrlByPathnameAndQueryString: (
    pathname: string,
    queryString: string,
  ) => string;
}

export const useManageSearchParams = (): IUseManageSearchParamsReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const buildQueryValue = useCallback(
    (props: IHandlePushKeyInSearchParamsProps) => {
      const newSearchParams = new URLSearchParams(searchParamsString);

      const items = Array.isArray(props) ? props : [props];

      items.forEach((paramsItem) => {
        const { key, value } = paramsItem;

        const formattedValue = Array.isArray(value)
          ? value.join(QUERY_ARRAY_SEPARATOR)
          : value;

        if (
          formattedValue === null ||
          formattedValue === undefined ||
          formattedValue === "" ||
          formattedValue === false
        ) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(formattedValue));
        }
      });

      return newSearchParams.toString();
    },
    [searchParamsString],
  );

  const buildUrlByPathnameAndQueryString = useCallback(
    (nextPathname: string, queryString: string) => {
      return queryString ? `${nextPathname}?${queryString}` : nextPathname;
    },
    [],
  );

  const handlePushKeyInSearchParams = useCallback(
    (
      props: IHandlePushKeyInSearchParamsProps,
      options: IHandlePushKeyInSearchParamsOptions = {},
    ) => {
      const queryString = buildQueryValue(props);

      const nextUrl = buildUrlByPathnameAndQueryString(pathname, queryString);

      const currentUrl = buildUrlByPathnameAndQueryString(
        pathname,
        searchParamsString,
      );

      if (nextUrl === currentUrl) {
        return;
      }

      if (options.navigationMode === ENavigationMode.BY_NO_REFRESH_SERVER) {
        window.history.replaceState(null, "", nextUrl);
        return;
      }

      router.replace(nextUrl, { scroll: false });
    },
    [
      buildQueryValue,
      buildUrlByPathnameAndQueryString,
      pathname,
      router,
      searchParamsString,
    ],
  );

  return {
    pathname,
    searchParams,
    handlePushKeyInSearchParams,
    buildQueryValue,
    buildUrlByPathnameAndQueryString,
  };
};
