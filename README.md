# � Clipboard Landing Page

A modern, responsive landing page for a clipboard management tool built with HTML5, CSS3, and JavaScript to practice real-world front-end development workflows.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://hoanghuuthanhdev.github.io/clipboard_landing_page)
[![GitHub license](https://img.shields.io/github/license/hoanghuuthanhdev/clipboard_landing_page.svg)](https://github.com/hoanghuuthanhdev/clipboard_landing_page/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/hoanghuuthanhdev/clipboard_landing_page.svg)](https://github.com/hoanghuuthanhdev/clipboard_landing_page/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/hoanghuuthanhdev/clipboard_landing_page.svg)](https://github.com/hoanghuuthanhdev/clipboard_landing_page/network)

![Clipboard Landing Page Preview](./preview.jpg)

## 📖 Table of Contents

- [About](#-about)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Testing](#-testing)
- [Deployment](#️-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## � About

This project is a responsive landing page built to practice real-world front-end development workflows. It showcases a modern clipboard management tool with interactive features, pricing tiers, and customer testimonials. The project demonstrates proficiency in HTML5, CSS3, and JavaScript while following industry best practices for responsive web design and user experience.

**What it solves:**
- Provides a professional template for SaaS landing pages
- Demonstrates modern web development techniques
- Shows responsive design implementation across devices
- Implements interactive UI components and animations

## 🛠 Tech Stack

**Frontend:** HTML5, CSS3, JavaScript (ES6+)
**Styling:** Custom CSS with Flexbox & Grid
**Icons:** SVG icons and custom graphics
**Tools:** Git, VS Code, Browser DevTools
**Deployment:** GitHub Pages

## � Project Structure

```
clipboard-landing-page/
├── design/                # Design mockups and references
│   ├── desktop-design.jpg
│   ├── mobile-design.jpg
│   └── active-states.jpg
├── images/                # Static assets and icons
│   ├── logo.svg
│   ├── bg-header-desktop.png
│   ├── bg-header-mobile.png
│   ├── icon-*.svg         # Feature icons
│   ├── image-*.png        # Product images
│   └── logo-*.png         # Company logos
├── index.html             # Main HTML file
├── index_new.html         # Enhanced version with modern features
├── styles.css             # Main stylesheet
├── script.js              # JavaScript functionality
├── preview.jpg            # Project preview image
├── style-guide.md         # Design system documentation
└── README.md              # Project documentation
```

## ✨ Features

✅ **Responsive layout** - Works seamlessly on desktop, tablet, and mobile devices

✅ **Cross-browser compatibility** - Tested on Chrome, Firefox, Safari, and Edge

✅ **Interactive navigation** - Responsive navbar with mobile hamburger menu

✅ **Modern UI components** - Clean design with smooth animations and transitions

✅ **Pricing tiers** - Multiple subscription plans (Free, Pro, Team)

✅ **Customer testimonials** - Social proof with user reviews and company logos

✅ **FAQ section** - Interactive expandable questions and answers

✅ **Performance optimized** - Fast loading times and efficient code

✅ **Accessibility compliant** - WCAG guidelines with semantic HTML

✅ **SEO friendly** - Proper meta tags and structured content

## � Getting Started

### Prerequisites

- A modern web browser (Chrome >= 90, Firefox >= 88, Safari >= 14)
- Git for version control
- Code editor (VS Code recommended)
- Basic knowledge of HTML, CSS, and JavaScript

### Installation

```bash
# Clone the repository
git clone https://github.com/hoanghuuthanhdev/clipboard_landing_page.git

# Navigate to project directory
cd clipboard_landing_page

# Open with your preferred code editor
code .
```

### Running Locally

```bash
# Option 1: Open directly in browser
# Double-click index.html or right-click → "Open with" → Browser

# Option 2: Use a local server (recommended)
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Your app should now be running at: `http://localhost:8000`

## � Testing

### Manual Testing Checklist

- **Responsive Design**: Test on different screen sizes (mobile, tablet, desktop)
- **Cross-browser**: Verify functionality in Chrome, Firefox, Safari, Edge
- **Navigation**: Check all menu links and smooth scrolling
- **Interactive Elements**: Test buttons, hover effects, and animations
- **Form Validation**: Ensure all forms work correctly
- **Performance**: Check loading times and optimization

```bash
# Run accessibility tests
npx lighthouse-ci autorun

# Check HTML validation
npx html-validate index.html

# CSS validation
npx stylelint "**/*.css"
```

## ☁️ Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment:

```bash
# Build for production (if using build tools)
npm run build

# Deploy to GitHub Pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Alternative Deployment Options

**Netlify:**
1. Connect your GitHub repository
2. Set build command: `npm run build` (if applicable)
3. Set publish directory: `./` or `dist/`

**Vercel:**
```bash
npm i -g vercel
vercel --prod
```

**Manual Deployment:**
Upload files to any web hosting service (shared hosting, VPS, etc.)

## �🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a new branch**
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m "Add: new feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/my-feature
   ```
7. **Open a Pull Request**

### Code Standards

- Use semantic HTML5 elements
- Follow BEM methodology for CSS naming
- Write clean, commented JavaScript
- Ensure responsive design works on all devices
- Test cross-browser compatibility
- Maintain accessibility standards (WCAG 2.1)

### Pull Request Guidelines

- Provide a clear description of changes
- Include screenshots for UI changes
- Test on multiple devices and browsers
- Update documentation if needed
- Keep commits focused and atomic

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 👨‍💻 Author & Contact

**Hoang Huu Thanh**
- 🐙 GitHub: [@hoanghuuthanhdev](https://github.com/hoanghuuthanhdev)
- 📧 Email: hoanghuuthanhdev@gmail.com
- 💼 LinkedIn: [Hoang Huu Thanh](https://www.linkedin.com/in/hoanghuuthanhdev)

## 🙏 Acknowledgments

- Design inspiration from [Frontend Mentor](https://www.frontendmentor.io/)
- Icons and assets from the original design files
- Typography: [Bai Jamjuree](https://fonts.google.com/specimen/Bai+Jamjuree) from Google Fonts

---

<div align="center">
  <p>⭐ If you found this project helpful, please give it a star!</p>
  <p>🚀 Made with passion for learning and development</p>
</div>
