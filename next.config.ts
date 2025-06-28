import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  env: {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    ICON_DARK_URL:
      'https://github.com/A-Developer-Company/.github/blob/337e5fa228d6014b8df95e5d44e45cddf8576c04/assets/Icon%20dark.png?raw=true',
    ICON_LIGHT_URL:
      'https://github.com/A-Developer-Company/.github/blob/337e5fa228d6014b8df95e5d44e45cddf8576c04/assets/Icon%20light.png?raw=true',
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
