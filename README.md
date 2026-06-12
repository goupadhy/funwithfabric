# 🧵 Fun With Fabric

A community static web app for fabric samples and useful textile resources.

## 🌐 Live Site

Visit the live site on GitHub Pages: **[Fun With Fabric](https://goupadhy.github.io/funwithfabric/)**

## ✨ Features

- **Fabric Samples Gallery** – Browse a curated collection of fabric samples with details on type, weight, color, common uses, and tags.
- **Search & Filter** – Instantly search across all fabric attributes or filter by fabric type (Cotton, Linen, Silk, Wool, Knit, Velvet, Synthetic).
- **Useful Resources** – Curated links to guides, tools, forums, and references for sewists of all skill levels, filterable by category.
- **Contribute Section** – Links to submit suggestions via GitHub Issues.
- **Responsive Design** – Works great on desktop, tablet, and mobile.
- **Accessible** – Semantic HTML, ARIA labels, keyboard navigable, skip link.

## 🗂️ Project Structure

```
funwithfabric/
├── index.html      # Main HTML page
├── styles.css      # All styles
├── script.js       # Search, filter, and interactivity
├── data.js         # Fabric samples and resources data
└── _config.yml     # GitHub Pages configuration
```

## 🚀 Run locally

This repository is static content, so you can run it with a simple local web server:

```bash
python3 -m http.server 8000
```

Then open http://127.0.0.1:8000/.

## 🤝 Contributing

Contributions are welcome! To add a fabric sample or resource:

1. Fork the repository
2. Edit `data.js` to add your fabric sample or resource entry
3. Open a pull request

Or [open an issue](https://github.com/goupadhy/funwithfabric/issues/new) to suggest a fabric or resource without code.

## 📄 License

Open source. See [LICENSE](LICENSE) if present.
