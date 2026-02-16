# Contributing to Solana Address Tracker

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Error messages or logs

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### TypeScript Guidelines

```typescript
// Good
interface AddressAnalysis {
  address: string;
  totalReceived: number;
  totalSent: number;
}

// Bad
interface Data {
  addr: string;
  tr: number;
  ts: number;
}
```

### Error Handling

```typescript
// Always handle errors gracefully
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  // Provide fallback or rethrow with context
  throw new Error(`Failed to complete operation: ${error.message}`);
}
```

### Async/Await

```typescript
// Prefer async/await over promises
async function fetchData() {
  const data = await api.getData();
  return processData(data);
}
```

## 🧪 Testing

### Before Submitting

1. Test your changes with multiple addresses
2. Test with different depth levels (2, 3, 5)
3. Verify CSV and Markdown output
4. Check for TypeScript errors: `npm run type-check`
5. Ensure no console errors

### Test Cases

```bash
# Test with depth 2
npx tsx src/scripts/kyt-audit-single-address.ts <ADDRESS> 2

# Test with depth 5
npx tsx src/scripts/kyt-audit-single-address.ts <ADDRESS> 5

# Test with inactive address
npx tsx src/scripts/kyt-audit-single-address.ts <INACTIVE_ADDRESS> 3
```

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Analyzes a Solana address and its transaction network
 * @param address - The target Solana address to analyze
 * @param maxDepth - Maximum depth level for recursive analysis (1-5)
 * @returns Promise that resolves when analysis is complete
 */
async function analyzeAddress(address: string, maxDepth: number): Promise<void> {
  // Implementation
}
```

### README Updates

- Update README.md if adding new features
- Add examples for new functionality
- Update configuration section if needed

## 🔧 Project Structure

```
src/
├── scripts/          # Executable scripts
├── services/         # API integrations
└── types/            # TypeScript type definitions
```

### Adding New Scripts

1. Create in `src/scripts/`
2. Follow naming convention: `kebab-case.ts`
3. Add usage documentation
4. Update README.md

### Adding New Services

1. Create in `src/services/`
2. Use class-based structure
3. Add error handling
4. Document public methods

## 🎯 Priority Areas

### High Priority

- [ ] Improve error messages
- [ ] Add more pattern detection
- [ ] Optimize performance
- [ ] Add unit tests

### Medium Priority

- [ ] Token transfer analysis
- [ ] NFT tracking
- [ ] Web UI
- [ ] API endpoints

### Low Priority

- [ ] Additional export formats
- [ ] Custom themes
- [ ] Plugins system

## 🚀 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG_PUBLIC_VERSION.md`
3. Create git tag
4. Push to main branch
5. Create GitHub release

## 📋 Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style
- [ ] TypeScript compiles without errors
- [ ] Tested with multiple addresses
- [ ] Documentation updated
- [ ] No sensitive data in commits
- [ ] Commit messages are clear
- [ ] PR description explains changes

## 💡 Tips

### Performance

- Use async/await for API calls
- Implement rate limiting
- Cache results when possible
- Limit recursive depth

### Security

- Never commit API keys
- Validate user input
- Handle errors gracefully
- Use environment variables

### Code Quality

- Keep functions under 50 lines
- Use descriptive names
- Add comments for complex logic
- Follow DRY principle

## 🐛 Debugging

### Common Issues

**"Missing HELIUS_API_KEY"**
- Check `.env` file exists
- Verify API key format

**"Rate limit exceeded"**
- Add delays between requests
- Reduce depth level

**TypeScript errors**
- Run `npm run type-check`
- Check type definitions

## 📞 Getting Help

- Open an issue for questions
- Check existing documentation
- Review example code
- Ask in discussions

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Solana Address Tracker! 🎉
