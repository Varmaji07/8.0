# 8.0

A full-stack web application with separate `backend` and `frontend` services, deployed on Vercel.

🔗 **Live demo:** [8-0-six.vercel.app](https://8-0-six.vercel.app)

## Project Structure

```
8.0/
├── backend/       # Server-side application code
├── frontend/      # Client-side application code
├── vercel.json    # Vercel deployment configuration
└── srv_lookup.txt
```

## Tech Stack

<!-- Fill in the specific frameworks/languages you used, e.g. -->
- **Frontend:** _e.g. React, Vite_
- **Backend:** _e.g. Node.js, Express_
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js (version X or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Varmaji07/8.0.git
   cd 8.0
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` (and/or `frontend`) directory with the required variables:

```
# example
PORT=5000
DATABASE_URL=
API_KEY=
```

### Running Locally

Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend:
```bash
cd frontend
npm run dev
```

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com) via `vercel.json`.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or issue.

## License

<!-- Add your license here, e.g. MIT -->
