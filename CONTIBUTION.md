# Contributing to Construct-KVV

Thank you for your interest in contributing to Construct-KVV! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Constructive feedback is welcome
- Focus on what is best for the community

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Construct-KVV.git
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/k3lly003/Construct-KVV.git
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

1. Ensure you have all prerequisites installed (Node.js ≥ 16)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with required environment variables
4. Run development server:
   ```bash
   npm run dev
   ```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update documentation in `/docs` if applicable
3. Follow the PR template when creating your pull request
4. Wait for code review and address any requested changes
5. Merge only after receiving approval

## Coding Standards

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Component structure:
  ```typescript
  import { FC } from 'react'
  
  interface ComponentProps {
    // props definition
  }
  
  export const Component: FC<ComponentProps> = ({ props }) => {
    return (
      // JSX
    )
  }
  ```
- Use meaningful variable and function names
- Add comments for complex logic
- Write unit tests for new features

## Commit Messages

Follow conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code restructuring
- `test:` for adding tests
- `chore:` for maintenance

Example:
```
feat: add cart total calculation
```

## Reporting Bugs

Create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## Feature Requests

Create an issue with:
- Clear title and description
- Use case and benefits
- Proposed implementation (optional)
- Any relevant mockups or examples

---

Thank you for contributing to Construct-KVV!