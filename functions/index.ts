"use server";
import type { PortfolioData } from "@/types";

const PORTFOLIO_JSON_URL =
  "https://raw.githubusercontent.com/thaletto/portfolio-data/refs/heads/main/portfolio_data.json";

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
