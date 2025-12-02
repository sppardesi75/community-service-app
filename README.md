# Community Service Centralization Platform

### 🔴 Live Demo
**View the live application here:** [https://community-service-app.vercel.app](https://community-service-app.vercel.app)  
**📂 Source Code:** [https://github.com/sppardesi75/community-service-app](https://github.com/sppardesi75/community-service-app)

---

### 🔐 Demo Credentials
Recruiters and visitors can explore the platform using these pre-configured demo accounts to test specific permission levels:

| Role | Email | Password | Capability |
| :--- | :--- | :--- | :--- |
| **Admin** | `admindemo@gmail.com` | `Admin@123` | Full system oversight, user management, and analytics. |
| **Clerk** | `clerkdemo@gmail.com` | `Admin@123` | Manage assigned tickets and update resolution status. |
| **User** | `userdemo@gmail.com` | `Admin@123` | Submit service requests and track personal ticket history. |

---

### 📖 Project Overview
The **Community Service Centralization Platform** is a full-stack web application designed to streamline the reporting and resolution of municipal issues (e.g., maintenance requests, waste management). It replaces fragmented reporting channels with a **unified data pipeline**, ensuring that citizen requests are tracked, assigned, and resolved efficiently.

The system features a robust **Role-Based Access Control (RBAC)** architecture, ensuring data security and providing custom dashboards for Administrators, Clerks, and Citizens.

### 🛠 Technical Architecture
* **Frontend:** React.js, Next.js (Deployed on Vercel)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Cloud-hosted NoSQL)
* **Authentication:** JWT (JSON Web Tokens) & Custom Middleware
* **Data Visualization:** Real-time status tracking and filtering

### 🚀 Key Features

#### 🔐 Security & Access Control (RBAC)
* Implemented secure authentication middleware to enforce strict permission boundaries between roles.
* **Admin Dashboard:** Provides a high-level view of all system activities, user management, and ticket assignment.
* **Clerk Interface:** Specialized view for updating ticket status (Pending → In Progress → Resolved) without access to sensitive administrative settings.

#### 📊 Data Integration & Workflow
* **Unified Data Ingestion:** Centralizes unstructured inputs from various users into a structured MongoDB schema.
* **Real-Time Status Pipeline:** Updates made by Clerks are instantly reflected on the User's dashboard, ensuring transparency.
* **Automated Validation:** Backend logic validates input data to prevent SQL injection and ensure database integrity.

### 💻 Development Highlights
* Designed a scalable **schema architecture** in MongoDB to handle complex relationships between Users, Tickets, and Resolutions.
* Built **RESTful APIs** to handle CRUD operations, optimized for low-latency response times.
* Deployed via **CI/CD pipelines** on Vercel for continuous integration and immediate updates.