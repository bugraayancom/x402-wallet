# Contributing to x402 Wallet Studio

Thank you for your interest in contributing! We welcome contributions from the community.

## Code of Conduct

Be respectful, inclusive, and professional. We're all here to build something great together.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/x402/wallet-studio/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, wallet)

### Suggesting Features

1. Check [existing feature requests](https://github.com/x402/wallet-studio/issues?q=is%3Aissue+label%3Aenhancement)
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Examples or mockups if available

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Run tests (`pnpm test`)
6. Run type check (`pnpm check`)
7. Format code (`pnpm format`)
8. Commit changes (`git commit -m 'Add amazing feature'`)
9. Push to branch (`git push origin feature/amazing-feature`)
10. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/x402/wallet-studio.git
cd wallet-studio

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

### Project Structure

```
x402-wallet-studio/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   └── providers/     # Context providers
│   └── public/            # Static assets
├── server/                # Backend API
│   ├── routes/            # API routes
│   └── index.ts           # Server entry
├── docs/                  # Documentation
└── tests/                 # Test files
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type
- Use strict mode

### React

- Use functional components
- Use hooks for state management
- Keep components small and focused
- Extract reusable logic into custom hooks

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useWallet.ts`)
- **Utils**: camelCase (`formatAddress.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_GAS_LIMIT`)
- **Types/Interfaces**: PascalCase (`TransactionData`)

### Code Style

We use Prettier for formatting. Run `pnpm format` before committing.

Key guidelines:
- 2 spaces indentation
- Single quotes for strings
- Semicolons
- Trailing commas
- Max line length: 100

### Comments

- Write self-documenting code
- Add comments for complex logic
- Document public APIs with JSDoc
- TODO comments should reference an issue

Example:
```typescript
/**
 * Calculate gas fee for a transaction
 * @param gasLimit - Gas limit for the transaction
 * @param gasPrice - Current gas price in gwei
 * @returns Total gas fee in ETH
 */
export function calculateGasFee(gasLimit: bigint, gasPrice: bigint): string {
  // Implementation
}
```

## Testing

### Writing Tests

- Write tests for new features
- Update tests for changed features
- Aim for >80% code coverage
- Test edge cases and error conditions

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../module';

describe('functionToTest', () => {
  it('should handle valid input', () => {
    const result = functionToTest('valid');
    expect(result).toBe(expected);
  });

  it('should throw on invalid input', () => {
    expect(() => functionToTest('invalid')).toThrow();
  });
});
```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

Example: `feature/add-transaction-history`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(wallet): add multi-wallet support
fix(transaction): handle pending transactions correctly
docs(api): update API documentation
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log() or debugger statements
- [ ] Type check passes
- [ ] PR description explains changes

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots
If applicable

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex code
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass
```

## Review Process

1. Automated checks run (tests, lint, type check)
2. Code review by maintainers
3. Requested changes (if any)
4. Approval
5. Merge

## Community

- **Discord**: https://discord.gg/x402
- **Twitter**: https://twitter.com/x402protocol
- **GitHub Discussions**: https://github.com/x402/wallet-studio/discussions

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Invited to contributor Discord channel

## Questions?

Feel free to ask questions in:
- GitHub Discussions
- Discord #development channel
- Email: dev@x402.org

---

**Thank you for contributing to x402 Wallet Studio!**
