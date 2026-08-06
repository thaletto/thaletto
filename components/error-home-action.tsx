'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { T } from '~/lib/i18n'
import { useLocale } from '~/lib/locale-client'
import { localePath } from '~/lib/locale-route'

export function ErrorHomeAction() {
  const locale = useLocale()
  return (
    <Button asChild size="md" leadingIcon={ChevronLeft}>
      <Link href={localePath(locale, '/')}>
        <T zh="返回首页" en="Go home" />
      </Link>
    </Button>
  )
}
