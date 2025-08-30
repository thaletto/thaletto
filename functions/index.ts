'use server';
import type { PortfolioData } from '@/types';

const PORTFOLIO_JSON_URL =
  'https://gist.githubusercontent.com/thaletto/3aa83de4b93d48a4a2df4050d1d2f939/raw/e1c7efd9ce70c53c75097891a84064dd2b9be965/portfolio_data.json';

export async function getPortfolioData(): Promise<PortfolioData> {
  const response = await fetch(PORTFOLIO_JSON_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch portfolio data');
  }
  return response.json();
}
