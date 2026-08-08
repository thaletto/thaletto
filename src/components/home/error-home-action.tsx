'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'

export function ErrorHomeAction() {
  return (
    <Button asChild size="md" leadingIcon={ChevronLeft}>
      <Link href="/">Go home</Link>
    </Button>
  )
}
