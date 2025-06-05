# Create necessary directories if they don't exist
$directories = @(
    "src/components/common",
    "src/components/features",
    "src/components/ui",
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
    @{
        Source = "src/app/(components)/Button.tsx"
        Destination = "src/components/ui/Button.tsx"
    },
    @{
        Source = "src/app/(components)/BrickLoader.tsx"
        Destination = "src/components/ui/BrickLoader.tsx"
    },
    @{
        Source = "src/app/(components)/DefaultPageBanner.tsx"
        Destination = "src/components/ui/DefaultPageBanner.tsx"
    },
    @{
        Source = "src/app/(components)/ProductCard.tsx"
        Destination = "src/components/ui/ProductCard.tsx"
    },
    @{
        Source = "src/app/(components)/ReusableSection.tsx"
        Destination = "src/components/ui/ReusableSection.tsx"
    }
)

# Move common components
$commonComponents = @(
    @{
        Source = "src/app/(components)/Navbar"
        Destination = "src/components/common/Navbar"
    },
    @{
        Source = "src/app/(components)/footer"
        Destination = "src/components/common/footer"
    },
    @{
        Source = "src/app/(components)/chat"
        Destination = "src/components/common/chat"
    }
)

# Move feature components
$featureComponents = @(
    @{
        Source = "src/app/(components)/auth"
        Destination = "src/components/features/auth"
    },
    @{
        Source = "src/app/(components)/build-house"
        Destination = "src/components/features/build-house"
    },
    @{
        Source = "src/app/(components)/cart"
        Destination = "src/components/features/cart"
    },
    @{
        Source = "src/app/(components)/deals"
        Destination = "src/components/features/deals"
    },
    @{
        Source = "src/app/(components)/help"
        Destination = "src/components/features/help"
    },
    @{
        Source = "src/app/(components)/home"
        Destination = "src/components/features/home"
    },
    @{
        Source = "src/app/(components)/product"
        Destination = "src/components/features/product"
    },
    @{
        Source = "src/app/(components)/sections"
        Destination = "src/components/features/sections"
    },
    @{
        Source = "src/app/(components)/store"
        Destination = "src/components/features/store"
    },
    @{
        Source = "src/app/(components)/supplier"
        Destination = "src/components/features/supplier"
    }
)

# Move files
foreach ($component in $uiComponents) {
    if (Test-Path $component.Source) {
        Copy-Item -Path $component.Source -Destination $component.Destination -Force
    }
}

foreach ($component in $commonComponents) {
    if (Test-Path $component.Source) {
        Copy-Item -Path $component.Source -Destination $component.Destination -Recurse -Force
    }
}

foreach ($component in $featureComponents) {
    if (Test-Path $component.Source) {
        Copy-Item -Path $component.Source -Destination $component.Destination -Recurse -Force
    }
}

Write-Host "Files have been moved to their new locations. Please update the imports in each file manually." 