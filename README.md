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



##A brief explanation of how you handled data flow between the Vue frontend and Node.js
backend.
  ### Data Flow Architecture: Vue 3 to Node.js

The **Draggable Kanban Board** employs a **Circular Reactive Pattern** to ensure the User Interface (UI) remains synchronized with the Database (MongoDB) in real-time without requiring page refreshes.

### 📡 The Communication Lifecycle

#### 1. Initial State Fetching (Mounting)
When the application first loads, the frontend must populate the board with existing data from the server.
* **Action**: The `onMounted` lifecycle hook in Vue triggers an **Axios GET** request to the `/api/tasks` endpoint.
* **Response**: The Node.js server queries MongoDB via Mongoose and returns an array of task objects.
* **Update**: Vue assigns this data to a reactive `ref`, which immediately renders the cards in their respective columns ("To Do", "In Progress", or "Done").

#### 2. Local UI Update (Optimistic UI)
To provide a lag-free experience, the UI updates before the database confirms the change.
* **Action**: The `vuedraggable` component detects the end of a "drag" event.
* **Reactivity**: Vue’s two-way data binding updates the local array instantly. This gives the user zero-latency feedback, making the interface feel physical and responsive.

#### 3. Asynchronous Persistence (The PATCH Request)
Once the local UI has moved the card, the change is made permanent in the backend.
* **Action**: A function captures the `id` of the moved task and its new `status`.
* **Request**: Axios sends an asynchronous **PATCH** request to the backend.
* **Backend Logic**: Node.js receives the request, identifies the specific document in MongoDB by its ID, and updates the `status` field.

#### 4. Sync Confirmation & Error Handling
The flow includes a validation loop to ensure data "suitability" and reliability.
* **Success**: The server returns a `200 OK` status. No further action is needed as the local state is already updated.
* **Failure**: If the database update fails (e.g., a network error), the frontend catches the error, allowing for a "roll back" of the card to its original position so the UI never misleads the user.

---

###  Data Flow Summary

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Client (View)** | Vue 3 (Composition API) | Captures user drag events and renders reactive state. |
| **Transport** | Axios (HTTP Client) | Transmits JSON payloads between frontend and backend. |
| **Server (Logic)** | Node.js / Express | Validates incoming data and routes it to the database. |
| **Storage (Data)** | MongoDB / Mongoose | Acts as the "Source of Truth" for all task positions. |
