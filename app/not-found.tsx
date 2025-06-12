'use client';

import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative h-[calc(100vh-23rem)] w-full">
      <div className="flex flex-col justify-center items-center text-center space-y-4 w-full h-full">
        <h1 className="text-2xl font-regular tracking-tighter">404 - Page Not Found</h1>
        <p className="mx-auto text-xl text-gray-500 dark:text-gray-400">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">
            <Home />
            Return Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
