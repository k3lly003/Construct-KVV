# New Project Structure

## Directory Structure

```
src/
├── app/                    # Next.js app directory (keep as is)
├── components/            # Shared components
│   ├── common/           # Truly reusable components
│   │   ├── Navbar/      # Navigation components
│   │   ├── footer/      # Footer components
│   │   └── chat/        # Chat components
│   ├── features/         # Feature-specific components
│   │   ├── auth/        # Authentication components
│   │   ├── build-house/ # Build house components
│   │   ├── cart/        # Cart components
│   │   ├── deals/       # Deals components
│   │   ├── help/        # Help components
│   │   ├── home/        # Home components
│   │   ├── product/     # Product components
│   │   ├── sections/    # Section components
│   │   ├── store/       # Store components
│   │   └── supplier/    # Supplier components
│   └── ui/              # UI components
│       ├── Button.tsx
│       ├── BrickLoader.tsx
│       ├── DefaultPageBanner.tsx
│       ├── ProductCard.tsx
│       └── ReusableSection.tsx
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and configurations
├── services/           # API services and external integrations
├── store/              # State management (keep existing)
├── styles/             # Global styles and themes
│   └── globals.css
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

## File Movement Instructions

1. UI Components:
   - Move from `src/app/(components)/` to `src/components/ui/`:
     - Button.tsx
     - BrickLoader.tsx
     - DefaultPageBanner.tsx
     - ProductCard.tsx
     - ReusableSection.tsx

2. Common Components:
   - Move from `src/app/(components)/` to `src/components/common/`:
     - Navbar/
     - footer/
     - chat/

3. Feature Components:
   - Move from `src/app/(components)/` to `src/components/features/`:
     - auth/
     - build-house/
     - cart/
     - deals/
     - help/
     - home/
     - product/
     - sections/
     - store/
     - supplier/

4. Styles:
   - Move from `src/app/globals.css` to `src/styles/globals.css`

5. Utils:
   - Move from `src/app/utils/` to `src/utils/`

## Benefits of New Structure

1. Better Organization:
   - Clear separation between UI, feature, and common components
   - Easier to find and maintain code
   - Better scalability for future features

2. Improved Maintainability:
   - Each feature has its own dedicated space
   - Common components are easily accessible
   - UI components are centralized

3. Better Development Experience:
   - Clearer dependencies between modules
   - Easier to implement new features
   - Better code organization for team collaboration

4. Scalability:
   - Easy to add new features
   - Clear structure for new components
   - Better separation of concerns

## Next Steps

1. Create the new directory structure
2. Move files to their new locations
3. Update imports in all files to reflect new paths
4. Test the application to ensure everything works
5. Update documentation to reflect new structure 