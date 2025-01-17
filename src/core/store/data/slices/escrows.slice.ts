import { StateCreator } from "zustand";
import { EscrowGlobalStore } from "../@types/escrows.entity";
import { Escrow } from "@/@types/escrow.entity";
import {
  addEscrow,
  getAllEscrowsByUser,
  updateEscrow,
} from "@/components/modules/escrow/server/escrow-firebase";
import { getBalance } from "@/components/modules/escrow/services/getBalance";

const ESCROW_ACTIONS = {
  SET_ESCROWS: "escrows/set",
  SET_SELECTED_ESCROW: "escrows/setSelected",
  FETCH_ALL_ESCROWS: "escrows/fetchAll",
  ADD_ESCROW: "escrows/add",
  UPDATE_ESCROW: "escrows/update",
  DELETE_PRODUCT: "escrows/delete",
  SET_ESCROW_TO_DELETE: "escrows/setToDelete",
  SET_LOADING_ESCROWS: "escrows/setLoading",
} as const;

export const ESCROW_SLICE_NAME = "escrowSlice" as const;

export const useGlobalEscrowsSlice: StateCreator<
  EscrowGlobalStore,
  [["zustand/devtools", never]],
  [],
  EscrowGlobalStore
> = (set) => {
  return {
    // Stores
    escrows: [],
    totalEscrows: 0,
    loadingEscrows: false,
    escrowsToDelete: [],
    selectedEscrow: null,

    // Modifiers
    setEscrows: (escrows: Escrow[]) =>
      set({ escrows }, false, ESCROW_ACTIONS.SET_ESCROWS),

    setSelectedEscrow: (escrow) =>
      set(
        { selectedEscrow: escrow },
        false,
        ESCROW_ACTIONS.SET_SELECTED_ESCROW,
      ),

    fetchAllEscrows: async ({ address, type = "client" }) => {
      set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);

      const escrowsByUser = await getAllEscrowsByUser({
        address,
        type,
      });

      const escrows = await Promise.all(
        escrowsByUser.data.map(async (escrow: Escrow) => {
          const response = await getBalance(escrow.contractId, address);

          const balance = response.data.balance;
          const plainBalance = JSON.parse(JSON.stringify(balance));

          if (escrow.balance !== plainBalance) {
            await updateEscrow({
              escrowId: escrow.id,
              payload: plainBalance,
            });
            escrow.balance = plainBalance;
          }

          return escrow;
        }),
      );

      set(
        { escrows, totalEscrows: escrows?.length },
        false,
        ESCROW_ACTIONS.FETCH_ALL_ESCROWS,
      );
      set({ loadingEscrows: false }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);
    },

    addEscrow: async (payload, address, contractId) => {
      const newEscrowResponse = await addEscrow({
        payload,
        address,
        contractId,
      });
      if (newEscrowResponse && newEscrowResponse.data) {
        const newEscrow: Escrow = newEscrowResponse.data;
        set(
          (state) => ({
            escrows: [newEscrow, ...state.escrows],
          }),
          false,
          ESCROW_ACTIONS.ADD_ESCROW,
        );
        return newEscrow;
      }

      return undefined;
    },

    updateEscrow: async ({ escrowId, payload }) => {
      set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);

      const updatedEscrowResponse = await updateEscrow({
        escrowId,
        payload: { ...payload, balance: payload.balance || 0 },
      });

      if (updatedEscrowResponse) {
        const updatedEscrow: Escrow = updatedEscrowResponse.data;

        set(
          (state) => ({
            escrows: state.escrows.map((escrow) =>
              escrow.id === escrowId ? updatedEscrow : escrow,
            ),
          }),
          false,
          ESCROW_ACTIONS.UPDATE_ESCROW,
        );

        set(
          { loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_LOADING_ESCROWS,
        );

        return updatedEscrow;
      }
    },

    //   fetchDeleteProduct: async (productId) => {
    //     const ok = await fetchDeleteProduct({ productId });

    //     if (ok) {
    //       set(
    //         (state) => ({
    //           products: state.products.filter((p) => p.id !== productId),
    //         }),
    //         false,
    //         ESCROW_ACTIONS.DELETE_PRODUCT,
    //       );
    //     }
    //   },

    //   setProductsToDelete: (products) =>
    //     set(
    //       { productsToDelete: products },
    //       false,
    //       ESCROW_ACTIONS.SET_PRODUCTS_TO_DELETE,
    //     ),
  };
};
