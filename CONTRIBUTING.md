# Contributing to Sistem Manajemen Koperasi

Terima kasih telah tertarik untuk berkontribusi pada proyek Sistem Manajemen Koperasi Pasar Padang Pangan! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## 🤝 Code of Conduct

Proyek ini mengadopsi Code of Conduct yang mengharapkan semua peserta untuk:
- Menghormati semua kontributor
- Menggunakan bahasa yang inklusif
- Memberikan feedback yang konstruktif
- Fokus pada apa yang terbaik untuk komunitas

## 🛠️ How to Contribute

### 1. Fork Repository
```bash
# Fork repository ke akun GitHub Anda
# Kemudian clone
git clone https://github.com/your-username/koperasi-management.git
cd koperasi-management
```

### 2. Create Branch
```bash
# Selalu buat branch baru untuk fitur/perbaikan
git checkout -b feature/your-feature-name
# atau
git checkout -b fix/your-fix-name
```

### 3. Make Changes
- Ikuti coding standards yang ada
- Tambahkan tests jika diperlukan
- Update dokumentasi

### 4. Commit Changes
```bash
# Commit dengan pesan yang jelas
git add .
git commit -m "feat: add CSV export functionality"
```

### 5. Push dan Create PR
```bash
git push origin feature/your-feature-name
# Kemudian buat Pull Request di GitHub
```

## 🏗️ Development Setup

### Prerequisites
- Browser modern (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Local server (Python, Node.js, atau PHP)
- Git
- Text editor/IDE

### Setup Environment
```bash
# Clone repository
git clone https://github.com/your-username/koperasi-management.git
cd koperasi-management

# Start local server
python -m http.server 8080

# Akses di browser
open http://localhost:8080
```

### Project Structure
```
koperasi/
├── main.html              # Main application
├── assets/
│   ├── css/style.css       # Styles
│   └── js/
│       ├── app.js          # Main application logic
│       ├── api.js          # API service layer
│       └── config.js       # Configuration
├── docs/                   # Documentation
├── demo-data.js            # Demo data
└── tests/                  # Test files
```

## 📝 Pull Request Process

### 1. Before Submitting
- [ ] Pastikan kode berjalan tanpa error
- [ ] Test di multiple browser
- [ ] Update dokumentasi jika perlu
- [ ] Tambahkan/update tests
- [ ] Ikuti coding standards

### 2. PR Title Format
```
type(scope): description

Examples:
feat(export): add CSV export functionality
fix(dashboard): correct calculation for total kas
docs(readme): update installation instructions
style(ui): improve button spacing
refactor(api): optimize data fetching
```

### 3. PR Description Template
```markdown
## What does this PR do?
Brief description of the changes

## Changes made
- [ ] Added new feature X
- [ ] Fixed bug Y
- [ ] Updated documentation

## Testing
- [ ] Tested locally
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested offline mode

## Screenshots (if applicable)
Add screenshots of UI changes

## Breaking Changes
List any breaking changes

## Additional Notes
Any additional information
```

## 🎨 Coding Standards

### JavaScript
```javascript
// Use ES6+ features
const fetchData = async () => {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Use descriptive variable names
const isUserLoggedIn = checkUserStatus();
const userTransactions = fetchUserTransactions();

// Use consistent formatting
const config = {
    apiUrl: 'http://localhost:3000/api',
    timeout: 5000,
    retries: 3
};
```

### HTML
```html
<!-- Use semantic HTML -->
<main class="main-content">
    <section class="dashboard">
        <h1>Dashboard</h1>
        <article class="summary-cards">
            <!-- Content -->
        </article>
    </section>
</main>

<!-- Use consistent class naming -->
<div class="card summary-card">
    <div class="card-body">
        <h5 class="card-title">Total Kas</h5>
    </div>
</div>
```

### CSS
```css
/* Use consistent naming convention */
.summary-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-card__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
}

/* Use CSS custom properties */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
}
```

## 🧪 Testing Guidelines

### Manual Testing
1. **Functionality Testing**
   - Test all CRUD operations
   - Verify form validations
   - Check error handling

2. **UI/UX Testing**
   - Test responsive design
   - Verify accessibility
   - Check browser compatibility

3. **Performance Testing**
   - Test with large datasets
   - Verify offline mode
   - Check memory usage

### Test Checklist
- [ ] All forms validate correctly
- [ ] Error messages are user-friendly
- [ ] Export functionality works
- [ ] Offline mode functions properly
- [ ] Data persistence works
- [ ] Responsive design on mobile
- [ ] Cross-browser compatibility

## 📚 Documentation

### Code Documentation
```javascript
/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} type - Type of data (neraca, kas, anggota)
 * @returns {string} CSV formatted string
 */
function convertToCSV(data, type) {
    // Implementation
}
```

### Update Documentation
- Update README.md untuk fitur baru
- Tambahkan contoh penggunaan
- Update API documentation
- Tambahkan troubleshooting tips

## 🐛 Issue Reporting

### Bug Reports
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser: Chrome 91.0.4472.124
- OS: Windows 10
- Version: v1.0.0

**Additional Context**
Screenshots, error messages, etc.
```

### Feature Requests
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions considered

**Additional Context**
Mockups, examples, etc.
```

## 🏷️ Types of Contributions

### 🐛 Bug Fixes
- Fix calculation errors
- Resolve UI issues
- Fix browser compatibility
- Improve error handling

### ✨ New Features
- Add new export formats
- Implement new reports
- Add user authentication
- Improve offline capabilities

### 📚 Documentation
- Improve README
- Add code comments
- Create tutorials
- Update API docs

### 🎨 UI/UX Improvements
- Improve responsiveness
- Enhance accessibility
- Better user feedback
- Consistent styling

### ⚡ Performance
- Optimize data processing
- Reduce bundle size
- Improve load times
- Better memory usage

## 🔄 Review Process

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] No console.log statements left
- [ ] Error handling is proper
- [ ] Performance considerations
- [ ] Security considerations
- [ ] Documentation is updated

### Reviewer Guidelines
- Be respectful and constructive
- Explain reasoning for changes
- Suggest alternatives
- Acknowledge good work
- Focus on code, not person

## 🎯 Priority Labels

- **P0**: Critical - Breaks core functionality
- **P1**: High - Important feature/fix
- **P2**: Medium - Nice to have
- **P3**: Low - Future consideration

## 📞 Getting Help

### Communication Channels
- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - General questions and ideas
- Email - Direct contact for sensitive issues

### Resources
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [Bootstrap Documentation](https://getbootstrap.com/docs/) - UI framework
- [JavaScript.info](https://javascript.info/) - JavaScript tutorials

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub releases for major features

## 📅 Release Process

### Versioning
We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Schedule
- Bug fixes: As needed
- Minor releases: Monthly
- Major releases: Quarterly

---

**Thank you for contributing to Sistem Manajemen Koperasi! 🎉**

Your contributions help make this project better for everyone. Every contribution, no matter how small, is appreciated and valued.

Happy coding! 💻✨
