# Network Dashboard POC

<p align='center'>
  <img src='public/favicon.svg' alt='Network Dashboard POC' width='200'/>
</p>

<p align='center'>
Visualizing network domains and services with <b>Network Dashboard</b><sup><em>(monitoring)</em></sup><br>
</p>

<br>

## Features

- ⚡️ [React 18](https://beta.reactjs.org/)
- 🦾 TypeScript for type safety
- 📊 [D3.js](https://d3js.org/) for advanced network visualizations
- 🔄 [Redux](https://redux.js.org/) for state management
- 🎨 [Tailwind](https://tailwindcss.com/) with Styled Components + SCSS
- 👑 [Atomic Design organization](https://bradfrost.com/blog/post/atomic-web-design/)
- 🗂 Relative imports for clean code organization
- 😃 [Hero icons](https://heroicons.com/) for UI elements
- 🔄 [JSON-Server](https://github.com/typicode/json-server) for mock API endpoints

## Tech Stack

The Network Dashboard POC is built using the following technologies:

### Frontend
- **Framework**: React.js with TypeScript
- **Visualization Library**: D3.js for all network and chart visualizations
- **State Management**: Redux for application state
- **Styling**: 
  - TailwindCSS for utility-first styling
  - Styled Components with SCSS for component-specific styling

### Backend
- **API Layer**: Mock API with static JSON data
- **Data Format**: JSON for all data exchange
- **Data Source**: Static JSON files representing domain and service data
- **Mock Service**: JSON-Server for simulating API endpoints locally

## Domain Architecture

The network is organized into logical domains to group related services and infrastructure:

- User Access Domain
- Application Domain
- Infrastructure Domain
- Security Domain

## Getting Started

### Clone to local

```bash
git clone [repository-url] network-dashboard-poc
cd network-dashboard-poc
yarn # If you don't have yarn installed, run: npm install -g yarn
```

### Development

Run the development server and mock API:

```bash
# Start the development server
yarn dev

# In a separate terminal, start the mock API
yarn mock-api
```

Then visit http://localhost:3000/

### Build

To build the App, run:

```bash
yarn build
```

And you will see the generated files in `dist` ready to be served.

## Project Setup Checklist

- [x] Setup React with TypeScript and Vite
- [x] Configure Tailwind CSS and styling libraries
- [x] Set up D3.js for visualizations
- [x] Configure Redux for state management
- [x] Setup mock API with JSON-Server
- [ ] Implement domain visualization components
- [ ] Create service monitoring dashboards
- [ ] Build network traffic analysis views
- [ ] Develop critical service monitoring widgets