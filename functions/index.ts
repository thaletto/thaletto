"use server";
import { PORTFOLIO_JSON_URL } from "@/lib/data";
import type { PortfolioData } from "@/types";

export async function getPortfolioData(): Promise<PortfolioData> {
  const response = await fetch(PORTFOLIO_JSON_URL, {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch portfolio data");
  }
  console.log("Fetched portfolio data", new Date().toLocaleTimeString());
  return response.json();
}
