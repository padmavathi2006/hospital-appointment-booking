// This line stores the current page name from the body so one file can support multiple pages.
const currentPage = document.body.dataset.page;
// This line stores the logged-in user details after session loading.
let currentUser = null;
// This line stores the list of doctors for reuse in the dashboard.
let doctorCache = [];
// This line stores the list of appointments for reuse in the dashboard.
let appointmentCache = [];

// This line runs after the HTML page has fully loaded.
document.addEventListener("DOMContentLoaded", () => {
    // This line checks whether the current page is the login page.
    if (currentPage === "login") {
        // This line starts the login page behavior.
        setupLoginPage();
    }

    // This line checks whether the current page is the register page.
    if (currentPage === "register") {
        // This line starts the register page behavior.
        setupRegisterPage();
    }

    // This line checks whether the current page is the dashboard page.
    if (currentPage === "dashboard") {
        // This line starts the dashboard page behavior.
        setupDashboardPage();
    }
});

// This line sends a request to the backend API using fetch and JSON.
async function apiRequest(url, method = "GET", data = null) {
    // This line creates the basic fetch options object.
    const options = {
        // This line sets the HTTP method such as GET, POST, PUT or DELETE.
        method: method,
        // This line sends JSON headers so the backend knows the body format.
        headers: {
            "Content-Type": "application/json",
        },
    };

    // This line checks whether request data exists.
    if (data) {
        // This line converts the JavaScript object into JSON text for the request body.
        options.body = JSON.stringify(data);
    }

    // This line sends the request to the backend and waits for the response.
    const response = await fetch(url, options);
    // This line converts the response body into a JavaScript object.
    const result = await response.json();
    // This line attaches the HTTP success state to the result for easier handling.
    result.ok = response.ok;
    // This line returns the final result object.
    return result;
}

// This line shows an alert message inside a chosen message box.
function showMessage(elementId, message, type) {
    // This line selects the message box by its ID.
    const box = document.getElementById(elementId);

    // This line stops if the target message box is missing.
    if (!box) {
        // This line exits the function safely.
        return;
    }

    // This line removes the hidden class so the message becomes visible.
    box.classList.remove("d-none", "alert-success", "alert-danger", "alert-warning", "alert-info");
    // This line adds the Bootstrap alert style based on the chosen type.
    box.classList.add(`alert-${type}`);
    // This line sets the message text inside the alert box.
    box.textContent = message;
}

// This line hides an alert message box if it exists.
function hideMessage(elementId) {
    // This line selects the message box by its ID.
    const box = document.getElementById(elementId);

    // This line stops if the target message box is missing.
    if (!box) {
        // This line exits the function safely.
        return;
    }

    // This line adds the hidden class so the message disappears.
    box.classList.add("d-none");
    // This line clears the existing message text.
    box.textContent = "";
}

// This line checks whether a name contains only alphabets and spaces.
function isValidName(name) {
    // This line uses a regular expression to validate the name format.
    return /^[A-Za-z ]+$/.test(name.trim());
}

