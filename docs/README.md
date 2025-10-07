# Documentation

Welcome to the Demo-ContactApp documentation. This directory contains comprehensive guides, frameworks, and standards for developing and maintaining this project.

## Documentation Structure

```
docs/
├── README.md                    # This file - documentation index
└── ways-of-work/                # Development frameworks and standards
    ├── README.md                # Ways of work overview
    └── plan/                    # Test planning and QA framework
        ├── README.md            # Comprehensive framework guide
        └── example-epic/        # Example templates
            └── example-feature/
                ├── test-strategy.md
                ├── test-issues-checklist.md
                └── qa-plan.md
```

## Available Documentation

### Ways of Work Frameworks

Location: [`ways-of-work/`](ways-of-work/)

Standardized frameworks and templates for managing development projects with quality and efficiency.

#### Test Planning & Quality Assurance Framework

**Location**: [`ways-of-work/plan/`](ways-of-work/plan/)

A comprehensive framework for test planning and quality assurance based on ISTQB and ISO 25010 standards.

**What's Included**:
- Test strategy development templates
- Test task breakdown and estimation guidelines
- Quality assurance planning and validation
- GitHub issue templates for test tasks
- ISTQB test design techniques
- ISO 25010 quality model assessment
- 7-gate quality framework
- Risk-based testing approach

**Quick Links**:
- [Framework README](ways-of-work/plan/README.md) - Detailed framework documentation
- [Test Strategy Template](ways-of-work/plan/example-epic/example-feature/test-strategy.md)
- [Test Issues Checklist](ways-of-work/plan/example-epic/example-feature/test-issues-checklist.md)
- [QA Plan Template](ways-of-work/plan/example-epic/example-feature/qa-plan.md)

**GitHub Issue Templates**:
- [Test Strategy Issue](.github/ISSUE_TEMPLATE/test-strategy.md)
- [Playwright E2E Test Issue](.github/ISSUE_TEMPLATE/playwright-test.md)
- [Quality Assurance Issue](.github/ISSUE_TEMPLATE/quality-assurance.md)

---

## Quick Start Guides

### For New Team Members

1. **Read the Overview**: Start with [`ways-of-work/README.md`](ways-of-work/README.md) to understand the frameworks
2. **Review Test Planning**: Read [`ways-of-work/plan/README.md`](ways-of-work/plan/README.md) for testing guidelines
3. **Explore Templates**: Check the example feature templates to see how to apply the frameworks
4. **Use Issue Templates**: When creating GitHub issues, use the provided templates in `.github/ISSUE_TEMPLATE/`

### For Planning a New Feature

1. **Create Feature Directory**: 
   ```
   docs/ways-of-work/plan/{epic-name}/{feature-name}/
   ```

2. **Copy Templates**:
   - Copy `test-strategy.md` template
   - Copy `test-issues-checklist.md` template
   - Copy `qa-plan.md` template

3. **Fill Out Templates**: Adapt templates to your specific feature needs

4. **Create GitHub Issues**: Use issue templates to create test tasks

5. **Track Progress**: Monitor quality gates and test coverage throughout development

---

## Key Concepts

### ISTQB Framework
International standard for software testing providing:
- Test process activities
- Test design techniques
- Test types and levels
- Risk-based testing

Learn more: [ISTQB.org](https://www.istqb.org/)

### ISO 25010 Quality Model
Comprehensive software quality model with 8 characteristics:
- Functional Suitability
- Performance Efficiency
- Compatibility
- Usability
- Reliability
- Security
- Maintainability
- Portability

Learn more: [ISO 25010](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)

### Quality Gates
Checkpoints throughout development where quality criteria must be met:
- Requirements Quality
- Design Quality
- Implementation Quality
- Integration Quality
- System Testing Quality
- UAT Quality
- Production Readiness

### Risk-Based Testing
Prioritizing testing efforts based on risk assessment:
- High-risk areas: 100% coverage
- Medium-risk areas: ≥90% coverage
- Low-risk areas: ≥70% coverage

---

## Standards and Guidelines

### Testing Standards
- **Code Coverage**: ≥80% line coverage, ≥90% branch coverage (critical paths)
- **Test Types**: Unit, Integration, E2E, Performance, Security, Accessibility, Regression
- **Automation**: ≥90% test automation coverage
- **Quality Gates**: 100% quality gates passed before release

### Quality Standards
- **ISO 25010**: All applicable quality characteristics validated
- **WCAG**: Accessibility compliance (Level AA minimum)
- **OWASP**: Security best practices
- **Defects**: Zero critical/high severity defects at release

### Documentation Standards
- **Completeness**: All required sections filled
- **Clarity**: Clear, concise, unambiguous
- **Traceability**: Links to related requirements, issues, tests
- **Maintenance**: Keep documentation up-to-date

---

## Tools and Technologies

### Testing Tools
- **E2E Testing**: Playwright
- **Unit Testing**: Jest, Mocha (project-specific)
- **Performance Testing**: As defined in test strategy
- **Security Testing**: OWASP tools, vulnerability scanners
- **Accessibility Testing**: axe-core, WAVE, Lighthouse

### Quality Tools
- **Code Coverage**: Istanbul, NYC
- **Static Analysis**: ESLint, SonarQube
- **CI/CD**: GitHub Actions
- **Project Management**: GitHub Issues and Projects

---

## Contributing to Documentation

### How to Contribute

1. **Identify Improvements**: Find areas where documentation could be better
2. **Create an Issue**: Open a GitHub Issue describing the improvement
3. **Make Changes**: Fork, make changes, test locally
4. **Submit PR**: Create a Pull Request with your improvements
5. **Review**: Participate in the review process

### Documentation Guidelines

- Use clear, simple language
- Include examples where helpful
- Keep formatting consistent
- Update table of contents when adding sections
- Test all links and references
- Follow markdown best practices

---

## Additional Resources

### External Standards
- [ISTQB Testing Standards](https://www.istqb.org/)
- [ISO/IEC 25010 Quality Model](https://iso25000.com/)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

### Testing Resources
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Test Automation Patterns](https://www.selenium.dev/documentation/test_practices/)

---

## Support

### Getting Help

- **Documentation Issues**: Open a GitHub Issue with the `documentation` label
- **Framework Questions**: Consult the QA Lead or Test Architect
- **Process Questions**: Review the Ways of Work documentation
- **Technical Questions**: Check the specific framework README files

### Feedback

We welcome feedback on all documentation:
- Clarity and completeness
- Accuracy and correctness
- Usefulness and applicability
- Suggestions for improvements

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2025-01-07 | Initial documentation structure with Test Planning & QA Framework |

---

## License

This documentation is part of the Demo-ContactApp project and follows the project's license terms.
