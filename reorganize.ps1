# Create new directories if they don't exist
$directories = @(
    "src/components/common",
    "src/components/features",
    "src/hooks",
    "src/services",
    "src/styles",
    "src/types",
    "src/utils"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

# Move UI components
$uiComponents = @(
    "src/app/(components)/Button.tsx",
    "src/app/(components)/BrickLoader.tsx",
    "src/app/(components)/DefaultPageBanner.tsx",
    "src/app/(components)/ProductCard.tsx",
    "src/app/(components)/ReusableSection.tsx"
)

foreach ($component in $uiComponents) {
    if (Test-Path $component) {
        Copy-Item -Path $component -Destination "src/components/ui/" -Force
    }
}

# Move feature components
$featureComponents = @(
    "src/app/(components)/auth",
    "src/app/(components)/build-house",
    "src/app/(components)/cart",
    "src/app/(components)/deals",
    "src/app/(components)/help",
    "src/app/(components)/home",
    "src/app/(components)/product",
    "src/app/(components)/sections",
    "src/app/(components)/store",
    "src/app/(components)/supplier"
)

foreach ($component in $featureComponents) {
    if (Test-Path $component) {
        Copy-Item -Path $component -Destination "src/components/features/" -Recurse -Force
    }
}

# Move common components
$commonComponents = @(
    "src/app/(components)/Navbar",
    "src/app/(components)/footer",
    "src/app/(components)/chat"
)

foreach ($component in $commonComponents) {
    if (Test-Path $component) {
        Copy-Item -Path $component -Destination "src/components/common/" -Recurse -Force
    }
}

# Move styles
if (Test-Path "src/app/globals.css") {
    Copy-Item -Path "src/app/globals.css" -Destination "src/styles/" -Force
}

# Move utils
if (Test-Path "src/app/utils") {
    Copy-Item -Path "src/app/utils/*" -Destination "src/utils/" -Recurse -Force
}

Write-Host "Reorganization completed successfully!" 