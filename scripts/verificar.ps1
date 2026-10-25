$ErrorActionPreference = "Stop"
npm run lint; if ($LASTEXITCODE) { throw "Lint" }
npx tsc --noEmit; if ($LASTEXITCODE) { throw "TypeScript" }
gitleaks detect --no-banner; if ($LASTEXITCODE) { throw "Posible secreto" }
Write-Host "verificar: OK"
