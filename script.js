/*
Load portfolio data and initialize dashboard.
*/
document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchTristan();
    const tristan = data.find(p => p.name === "Tristan Cai");

    if (tristan) {
        setupNavLinkEvents();
        renderAll(tristan, 0);
    }
});

/*
Fetch local JSON data.
*/
async function fetchTristan() {
    const res = await fetch("tristan.json");
    return await res.json();
}

/*
Render all sections for selected project.
*/
function renderAll(user, projectIndex = 0) {
    renderProjectList(user, projectIndex);
    setupProjectSelection(user);
    renderProfile(user);

    const project = user.projects[projectIndex];
    if (!project) return;
    
    renderProjectDesc(project);
    renderFeatures(project);
    renderResources(project.resources);
    renderTech(project.tech_stack);
}

/*
Sidebar: Render list of projects.
*/
function renderProjectList(user, activeIndex = 0) {
    const projects = user.projects;
    const sidebar = document.getElementById("left-panel");

    sidebar.innerHTML = `
        <ul class="project-list">
            ${projects.map((p, i) => `
                <li class="project-item ${i === activeIndex ? 'selected' : ''}" data-project-index="${i}">
                    <div class="left-section">
                        <div class="project-info">
                            <strong>${p.name}</strong>
                            <span>${p.month} ${p.year}</span>
                        </div>
                    </div>
                    <img class="project-icon" src="${p.icon}" alt="Project Info" />
                </li>
            `).join("")}
        </ul>
    `;
}

/*
Project selection: update display on click.
*/
function setupProjectSelection(user) {
    document.querySelectorAll(".project-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".project-item").forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");

            const index = Number(item.dataset.projectIndex);
            renderAll(user, index);
        });
    });
}

/*
Navbar: Handle link selection styling.
*/
function setupNavLinkEvents() {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            const isExternal = href.startsWith("http://") || href.startsWith("https://");

            if (!isExternal) {
                e.preventDefault();
                document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            }
        });
    });
}


/*
Render the profile section.
*/
function renderProfile(user) {
    document.getElementById("profile").innerHTML = `
        <img src="${user.profile_picture}" class="profile-large" />
        <h2 class="profile-name">${user.name}</h2>
        <div class="profile-desc">
            ${renderProfileRow("birth.svg", "Date Of Birth", formatDate(user.date_of_birth))}
            ${renderProfileRow("field.svg", "Field", user.field)}
            ${renderProfileRow("email.svg", "Email", user.email)}
            ${renderProfileRow("phone.svg", "Phone", user.phone_number)}
            ${renderProfileRow("resume.svg", "Resume", user.resume)}
        </div>
    `;
}

function renderProfileRow(icon, label, value) {
    return `
        <div class="profile-row">
            <img src="assets/images/${icon}" class="profile-icon" />
            <div>
                <p class="profile-label">${label}</p>
                <p class="profile-value">${value}</p>
            </div>
        </div>
    `;
}

/*
Project description.
*/
function renderProjectDesc(project) {
    document.getElementById("project-desc").innerHTML = `
        <h2>${project.name}</h2>
        <p>${project.desc}</p>
        <p>
            Below, I have included <strong>features</strong> of the project.
        </p>
        <p>
            I have also added different <strong>resources</strong> and <strong>tech stack</strong> implementations.
        </p>
    `;
}

/*
Render project feature cards.
*/
function renderFeatures(project) {
    const features = [
        {
            label: "Feature 1",
            value: project.feature_1.name,
            level: project.feature_1.desc,
            color: "blue",
            icon: project.feature_1.icon
        },
        {
            label: "Feature 2",
            value: project.feature_2.name,
            level: project.feature_2.desc,
            color: "red",
            icon: project.feature_2.icon
        },
        {
            label: "Feature 3",
            value: project.feature_3.name,
            level: project.feature_3.desc,
            color: "pink",
            icon: project.feature_3.icon
        }
    ];

    document.getElementById("features-cards").innerHTML = features.map(f => `
        <div class="card ${f.color}">
            <img class="features-img" src="${f.icon}" alt="${f.label}" />
            <p class="features-title">${f.label}</p>
            <p class="features-stat">${f.value}</p>
            <small class="features-status">${f.level}</small>
        </div>
    `).join("");
}

/*
Render resource links.
*/
function renderResources(resources) {
    const r = document.getElementById("resources-list");
    r.innerHTML = `
        <table class="resources-table">
            <thead>
                <tr>
                    <th id="left">Resource</th>
                    <th>Description</th>
                    <th id="right">Link</th>
                </tr>
            </thead>
            <tbody>
                ${resources.map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td>${r.desc}</td>
                        <td> <a class="resources-link" href="${r.link}" target="_blank" rel="noopener noreferrer"> Source </a> </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

/*
Render tech stack list.
*/
function renderTech(techStack) {
    document.getElementById("tech-info").innerHTML = `
        <ul class="tech-list">
            ${techStack.map(t => `
                <li>${t.name} <img class="tech-logo" src="${t.logo}" alt="Download Record" /></li>
            `).join("")}
        </ul>
    `;
}

/*
Helper: Format date string.
*/
function formatDate(d) {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

/*
Helper: Capitalize first letter.
*/
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
