# Gemini Context: 3D Interactive Rubik's Cube

## Project Overview

This project is a 3D interactive Rubik's Cube simulation built to run directly in a web browser. It uses modern JavaScript features (ES Modules) and relies on the Three.js library for 3D rendering and GSAP for smooth animations.

The application is structured in a modular way, separating concerns into different files:

*   **`index.html`**: The main HTML file that defines the user interface, including buttons for interaction and the canvas for the 3D scene. It uses an `importmap` to manage external dependencies.
*   **`style.css`**: Provides the visual styling for the application, featuring a modern, dark theme and a responsive layout.
*   **`js/main.js`**: The main entry point of the application logic. It initializes the scene and the cube, and connects the UI events (button clicks) to the cube's actions.
*   **`js/SceneManager.js`**: Encapsulates the setup of the Three.js scene, camera, renderer, and lighting.
*   **`js/Cube.js`**: The core component of the project. It programmatically constructs the Rubik's Cube from individual smaller cubes ("cubies") and handles the complex logic for rotating the layers.
*   **`js/Config.js`**: A centralized configuration file for constants like colors, animation speeds, and cube dimensions, making it easy to tweak the application's behavior.

## Building and Running

This project does not require a build step. The dependencies (`three`, `gsap`) are loaded directly from a CDN.

To run the project, you need to serve the files using a local web server. Opening the `index.html` file directly from the filesystem (`file:///...`) will likely fail due to browser security restrictions on ES Modules.

**Running with a simple Python server:**

1.  Navigate to the project's root directory in your terminal.
2.  Run one of the following commands:
    *   If you have Python 3: `python -m http.server`
    *   If you have Python 2: `python -m SimpleHTTPServer`
3.  Open your web browser and go to `http://localhost:8000`.

**Running with `npx`:**

1.  Make sure you have Node.js installed.
2.  Navigate to the project's root directory.
3.  Run the command: `npx serve`
4.  Open your web browser to the address provided by the command (usually `http://localhost:3000`).

There are no automated tests included in this project.

## Development Conventions

*   **Modularity**: The code is organized into JavaScript modules (ESM), with each class or component in its own file.
*   **Dependencies**: External libraries are managed via an `importmap` in `index.html`, pointing to CDN URLs. There is no `package.json` file.
*   **Animations**: The GSAP library is used for all animations (cube rotations, camera zoom) to ensure they are smooth and performant.
*   **Configuration**: A dedicated `Config.js` file holds all magic numbers and settings, which is a good practice for maintainability.
*   **Code Style**: The code follows a clean, class-based approach for its main components. There are no explicit linting or formatting rules (`.eslintrc`, `.prettierrc`) defined in the project.
