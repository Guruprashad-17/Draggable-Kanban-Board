# Draggable-Kanban-Board

A high-performance, full-stack **MEVN** (MongoDB, Express, Vue 3, Node.js) Kanban application. This project features a unique "Glassmorphism" UI that shifts between a **Dark mode** and a **Light mode** theme based on user preference.

---

##  Key Features

* **Drag-and-Drop Workflow**: Intuitive task management across "To Do", "In Progress", and "Done" states using `vuedraggable`.
* **Clean Architecture**: Separation of concerns achieved by moving styling logic to a dedicated `kanban.css` file.
* **Dynamic Theme Engine**: Smooth 1-second transitions between "Dark mode" and "Light mode" backgrounds.
* **Glassmorphic UI**: Semi-transparent column containers utilizing `backdrop-blur-md` and rim-lighting for high contrast against complex backgrounds.


---

##  Tech Stack

* **Frontend**: Vue 3 (Composition API), Vite, Tailwind CSS.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB via Mongoose ODM.
* **API**: RESTful architecture with Axios communication.

---

##  Setup Instructions

### 1. Prerequisites
* **Node.js** (v16+) installed on your machine.
* **MongoDB** running locally at `mongodb://127.0.0.1:27017`.

### 2. Backend Setup
The backend serves as the bridge between the UI and your data.
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### Frontend Setup
The frontend handles the reactive UI and theme transitions.
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

# The application will launch at http://localhost:5173.
