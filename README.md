<div align="center">

# 🏥 Hospital Appointment Booking System

A full-stack web application where patients book doctor appointments and admins manage doctors and bookings.

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![AWS DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-4053D6?logo=amazondynamodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)

</div>

---

## 📖 About

**HospitalCare** is a hospital appointment booking system built with **HTML, CSS, Bootstrap 5, JavaScript** on the frontend and **Node.js (core `http` module, no Express)** on the backend, with **AWS DynamoDB** as the database.

The project ships with **Docker support**: one command starts the application together with a local DynamoDB, so no AWS account is needed to try it out.

## ✨ Features

### 👤 Patient
- Register and log in securely
- Browse available doctors with specialization, schedule and fees
- Book an appointment by choosing doctor, date, time and reason
- Double booking protection (the same doctor cannot be booked twice for the same date and time)
- View appointment history and cancel appointments

### 🛠️ Admin
- Log in with the default admin account
- Add, edit and delete doctors
- View all appointments with patient and doctor details
- Dashboard statistics: doctors, patients, appointments and active bookings

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript |
| Backend | Node.js (core `http` module, manual routing and sessions) |
| Database | AWS DynamoDB (DynamoDB Local when running with Docker) |
| SDK | AWS SDK for JavaScript v3 |
| DevOps | Docker, Docker Compose |

## 📁 Project Structure

```text
hospital-appointment-booking/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── hospital-bg.svg
│   │   ├── login-illustration.svg
│   │   └── register-illustration.svg
│   ├── js/
│   │   └── script.js
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
├── db.js                  # DynamoDB access layer (creates tables automatically)
├── server.js              # HTTP server, API routes and sessions
├── wait-for-db.js         # Waits for DynamoDB before starting (Docker)
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .dockerignore
├── .gitignore
└── README.md
```

## 🚀 Quick Start with Docker (recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running (wait for **"Engine running"**)

### Steps

**1. Get the code**

```bash
git clone https://github.com/padmavathi2006/hospital-appointment-booking.git
cd hospital-appointment-booking
```

No Git? Click **Code → Download ZIP** on the [repository page](https://github.com/padmavathi2006/hospital-appointment-booking), extract it and open a terminal inside the extracted folder.

**2. Start the application**

```bash
docker compose up --build
```

The first run downloads the images and can take a few minutes.

**3. Open the app**

👉 **http://localhost:3100**

You should see this line in the logs when it is ready:

```text
Hospital Appointment Booking System is running at http://localhost:3100
```

### What gets started

| Container | Purpose | Port |
| --- | --- | --- |
| `hospital-app` | Node.js application | 3100 |
| `hospital-dynamodb` | DynamoDB Local | 8000 |

Data is stored in the `dynamodb-data` Docker volume, so it survives restarts.

### Useful commands

```bash
docker compose up -d --build   # run in the background
docker compose logs -f app     # follow application logs
docker compose down            # stop (data is kept)
docker compose down -v         # stop and delete all data
```

## 🔑 Default Admin Login

| Field | Value |
| --- | --- |
| Email | `admin@gmail.com` |
| Password | `admin123` |

Patients create their own account from the **Register** page. Select **Admin** or **Patient** in the *Login As* dropdown.

## 💻 Run Without Docker

**Requirements:** Node.js 20 or newer, and a DynamoDB endpoint (real AWS or DynamoDB Local).

```bash
npm install
```

**Windows (PowerShell)**

```powershell
$env:AWS_REGION="us-east-1"
$env:AWS_ACCESS_KEY_ID="your_access_key"
$env:AWS_SECRET_ACCESS_KEY="your_secret_key"
# Only when using DynamoDB Local:
$env:AWS_DYNAMODB_ENDPOINT="http://localhost:8000"
node server.js
```

**Mac / Linux**

```bash
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
# Only when using DynamoDB Local:
export AWS_DYNAMODB_ENDPOINT=http://localhost:8000
node server.js
```

Then open http://localhost:3100.

## ⚙️ Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3100` | Server port |
| `AWS_REGION` | `us-east-1` | AWS region |
| `AWS_ACCESS_KEY_ID` | none | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | none | AWS secret key |
| `AWS_SESSION_TOKEN` | none | Session token (temporary credentials only) |
| `AWS_DYNAMODB_ENDPOINT` | none | Custom endpoint (DynamoDB Local) |
| `DYNAMODB_USERS_TABLE` | `hospital_users` | Users table name |
| `DYNAMODB_DOCTORS_TABLE` | `hospital_doctors` | Doctors table name |
| `DYNAMODB_APPOINTMENTS_TABLE` | `hospital_appointments` | Appointments table name |
| `DYNAMODB_COUNTERS_TABLE` | `hospital_counters` | ID counters table name |

## 🗄️ Database Design

Tables are created automatically on startup, and the default admin and two sample doctors are seeded on first run.

| Table | Purpose | Index |
| --- | --- | --- |
| `hospital_users` | Patients and admin | `emailIndex` (email) |
| `hospital_doctors` | Doctors | none |
| `hospital_appointments` | Appointments | `doctorSlotIndex` (doctor_id, slot_key) |
| `hospital_counters` | Auto-increment IDs | none |

## 🔌 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/session` | Current logged-in user |
| POST | `/api/register` | Register a patient |
| POST | `/api/login` | Log in |
| POST | `/api/logout` | Log out |
| GET | `/api/doctors` | List doctors |
| POST | `/api/doctors` | Add a doctor (admin) |
| PUT | `/api/doctors/:id` | Update a doctor (admin) |
| DELETE | `/api/doctors/:id` | Delete a doctor (admin) |
| GET | `/api/appointments` | List appointments (own for patients, all for admin) |
| POST | `/api/appointments` | Book an appointment |
| DELETE | `/api/appointments/:id` | Cancel an appointment |
| GET | `/api/admin/stats` | Dashboard statistics (admin) |

## 🛟 Troubleshooting

| Problem | Fix |
| --- | --- |
| `docker` is not recognized | Install Docker Desktop, then open a new terminal or restart the PC |
| Cannot connect to the Docker daemon | Open Docker Desktop and wait for "Engine running" |
| Port 3100 or 8000 already in use | Stop the other process, or change the port mapping in `docker-compose.yml` |
| "Could not load credentials" warning | Set the AWS variables (not needed with Docker Compose) |
| "Invalid login credentials" on a fresh run | Check `docker compose logs app` for startup errors, then `docker compose down -v` and `docker compose up --build` |
| Pages do not load after cloning | Make sure the `public` folder exists with `css`, `js` and `images` inside it |
| Code changes not showing | Rebuild with `docker compose up --build` |

## 🔒 Security Notes

This is a learning project. Before any real deployment:

- Passwords are stored in **plain text**. Hash them (for example with bcrypt).
- Sessions are kept in memory and are lost when the server restarts.
- Change the default admin password.
- Never commit real AWS keys. Use IAM roles or a secrets manager.
- Serve the app over HTTPS behind a reverse proxy or load balancer.

## ☁️ Deploying to AWS

- Use an IAM role with DynamoDB permissions instead of access keys.
- Remove `AWS_DYNAMODB_ENDPOINT` and the dummy keys from `docker-compose.yml` to use real DynamoDB.
- The Docker image can run on EC2, ECS or App Runner.

## 🚧 Future Improvements

- Hash passwords with bcrypt
- Store sessions in DynamoDB
- Block booking of past dates
- Email or SMS appointment reminders
- Pagination and search for doctors and appointments

## 👩‍💻 Author

**Padmavathi**
GitHub: [@padmavathi2006](https://github.com/padmavathi2006)
