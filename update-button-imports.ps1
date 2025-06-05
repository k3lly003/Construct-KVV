# List of files to update
$files = @(
    "src/app/(components)/shad/ShadDialog.tsx",
    "src/app/(components)/supplier/SupplierCard.tsx",
    "src/app/(components)/shad/DropdownMenuDemo.tsx",
    "src/app/(components)/product/ProductInfo.tsx",
    "src/app/(components)/deals/QuotaModal.tsx",
    "src/app/(components)/build-house/form-summary.tsx",
    "src/app/(components)/build-house/form-steps/step-6-contact.tsx",
    "src/app/(components)/build-house/form-steps/step-5-preferences.tsx",
    "src/app/(components)/build-house/form-steps/step-4-outdoor.tsx",
    "src/app/(components)/build-house/form-steps/step-3-interior.tsx",
    "src/app/(components)/build-house/form-steps/step-2-exterior.tsx",
    "src/app/(components)/build-house/form-steps/step-1-basics.tsx",
    "src/app/(components)/auth/SignupAuth.tsx",
    "src/app/dashboard/shops/page.tsx",
    "src/app/dashboard/products/page.tsx",
    "src/app/dashboard/notifications/page.tsx",
    "src/app/dashboard/categories/page.tsx",
    "src/app/dashboard/(components)/products/create-product-dialog.tsx",
    "src/app/(components)/auth/LoginAuth.tsx",
    "src/app/dashboard/(components)/overview/top-products.tsx",
    "src/components/mode-toggle.tsx",
    "src/components/ui/pagination.tsx",
    "src/components/ui/drag-drop-zone.tsx",
    "src/components/features/supplier/SupplierCard.tsx",
    "src/components/features/product/ProductInfo.tsx",
    "src/components/features/deals/QuotaModal.tsx",
    "src/components/features/auth/LoginAuth.tsx",
    "src/components/features/auth/SignupAuth.tsx",
    "src/components/features/build-house/form-summary.tsx",
    "src/components/features/build-house/form-steps/step-2-exterior.tsx",
    "src/components/features/build-house/form-steps/step-3-interior.tsx",
    "src/components/features/build-house/form-steps/step-6-contact.tsx",
    "src/components/features/build-house/form-steps/step-5-preferences.tsx",
    "src/components/features/build-house/form-steps/step-4-outdoor.tsx",
    "src/components/features/build-house/form-steps/step-1-basics.tsx"
)

# Update each file
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace the import statement
        $content = $content -replace 'import\s+{\s*Button\s*}\s+from\s+["'']\.\.\/\.\.\/\.\.\/components\/ui\/button["'']', 'import { GenericButton } from "@/components/ui/generic-button"'
        $content = $content -replace 'import\s+{\s*Button\s*}\s+from\s+["'']@\/components\/ui\/button["'']', 'import { GenericButton } from "@/components/ui/generic-button"'
        $content = $content -replace 'import\s+{\s*Button\s*}\s+from\s+["'']\.\.\/components\/ui\/button["'']', 'import { GenericButton } from "@/components/ui/generic-button"'
        
        # Replace Button usage with GenericButton
        $content = $content -replace '<Button', '<GenericButton'
        $content = $content -replace '</Button', '</GenericButton'
        
        # Save the changes
        Set-Content -Path $file -Value $content
    }
}

Write-Host "Button imports have been updated to use GenericButton. Please review the changes and update any specific button props as needed." 