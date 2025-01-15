/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/core/config/firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";
import { formSchema } from "../schema/initialize-escrow-schema";
import { Escrow } from "@/@types/escrow.entity";

interface addEscrowProps {
  payload: z.infer<typeof formSchema>;
  address: string;
  contractId: string;
}

const addEscrow = async ({
  payload,
  address,
  contractId,
}: addEscrowProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  const collectionRef = collection(db, "escrows");

  try {
    const docRef: DocumentReference = await addDoc(collectionRef, {
      ...payload,
      issuer: address,
      contractId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const createdDoc = await getDoc(docRef);

    if (createdDoc.exists()) {
      return {
        success: true,
        message: `Escrow ${payload.title} created successfully`,
        data: { id: docRef.id, ...createdDoc.data() },
      };
    } else {
      return {
        success: false,
        message: "Document was created but no data was found.",
      };
    }
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred";

    return { success: false, message: errorMessage };
  }
};

interface getAllEscrowsByUserProps {
  address: string;
  type: string;
}

const getAllEscrowsByUser = async ({
  address,
  type, // ! issuer, client, disputeResolver or serviceProvider
}: getAllEscrowsByUserProps): Promise<{
  success: boolean;
  message?: string;
  data?: any;
}> => {
  const collectionRef = collection(db, "escrows");

  try {
    const escrowCollectionSnapshot = await getDocs(
      query(collectionRef, where(type, "==", address)),
    );

    const escrowList = escrowCollectionSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return { success: false, data: escrowList };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred";

    return { success: false, message: errorMessage };
  }
};

interface updateEscrowProps {
  escrowId: string;
  payload: Record<string, any>;
}

const updateEscrow = async ({
  escrowId,
  payload,
}: updateEscrowProps): Promise<
  | {
      success: boolean;
      message: string;
      data?: any;
    }
  | Escrow
> => {
  try {
    const docRef = doc(db, "escrows", escrowId);
    const updatesWithTimestamp = {
      ...payload,
      balance: payload.balance || 0,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updatesWithTimestamp);

    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) {
      throw new Error("Escrow not found.");
    }

    const updatedEscrow = updatedDoc.data();

    return {
      success: true,
      message: `Escrow with ID ${escrowId} updated successfully.`,
      data: { escrowId, ...updatedEscrow },
    };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred during the update.";

    return { success: false, message: errorMessage };
  }
};

export { addEscrow, getAllEscrowsByUser, updateEscrow };