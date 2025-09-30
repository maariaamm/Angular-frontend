# AngularFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.

# Frontend web app built with angular - [CarSaales](https://carsaales.netlify.app) 

## Features

- User registration and login  
- Create, view, edit, and delete car ads  
- Upload car images  
- Responsive frontend  
- Deployed backend and frontend

---
## Prerequisites

make sure you have the following installed:

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd angular-frontend
```

2. Install dependencies:

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building for Production

To build the project for production:

```bash
ng build
```

## API Connection

The application connects to a RESTful API hosted at `https://u05-restful-api-4.onrender.com`. The API endpoints include:


| HTTP-metod     | Endpoint             | 
|----------------|----------------------|
| **GET**        | `/api/carAds`        |   
| **GET**        | `/api/carAds/:id`    | 
| **POST**       | `/api/carAds`        | 
| **PUT**        | `/api/carAds/:id`    | 
| **DELETE**     | `/api/carAds/:id`    | 

---

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
