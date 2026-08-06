const isDevelopment = process.env.NODE_ENV === 'development'

function contentSecurityPolicy(
  scriptSources: string,
  styleSources: string,
  {
    formActionSources = "'self'",
    connectSources = '',
  }: { formActionSources?: string; connectSources?: string } = {},
) {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    `form-action ${formActionSources}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src ${scriptSources}`,
    "script-src-attr 'none'",
    `style-src ${styleSources}`,
    `img-src 'self' data: blob: https://og.zolplay.com`,
    "font-src 'self' data:",
    `connect-src 'self'${connectSources}`,
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "frame-src 'none'",
    "manifest-src 'self'",
  ].join('; ')
}

// Static policies keep the prerendered shell cacheable.
const publicContentSecurityPolicy = contentSecurityPolicy(
  `'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "'self' 'unsafe-inline'",
)

export const securityHeaders = [
  { key: 'Content-Security-Policy', value: publicContentSecurityPolicy },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()',
    ].join(', '),
  },
] as const
