"use client"
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/trpc";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";


export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  )
}
