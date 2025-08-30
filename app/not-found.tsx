'use client';

import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative h-[calc(100vh-23rem)] w-full">
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-regular text-2xl tracking-tighter">
          404 - Page Not Found
        </h1>
        <p className="mx-auto text-xl text-gray-500">
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
