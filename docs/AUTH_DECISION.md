# ADR: Rider and developer authentication

**Status:** Proposed for production; local compatibility scaffold implemented.

## Decision

Use Supabase Auth as the production identity service, enable Google as an optional provider, and have FastAPI verify Supabase JWTs. Keep TransitOS domain data, API keys, quotas, route contributions, and community posts in the existing application database. Until credentials and an SMTP/domain decision exist, the repository keeps a compatible FastAPI account boundary so feature work can run locally.

## Why

Supabase supplies password, recovery, email verification, social providers, JWTs, and a documented local workflow. Google Sign-In by itself supplies an identity assertion but not the complete account, session, recovery, and multi-provider lifecycle. Better Auth is strong and self-hostable, but mounting a TypeScript auth service next to a Python-owned API creates a second backend runtime and migration owner.

## Comparison

| Option | Strengths | Cost / risk here | Verdict |
| --- | --- | --- | --- |
| Supabase Auth + Google | Managed recovery and verification, social OAuth, JWT boundary, 50k MAU on current free tier | Vendor service, SMTP/domain configuration, JWT integration work | Recommended |
| Better Auth + Google | Open TypeScript library, database adapters, email/password and social providers | Adds a Node auth backend beside FastAPI; shared-schema ownership must be designed | Good if the team chooses full self-hosting |
| Google Identity Services alone | Familiar button and signed identity token | No password users, recovery, application sessions, or account linking policy by itself | Provider only, not the auth system |

## Migration seam

The clients call an account adapter rather than embedding auth throughout feature components. Replace the adapter methods with Supabase SDK calls, add a FastAPI JWT dependency, map the JWT `sub` to an application profile, migrate current accounts deliberately, then remove local password/session tables after the cutover window.

## Sources checked 2026-09-08

- [Supabase Auth overview](https://supabase.com/docs/guides/auth)
- [Supabase password and recovery flow](https://supabase.com/docs/guides/auth/passwords)
- [Supabase Google provider](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase pricing](https://supabase.com/pricing)
- [Better Auth installation and methods](https://better-auth.com/docs/installation)
- [Better Auth email and recovery](https://better-auth.com/docs/concepts/email)
- [Google Identity Services setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
