import { execFileSync } from 'node:child_process'

const list = JSON.parse(
  execFileSync('pnpm', ['list', '--prod', '--depth', 'Infinity', '--json'], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  }),
)

const packages = new Map()

function collectDependencies(node) {
  for (const [name, dependency] of Object.entries(node.dependencies ?? {})) {
    const version = dependency.version
    if (version && !/^(?:file|link|workspace):/.test(version)) {
      packages.set(`${name}@${version}`, {
        package: { ecosystem: 'npm', name },
        version,
      })
    }
    collectDependencies(dependency)
  }
}

for (const root of list) collectDependencies(root)

const queries = [...packages.values()]
const response = await fetch('https://api.osv.dev/v1/querybatch', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ queries }),
})

if (!response.ok) {
  throw new Error(`OSV dependency audit failed with HTTP ${response.status}`)
}

const report = await response.json()
if (report.results.length !== queries.length) {
  throw new Error('OSV dependency audit returned an incomplete result set')
}

const findings = report.results.flatMap((result, index) =>
  (result.vulns ?? []).map((vulnerability) => ({
    dependency: `${queries[index].package.name}@${queries[index].version}`,
    id: vulnerability.id,
  })),
)

if (findings.length > 0) {
  console.error(
    `OSV found ${findings.length} known production dependency vulnerabilities`,
  )
  if (process.env.AUDIT_DETAILS === 'true') {
    for (const finding of findings) {
      console.error(`- ${finding.dependency}: ${finding.id}`)
    }
  } else {
    console.error('Re-run privately with AUDIT_DETAILS=true for triage details')
  }
  process.exitCode = 1
} else {
  console.log(
    `OSV checked ${queries.length} production package versions; no known vulnerabilities found`,
  )
}
