# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 🛠️ Development & Tooling Log

This project was built and coded by hand. During the development process, an AI assistant was used as a sounding board to help debug edge cases and accelerate minor feature implementations.

### Where AI assistance was used:
* **Layout Adjustment:** Helped refine the responsive grid system to ensure the card container scales cleanly on ultra-wide desktop monitors.
* **Hardware Controls:** Assisted in formatting the immediate microphone cutoff sequence (`stopVoiceRecording`) to handle browser-specific speech timeouts.
* **Camera Input:** Helped tweak the file picker attributes so the photo upload accepts both local files and mobile camera captures smoothly.