// This line checks whether an email has a valid basic format.
function isValidEmail(email) {
    // This line uses a regular expression to validate the email format.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// This line checks whether a mobile number has exactly 10 digits.
function isValidMobile(mobile) {
    // This line uses a regular expression to validate the mobile number format.
    return /^\d{10}$/.test(mobile.trim());
}

// This line loads the current session user from the backend.
async function getSessionUser() {
    // This line requests the current session from the backend API.
    const result = await apiRequest("/api/session");
    // This line returns the user object or null if there is no active session.
    return result.user || null;
}

// This line creates the login page behavior.
function setupLoginPage() {
    // This line selects the login form.
    const form = document.getElementById("loginForm");

    // This line stops if the login form is not found.
    if (!form) {
        // This line exits the function safely.
        return;
    }

    // This line attaches a submit event to the login form.
    form.addEventListener("submit", async (event) => {
        // This line stops the browser from reloading the page during form submit.
        event.preventDefault();
        // This line hides any old login message.
        hideMessage("loginMessage");

        // This line reads the selected role from the form.
        const role = document.getElementById("loginRole").value;
        // This line reads the email value from the form.
        const email = document.getElementById("loginEmail").value;
        // This line reads the password value from the form.
        const password = document.getElementById("loginPassword").value;

        // This line checks that the email field is not empty.
        if (!email.trim()) {
            // This line shows an error for a missing email field.
            showMessage("loginMessage", "Email is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks that the email format is valid.
        if (!isValidEmail(email)) {
            // This line shows an error for invalid email format.
            showMessage("loginMessage", "Enter a valid email address.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks that the password field is not empty.
        if (!password.trim()) {
            // This line shows an error for a missing password field.
            showMessage("loginMessage", "Password is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line sends the login request to the backend.
        const result = await apiRequest("/api/login", "POST", { role, email, password });

        // This line checks whether the login request failed.
        if (!result.ok) {
            // This line shows the backend error message.
            showMessage("loginMessage", result.message, "danger");
            // This line stops after showing the error.
            return;
        }

        // This line shows a success login message.
        showMessage("loginMessage", result.message, "success");
        // This line redirects the user to the dashboard after a short delay.
        setTimeout(() => {
            // This line changes the browser location to the dashboard.
            window.location.href = "/dashboard";
        }, 800);
    });
}

// This line creates the register page behavior.
function setupRegisterPage() {
    // This line selects the registration form.
    const form = document.getElementById("registerForm");

    // This line stops if the registration form is not found.
    if (!form) {
        // This line exits the function safely.
        return;
    }

    // This line attaches a submit event to the registration form.
    form.addEventListener("submit", async (event) => {
        // This line stops the browser from reloading the page during form submit.
        event.preventDefault();
        // This line hides any old registration message.
        hideMessage("registerMessage");

        // This line reads the full name from the form.
        const full_name = document.getElementById("registerName").value;
        // This line reads the email from the form.
        const email = document.getElementById("registerEmail").value;
        // This line reads the mobile number from the form.
        const mobile = document.getElementById("registerMobile").value;
        // This line reads the password from the form.
        const password = document.getElementById("registerPassword").value;

        // This line checks whether the name field is empty.
        if (!full_name.trim()) {
            // This line shows a missing name error.
            showMessage("registerMessage", "Name is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether the name contains only alphabets and spaces.
        if (!isValidName(full_name)) {
            // This line shows an invalid name error.
            showMessage("registerMessage", "Name must contain alphabets only.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether the email field is empty.
        if (!email.trim()) {
            // This line shows a missing email error.
            showMessage("registerMessage", "Email is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether the email format is valid.
        if (!isValidEmail(email)) {
            // This line shows an invalid email error.
            showMessage("registerMessage", "Enter a valid email address.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether the mobile number format is valid.
        if (!isValidMobile(mobile)) {
            // This line shows an invalid mobile number error.
            showMessage("registerMessage", "Mobile number must be exactly 10 digits.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether the password length is at least 6 characters.
        if (password.length < 6) {
            // This line shows an invalid password error.
            showMessage("registerMessage", "Password must be at least 6 characters.", "danger");
            // This line stops further processing.
            return;
        }

        // This line sends the registration data to the backend.
        const result = await apiRequest("/api/register", "POST", { full_name, email, mobile, password });

        // This line checks whether the registration request failed.
        if (!result.ok) {
            // This line shows the backend error message.
            showMessage("registerMessage", result.message, "danger");
            // This line stops further processing.
            return;
        }

        // This line shows the backend success message.
        showMessage("registerMessage", result.message, "success");
        // This line shows a browser popup alert so the user gets immediate confirmation after account creation.
        window.alert("User created successfully. Please log in with your new account.");
        // This line resets the form after successful registration.
        form.reset();
        // This line redirects the user to the login page after a short delay.
        setTimeout(() => {
            // This line changes the browser location to the login page.
            window.location.href = "/login";
        }, 1000);
    });
}

// This line creates the dashboard page behavior.
async function setupDashboardPage() {
    // This line loads the session user from the backend.
    currentUser = await getSessionUser();

    // This line checks whether no user is logged in.
    if (!currentUser) {
        // This line redirects guests to the login page.
        window.location.href = "/login";
        // This line stops dashboard loading for guests.
        return;
    }

    // This line shows the current user name and role in the badge.
    document.getElementById("dashboardUserBadge").textContent = `${currentUser.full_name} (${currentUser.role})`;
    // This line updates the main dashboard heading using the current role.
    document.getElementById("dashboardHeading").textContent = currentUser.role === "admin" ? "Admin Dashboard" : "Patient Dashboard";
    // This line updates the dashboard subheading text.
    document.getElementById("dashboardSubheading").textContent = currentUser.role === "admin"
        ? "Manage doctors, monitor appointments and review reports."
        : "Browse doctors, book appointments and track your history.";
    // This line updates the profile summary card with the role.
    document.getElementById("profileRole").textContent = currentUser.role;

    // This line connects the logout button to the logout function.
    document.getElementById("logoutButton").addEventListener("click", logoutUser);

    // This line checks whether the current user is an admin.
    if (currentUser.role === "admin") {
        // This line shows all admin-only sections.
        document.querySelectorAll(".admin-only").forEach((section) => section.classList.remove("d-none"));
        // This line sets the admin appointment table title.
        document.getElementById("appointmentsTableTitle").textContent = "All Appointments";
        // This line loads admin statistics from the backend.
        await loadAdminStats();
        // This line connects the doctor form submit behavior.
        setupDoctorForm();
    } else {
        // This line shows all patient-only sections.
        document.querySelectorAll(".patient-only").forEach((section) => section.classList.remove("d-none"));
        // This line connects the appointment booking form submit behavior.
        setupAppointmentForm();
    }

    // This line loads the latest doctors and appointments after the role setup is complete.
    await refreshDashboardData();
}

// This line logs the user out from the dashboard.
async function logoutUser() {
    // This line sends the logout request to the backend.
    const result = await apiRequest("/api/logout", "POST");

    // This line checks whether logout was successful.
    if (result.ok) {
        // This line redirects the user to the login page after logout.
        window.location.href = "/login";
    }
}

// This line refreshes all dashboard data together.
async function refreshDashboardData() {
    // This line loads doctors from the backend.
    await loadDoctors();
    // This line loads appointments from the backend.
    await loadAppointments();
}

// This line loads doctors from the backend and updates the UI.
async function loadDoctors() {
    // This line requests the doctor list from the backend.
    const result = await apiRequest("/api/doctors");

    // This line checks whether the request failed.
    if (!result.ok) {
        // This line shows the backend error message in the dashboard.
        showMessage("dashboardMessage", result.message, "danger");
        // This line stops further processing.
        return;
    }

    // This line stores the doctor list in local memory.
    doctorCache = result.doctors;
    // This line updates the doctors count summary card.
    document.getElementById("doctorsCount").textContent = doctorCache.length;
    // This line renders the doctor cards on the page.
    renderDoctors();
    // This line fills the doctor dropdown for patient booking.
    populateDoctorDropdown();
}

// This line renders doctor cards in the doctor list area.
function renderDoctors() {
    // This line selects the doctor list container.
    const container = document.getElementById("doctorList");
    // This line clears any previous doctor cards.
    container.innerHTML = "";

    // This line checks whether no doctors are available.
    if (doctorCache.length === 0) {
        // This line inserts a message card when no doctors exist.
        container.innerHTML = `<div class="col-12"><div class="alert alert-warning mb-0">No doctors available right now.</div></div>`;
        // This line stops further processing.
        return;
    }

    // This line loops through each doctor in the list.
    doctorCache.forEach((doctor) => {
        // This line creates the action buttons only for admin users.
        const adminButtons = currentUser.role === "admin"
            ? `
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="editDoctorById(${doctor.id})"><i class="fa-solid fa-pen-to-square me-1"></i>Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDoctor(${doctor.id})"><i class="fa-solid fa-trash me-1"></i>Delete</button>
                </div>
              `
            : "";

        // This line adds one doctor card to the container.
        container.innerHTML += `
            <div class="col-md-6">
                <div class="card doctor-card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="fw-bold mb-2">${doctor.doctor_name}</h5>
                        <p class="text-muted mb-2">${doctor.specialization}</p>
                        <div class="d-flex flex-wrap gap-2 mb-3">
                            <span class="doctor-pill"><i class="fa-regular fa-clock me-1"></i>${doctor.schedule}</span>
                            <span class="doctor-pill"><i class="fa-solid fa-indian-rupee-sign me-1"></i>${doctor.fees}</span>
                        </div>
                        ${adminButtons}
                    </div>
                </div>
            </div>
        `;
    });
}

// This line fills the doctor dropdown used by patients while booking an appointment.
function populateDoctorDropdown() {
    // This line selects the doctor dropdown field.
    const dropdown = document.getElementById("appointmentDoctor");

    // This line stops if the dropdown is not present on the current page.
    if (!dropdown) {
        // This line exits the function safely.
        return;
    }

    // This line resets the dropdown with a default option.
    dropdown.innerHTML = `<option value="">Select Doctor</option>`;

    // This line loops through each doctor and adds an option element.
    doctorCache.forEach((doctor) => {
        // This line adds the doctor option with name and specialization.
        dropdown.innerHTML += `<option value="${doctor.id}">${doctor.doctor_name} - ${doctor.specialization}</option>`;
    });
}

// This line loads appointments from the backend and updates the table.
async function loadAppointments() {
    // This line requests the appointments list from the backend.
    const result = await apiRequest("/api/appointments");

    // This line checks whether the request failed.
    if (!result.ok) {
        // This line shows the backend error message in the dashboard.
        showMessage("dashboardMessage", result.message, "danger");
        // This line stops further processing.
        return;
    }

    // This line stores the appointment list in local memory.
    appointmentCache = result.appointments;
    // This line updates the appointments count summary card.
    document.getElementById("appointmentsCount").textContent = appointmentCache.length;
    // This line renders the appointments table.
    renderAppointments();
}

// This line creates the HTML for an appointment status badge.
function createStatusBadge(status) {
    // This line converts the status text to lowercase for class naming.
    const normalizedStatus = status.toLowerCase();
    // This line returns the styled badge HTML.
    return `<span class="status-badge status-${normalizedStatus}">${status}</span>`;
}

// This line renders the appointments table for the current role.
function renderAppointments() {
    // This line selects the appointments table header.
    const head = document.getElementById("appointmentsHead");
    // This line selects the appointments table body.
    const body = document.getElementById("appointmentsBody");
    // This line clears the previous table body content.
    body.innerHTML = "";

    // This line checks whether the current user is an admin.
    if (currentUser.role === "admin") {
        // This line builds the admin table header.
        head.innerHTML = `<tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Action</th></tr>`;
    } else {
        // This line builds the patient table header.
        head.innerHTML = `<tr><th>Doctor</th><th>Specialization</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Action</th></tr>`;
    }

    // This line checks whether there are no appointments to show.
    if (appointmentCache.length === 0) {
        // This line inserts a friendly empty message row.
        body.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No appointments found.</td></tr>`;
        // This line stops further processing.
        return;
    }

    // This line loops through every appointment in the list.
    appointmentCache.forEach((appointment) => {
        // This line checks whether the appointment can still be cancelled.
        const cancelButton = appointment.status === "Cancelled"
            ? `<button class="btn btn-sm btn-secondary" disabled>Cancelled</button>`
            : `<button class="btn btn-sm btn-outline-danger" onclick="cancelAppointment(${appointment.id})"><i class="fa-solid fa-ban me-1"></i>Cancel</button>`;

        // This line checks whether the current user is an admin.
        if (currentUser.role === "admin") {
            // This line inserts an admin table row.
            body.innerHTML += `<tr><td>${appointment.patient_name}<br><small class="text-muted">${appointment.patient_email}</small></td><td>${appointment.doctor_name}<br><small class="text-muted">${appointment.specialization}</small></td><td>${appointment.appointment_date}</td><td>${appointment.appointment_time}</td><td>${appointment.reason}</td><td>${createStatusBadge(appointment.status)}</td><td>${cancelButton}</td></tr>`;
        } else {
            // This line inserts a patient table row.
            body.innerHTML += `<tr><td>${appointment.doctor_name}</td><td>${appointment.specialization}</td><td>${appointment.appointment_date}</td><td>${appointment.appointment_time}</td><td>${appointment.reason}</td><td>${createStatusBadge(appointment.status)}</td><td>${cancelButton}</td></tr>`;
        }
    });
}

// This line connects the patient appointment booking form behavior.
function setupAppointmentForm() {
    // This line selects the appointment form.
    const form = document.getElementById("appointmentForm");
    // This line selects the date input field.
    const dateInput = document.getElementById("appointmentDate");

    // This line stops if the appointment form is not found.
    if (!form) {
        // This line exits the function safely.
        return;
    }

    // This line sets the minimum selectable date to today's date.
    dateInput.min = new Date().toISOString().split("T")[0];

    // This line attaches a submit event to the appointment form.
    form.addEventListener("submit", async (event) => {
        // This line stops the browser from reloading the page during form submit.
        event.preventDefault();
        // This line hides any previous dashboard message.
        hideMessage("dashboardMessage");

        // This line reads the selected doctor ID from the form.
        const doctor_id = document.getElementById("appointmentDoctor").value;
        // This line reads the selected appointment date from the form.
        const appointment_date = document.getElementById("appointmentDate").value;
        // This line reads the selected appointment time from the form.
        const appointment_time = document.getElementById("appointmentTime").value;
        // This line reads the appointment reason from the form.
        const reason = document.getElementById("appointmentReason").value;

        // This line checks that a doctor was selected.
        if (!doctor_id) {
            // This line shows a missing doctor error.
            showMessage("dashboardMessage", "Please select a doctor.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks that the date field is not empty.
        if (!appointment_date) {
            // This line shows a missing date error.
            showMessage("dashboardMessage", "Appointment date is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks that the time field is not empty.
        if (!appointment_time) {
            // This line shows a missing time error.
            showMessage("dashboardMessage", "Appointment time is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks that the reason field is not empty.
        if (!reason.trim()) {
            // This line shows a missing reason error.
            showMessage("dashboardMessage", "Reason for appointment is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line sends the appointment booking request to the backend.
        const result = await apiRequest("/api/appointments", "POST", { doctor_id, appointment_date, appointment_time, reason });

        // This line checks whether the booking request failed.
        if (!result.ok) {
            // This line shows the backend error message.
            showMessage("dashboardMessage", result.message, "danger");
            // This line stops further processing.
            return;
        }

        // This line shows the booking success message.
        showMessage("dashboardMessage", result.message, "success");
        // This line resets the appointment form after a successful booking.
        form.reset();
        // This line reloads the latest doctors and appointments.
        await refreshDashboardData();
    });
}

// This line connects the admin doctor add and update form behavior.
function setupDoctorForm() {
    // This line selects the doctor form.
    const form = document.getElementById("doctorForm");
    // This line selects the cancel edit button.
    const cancelButton = document.getElementById("doctorCancelButton");

    // This line stops if the doctor form is not found.
    if (!form) {
        // This line exits the function safely.
        return;
    }

    // This line attaches a submit event to the doctor form.
    form.addEventListener("submit", async (event) => {
        // This line stops the browser from reloading the page during form submit.
        event.preventDefault();
        // This line hides any previous dashboard message.
        hideMessage("dashboardMessage");

        // This line reads the hidden doctor ID field.
        const doctorId = document.getElementById("doctorId").value;
        // This line reads the doctor name value.
        const doctor_name = document.getElementById("doctorName").value;
        // This line reads the specialization value.
        const specialization = document.getElementById("doctorSpecialization").value;
        // This line reads the schedule value.
        const schedule = document.getElementById("doctorSchedule").value;
        // This line reads the fee value.
        const fees = document.getElementById("doctorFees").value;

        // This line checks whether the doctor name is empty.
        if (!doctor_name.trim()) {
            // This line shows a missing doctor name error.
            showMessage("dashboardMessage", "Doctor name is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether the doctor name contains only alphabets, spaces and dots.
        if (!/^[A-Za-z .]+$/.test(doctor_name.trim())) {
            // This line shows an invalid doctor name error.
            showMessage("dashboardMessage", "Doctor name must contain alphabets only.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether specialization is empty.
        if (!specialization.trim()) {
            // This line shows a missing specialization error.
            showMessage("dashboardMessage", "Specialization is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether schedule is empty.
        if (!schedule.trim()) {
            // This line shows a missing schedule error.
            showMessage("dashboardMessage", "Availability schedule is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line checks whether fees is empty.
        if (fees === "") {
            // This line shows a missing fee error.
            showMessage("dashboardMessage", "Consultation fee is required.", "danger");
            // This line stops further processing.
            return;
        }

        // This line stores the payload object that will be sent to the backend.
        const payload = { doctor_name, specialization, schedule, fees };
        // This line chooses the correct API URL based on add or edit mode.
        const url = doctorId ? `/api/doctors/${doctorId}` : "/api/doctors";
        // This line chooses the correct HTTP method based on add or edit mode.
        const method = doctorId ? "PUT" : "POST";
        // This line sends the doctor form request to the backend.
        const result = await apiRequest(url, method, payload);

        // This line checks whether the request failed.
        if (!result.ok) {
            // This line shows the backend error message.
            showMessage("dashboardMessage", result.message, "danger");
            // This line stops further processing.
            return;
        }

        // This line shows the success message after saving the doctor.
        showMessage("dashboardMessage", result.message, "success");
        // This line resets the doctor form back to blank state.
        resetDoctorForm();
        // This line reloads the latest doctors and appointments.
        await refreshDashboardData();
        // This line reloads admin statistics because doctor count might change.
        await loadAdminStats();
    });

    // This line attaches a click event to the cancel edit button.
    cancelButton.addEventListener("click", () => {
        // This line resets the doctor form back to add mode.
        resetDoctorForm();
    });
}

// This line fills the doctor form with data for editing.
function editDoctor(doctor) {
    // This line places the doctor ID into the hidden field.
    document.getElementById("doctorId").value = doctor.id;
    // This line places the doctor name into the input field.
    document.getElementById("doctorName").value = doctor.doctor_name;
    // This line places the specialization into the input field.
    document.getElementById("doctorSpecialization").value = doctor.specialization;
    // This line places the schedule into the input field.
    document.getElementById("doctorSchedule").value = doctor.schedule;
    // This line places the fees into the input field.
    document.getElementById("doctorFees").value = doctor.fees;
    // This line changes the form heading to show edit mode.
    document.getElementById("doctorFormTitle").textContent = "Update Doctor";
    // This line shows the cancel button while editing.
    document.getElementById("doctorCancelButton").classList.remove("d-none");
    // This line scrolls the page to the doctor form smoothly.
    document.getElementById("doctorFormCard").scrollIntoView({ behavior: "smooth" });
}

// This line finds a doctor in the local cache and opens that doctor in edit mode.
function editDoctorById(doctorId) {
    // This line searches the local doctor list for the matching doctor.
    const doctor = doctorCache.find((item) => item.id === doctorId);

    // This line checks whether the doctor exists in the local cache.
    if (!doctor) {
        // This line shows an error if the doctor record is missing.
        showMessage("dashboardMessage", "Doctor data not found for editing.", "danger");
        // This line stops further processing.
        return;
    }

    // This line sends the found doctor object to the existing edit function.
    editDoctor(doctor);
}

// This line resets the doctor form to add mode.
function resetDoctorForm() {
    // This line resets the form fields to empty values.
    document.getElementById("doctorForm").reset();
    // This line clears the hidden doctor ID field.
    document.getElementById("doctorId").value = "";
    // This line changes the form heading back to add mode.
    document.getElementById("doctorFormTitle").textContent = "Add Doctor";
    // This line hides the cancel button because edit mode is finished.
    document.getElementById("doctorCancelButton").classList.add("d-none");
}

// This line deletes a doctor after confirmation.
async function deleteDoctor(doctorId) {
    // This line asks the user to confirm the delete action.
    const confirmed = window.confirm("Are you sure you want to delete this doctor?");

    // This line stops if the user cancels the confirmation box.
    if (!confirmed) {
        // This line exits the function safely.
        return;
    }

    // This line sends the delete request to the backend.
    const result = await apiRequest(`/api/doctors/${doctorId}`, "DELETE");

    // This line checks whether the delete request failed.
    if (!result.ok) {
        // This line shows the backend error message.
        showMessage("dashboardMessage", result.message, "danger");
        // This line stops further processing.
        return;
    }

    // This line shows the doctor deletion success message.
    showMessage("dashboardMessage", result.message, "success");
    // This line refreshes the dashboard data after deletion.
    await refreshDashboardData();
    // This line refreshes admin statistics after deletion.
    await loadAdminStats();
}

// This line cancels an appointment after confirmation.
async function cancelAppointment(appointmentId) {
    // This line asks the user to confirm appointment cancellation.
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");

    // This line stops if the user cancels the confirmation box.
    if (!confirmed) {
        // This line exits the function safely.
        return;
    }

    // This line sends the appointment cancellation request to the backend.
    const result = await apiRequest(`/api/appointments/${appointmentId}`, "DELETE");

    // This line checks whether the cancellation request failed.
    if (!result.ok) {
        // This line shows the backend error message.
        showMessage("dashboardMessage", result.message, "danger");
        // This line stops further processing.
        return;
    }

    // This line shows the appointment cancellation success message.
    showMessage("dashboardMessage", result.message, "success");
    // This line refreshes the dashboard data after cancellation.
    await refreshDashboardData();
    // This line refreshes admin statistics when the current user is admin.
    if (currentUser.role === "admin") {
        // This line reloads the statistics cards.
        await loadAdminStats();
    }
}

// This line loads basic admin statistics from the backend.
async function loadAdminStats() {
    // This line requests the statistics data from the backend.
    const result = await apiRequest("/api/admin/stats");

    // This line checks whether the request failed.
    if (!result.ok) {
        // This line shows the backend error message.
        showMessage("dashboardMessage", result.message, "danger");
        // This line stops further processing.
        return;
    }

    // This line selects the admin statistics row container.
    const statsRow = document.getElementById("adminStatsRow");
    // This line reads the stats object from the response.
    const stats = result.stats;

    // This line builds the admin statistics cards.
    statsRow.innerHTML = `
        <div class="col-md-3"><div class="card border-0 shadow-sm summary-card"><div class="card-body"><p class="card-label">Active Doctors</p><h3 class="fw-bold">${stats.doctors}</h3><i class="fa-solid fa-user-doctor card-icon"></i></div></div></div>
        <div class="col-md-3"><div class="card border-0 shadow-sm summary-card"><div class="card-body"><p class="card-label">Patients</p><h3 class="fw-bold">${stats.patients}</h3><i class="fa-solid fa-users card-icon"></i></div></div></div>
        <div class="col-md-3"><div class="card border-0 shadow-sm summary-card"><div class="card-body"><p class="card-label">Total Appointments</p><h3 class="fw-bold">${stats.appointments}</h3><i class="fa-solid fa-calendar-days card-icon"></i></div></div></div>
        <div class="col-md-3"><div class="card border-0 shadow-sm summary-card"><div class="card-body"><p class="card-label">Active Bookings</p><h3 class="fw-bold">${stats.activeBookings}</h3><i class="fa-solid fa-chart-line card-icon"></i></div></div></div>
    `;
}

// This line exposes the editDoctor function globally so inline button clicks can use it.
window.editDoctor = editDoctor;
// This line exposes the editDoctorById function globally so inline button clicks can use it.
window.editDoctorById = editDoctorById;
// This line exposes the deleteDoctor function globally so inline button clicks can use it.
window.deleteDoctor = deleteDoctor;
// This line exposes the cancelAppointment function globally so inline button clicks can use it.
window.cancelAppointment = cancelAppointment;
