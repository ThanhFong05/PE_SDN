# Package submission script for QE190030
$studentCode = "QE190030"
$outputZip = "$PSScriptRoot\..\$studentCode.zip"
$tempDir = "$env:TEMP\package_$studentCode"

if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

$itemsToCopy = @(
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "next.config.ts",
    "eslint.config.mjs",
    "components.json",
    ".env.example",
    "src",
    "public",
    "prisma"
)

foreach ($item in $itemsToCopy) {
    $source = Join-Path "$PSScriptRoot\.." $item
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $tempDir -Recurse -Force
    }
}

# Remove any accidental .env inside tempDir
Get-ChildItem -Path $tempDir -Filter ".env" -Recurse -Force | Remove-Item -Force

if (Test-Path $outputZip) {
    Remove-Item -Path $outputZip -Force
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $outputZip -Force
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Submission zip created successfully at: $outputZip"
