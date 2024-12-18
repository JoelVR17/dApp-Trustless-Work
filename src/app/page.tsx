"use client";

import { Bounded } from "@/components/Bounded";
import ThemeToggle from "@/components/layout/header/ThemeToggle";
import { useWalletStore } from "@/store/walletStore";
import { useWalletUtils } from "@/utils/hook/wallet.hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { handleConnect, handleDisconnect } = useWalletUtils();
  const { address } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push("/dashboard");
    }
  }, [address, router]);

  const handleRequestApiKey = () => {
    router.push("/dashboard/request-api-key");
  };

  const handleReportIssue = () => {
    router.push("/report-issue");
  };

  return (
    <>
      <div className="flex w-full justify-between items-center gap-2 px-4">
        {address ? (
          <>
            <div className="flex gap-5 ml-auto">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleDisconnect}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Disconnect
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-5 ml-auto">
            <ThemeToggle />

            <button
              type="button"
              onClick={handleReportIssue}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-500 to-red-700 group-hover:from-red-600 group-hover:to-red-800 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Report Issue
              </span>
            </button>

            <button
              type="button"
              onClick={handleRequestApiKey}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Request an API Key
              </span>
            </button>

            <button
              type="button"
              onClick={handleConnect}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Connect
              </span>
            </button>
          </div>
        )}
      </div>
      <Bounded center={true} className="mt-20">
        <div className="flex flex-col sm:flex-row justify-center items-center w-full h-full mt-0 md:mt-20 gap-10">
          <h1 className="text-5xl md:text-6xl font-bold">
            Welcome to <br />
            Trustless Work
          </h1>
          <hr className="hidden md:block bg-gray-200 w-0.5 h-96" />
          <p className="text-xl">
            <span className="text-primary font-bold">Escrow-as-a-service</span>{" "}
            platform built on <strong>Soroban</strong>, <br />
            <strong>Stellar's smart contract platform</strong>, designed to
            provide secure,
            <br />
            transparent, and agile escrow solutions.
          </p>
        </div>
      </Bounded>
    </>
  );
}
