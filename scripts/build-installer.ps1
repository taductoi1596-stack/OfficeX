param(
    [string]$Target = "win"
)

Write-Host "Building OfficeX Installer for $Target..."
Write-Host "Make sure you have run 'pnpm build' in apps/desktop first!"

if ($Target -eq "win") {
    pnpm --filter @officex/desktop exec electron-builder --win --x64
} elseif ($Target -eq "mac") {
    pnpm --filter @officex/desktop exec electron-builder --mac --x64
} else {
    Write-Host "Unknown target: $Target"
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Installer built successfully!"
} else {
    Write-Host "Build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}
