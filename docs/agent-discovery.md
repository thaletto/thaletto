# Agent discovery

The site publishes machine-readable discovery resources for agents alongside
its HTML pages.

## Link headers

Every public page response carries [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288)
`Link` headers:

```http
Link: </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", </llms.txt>; rel="describedby"; type="text/plain", </llms-full.txt>; rel="service-doc"; type="text/plain"
```

The values live in `src/lib/agents/discovery.ts`. `/.well-known/api-catalog`
returns an [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727) linkset.

## Markdown for agents

Requests that prefer `text/markdown` over `text/html` are rewritten by
`src/proxy.ts` to `src/app/api/agent-markdown/route.ts`. The response is
generated from the same MDX content as the HTML pages and includes:

- `Content-Type: text/markdown; charset=utf-8`
- `Vary: Accept`
- `x-markdown-tokens` (approximate token count)

Browsers and clients that send `Accept: */*` continue to receive HTML.
`/llms.txt` is a compact index; `/llms-full.txt` contains every project and
essay.

## Content Signals

`src/app/robots.txt/route.ts` declares:

```text
Content-Signal: ai-train=yes, search=yes, ai-input=yes
```

The same policy is sent as a `Content-Signal` response header. Change it in
`src/lib/agents/discovery.ts` to update both.

## Web Bot Auth

`/.well-known/http-message-signatures-directory` serves the Ed25519 public key
in `src/content/web-bot-auth.json` with the
`application/http-message-signatures-directory+json` content type.

The private JWK is kept at `secrets/web-bot-auth-private.jwk` and is ignored by
git. To rotate:

1. Generate a new Ed25519 keypair.
2. Replace the public key in `src/content/web-bot-auth.json` (keep the `kid`
   equal to the RFC 8037 JWK thumbprint).
3. Store the new private JWK in `secrets/web-bot-auth-private.jwk`.
4. Deploy, then re-register the directory if the site is registered as a bot.

Requests sent by an agent must be signed with the private key and include
`Signature-Agent` and `Signature-Input` headers.

## DNS-AID

DNS for AI Discovery (DNS-AID) records are not published. The site runs on
`thaletto.vercel.app`, whose DNS zone is managed by Vercel and cannot carry
`_agents` records. Once the site has a custom domain, publish SVCB/HTTPS
records such as:

```dns
_index._agents.example.com. 3600 IN SVCB 1 example.com. alpn="h2" port=443 mandatory=alpn,port
_a2a._agents.example.com.   3600 IN SVCB 1 example.com. alpn="a2a" port=443 mandatory=alpn,port
```

Sign the zone with DNSSEC before announcing the records.
