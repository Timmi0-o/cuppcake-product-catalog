"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { productsDelete } from "@/actions/product/actions";
import { handleActionError } from "@/hooks/actions/handle-action-error";

export const useProductDelete = () => {
  const t = useTranslations("pages.admin");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await productsDelete(productId);
      handleActionError(response, t("deleteError"));
      return response.result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("deleteSuccess"));
    },
  });
};
