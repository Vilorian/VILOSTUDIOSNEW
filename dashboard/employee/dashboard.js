// Dashboard JavaScript
// Check if user is logged in
let userData = JSON.parse(localStorage.getItem('vilostudios_user') || 'null');

// Check for session expiration (24 hours)
if (userData && userData.loginTime) {
    const loginTime = new Date(userData.loginTime);
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > 24) {
        // Session expired
        localStorage.removeItem('vilostudios_user');
        userData = null;
    } else {
        // Update login time to extend session
        userData.loginTime = now.toISOString();
        localStorage.setItem('vilostudios_user', JSON.stringify(userData));
    }
}

if (!userData) {
    window.location.href = '../../login.html';
    throw new Error('Not logged in');
}

// Initialize user info
const userName = userData.name || userData.email?.split('@')[0] || 'User';
const userEmail = userData.email || '';
const userRole = userData.role || 'manager';
const userInitial = userName.charAt(0).toUpperCase();

// Format role name
function formatRoleName(role) {
    return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
}

// Update UI with user info
function updateProfileDisplay() {
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarUserEmail = document.getElementById('sidebar-user-email');
    const headerAvatar = document.getElementById('header-avatar');
    const headerUserName = document.getElementById('header-user-name');
    const headerUserRoleTag = document.getElementById('header-user-role-tag');
    
    const firstName = userName.split(' ')[0];
    
    if (sidebarAvatar) sidebarAvatar.textContent = userInitial;
    if (sidebarUserName) sidebarUserName.textContent = firstName;
    if (sidebarUserEmail) sidebarUserEmail.textContent = userEmail;
    if (headerAvatar) headerAvatar.textContent = userInitial;
    if (headerUserName) headerUserName.textContent = firstName;
    
    // Update role tag - uppercase
    if (headerUserRoleTag) {
        headerUserRoleTag.textContent = userRole.toUpperCase().replace('_', ' ');
        // Remove all role classes and add the current one
        headerUserRoleTag.className = 'header-user-role-tag';
        headerUserRoleTag.classList.add(userRole.toLowerCase().replace(' ', '_'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateProfileDisplay();
});

// Roles and Permissions Data
const roles = [
    { id: 'manager', name: 'Manager', permissions: [] },
    { id: 'ambassador', name: 'Ambassador', permissions: [] },
    { id: 'internal_recruiter', name: 'Internal Recruiter', permissions: [] },
    { id: 'director', name: 'Director', permissions: [] },
    { id: 'talent', name: 'Talent', permissions: [] },
    { id: 'production_assistant', name: 'Production Assistant', permissions: [] },
    { id: 'client', name: 'Client', permissions: [] }
];

const permissionCategories = [
    { id: 'all', name: 'All' },
    { id: 'user_role_management', name: 'User & Role Management' },
    { id: 'project_management', name: 'Project Management' },
    { id: 'database_talent', name: 'Database & Talent Access' },
    { id: 'recruitment', name: 'Recruitment & Applications' },
    { id: 'resources', name: 'Resources & Content' },
    { id: 'communication', name: 'Communication & Support' }
];

const permissions = [
    // User & Role Management
    { 
        id: 'change_permissions', 
        name: 'Change Permissions', 
        description: 'View, create, edit, and remove permissions for roles in the Permissions dashboard page. Allows modification of what each role can access and do throughout the system.', 
        category: 'user_role_management' 
    },
    { 
        id: 'assign_roles', 
        name: 'Assign Roles', 
        description: 'View, create, edit, and remove user role assignments in the Role Assignment dashboard page. Can assign roles to new users, update existing user roles, and remove role assignments.', 
        category: 'user_role_management' 
    },
    { 
        id: 'manage_talents', 
        name: 'Manage Talents', 
        description: 'View, create, edit, and remove talent/freelancer role assignments and department associations. Manage talent profiles and their organizational structure.', 
        category: 'user_role_management' 
    },
    
    // Project Management
    { 
        id: 'view_all_projects', 
        name: 'View All Projects', 
        description: 'View and access all projects across the organization in the Projects dashboard page. Read-only access to project details, timelines, and status information.', 
        category: 'project_management' 
    },
    { 
        id: 'create_projects', 
        name: 'Create Projects', 
        description: 'Create new projects in the Projects dashboard page. Can initiate new project entries, set up project details, and establish project structures.', 
        category: 'project_management' 
    },
    { 
        id: 'edit_projects', 
        name: 'Edit Projects', 
        description: 'Edit and update existing projects in the Projects dashboard page. Can modify project details, timelines, status, and all project-related information. Includes ability to remove/delete projects.', 
        category: 'project_management' 
    },
    
    // Database & Talent Access
    { 
        id: 'freelancer_database', 
        name: 'Freelancer Database', 
        description: 'View and access the freelancer database in the Freelancer Database dashboard page. Read-only access to freelancer profiles, skills, and portfolio information.', 
        category: 'database_talent' 
    },
    { 
        id: 'freelancer_contacts', 
        name: 'Freelancer Contacts', 
        description: 'View, create, edit, and remove freelancer contact information including email addresses and phone numbers in the Freelancer Database dashboard page.', 
        category: 'database_talent' 
    },
    { 
        id: 'freelancer_numbers', 
        name: 'Freelancer Numbers', 
        description: 'View freelancer statistics, metrics, and numerical data in the Freelancer Database dashboard page. Access to analytics, performance numbers, and database statistics.', 
        category: 'database_talent' 
    },
    
    // Recruitment & Applications
    { 
        id: 'applications_view', 
        name: 'View Applications', 
        description: 'View and access job applications in the Applications dashboard page. Read-only access to application details, candidate information, and application status.', 
        category: 'recruitment' 
    },
    { 
        id: 'applications_manage', 
        name: 'Manage Applications', 
        description: 'View, create, edit, accept, decline, and remove job applications in the Applications dashboard page. Full control over application processing and candidate management.', 
        category: 'recruitment' 
    },
    { 
        id: 'positions_create', 
        name: 'Create Positions', 
        description: 'Create new job positions and postings in the Applications dashboard page. Can set up new roles, define requirements, and publish position listings.', 
        category: 'recruitment' 
    },
    { 
        id: 'positions_manage', 
        name: 'Manage Positions', 
        description: 'View, edit, update, and remove job positions in the Applications dashboard page. Can modify position details, requirements, status, and delete position listings.', 
        category: 'recruitment' 
    },
    
    // Resources & Content
    { 
        id: 'crm_clients', 
        name: 'CRM - Client List', 
        description: 'View, create, edit, and remove client entries in the CRM dashboard page. Full access to client list management, client profiles, and client relationship data.', 
        category: 'resources' 
    },
    { 
        id: 'crm_documents', 
        name: 'CRM - Documents', 
        description: 'View, upload, edit, download, and remove client documents in the Documents & Pricing dashboard page. Access to all document management features and file operations.', 
        category: 'resources' 
    },
    
    // Communication & Support
    { 
        id: 'send_communications', 
        name: 'Send Communications', 
        description: 'View, create, send, edit, and remove messages to users and clients throughout the dashboard. Can initiate communications, manage message history, and handle support interactions.', 
        category: 'communication' 
    }
];

// Load role permissions from localStorage or use defaults
let rolePermissions = JSON.parse(localStorage.getItem('vilostudios_role_permissions') || '{}');

// Initialize default permissions if not set
if (Object.keys(rolePermissions).length === 0) {
    rolePermissions = {
        manager: permissions.map(p => p.id), // Manager has all permissions (15 total)
        ambassador: ['crm_clients', 'crm_documents', 'freelancer_database', 'freelancer_contacts'], // 4 permissions
        internal_recruiter: ['applications_view', 'applications_manage', 'positions_create', 'positions_manage', 'freelancer_database'], // 5 permissions
        director: ['view_all_projects', 'create_projects', 'edit_projects'], // 3 permissions
        talent: ['view_all_projects', 'freelancer_database', 'applications_view'], // 3 permissions
        production_assistant: ['freelancer_database', 'freelancer_numbers', 'view_all_projects', 'applications_view', 'positions_create'], // 5 permissions
        client: ['view_all_projects', 'crm_documents', 'send_communications'] // 3 permissions
    };
    localStorage.setItem('vilostudios_role_permissions', JSON.stringify(rolePermissions));
}

// Current state
let currentRole = 'manager';
let currentCategory = 'all';
let searchQuery = '';
let viewAsRole = userRole || 'manager';

// Initialize dashboard
function initDashboard() {
    renderRolesList();
    renderPermissions();
    setupEventListeners();
}

// Render roles list
function renderRolesList() {
    const rolesList = document.getElementById('roles-list');
    rolesList.innerHTML = '';
    
    roles.forEach(role => {
        const count = rolePermissions[role.id]?.length || 0;
        const roleItem = document.createElement('div');
        roleItem.className = `role-item ${currentRole === role.id ? 'active' : ''}`;
        roleItem.innerHTML = `
            <div class="role-name">${role.name}</div>
            <div class="role-permission-count">${count} permissions</div>
        `;
        roleItem.addEventListener('click', () => {
            currentRole = role.id;
            renderRolesList();
            renderPermissions();
        });
        rolesList.appendChild(roleItem);
    });
}

// Render permissions
function renderPermissions() {
    const selectedRole = roles.find(r => r.id === currentRole);
    document.getElementById('selected-role-title').textContent = `${selectedRole.name} Permissions`;
    
    // Render category tabs
    renderCategoryTabs();
    
    // Filter permissions
    let filteredPermissions = permissions;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredPermissions = filteredPermissions.filter(p => p.category === currentCategory);
    }
    
    // Filter by search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPermissions = filteredPermissions.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
        );
    }
    
    // Group by category
    const grouped = {};
    filteredPermissions.forEach(perm => {
        if (!grouped[perm.category]) {
            grouped[perm.category] = [];
        }
        grouped[perm.category].push(perm);
    });
    
    // Render permissions list
    const permissionsList = document.getElementById('permissions-list');
    permissionsList.innerHTML = '';
    
    Object.keys(grouped).forEach(categoryId => {
        const category = permissionCategories.find(c => c.id === categoryId);
        if (!category) return;
        
        const section = document.createElement('div');
        section.className = 'permission-section';
        section.innerHTML = `
            <div class="permission-section-title">${category.name}</div>
        `;
        
        grouped[categoryId].forEach(perm => {
            const isChecked = rolePermissions[currentRole]?.includes(perm.id) || false;
            const permItem = document.createElement('div');
            permItem.className = 'permission-item';
            permItem.innerHTML = `
                <div class="permission-checkbox ${isChecked ? 'checked' : ''}" data-permission="${perm.id}"></div>
                <div class="permission-info">
                    <div class="permission-name">${perm.name}</div>
                    <div class="permission-description">${perm.description}</div>
                </div>
            `;
            
            permItem.querySelector('.permission-checkbox').addEventListener('click', () => {
                togglePermission(perm.id);
            });
            
            section.appendChild(permItem);
        });
        
        permissionsList.appendChild(section);
    });
}

// Render category tabs
function renderCategoryTabs() {
    const categoryTabs = document.getElementById('category-tabs');
    categoryTabs.innerHTML = '';
    
    permissionCategories.forEach(category => {
        const tab = document.createElement('button');
        tab.className = `category-tab ${currentCategory === category.id ? 'active' : ''}`;
        tab.textContent = category.name;
        tab.addEventListener('click', () => {
            currentCategory = category.id;
            renderPermissions();
        });
        categoryTabs.appendChild(tab);
    });
}

// Toggle permission
function togglePermission(permissionId) {
    if (!rolePermissions[currentRole]) {
        rolePermissions[currentRole] = [];
    }
    
    const index = rolePermissions[currentRole].indexOf(permissionId);
    if (index > -1) {
        rolePermissions[currentRole].splice(index, 1);
    } else {
        rolePermissions[currentRole].push(permissionId);
    }
    
    // Save to localStorage
    localStorage.setItem('vilostudios_role_permissions', JSON.stringify(rolePermissions));
    
    // Re-render
    renderRolesList();
    renderPermissions();
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('permission-search').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderPermissions();
    });
    
    // Save button
    document.getElementById('save-permissions-btn').addEventListener('click', () => {
        // In a real app, this would save to the server
        alert('Permissions saved successfully!');
    });
    
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            switchPage(page);
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // View as dropdown
    const viewAsBtn = document.getElementById('view-as-btn');
    const viewAsDropdown = document.getElementById('view-as-dropdown');
    const viewAsRoleSpan = document.getElementById('view-as-role');
    
    if (viewAsBtn && viewAsDropdown && viewAsRoleSpan) {
        // Populate dropdown with roles
        function renderViewAsDropdown() {
            viewAsDropdown.innerHTML = '';
            roles.forEach(role => {
                const item = document.createElement('div');
                item.className = `view-as-dropdown-item ${viewAsRole === role.id ? 'active' : ''}`;
                item.textContent = role.name;
                item.addEventListener('click', () => {
                    viewAsRole = role.id;
                    viewAsRoleSpan.textContent = formatRoleName(viewAsRole);
                    viewAsBtn.classList.remove('active');
                    viewAsDropdown.classList.remove('show');
                    
                    // Update active state in dropdown
                    viewAsDropdown.querySelectorAll('.view-as-dropdown-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    item.classList.add('active');
                    
                    // Change the selected role in the roles panel and permissions view
                    currentRole = viewAsRole;
                    renderRolesList();
                    renderPermissions();
                });
                viewAsDropdown.appendChild(item);
            });
        }
        
        renderViewAsDropdown();
        
        // Toggle dropdown
        viewAsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = viewAsBtn.classList.contains('active');
            
            if (isActive) {
                viewAsBtn.classList.remove('active');
                viewAsDropdown.classList.remove('show');
            } else {
                viewAsBtn.classList.add('active');
                viewAsDropdown.classList.add('show');
                renderViewAsDropdown(); // Re-render to update active state
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!viewAsBtn.contains(e.target) && !viewAsDropdown.contains(e.target)) {
                viewAsBtn.classList.remove('active');
                viewAsDropdown.classList.remove('show');
            }
        });
        
        // Initialize display
        viewAsRoleSpan.textContent = formatRoleName(viewAsRole);
    }
    
    // API bypass button - only show for managers
    const apiBypassBtn = document.getElementById('api-bypass-btn');
    const apiBypassText = document.getElementById('api-bypass-text');
    
    if (apiBypassBtn && (userRole === 'manager' || userRole === 'Manager')) {
        apiBypassBtn.style.display = 'flex';
        
        // Load saved state from localStorage
        const bypassState = localStorage.getItem('vilostudios_api_bypass') === 'true';
        if (bypassState) {
            apiBypassBtn.classList.add('active');
            if (apiBypassText) apiBypassText.textContent = 'API Bypass ON';
        } else {
            if (apiBypassText) apiBypassText.textContent = 'API Bypass OFF';
        }
        
        apiBypassBtn.addEventListener('click', () => {
            const isActive = apiBypassBtn.classList.contains('active');
            apiBypassBtn.classList.toggle('active');
            
            // Save state to localStorage
            localStorage.setItem('vilostudios_api_bypass', !isActive ? 'true' : 'false');
            
            // Update button text
            if (apiBypassText) {
                apiBypassText.textContent = !isActive ? 'API Bypass ON' : 'API Bypass OFF';
            }
        });
    }
}

// Switch page
function switchPage(page) {
    const permissionsPage = document.getElementById('permissions-page');
    const otherPages = document.getElementById('other-pages');
    const pageTitle = document.getElementById('page-title');
    
    switch(page) {
        case 'permissions':
            permissionsPage.style.display = 'block';
            otherPages.style.display = 'none';
            pageTitle.textContent = 'Manager Dashboard';
            break;
        case 'user-management':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderUserManagementPage();
            pageTitle.textContent = 'User Management';
            break;
        case 'role-assignment':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderRoleAssignmentPage();
            pageTitle.textContent = 'Role Assignment';
            break;
        case 'wishlist-pas':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderWishlistPAsPage();
            pageTitle.textContent = 'Wishlist PAs';
            break;
        case 'projects':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderProjectsPage();
            pageTitle.textContent = 'Projects';
            break;
        case 'freelancer-database':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderFreelancerDatabasePage();
            pageTitle.textContent = 'Freelancer Database';
            break;
        case 'applications':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderApplicationsPage();
            pageTitle.textContent = 'Applications';
            break;
        case 'documents':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            otherPages.innerHTML = '<p style="margin-top: 2rem;">Documents & Pricing interface coming soon...</p>';
            pageTitle.textContent = 'Documents & Pricing';
            break;
        case 'settings':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderSystemSettings();
            pageTitle.textContent = 'Settings';
            break;
        default:
            permissionsPage.style.display = 'block';
            otherPages.style.display = 'none';
            pageTitle.textContent = 'Manager Dashboard';
    }
}

// Render Role Assignment Page
function renderRoleAssignmentPage() {
    const otherPages = document.getElementById('other-pages');
    const rolesOptions = roles.map(role => 
        `<option value="${role.id}">${role.name}</option>`
    ).join('');
    
    otherPages.innerHTML = `
        <div class="role-assignment-form">
            <div id="role-assignment-message"></div>
            <form id="role-assignment-form">
                <div class="form-group">
                    <label for="username" class="form-label">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        class="form-input" 
                        placeholder="Enter username"
                        required
                    >
                </div>
                <div class="form-group">
                    <label for="email" class="form-label">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        class="form-input" 
                        placeholder="user@example.com"
                        required
                    >
                </div>
                <div class="form-group">
                    <label for="role" class="form-label">Role</label>
                    <div class="form-select-wrapper">
                        <select id="role" name="role" class="form-select" required>
                            <option value="">Select a role</option>
                            ${rolesOptions}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="temp-password" class="form-label">Temporary Password</label>
                    <input 
                        type="text" 
                        id="temp-password" 
                        name="temp-password" 
                        class="form-input" 
                        placeholder="Auto-generated if left empty"
                    >
                    <small style="display: block; margin-top: 0.5rem; color: var(--text-muted); font-size: var(--font-sm);">
                        Leave empty to auto-generate a secure password
                    </small>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary" id="assign-role-btn">
                        Assign Role & Send Email
                    </button>
                    <button type="button" class="btn-secondary" id="reset-form-btn">
                        Reset
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Setup form handlers
    const form = document.getElementById('role-assignment-form');
    const resetBtn = document.getElementById('reset-form-btn');
    
    form.addEventListener('submit', handleRoleAssignment);
    resetBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('role-assignment-message').innerHTML = '';
    });
}

// Handle Role Assignment Form Submission
async function handleRoleAssignment(e) {
    e.preventDefault();
    
    const messageDiv = document.getElementById('role-assignment-message');
    const submitBtn = document.getElementById('assign-role-btn');
    const form = e.target;
    
    const formData = {
        username: form.username.value.trim(),
        email: form.email.value.trim(),
        role: form.role.value,
        tempPassword: form['temp-password'].value.trim() || null
    };
    
    // Validation
    if (!formData.username || !formData.email || !formData.role) {
        messageDiv.innerHTML = '<div class="form-message error">Please fill in all required fields</div>';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Assigning...';
    messageDiv.innerHTML = '';
    
    try {
        const response = await fetch('../../api/users/assign-role.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            messageDiv.innerHTML = `<div class="form-message success">${result.message}</div>`;
            form.reset();
        } else {
            messageDiv.innerHTML = `<div class="form-message error">${result.message || 'Failed to assign role'}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="form-message error">Error: ${error.message}</div>`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Assign Role & Send Email';
    }
}

// Render Wishlist Production Assistants Page
function renderWishlistPAsPage() {
    const otherPages = document.getElementById('other-pages');
    
    otherPages.innerHTML = `
        <div class="wishlist-pas-layout">
            <div class="wishlist-pas-form-panel">
                <h3 class="panel-title">
                    <svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <path d="M20 8v6"></path>
                        <path d="M23 11h-6"></path>
                    </svg>
                    Add Production Assistant
                </h3>
                <div id="wishlist-pas-message"></div>
                <form id="wishlist-pas-form">
                    <div class="form-group">
                        <label for="pa-username" class="form-label">
                            <svg class="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Username
                        </label>
                        <input 
                            type="text" 
                            id="pa-username" 
                            name="username" 
                            class="form-input" 
                            placeholder="Enter username"
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label for="pa-email" class="form-label">
                            <svg class="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            id="pa-email" 
                            name="email" 
                            class="form-input" 
                            placeholder="user@example.com"
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label for="pa-studio" class="form-label">
                            <svg class="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                            </svg>
                            Studio
                        </label>
                        <input 
                            type="text" 
                            id="pa-studio" 
                            name="studio" 
                            class="form-input" 
                            placeholder="Enter studio name (e.g., VILOSTUDIOS)"
                            list="studio-suggestions"
                            required
                            autocomplete="off"
                        >
                        <datalist id="studio-suggestions">
                            <option value="VILOSTUDIOS">VILOSTUDIOS</option>
                            <option value="Partner Studio 1">Partner Studio 1</option>
                            <option value="Partner Studio 2">Partner Studio 2</option>
                            <option value="External">External</option>
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label for="pa-temp-password" class="form-label">
                            <svg class="form-label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Temporary Password
                        </label>
                        <input 
                            type="text" 
                            id="pa-temp-password" 
                            name="temp-password" 
                            class="form-input" 
                            placeholder="Auto-generated if left empty"
                        >
                        <small style="display: block; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.4); font-size: var(--font-xs);">
                            Leave empty to auto-generate a secure password
                        </small>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary" id="add-pa-btn" style="display: flex; align-items: center; justify-content: center;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 0.5rem;">
                                <path d="M12 5v14M5 12h14"></path>
                            </svg>
                            Add to Wishlist & Send Email
                        </button>
                        <button type="button" class="btn-secondary" id="reset-pa-form-btn" style="display: flex; align-items: center; justify-content: center;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 0.5rem;">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                            </svg>
                            Reset
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="wishlist-pas-list-panel">
                <div class="list-panel-header">
                    <h3 class="panel-title">
                        <svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Production Assistants
                    </h3>
                    <div class="list-filters">
                        <div class="search-wrapper">
                            <input 
                                type="text" 
                                id="pa-search" 
                                class="form-input search-input-enhanced" 
                                placeholder="Search by name, email, or studio..."
                                autocomplete="off"
                            >
                        </div>
                        <div class="filter-tags">
                            <button class="filter-tag active" data-filter="">All</button>
                            <button class="filter-tag" data-filter="VILOSTUDIOS">VILOSTUDIOS</button>
                            <button class="filter-tag" data-filter="Partner">Partner</button>
                            <button class="filter-tag" data-filter="External">External</button>
                        </div>
                    </div>
                </div>
                <div id="wishlist-pas-list" class="wishlist-pas-list">
                    <!-- List will be populated here -->
                </div>
            </div>
        </div>
    `;
    
    // Setup form handlers
    const form = document.getElementById('wishlist-pas-form');
    const resetBtn = document.getElementById('reset-pa-form-btn');
    const searchInput = document.getElementById('pa-search');
    
    form.addEventListener('submit', handleWishlistPAAdd);
    resetBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('wishlist-pas-message').innerHTML = '';
    });
    
    searchInput.addEventListener('input', loadWishlistPAs);
    
    // Filter tag handlers
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            loadWishlistPAs();
        });
    });
    
    // Load initial list
    loadWishlistPAs();
}

// Handle Wishlist PA Form Submission
async function handleWishlistPAAdd(e) {
    e.preventDefault();
    
    const messageDiv = document.getElementById('wishlist-pas-message');
    const submitBtn = document.getElementById('add-pa-btn');
    const form = e.target;
    
    const formData = {
        username: form.username.value.trim(),
        email: form.email.value.trim(),
        studio: form.studio.value,
        tempPassword: form['temp-password'].value.trim() || null
    };
    
    // Validation
    if (!formData.username || !formData.email || !formData.studio) {
        messageDiv.innerHTML = '<div class="form-message error">Please fill in all required fields</div>';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';
    messageDiv.innerHTML = '';
    
    try {
        const response = await fetch('../../api/production-assistants/add.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            messageDiv.innerHTML = `<div class="form-message success">${result.message}</div>`;
            form.reset();
            loadWishlistPAs(); // Reload list
        } else {
            messageDiv.innerHTML = `<div class="form-message error">${result.message || 'Failed to add production assistant'}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="form-message error">Error: ${error.message}</div>`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add to Wishlist & Send Email';
    }
}

// Load Wishlist Production Assistants
async function loadWishlistPAs() {
    const listDiv = document.getElementById('wishlist-pas-list');
    if (!listDiv) return;
    
    const searchInput = document.getElementById('pa-search');
    const searchQuery = searchInput?.value.trim() || '';
    const activeFilterTag = document.querySelector('.filter-tag.active');
    const activeFilter = activeFilterTag?.dataset.filter || '';
    
    listDiv.innerHTML = '<div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.4);">Loading...</div>';
    
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (activeFilter) {
            // If filter is "Partner", search for studios containing "Partner"
            if (activeFilter === 'Partner') {
                params.append('studio', 'Partner');
            } else {
                params.append('studio', activeFilter);
            }
        }
        
        const response = await fetch(`../../api/production-assistants/list.php?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        let result;
        
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            renderWishlistPAList(result.data || []);
        } else {
            listDiv.innerHTML = `<div class="form-message error">${result.message || 'Failed to load production assistants'}</div>`;
        }
    } catch (error) {
        console.error('Error loading wishlist PAs:', error);
        listDiv.innerHTML = `<div class="form-message error">Error: ${error.message}</div>`;
    }
}

// Render Wishlist PA List
function renderWishlistPAList(pas) {
    const listDiv = document.getElementById('wishlist-pas-list');
    
    if (pas.length === 0) {
        listDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.4);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3; margin-bottom: 1rem;">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <p style="font-size: var(--font-md); margin-top: 0.5rem;">No production assistants found</p>
            </div>
        `;
        return;
    }
    
    listDiv.innerHTML = pas.map(pa => {
        const studio = pa.studio || 'N/A';
        let badgeClass = '';
        if (studio === 'VILOSTUDIOS') badgeClass = 'vilostudios';
        else if (studio.includes('Partner')) badgeClass = 'partner';
        else if (studio === 'External') badgeClass = 'external';
        
        return `
        <div class="wishlist-pa-item" data-studio="${escapeHtml(studio)}">
            <div class="pa-item-header">
                <div class="pa-item-info">
                    <div class="pa-item-name">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; opacity: 0.6;">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${escapeHtml(pa.username || pa.name || 'N/A')}
                    </div>
                    <div class="pa-item-email">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem; opacity: 0.5;">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        ${escapeHtml(pa.email)}
                    </div>
                </div>
                <div class="pa-item-studio">
                    <span class="studio-badge ${badgeClass}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem;">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                        ${escapeHtml(studio)}
                    </span>
                </div>
            </div>
            <div class="pa-item-meta">
                <span class="pa-item-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem; opacity: 0.5;">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Added: ${new Date(pa.created_at).toLocaleDateString()}
                </span>
                <button class="pa-item-delete" data-id="${pa.id}" onclick="deleteWishlistPA(${pa.id})" title="Remove from wishlist">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </div>
    `;
    }).join('');
}

// Delete Wishlist PA
async function deleteWishlistPA(id) {
    if (!confirm('Are you sure you want to remove this production assistant from the wishlist?')) {
        return;
    }
    
    try {
        const response = await fetch(`../../api/production-assistants/delete.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            loadWishlistPAs();
        } else {
            alert(result.message || 'Failed to delete production assistant');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Escape HTML helper
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render User Management Page
function renderUserManagementPage() {
    const otherPages = document.getElementById('other-pages');
    
    otherPages.innerHTML = `
        <div class="user-management-panel">
            <div class="list-panel-header">
                <h3 class="panel-title">
                    <svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    All Users
                </h3>
                    <div class="list-filters">
                        <div class="search-wrapper">
                            <input 
                                type="text" 
                                id="user-search" 
                                class="form-input search-input-enhanced" 
                                placeholder="Search by name, email, or role..."
                                autocomplete="off"
                            >
                        </div>
                    <div class="filter-tags">
                        <button class="filter-tag active" data-filter="">All</button>
                        <button class="filter-tag" data-filter="manager">Manager</button>
                        <button class="filter-tag" data-filter="ambassador">Ambassador</button>
                        <button class="filter-tag" data-filter="internal_recruiter">Recruiter</button>
                        <button class="filter-tag" data-filter="production_assistant">PA</button>
                        <button class="filter-tag" data-filter="client">Client</button>
                        <button class="filter-tag" data-filter="banned">Banned</button>
                    </div>
                </div>
            </div>
            <div id="user-management-list" class="user-management-list">
                <!-- List will be populated here -->
            </div>
        </div>
    `;
    
    // Setup search and filter handlers
    const searchInput = document.getElementById('user-search');
    searchInput.addEventListener('input', loadUsers);
    
    // Filter tag handlers
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            loadUsers();
        });
    });
    
    // Load initial list
    loadUsers();
}

// Load Users
async function loadUsers() {
    const listDiv = document.getElementById('user-management-list');
    if (!listDiv) return;
    
    const searchInput = document.getElementById('user-search');
    const searchQuery = searchInput?.value.trim() || '';
    const activeFilterTag = document.querySelector('.filter-tag.active');
    const activeFilter = activeFilterTag?.dataset.filter || '';
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    listDiv.innerHTML = '<div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.4);">Loading...</div>';
    
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (activeFilter) params.append('filter', activeFilter);
        if (apiBypass) params.append('bypass', '1');
        
        const response = await fetch(`../../api/users/list.php?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        let result;
        
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            // If API fails and bypass is on, show example data
            if (apiBypass) {
                renderUserList(getExampleUsers());
                return;
            }
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            renderUserList(result.data || []);
        } else {
            // If API fails and bypass is on, show example data
            if (apiBypass) {
                renderUserList(getExampleUsers());
            } else {
                listDiv.innerHTML = `<div class="form-message error">${result.message || 'Failed to load users'}</div>`;
            }
        }
    } catch (error) {
        console.error('Error loading users:', error);
        // If API fails and bypass is on, show example data
        if (apiBypass) {
            renderUserList(getExampleUsers());
        } else {
            listDiv.innerHTML = `<div class="form-message error">Error: ${error.message}</div>`;
        }
    }
}

// Get Example Users (for API bypass)
function getExampleUsers() {
    return [
        { id: 1, username: 'kevin', email: 'kevin@vilostudios.com', role: 'manager', status: 'active', created_at: '2024-01-15 10:30:00' },
        { id: 2, username: 'sarah', email: 'sarah@vilostudios.com', role: 'ambassador', status: 'active', created_at: '2024-02-20 14:15:00' },
        { id: 3, username: 'mike', email: 'mike@vilostudios.com', role: 'internal_recruiter', status: 'active', created_at: '2024-03-10 09:00:00' },
        { id: 4, username: 'jane', email: 'jane@partnerstudio.com', role: 'production_assistant', status: 'active', created_at: '2024-04-05 16:45:00' },
        { id: 5, username: 'client1', email: 'client1@example.com', role: 'client', status: 'active', created_at: '2024-05-12 11:20:00' },
        { id: 6, username: 'banned_user', email: 'banned@example.com', role: 'client', status: 'banned', created_at: '2024-01-20 08:00:00' },
        { id: 7, username: 'restricted_user', email: 'restricted@example.com', role: 'production_assistant', status: 'restricted', created_at: '2024-02-28 13:30:00' }
    ];
}

// Get Example Applications (for API bypass)
function getExampleApplications(category = 'database', status = 'all', searchQuery = '') {
    const allExamples = [
        // Database Positions
        { 
            id: 1, 
            name: 'Sarah Johnson', 
            email: 'sarah.johnson@example.com', 
            phone: '+1 (555) 123-4567',
            role: 'Animation Director (作画監督)', 
            department: 'animation',
            company: 'Vilostudios',
            status: 'pending',
            submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'I am an experienced animation director with over 10 years in the industry, specializing in anime production...',
            cv_path: null,
            portfolio_url: 'https://sarahjohnson-animation.portfolio.com'
        },
        { 
            id: 2, 
            name: 'Michael Chen', 
            email: 'mchen@example.com', 
            phone: '+1 (555) 234-5678',
            role: 'Key Animator (原画)', 
            department: 'animation',
            company: 'Vilostudios',
            status: 'accepted',
            submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            processed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            processed_by: {
                name: 'Sarah Williams',
                email: 'sarah.williams@vilostudios.com',
                role: 'Internal Recruiter'
            },
            coverLetter: 'Passionate key animator seeking opportunities in anime production...',
            cv_path: null
        },
        { 
            id: 3, 
            name: 'Emma Williams', 
            email: 'emma.w@example.com', 
            phone: null, // Phone optional
            role: 'Background Artist (背景)', 
            department: 'background-art',
            company: 'Vilostudios',
            status: 'pending',
            submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'Experienced background artist with a strong portfolio in environmental design...',
            cv_path: 'uploads/cvs/emma_williams_cv.pdf', // Example CV
            portfolio_url: 'https://emmawilliams-art.portfolio.com'
        },
        // Bot detected examples
        { 
            id: 99, 
            name: 'Test User', 
            email: 'test@test.com', 
            phone: '+1 (555) 999-9999',
            role: 'Animator', 
            department: 'animation',
            company: 'Vilostudios',
            status: 'pending',
            submitted_at: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'This is a test application',
            cv_path: null,
            portfolio_url: null
        },
        { 
            id: 100, 
            name: 'Bot', 
            email: 'bot@example.com', 
            phone: null,
            role: 'Key Animator', 
            department: 'animation',
            company: 'Vilostudios',
            status: 'pending',
            submitted_at: new Date(Date.now() - 0.25 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'Automated submission',
            cv_path: null,
            portfolio_url: null
        },
        { 
            id: 101, 
            name: '123', 
            email: 'spam@fake.com', 
            phone: null,
            role: 'Background Artist', 
            department: 'background-art',
            company: 'Vilostudios',
            status: 'pending',
            submitted_at: new Date(Date.now() - 0.1 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'Hi',
            cv_path: null,
            portfolio_url: null
        },
        // Project Positions
        { 
            id: 4, 
            name: 'David Kim', 
            email: 'david.kim@example.com', 
            phone: '+1 (555) 456-7890',
            role: 'Character Designer', 
            department: 'character-design',
            company: 'Vilostudios',
            status: 'pending',
            submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'Character designer specializing in anime character creation...',
            cv_path: null
        },
        { 
            id: 5, 
            name: 'Lisa Anderson', 
            email: 'lisa.anderson@example.com', 
            phone: '+1 (555) 567-8901',
            role: 'Color Designer', 
            department: 'color-design',
            company: 'Vilostudios',
            status: 'declined',
            submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            processed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            processed_by: {
                name: 'Mike Johnson',
                email: 'mike.johnson@vilostudios.com',
                role: 'Manager'
            },
            coverLetter: 'Color design specialist with experience in anime production...',
            cv_path: null,
            portfolio_url: null
        },
        // Internship Positions
        { 
            id: 6, 
            name: 'Alex Rodriguez', 
            email: 'alex.r@example.com', 
            phone: null,
            role: 'Animation Intern', 
            department: 'animation',
            company: 'Vilostudios',
            status: 'pending',
            submitted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'Recent animation graduate seeking internship opportunities...',
            cv_path: null,
            portfolio_url: 'https://alexrodriguez-anim.behance.net'
        },
        // Tech Positions (Vilostudios Technologies)
        { 
            id: 7, 
            name: 'James Park', 
            email: 'james.park@example.com', 
            phone: '+1 (555) 678-9012',
            role: 'Software Developer', 
            department: 'technology',
            company: 'Vilostudios Technologies',
            status: 'accepted',
            submitted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            processed_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            processed_by: {
                name: 'Kevin Manager',
                email: 'kevin@vilostudios.com',
                role: 'Manager'
            },
            coverLetter: 'Full-stack developer with experience in animation production tools...',
            cv_path: null,
            portfolio_url: 'https://jamespark.dev'
        },
        // Management Positions (Vilostudios)
        { 
            id: 8, 
            name: 'Rachel Thompson', 
            email: 'rachel.t@example.com', 
            phone: '+1 (555) 789-0123',
            role: 'Project Manager', 
            department: 'internal-management',
            company: 'Vilostudios',
            status: 'pending',
            submitted_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'Experienced project manager in creative industries...',
            cv_path: null,
            portfolio_url: null
        },
        // Sound Positions (Hex Archive)
        { 
            id: 9, 
            name: 'Tom Wilson', 
            email: 'tom.wilson@example.com', 
            phone: '+1 (555) 890-1234',
            role: 'Sound Designer', 
            department: 'sound',
            company: 'Hex Archive',
            status: 'pending',
            submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'Audio professional with expertise in game and animation sound design...',
            cv_path: null,
            portfolio_url: 'https://tomwilson-audio.soundcloud.com'
        }
    ];
    
    // Filter by category
    let filtered = allExamples;
    if (category === 'database') {
        filtered = allExamples.filter(app => ['animation', 'character-design', 'color-design', 'background-art'].includes(app.department));
    } else if (category === 'project') {
        filtered = allExamples.filter(app => app.id === 4 || app.id === 5);
    } else if (category === 'internship') {
        filtered = allExamples.filter(app => app.id === 6);
    } else if (category === 'tech') {
        filtered = allExamples.filter(app => app.company === 'Vilostudios Technologies');
    } else if (category === 'management') {
        filtered = allExamples.filter(app => app.company === 'Vilostudios' && app.department === 'internal-management');
    } else if (category === 'sound') {
        filtered = allExamples.filter(app => app.company === 'Hex Archive');
    }
    
    // Filter by status
    if (status !== 'all') {
        filtered = filtered.filter(app => app.status === status);
    }
    
    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(app => 
            app.name.toLowerCase().includes(query) ||
            app.email.toLowerCase().includes(query) ||
            app.role.toLowerCase().includes(query)
        );
    }
    
    return filtered;
}

// Render User List
function renderUserList(users) {
    const listDiv = document.getElementById('user-management-list');
    
    if (users.length === 0) {
        listDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.4);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3; margin-bottom: 1rem;">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <p style="font-size: var(--font-md); margin-top: 0.5rem;">No users found</p>
            </div>
        `;
        return;
    }
    
    listDiv.innerHTML = users.map(user => {
        const status = user.status || 'active';
        const role = user.role || 'user';
        const statusClass = status === 'banned' ? 'banned' : status === 'restricted' ? 'restricted' : 'active';
        
        return `
        <div class="user-management-item" data-status="${statusClass}">
            <div class="user-item-header">
                <div class="user-item-info">
                    <div class="user-item-name">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; opacity: 0.6;">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${escapeHtml(user.username || 'N/A')}
                    </div>
                    <div class="user-item-email">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem; opacity: 0.5;">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        ${escapeHtml(user.email)}
                    </div>
                </div>
                <div class="user-item-meta-right">
                    <span class="role-badge ${role}">${formatRoleName(role)}</span>
                    <span class="status-badge ${statusClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
            </div>
            <div class="user-item-actions">
                <span class="user-item-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem; opacity: 0.5;">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Joined: ${new Date(user.created_at).toLocaleDateString()}
                </span>
                <div class="user-action-buttons">
                    ${status !== 'banned' ? `
                        <button class="user-action-btn ban-btn" onclick="banUser(${user.id}, '${escapeHtml(user.email)}')" title="Ban user">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            Ban
                        </button>
                    ` : `
                        <button class="user-action-btn unban-btn" onclick="unbanUser(${user.id}, '${escapeHtml(user.email)}')" title="Unban user">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M8 12h8"></path>
                            </svg>
                            Unban
                        </button>
                    `}
                    ${status !== 'restricted' ? `
                        <button class="user-action-btn restrict-btn" onclick="restrictUser(${user.id}, '${escapeHtml(user.email)}')" title="Restrict user">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Restrict
                        </button>
                    ` : `
                        <button class="user-action-btn unrestrict-btn" onclick="unrestrictUser(${user.id}, '${escapeHtml(user.email)}')" title="Remove restriction">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                <line x1="12" y1="15" x2="12" y2="18"></line>
                            </svg>
                            Unrestrict
                        </button>
                    `}
                    <button class="user-action-btn remove-btn" onclick="removeUser(${user.id}, '${escapeHtml(user.email)}')" title="Remove user">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// Ban User
async function banUser(userId, email) {
    if (!confirm(`Are you sure you want to ban ${email}? This will add them to the blacklist.`)) {
        return;
    }
    
    try {
        const response = await fetch('../../api/users/ban.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, email })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            loadUsers();
        } else {
            alert(result.message || 'Failed to ban user');
        }
    } catch (error) {
        // If API fails and bypass is on, just reload
        if (localStorage.getItem('vilostudios_api_bypass') === 'true') {
            loadUsers();
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Unban User
async function unbanUser(userId, email) {
    try {
        const response = await fetch('../../api/users/unban.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, email })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            loadUsers();
        } else {
            alert(result.message || 'Failed to unban user');
        }
    } catch (error) {
        if (localStorage.getItem('vilostudios_api_bypass') === 'true') {
            loadUsers();
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Restrict User
async function restrictUser(userId, email) {
    if (!confirm(`Are you sure you want to restrict ${email}?`)) {
        return;
    }
    
    try {
        const response = await fetch('../../api/users/restrict.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, email })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            loadUsers();
        } else {
            alert(result.message || 'Failed to restrict user');
        }
    } catch (error) {
        if (localStorage.getItem('vilostudios_api_bypass') === 'true') {
            loadUsers();
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Unrestrict User
async function unrestrictUser(userId, email) {
    try {
        const response = await fetch('../../api/users/unrestrict.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, email })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            loadUsers();
        } else {
            alert(result.message || 'Failed to remove restriction');
        }
    } catch (error) {
        if (localStorage.getItem('vilostudios_api_bypass') === 'true') {
            loadUsers();
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Remove User
async function removeUser(userId, email) {
    if (!confirm(`Are you sure you want to permanently remove ${email}? This action cannot be undone.`)) {
        return;
    }
    
    if (!confirm(`Final confirmation: Remove ${email} permanently?`)) {
        return;
    }
    
    try {
        const response = await fetch('../../api/users/remove.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, email })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            loadUsers();
        } else {
            alert(result.message || 'Failed to remove user');
        }
    } catch (error) {
        if (localStorage.getItem('vilostudios_api_bypass') === 'true') {
            loadUsers();
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Format Role Name
function formatRoleName(role) {
    const roleMap = {
        'manager': 'Manager',
        'ambassador': 'Ambassador',
        'internal_recruiter': 'Recruiter',
        'production_assistant': 'PA',
        'client': 'Client',
        'freelancer': 'Freelancer'
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
}

// Render Projects Page
function renderProjectsPage() {
    const otherPages = document.getElementById('other-pages');
    
    otherPages.innerHTML = `
        <div class="projects-panel">
            <div class="projects-header">
                <div class="projects-header-top">
                    <h3 class="panel-title">
                        <svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Projects
                    </h3>
                    <button class="btn-create-project" id="btn-create-project">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        Create Project
                    </button>
                </div>
            </div>
            <div id="projects-list" class="projects-list">
                <div class="loading-state">Loading projects...</div>
            </div>
        </div>
    `;
    
    // Setup create project button
    const createProjectBtn = document.getElementById('btn-create-project');
    if (createProjectBtn) {
        createProjectBtn.addEventListener('click', () => {
            openCreateProjectModal();
        });
    }
    
    // Load projects
    loadProjects();
}

// Load Projects
async function loadProjects() {
    const listDiv = document.getElementById('projects-list');
    if (!listDiv) return;
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        const exampleProjects = getExampleProjects();
        displayProjects(exampleProjects);
        return;
    }
    
    try {
        const response = await fetch('../../api/projects/list.php');
        const result = await response.json();
        
        if (result.success && result.data) {
            displayProjects(result.data);
        } else {
            listDiv.innerHTML = `<div class="empty-state">${result.message || 'Failed to load projects'}</div>`;
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        listDiv.innerHTML = '<div class="empty-state">Error loading projects</div>';
    }
}

// Get Example Projects (for API bypass)
function getExampleProjects() {
    return [
        {
            id: 1,
            project_name: 'Wuthering Waves - Where Are You Rover?',
            client_name: 'Kuro Games',
            cover_image_path: 'uploads/projects/covers/kuro_games_cover.jpg',
            creation_date: '2024-01-15',
            finished_date: null,
            nda_enabled: 0,
            nda_date: null,
            is_public: 1,
            is_locked: 0,
            is_hidden: 0,
            team_member_count: 12,
            created_at: '2024-01-15 10:00:00'
        }
    ];
}

// Display Projects
function displayProjects(projects) {
    const listDiv = document.getElementById('projects-list');
    if (!listDiv) return;
    
    if (projects.length === 0) {
        listDiv.innerHTML = '<div class="empty-state">No projects yet. Click "Create Project" to add one.</div>';
        return;
    }
    
    const projectsHTML = projects.map(project => {
        const creationDate = project.creation_date ? new Date(project.creation_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'Not set';
        
        const finishedDate = project.finished_date ? new Date(project.finished_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'Ongoing';
        
        // Handle cover image path - check if it's a relative path or absolute
        let coverImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFBMUExRiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlciBJbWFnZTwvdGV4dD48L3N2Zz4=';
        
        if (project.cover_image_path) {
            if (project.cover_image_path.startsWith('http://') || project.cover_image_path.startsWith('https://')) {
                coverImage = project.cover_image_path;
            } else if (project.cover_image_path.startsWith('uploads/')) {
                coverImage = `../../${project.cover_image_path}`;
            } else {
                coverImage = `../../uploads/projects/covers/${project.cover_image_path}`;
            }
        }
        
        return `
            <div class="project-card ${project.is_hidden ? 'project-hidden' : ''} ${project.is_locked ? 'project-locked' : ''}">
                <div class="project-card-cover">
                    <img src="${coverImage}" alt="${escapeHtml(project.project_name)}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFBMUExRiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlciBJbWFnZTwvdGV4dD48L3N2Zz4=';">
                    ${project.is_hidden ? '<div class="project-hidden-badge">Hidden</div>' : ''}
                    ${project.is_locked ? '<div class="project-locked-badge">Locked</div>' : ''}
                    ${!project.is_public ? '<div class="project-nda-badge">NDA</div>' : ''}
                </div>
                <div class="project-card-body">
                    <h3 class="project-card-title">${escapeHtml(project.project_name)}</h3>
                    ${project.client_name ? `<p class="project-card-client">Client: ${escapeHtml(project.client_name)}</p>` : ''}
                    <div class="project-card-info">
                        <div class="project-info-item">
                            <strong>Created:</strong> ${creationDate}
                        </div>
                        <div class="project-info-item">
                            <strong>Finished:</strong> ${finishedDate}
                        </div>
                        ${project.team_member_count > 0 ? `
                        <div class="project-info-item">
                            <strong>Team:</strong> ${project.team_member_count} member${project.team_member_count !== 1 ? 's' : ''}
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="project-card-actions">
                    <button class="btn-project-action btn-edit" data-project-id="${project.id}" title="Edit Project">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-project-action btn-lock" data-project-id="${project.id}" data-locked="${project.is_locked ? 1 : 0}" title="${project.is_locked ? 'Unlock' : 'Lock'} Project">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${project.is_locked ? `
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            ` : `
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            <line x1="12" y1="16" x2="12" y2="16"></line>
                            `}
                        </svg>
                    </button>
                    <button class="btn-project-action btn-hide" data-project-id="${project.id}" data-hidden="${project.is_hidden ? 1 : 0}" title="${project.is_hidden ? 'Unhide' : 'Hide'} Project">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${project.is_hidden ? `
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                            ` : `
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                            `}
                        </svg>
                    </button>
                    <button class="btn-project-action btn-delete" data-project-id="${project.id}" title="Delete Project">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    listDiv.innerHTML = projectsHTML;
    
    // Setup action button handlers
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.projectId;
            const projectData = projects.find(p => p.id == projectId);
            if (projectData) {
                openEditProjectModal(projectId, projectData);
            }
        });
    });
    
    document.querySelectorAll('.btn-lock').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.projectId;
            const isLocked = btn.dataset.locked === '1';
            handleLockProject(projectId, !isLocked);
        });
    });
    
    document.querySelectorAll('.btn-hide').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.projectId;
            const isHidden = btn.dataset.hidden === '1';
            handleHideProject(projectId, !isHidden);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.projectId;
            handleDeleteProject(projectId);
        });
    });
}

// Handle Lock Project
async function handleLockProject(projectId, lock) {
    showConfirmDialog(
        lock ? 'Lock Project' : 'Unlock Project',
        lock 
            ? 'Are you sure you want to lock this project? Locked projects cannot be edited or modified.'
            : 'Are you sure you want to unlock this project? It will become editable again.',
        lock ? 'Lock' : 'Unlock',
        'Cancel',
        async () => {
            await performLockProject(projectId, lock);
        }
    );
}

// Perform Lock Project
async function performLockProject(projectId, lock) {
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        showSuccessDialog(`Project ${lock ? 'locked' : 'unlocked'} successfully!`, () => {
            loadProjects();
        });
        return;
    }
    
    try {
        const response = await fetch('../../api/projects/update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_id: projectId,
                is_locked: lock
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessDialog(`Project ${lock ? 'locked' : 'unlocked'} successfully!`, () => {
                loadProjects();
            });
        } else {
            showErrorDialog(result.message || 'Failed to update project');
        }
    } catch (error) {
        console.error('Error updating project:', error);
        showErrorDialog('Error updating project: ' + error.message);
    }
}

// Handle Hide Project
async function handleHideProject(projectId, hide) {
    showConfirmDialog(
        hide ? 'Hide Project' : 'Unhide Project',
        hide 
            ? 'Are you sure you want to hide this project? It will not be visible to the public until you unhide it.'
            : 'Are you sure you want to unhide this project? It will become visible to the public.',
        hide ? 'Hide' : 'Unhide',
        'Cancel',
        async () => {
            await performHideProject(projectId, hide);
        }
    );
}

// Perform Hide Project
async function performHideProject(projectId, hide) {
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        showSuccessDialog(`Project ${hide ? 'hidden' : 'unhidden'} successfully!`, () => {
            loadProjects();
        });
        return;
    }
    
    try {
        const response = await fetch('../../api/projects/update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_id: projectId,
                is_hidden: hide
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessDialog(`Project ${hide ? 'hidden' : 'unhidden'} successfully!`, () => {
                loadProjects();
            });
        } else {
            showErrorDialog(result.message || 'Failed to update project');
        }
    } catch (error) {
        console.error('Error updating project:', error);
        showErrorDialog('Error updating project: ' + error.message);
    }
}

// Handle Delete Project
async function handleDeleteProject(projectId) {
    showConfirmDialog(
        'Delete Project',
        'Are you sure you want to delete this project? This action cannot be undone. All project data, team members, and associated information will be permanently removed.',
        'Delete',
        'Cancel',
        async () => {
            await performDeleteProject(projectId);
        },
        'danger'
    );
}

// Perform Delete Project
async function performDeleteProject(projectId) {
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        showSuccessDialog('Project deleted successfully!', () => {
            loadProjects();
        });
        return;
    }
    
    try {
        const response = await fetch('../../api/projects/delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_id: projectId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessDialog('Project deleted successfully!', () => {
                loadProjects();
            });
        } else {
            showErrorDialog(result.message || 'Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showErrorDialog('Error deleting project: ' + error.message);
    }
}

// Show Confirmation Dialog
function showConfirmDialog(title, message, confirmText, cancelText, onConfirm, type = 'default') {
    const modal = document.createElement('div');
    modal.className = 'confirm-dialog-overlay';
    modal.innerHTML = `
        <div class="confirm-dialog ${type === 'danger' ? 'confirm-dialog-danger' : ''}">
            <div class="confirm-dialog-header">
                <h3>${escapeHtml(title)}</h3>
            </div>
            <div class="confirm-dialog-body">
                <p>${escapeHtml(message)}</p>
            </div>
            <div class="confirm-dialog-actions">
                <button class="btn-confirm-cancel">${escapeHtml(cancelText)}</button>
                <button class="btn-confirm-ok ${type === 'danger' ? 'btn-confirm-danger' : ''}">${escapeHtml(confirmText)}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const cancelBtn = modal.querySelector('.btn-confirm-cancel');
    const confirmBtn = modal.querySelector('.btn-confirm-ok');
    
    const closeDialog = () => {
        document.body.removeChild(modal);
    };
    
    cancelBtn.addEventListener('click', closeDialog);
    confirmBtn.addEventListener('click', () => {
        closeDialog();
        if (onConfirm) onConfirm();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeDialog();
    });
}

// Show Success Dialog
function showSuccessDialog(message, onClose) {
    const modal = document.createElement('div');
    modal.className = 'confirm-dialog-overlay';
    modal.innerHTML = `
        <div class="confirm-dialog confirm-dialog-success">
            <div class="confirm-dialog-header">
                <h3>Success</h3>
            </div>
            <div class="confirm-dialog-body">
                <p>${escapeHtml(message)}</p>
            </div>
            <div class="confirm-dialog-actions">
                <button class="btn-confirm-ok">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const confirmBtn = modal.querySelector('.btn-confirm-ok');
    
    const closeDialog = () => {
        document.body.removeChild(modal);
        if (onClose) onClose();
    };
    
    confirmBtn.addEventListener('click', closeDialog);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeDialog();
    });
}

// Show Error Dialog
function showErrorDialog(message) {
    const modal = document.createElement('div');
    modal.className = 'confirm-dialog-overlay';
    modal.innerHTML = `
        <div class="confirm-dialog confirm-dialog-error">
            <div class="confirm-dialog-header">
                <h3>Error</h3>
            </div>
            <div class="confirm-dialog-body">
                <p>${escapeHtml(message)}</p>
            </div>
            <div class="confirm-dialog-actions">
                <button class="btn-confirm-ok">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const confirmBtn = modal.querySelector('.btn-confirm-ok');
    
    const closeDialog = () => {
        document.body.removeChild(modal);
    };
    
    confirmBtn.addEventListener('click', closeDialog);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeDialog();
    });
}

// Open Edit Project Modal
function openEditProjectModal(projectId, projectData) {
    if (!projectData) {
        showErrorDialog('Project data not found');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.innerHTML = `
        <div class="project-modal">
            <div class="project-modal-header">
                <h2>Edit Project</h2>
                <button class="btn-close-modal">&times;</button>
            </div>
            <div class="project-modal-body">
                <form id="edit-project-form">
                    <div class="form-group">
                        <label for="edit-project-name">Project Name *</label>
                        <input type="text" id="edit-project-name" name="project_name" value="${escapeHtml(projectData.project_name || '')}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-client-name">Client Name</label>
                        <input type="text" id="edit-client-name" name="client_name" value="${escapeHtml(projectData.client_name || '')}">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-cover-image">Cover Image</label>
                        <div class="project-cover-upload">
                            <input type="file" id="edit-cover-image" accept="image/*" style="display: none;">
                            <button type="button" class="btn-secondary" onclick="document.getElementById('edit-cover-image').click()">Choose Image</button>
                            <div class="cover-preview" id="edit-cover-preview">
                                ${projectData.cover_image_path ? `<img src="../../${projectData.cover_image_path}" alt="Cover preview" style="max-width: 100%; max-height: 200px; border-radius: var(--radius-md); margin-top: var(--spacing-md);">` : '<p style="margin-top: var(--spacing-md); color: var(--text-secondary);">No cover image</p>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-creation-date">Creation Date</label>
                            <input type="date" id="edit-creation-date" name="creation_date" value="${projectData.creation_date || ''}">
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-finished-date">Finished Date</label>
                            <input type="date" id="edit-finished-date" name="finished_date" value="${projectData.finished_date || ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="edit-nda-enabled" name="nda_enabled" ${projectData.nda_enabled ? 'checked' : ''}>
                            <span>Enable NDA (Non-Disclosure Agreement)</span>
                        </label>
                    </div>
                    
                    <div class="form-group" id="edit-nda-date-group" style="${projectData.nda_enabled ? '' : 'display: none;'}">
                        <label for="edit-nda-date">NDA Date (Optional - if not set, project remains private)</label>
                        <input type="date" id="edit-nda-date" name="nda_date" value="${projectData.nda_date || ''}">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="edit-cancel-btn">Cancel</button>
                        <button type="submit" class="btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle cover image upload
    const coverInput = document.getElementById('edit-cover-image');
    const coverPreview = document.getElementById('edit-cover-preview');
    
    coverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                coverPreview.innerHTML = `<img src="${event.target.result}" alt="Cover preview" style="max-width: 100%; max-height: 200px; border-radius: var(--radius-md); margin-top: var(--spacing-md);">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle NDA checkbox
    const ndaCheckbox = document.getElementById('edit-nda-enabled');
    const ndaDateGroup = document.getElementById('edit-nda-date-group');
    
    ndaCheckbox.addEventListener('change', () => {
        ndaDateGroup.style.display = ndaCheckbox.checked ? 'block' : 'none';
    });
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.btn-close-modal');
    const cancelBtn = document.getElementById('edit-cancel-btn');
    
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Handle form submission
    const form = document.getElementById('edit-project-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleUpdateProject(projectId, form, coverInput, closeModal);
    });
}

// Handle Update Project
async function handleUpdateProject(projectId, form, coverInput, closeModal) {
    const formData = new FormData(form);
    const data = {
        project_id: projectId,
        project_name: formData.get('project_name'),
        client_name: formData.get('client_name') || null,
        creation_date: formData.get('creation_date') || null,
        finished_date: formData.get('finished_date') || null,
        nda_enabled: formData.get('nda_enabled') === 'on',
        nda_date: formData.get('nda_date') || null
    };
    
    // Handle cover image if changed
    if (coverInput.files.length > 0) {
        const file = coverInput.files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
            data.cover_image = e.target.result;
            await submitProjectUpdate(data, closeModal);
        };
        reader.readAsDataURL(file);
    } else {
        await submitProjectUpdate(data, closeModal);
    }
}

// Submit Project Update
async function submitProjectUpdate(data, closeModal) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        showSuccessDialog('Project updated successfully!', () => {
            closeModal();
            loadProjects();
        });
        return;
    }
    
    try {
        const response = await fetch('../../api/projects/update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessDialog('Project updated successfully!', () => {
                closeModal();
                loadProjects();
            });
        } else {
            showErrorDialog(result.message || 'Failed to update project');
        }
    } catch (error) {
        console.error('Error updating project:', error);
        showErrorDialog('Error updating project: ' + error.message);
    }
}

// Open Create Project Modal
function openCreateProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.innerHTML = `
        <div class="project-modal">
            <div class="project-modal-header">
                <h2>Create New Project</h2>
                <button class="btn-close-modal">&times;</button>
            </div>
            <div class="project-modal-body">
                <form id="create-project-form">
                    <!-- Project Name -->
                    <div class="form-group">
                        <label>Project Name *</label>
                        <input type="text" id="project-name" class="form-input" required>
                    </div>
                    
                    <!-- Client Selection -->
                    <div class="form-group">
                        <label>Client</label>
                        <input type="text" id="client-name" class="form-input" placeholder="Enter client name">
                    </div>
                    
                    <!-- Cover Image Upload -->
                    <div class="form-group">
                        <label>Cover Image</label>
                        <div class="cover-upload-area" id="cover-upload-area">
                            <input type="file" id="cover-image-input" accept="image/*" style="display: none;">
                            <div class="cover-upload-preview" id="cover-preview">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                <p>Click to upload cover image</p>
                            </div>
                            <img id="cover-preview-img" style="display: none; max-width: 100%; max-height: 200px; border-radius: var(--radius-md);">
                        </div>
                    </div>
                    
                    <!-- Dates -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Creation Date</label>
                            <input type="date" id="creation-date" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>Finished Date</label>
                            <input type="date" id="finished-date" class="form-input">
                        </div>
                    </div>
                    
                    <!-- NDA Section -->
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="nda-enabled" class="checkbox-input">
                            <span>Enable NDA (Project will not be publicly available)</span>
                        </label>
                    </div>
                    
                    <div class="form-group" id="nda-date-group" style="display: none;">
                        <label>NDA Date (Optional - Project becomes public after this date)</label>
                        <input type="date" id="nda-date" class="form-input">
                        <small style="color: var(--text-secondary); font-size: var(--font-sm); margin-top: var(--spacing-xs); display: block;">
                            Leave empty to keep project private indefinitely
                        </small>
                    </div>
                    
                    <!-- Team Members -->
                    <div class="form-group">
                        <label>Team Members (Invite by Email)</label>
                        <div id="team-members-list" class="team-members-list"></div>
                        <button type="button" class="btn-add-member" id="btn-add-member">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14"></path>
                            </svg>
                            Add Team Member
                        </button>
                    </div>
                    
                    <!-- Submit Button -->
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="btn-cancel-project">Cancel</button>
                        <button type="submit" class="btn-primary" id="btn-submit-project">Create Project</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cover image upload handler
    const coverUploadArea = document.getElementById('cover-upload-area');
    const coverInput = document.getElementById('cover-image-input');
    const coverPreview = document.getElementById('cover-preview');
    const coverPreviewImg = document.getElementById('cover-preview-img');
    
    coverUploadArea.addEventListener('click', () => coverInput.click());
    coverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                coverPreview.style.display = 'none';
                coverPreviewImg.src = event.target.result;
                coverPreviewImg.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // NDA toggle handler
    const ndaEnabled = document.getElementById('nda-enabled');
    const ndaDateGroup = document.getElementById('nda-date-group');
    ndaEnabled.addEventListener('change', () => {
        ndaDateGroup.style.display = ndaEnabled.checked ? 'block' : 'none';
    });
    
    // Team members management
    let teamMembers = [];
    const addMemberBtn = document.getElementById('btn-add-member');
    const membersList = document.getElementById('team-members-list');
    
    function renderTeamMembers() {
        membersList.innerHTML = teamMembers.map((member, index) => `
            <div class="team-member-item">
                <div class="team-member-fields">
                    <input type="email" placeholder="Email" class="form-input" value="${escapeHtml(member.email)}" required>
                    <input type="text" placeholder="Role" class="form-input" value="${escapeHtml(member.role || '')}">
                    <input type="text" placeholder="Credits" class="form-input" value="${escapeHtml(member.credits || '')}">
                    <button type="button" class="btn-remove-member" data-index="${index}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Setup remove buttons
        document.querySelectorAll('.btn-remove-member').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                teamMembers.splice(index, 1);
                renderTeamMembers();
            });
        });
        
        // Setup input handlers
        document.querySelectorAll('.team-member-item input').forEach((input, idx) => {
            const itemIndex = Math.floor(idx / 3);
            const fieldIndex = idx % 3;
            input.addEventListener('input', () => {
                if (fieldIndex === 0) teamMembers[itemIndex].email = input.value;
                else if (fieldIndex === 1) teamMembers[itemIndex].role = input.value;
                else if (fieldIndex === 2) teamMembers[itemIndex].credits = input.value;
            });
        });
    }
    
    addMemberBtn.addEventListener('click', () => {
        teamMembers.push({ email: '', role: '', credits: '' });
        renderTeamMembers();
    });
    
    // Close modal handlers
    modal.querySelector('.btn-close-modal').addEventListener('click', () => modal.remove());
    document.getElementById('btn-cancel-project').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Form submission
    document.getElementById('create-project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('btn-submit-project');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';
        
        try {
            // Get cover image as base64
            let coverImage = null;
            if (coverPreviewImg.style.display === 'block' && coverPreviewImg.src) {
                coverImage = coverPreviewImg.src;
            }
            
            // Collect team members data
            const members = teamMembers.filter(m => m.email.trim() !== '').map(m => ({
                email: m.email.trim(),
                role: m.role.trim() || null,
                credits: m.credits.trim() || null
            }));
            
            const projectData = {
                project_name: document.getElementById('project-name').value.trim(),
                client_name: document.getElementById('client-name').value.trim() || null,
                cover_image: coverImage,
                creation_date: document.getElementById('creation-date').value || null,
                finished_date: document.getElementById('finished-date').value || null,
                nda_enabled: document.getElementById('nda-enabled').checked,
                nda_date: document.getElementById('nda-date').value || null,
                team_members: members,
                created_by: userName
            };
            
            const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
            
            if (apiBypass) {
                alert('Project created successfully! (API Bypass Mode)');
                modal.remove();
                return;
            }
            
            const response = await fetch('../../api/projects/create.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Project created successfully!');
                modal.remove();
                renderProjectsPage();
            } else {
                alert(result.message || 'Failed to create project');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Project';
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error creating project: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Project';
        }
    });
}

// Render Freelancer Database Page
function renderFreelancerDatabasePage() {
    const otherPages = document.getElementById('other-pages');
    
    otherPages.innerHTML = `
        <div class="freelancer-database-panel">
            <div class="list-panel-header">
                <div class="list-panel-header-top">
                    <h3 class="panel-title">
                        <svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        VILOSTUDIOS Freelancers
                    </h3>
                </div>
                <!-- Tabs -->
                <div class="freelancer-database-tabs">
                    <button class="freelancer-database-tab active" data-tab="database">Database</button>
                    <button class="freelancer-database-tab" data-tab="add">Add Freelancer</button>
                </div>
            </div>
            
            <!-- Database Tab Content -->
            <div id="freelancer-database-tab-content" class="freelancer-tab-content active">
                <div class="freelancer-database-header">
                    <div class="freelancer-database-header-actions">
                        <button class="btn-action-secondary" id="btn-export-freelancers" title="Export freelancers">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export
                        </button>
                        <button class="btn-action-secondary" id="btn-import-freelancers" title="Import freelancers">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Import
                        </button>
                    </div>
                    <div class="list-filters">
                        <div class="search-wrapper">
                            <input 
                                type="text" 
                                id="freelancer-search" 
                                class="form-input search-input-enhanced" 
                                placeholder="Search by name, email, skills, or specialty..."
                                autocomplete="off"
                            >
                        </div>
                        <div class="filter-tags">
                            <button class="filter-tag active" data-filter="">All</button>
                            <button class="filter-tag" data-filter="animation">Animation</button>
                            <button class="filter-tag" data-filter="character-design">Character Design</button>
                            <button class="filter-tag" data-filter="color-design">Color Design</button>
                            <button class="filter-tag" data-filter="background-art">Background Art</button>
                            <button class="filter-tag" data-filter="3d-cgi">3D/CG</button>
                            <button class="filter-tag" data-filter="editing">Editing</button>
                            <button class="filter-tag" data-filter="sound-design">Sound Design</button>
                            <button class="filter-tag" data-filter="music">Music</button>
                            <button class="filter-tag" data-filter="voice-acting">Voice Acting</button>
                            <button class="filter-tag" data-filter="production">Production</button>
                            <button class="filter-tag" data-filter="photography-compositing">Compositing</button>
                        </div>
                    </div>
                </div>
                <div id="freelancer-database-list" class="freelancer-database-list">
                    <!-- List will be populated here -->
                </div>
            </div>
            
            <!-- Add Freelancer Tab Content -->
            <div id="freelancer-add-tab-content" class="freelancer-tab-content">
                <div class="add-freelancer-form-container">
                    <form id="add-freelancer-form" class="add-freelancer-form">
                        <div class="form-group">
                            <label for="add-freelancer-name" class="form-label">Name *</label>
                            <input type="text" id="add-freelancer-name" name="name" class="form-input" required placeholder="Enter freelancer name">
                        </div>
                        
                        <div class="form-group">
                            <label for="add-freelancer-email" class="form-label">Email</label>
                            <input type="email" id="add-freelancer-email" name="email" class="form-input" placeholder="freelancer@example.com">
                        </div>
                        
                        <div class="form-group">
                            <label for="add-freelancer-main-role" class="form-label">Main Role</label>
                            <input type="text" id="add-freelancer-main-role" name="main_role" class="form-input" placeholder="e.g., Key Animator, Sound Designer">
                        </div>
                        
                        <div class="form-group">
                            <label for="add-freelancer-main-department" class="form-label">Main Department</label>
                            <select id="add-freelancer-main-department" name="main_department" class="form-input">
                                <option value="">Select department</option>
                                <option value="animation">Animation</option>
                                <option value="character-design">Character Design</option>
                                <option value="color-design">Color Design</option>
                                <option value="background-art">Background Art</option>
                                <option value="3d-cgi">3D/CG</option>
                                <option value="editing">Editing</option>
                                <option value="sound-design">Sound Design</option>
                                <option value="music">Music</option>
                                <option value="voice-acting">Voice Acting</option>
                                <option value="production">Production</option>
                                <option value="photography-compositing">Compositing</option>
                                <option value="technology">Technology</option>
                                <option value="internal-management">Internal Management</option>
                                <option value="development">Development</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Additional Departments (Optional)</label>
                            <div class="department-checkboxes">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="animation">
                                    <span>Animation</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="character-design">
                                    <span>Character Design</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="color-design">
                                    <span>Color Design</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="background-art">
                                    <span>Background Art</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="3d-cgi">
                                    <span>3D/CG</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="editing">
                                    <span>Editing</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="sound-design">
                                    <span>Sound Design</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="music">
                                    <span>Music</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="voice-acting">
                                    <span>Voice Acting</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="production">
                                    <span>Production</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="photography-compositing">
                                    <span>Compositing</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="technology">
                                    <span>Technology</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="internal-management">
                                    <span>Internal Management</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="departments" value="development">
                                    <span>Development</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" id="btn-cancel-add-freelancer">Cancel</button>
                            <button type="submit" class="btn-primary" id="btn-submit-add-freelancer">Add Freelancer</button>
                        </div>
                        
                        <div id="add-freelancer-message"></div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Setup tab switching
    document.querySelectorAll('.freelancer-database-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.freelancer-database-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show/hide content
            document.querySelectorAll('.freelancer-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            if (tabName === 'database') {
                document.getElementById('freelancer-database-tab-content').classList.add('active');
            } else if (tabName === 'add') {
                document.getElementById('freelancer-add-tab-content').classList.add('active');
            }
        });
    });
    
    // Setup search and filter handlers
    const searchInput = document.getElementById('freelancer-search');
    if (searchInput) {
        searchInput.addEventListener('input', loadFreelancers);
    }
    
    // Filter tag handlers
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            loadFreelancers();
        });
    });
    
    // Load initial list
    loadFreelancers();
    
    // Setup Export/Import buttons for freelancers
    const exportFreelancersBtn = document.getElementById('btn-export-freelancers');
    if (exportFreelancersBtn) {
        exportFreelancersBtn.addEventListener('click', handleExportFreelancers);
    }
    
    const importFreelancersBtn = document.getElementById('btn-import-freelancers');
    if (importFreelancersBtn) {
        importFreelancersBtn.addEventListener('click', handleImportFreelancers);
    }
    
    // Setup Add Freelancer form
    const addFreelancerForm = document.getElementById('add-freelancer-form');
    if (addFreelancerForm) {
        addFreelancerForm.addEventListener('submit', handleAddFreelancer);
    }
    
    const cancelBtn = document.getElementById('btn-cancel-add-freelancer');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addFreelancerForm.reset();
            document.getElementById('add-freelancer-message').innerHTML = '';
        });
    }
}

// Get Example Freelancers (for API bypass)
function getExampleFreelancers() {
    return [
        { 
            id: 1, 
            name: 'Kevin MD', 
            email: 'kevin@vilostudios.com', 
            department: 'production',
            departments: ['production', 'sound-design'],
            roles: 'Anime Producer, Audio Director',
            created_at: '2025-10-22 08:05:17'
        },
        { 
            id: 4, 
            name: 'HeyNight', 
            email: '', 
            department: 'animation',
            departments: ['animation'],
            roles: 'Key Animator (Genga)',
            created_at: '2025-10-22 11:14:47'
        },
        { 
            id: 50, 
            name: 'Matthew Mai', 
            email: 'matthewmai146@gmail.com', 
            department: 'animation',
            departments: ['animation'],
            roles: 'Animation Director (作画監督/Sakkan)',
            created_at: '2025-10-28 16:17:22'
        },
        { 
            id: 77, 
            name: 'Raul Ortiz Campillo', 
            email: 'razzzus@gmail.com', 
            department: 'animation',
            departments: ['animation'],
            roles: 'Key Animator (原画 / Genga)',
            created_at: '2025-11-12 16:17:48'
        },
        { 
            id: 52, 
            name: 'Soleil Hampton', 
            email: 'soleilhampton@gmail.com', 
            department: '3d-cgi',
            departments: ['3d-cgi'],
            roles: 'Rigger / Technical Artist (リガー / テクニカルアーティスト)',
            created_at: '2025-11-12 15:36:47'
        },
        { 
            id: 54, 
            name: 'Aniyah Mehu', 
            email: 'ANMehu_18@yahoo.com', 
            department: 'character-design',
            departments: ['character-design'],
            roles: 'Character Designer',
            created_at: '2025-11-12 15:40:58'
        }
    ];
}

// Render Applications Page
function renderApplicationsPage() {
    const otherPages = document.getElementById('other-pages');
    
    otherPages.innerHTML = `
        <div class="applications-container">
            <div class="main-tabs-container">
                <div class="main-tabs">
                    <button class="main-tab active" data-main-tab="applications">
                        Applications
                    </button>
                    <button class="main-tab" data-main-tab="positions">
                        Positions
                    </button>
                    <button class="main-tab" data-main-tab="support-cases">
                        Support Cases
                    </button>
                    <button class="main-tab" data-main-tab="metrics">
                        Metrics
                    </button>
                </div>
            </div>

            <!-- Applications Tab Content -->
            <div id="applications-tab-content" class="tab-content active">
                <div class="applications-header">
                    <div class="applications-category-tabs">
                        <button class="application-category-tab active" data-category="database">
                            Database Positions
                        </button>
                        <button class="application-category-tab" data-category="project">
                            Project Positions
                        </button>
                        <button class="application-category-tab" data-category="internship">
                            Internship Positions
                        </button>
                        <button class="application-category-tab" data-category="tech">
                            Tech Positions
                            <span class="tab-company">(Vilostudios Technologies)</span>
                        </button>
                        <button class="application-category-tab" data-category="management">
                            Management Positions
                            <span class="tab-company">(Vilostudios)</span>
                        </button>
                        <button class="application-category-tab" data-category="sound">
                            Sound Positions
                            <span class="tab-company">(Hex Archive)</span>
                        </button>
                    </div>
                    <div class="applications-header-actions">
                        <button class="btn-action-secondary" id="btn-export-applications" title="Export applications">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export
                        </button>
                        <button class="btn-action-secondary" id="btn-import-applications" title="Import applications">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Import
                        </button>
                        <button class="btn-action btn-delete-old" id="btn-delete-old-applications">
                            Delete 30+ Days Old
                        </button>
                        <button class="btn-action btn-delete-suspicious" id="btn-delete-bot-applications">
                            Delete Bot Detected
                        </button>
                        <button class="btn-action btn-delete-suspicious" id="btn-delete-missing-portfolio-applications">
                            Delete Missing Portfolio
                        </button>
                    </div>
                    <div class="applications-filters">
                        <div class="search-wrapper">
                            <input 
                                type="text" 
                                id="applications-search" 
                                class="form-input search-input-enhanced" 
                                placeholder="Search by name, email, role..."
                                autocomplete="off"
                            >
                        </div>
                        <div class="status-filter-wrapper">
                            <button class="status-filter-btn" id="applications-status-filter-btn">
                                <span id="applications-status-filter-text">All Status</span>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="status-filter-dropdown" id="applications-status-filter-dropdown">
                                <div class="status-filter-item active" data-value="all">All Status</div>
                                <div class="status-filter-item" data-value="pending">Pending</div>
                                <div class="status-filter-item" data-value="accepted">Accepted</div>
                                <div class="status-filter-item" data-value="declined">Declined</div>
                                <div class="status-filter-item" data-value="missing-portfolio">Missing Portfolio</div>
                                <div class="status-filter-item" data-value="with-portfolio">With Portfolio</div>
                                <div class="status-filter-item" data-value="bots-detected">Bots Detected</div>
                            </div>
                        </div>
                        <input type="hidden" id="applications-status-filter" value="all">
                    </div>
                </div>
                <div id="applications-list" class="applications-list">
                    <div class="loading-state">Loading applications...</div>
                </div>
            </div>

            <!-- Support Cases Tab Content -->
            <div id="support-cases-tab-content" class="tab-content">
                <div class="support-cases-header">
                    <div class="support-cases-header-top">
                        <h2 class="support-cases-title">Career Support Cases</h2>
                    </div>
                    <div class="support-cases-filters">
                        <div class="search-wrapper">
                            <input 
                                type="text" 
                                id="support-cases-search" 
                                class="form-input search-input-enhanced" 
                                placeholder="Search by email, name, case ID..."
                                autocomplete="off"
                            >
                        </div>
                        <div class="status-filter-wrapper">
                            <button class="status-filter-btn" id="support-cases-email-filter-btn">
                                <span id="support-cases-email-filter-text">All Emails</span>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="status-filter-dropdown" id="support-cases-email-filter-dropdown">
                                <div class="status-filter-item active" data-value="all">All Emails</div>
                            </div>
                        </div>
                        <div class="status-filter-wrapper">
                            <button class="status-filter-btn" id="support-cases-status-filter-btn">
                                <span id="support-cases-status-filter-text">All Status</span>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="status-filter-dropdown" id="support-cases-status-filter-dropdown">
                                <div class="status-filter-item active" data-value="all">All Status</div>
                                <div class="status-filter-item" data-value="open">Open</div>
                                <div class="status-filter-item" data-value="in_progress">In Progress</div>
                                <div class="status-filter-item" data-value="resolved">Resolved</div>
                                <div class="status-filter-item" data-value="closed">Closed</div>
                            </div>
                        </div>
                        <input type="hidden" id="support-cases-email-filter" value="all">
                        <input type="hidden" id="support-cases-status-filter" value="all">
                    </div>
                </div>
                <div id="support-cases-list" class="support-cases-list">
                    <div class="loading-state">Loading support cases...</div>
                </div>
            </div>

            <!-- Metrics Tab Content -->
            <div id="metrics-tab-content" class="tab-content">
                <div class="metrics-container">
                    <div class="metrics-header">
                        <h2 class="metrics-title">Analytics & Metrics</h2>
                    </div>
                    
                    <div class="metrics-grid">
                        <!-- Personal Stats Card -->
                        <div class="metrics-card personal-stats-card">
                            <div class="metrics-card-header">
                                <h3>Your Personal Stats</h3>
                                <span class="metrics-card-badge" id="personal-stats-badge">Loading...</span>
                            </div>
                            <div class="metrics-card-body" id="personal-stats-content">
                                <div class="loading-state">Loading personal statistics...</div>
                            </div>
                        </div>
                        
                        <!-- Monthly Applicants Chart -->
                        <div class="metrics-card chart-card">
                            <div class="metrics-card-header">
                                <h3>Monthly Applicants</h3>
                            </div>
                            <div class="metrics-card-body">
                                <canvas id="monthly-applicants-chart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Daily Applicants Chart -->
                        <div class="metrics-card chart-card">
                            <div class="metrics-card-header">
                                <h3>Daily Applicants (Last 30 Days)</h3>
                            </div>
                            <div class="metrics-card-body">
                                <canvas id="daily-applicants-chart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Monthly Accepted Chart -->
                        <div class="metrics-card chart-card">
                            <div class="metrics-card-header">
                                <h3>Accepted by Month</h3>
                            </div>
                            <div class="metrics-card-body">
                                <canvas id="monthly-accepted-chart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Daily Accepted Chart -->
                        <div class="metrics-card chart-card">
                            <div class="metrics-card-header">
                                <h3>Daily Accepted (Last 30 Days)</h3>
                            </div>
                            <div class="metrics-card-body">
                                <canvas id="daily-accepted-chart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Recruiter Leaderboard -->
                        <div class="metrics-card leaderboard-card">
                            <div class="metrics-card-header">
                                <h3>Recruiter Leaderboard</h3>
                                <span class="metrics-card-subtitle">Top Performers</span>
                            </div>
                            <div class="metrics-card-body" id="leaderboard-content">
                                <div class="loading-state">Loading leaderboard...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Positions Tab Content -->
            <div id="positions-tab-content" class="tab-content">
                <div class="positions-header">
                    <div class="positions-header-top">
                        <h2 class="positions-title">Job Positions</h2>
                        <div class="positions-header-actions">
                            <button class="btn-action-secondary" id="btn-export-positions" title="Export positions">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Export
                            </button>
                            <button class="btn-action-secondary" id="btn-import-positions" title="Import positions">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Import
                            </button>
                            <button class="btn-create-position" id="btn-create-position">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M12 5v14M5 12h14"></path>
                                </svg>
                                Create Position
                            </button>
                        </div>
                    </div>
                    <div class="positions-filters">
                        <div class="search-wrapper">
                            <input 
                                type="text" 
                                id="positions-search" 
                                class="form-input search-input-enhanced" 
                                placeholder="Search positions by role, department..."
                                autocomplete="off"
                            >
                        </div>
                        <div class="status-filter-wrapper">
                            <button class="status-filter-btn" id="positions-type-filter-btn">
                                <span id="positions-type-filter-text">All Types</span>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="status-filter-dropdown" id="positions-type-filter-dropdown">
                                <div class="status-filter-item active" data-value="all">All Types</div>
                                <div class="status-filter-item" data-value="database">Database Positions</div>
                                <div class="status-filter-item" data-value="project">Project Positions</div>
                            </div>
                        </div>
                        <input type="hidden" id="positions-type-filter" value="all">
                    </div>
                </div>
                <div id="positions-list" class="positions-list">
                    <div class="empty-state">No positions yet. Click "Create Position" to add one.</div>
                </div>
            </div>
        </div>
    `;
    
    // Setup main tab handlers
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.mainTab;
            
            // Update main tabs
            document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show/hide tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            if (tabName === 'applications') {
                document.getElementById('applications-tab-content').classList.add('active');
            } else if (tabName === 'positions') {
                document.getElementById('positions-tab-content').classList.add('active');
                loadPositions(); // Load positions when tab is opened
            } else if (tabName === 'support-cases') {
                document.getElementById('support-cases-tab-content').classList.add('active');
                loadSupportCases(); // Load support cases when tab is opened
            } else if (tabName === 'metrics') {
                document.getElementById('metrics-tab-content').classList.add('active');
                loadMetrics(); // Load metrics when tab is opened
            }
        });
    });
    
    // Setup application category tab handlers
    document.querySelectorAll('.application-category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.application-category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadApplications();
        });
    });
    
    // Setup Create Position button
    const createPositionBtn = document.getElementById('btn-create-position');
    if (createPositionBtn) {
        createPositionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                openCreatePositionModal();
            } catch (error) {
                console.error('Error opening position modal:', error);
                alert('Error opening position creator. Please check console for details.');
            }
        });
    }
    
    // Setup Export/Import buttons for positions
    const exportPositionsBtn = document.getElementById('btn-export-positions');
    if (exportPositionsBtn) {
        exportPositionsBtn.addEventListener('click', handleExportPositions);
    }
    
    const importPositionsBtn = document.getElementById('btn-import-positions');
    if (importPositionsBtn) {
        importPositionsBtn.addEventListener('click', handleImportPositions);
    }
    
    // Setup search handler
    const searchInput = document.getElementById('applications-search');
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(loadApplications, 300);
    });
    
    // Setup status filter dropdown
    const statusFilterBtn = document.getElementById('applications-status-filter-btn');
    const statusFilterDropdown = document.getElementById('applications-status-filter-dropdown');
    const statusFilterText = document.getElementById('applications-status-filter-text');
    const statusFilterHidden = document.getElementById('applications-status-filter');
    
    if (statusFilterBtn && statusFilterDropdown && statusFilterText && statusFilterHidden) {
        // Toggle dropdown
        statusFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = statusFilterBtn.classList.contains('active');
            
            if (isActive) {
                statusFilterBtn.classList.remove('active');
                statusFilterDropdown.classList.remove('show');
            } else {
                statusFilterBtn.classList.add('active');
                statusFilterDropdown.classList.add('show');
            }
        });
        
        // Handle item selection
        statusFilterDropdown.querySelectorAll('.status-filter-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const text = item.textContent;
                
                statusFilterHidden.value = value;
                statusFilterText.textContent = text;
                
                // Update active state
                statusFilterDropdown.querySelectorAll('.status-filter-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
                
                // Close dropdown
                statusFilterBtn.classList.remove('active');
                statusFilterDropdown.classList.remove('show');
                
                // Reload applications
                loadApplications();
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!statusFilterBtn.contains(e.target) && !statusFilterDropdown.contains(e.target)) {
                statusFilterBtn.classList.remove('active');
                statusFilterDropdown.classList.remove('show');
            }
        });
    }
    
    // Setup positions type filter dropdown
    const positionsFilterBtn = document.getElementById('positions-type-filter-btn');
    const positionsFilterDropdown = document.getElementById('positions-type-filter-dropdown');
    const positionsFilterText = document.getElementById('positions-type-filter-text');
    const positionsFilterHidden = document.getElementById('positions-type-filter');
    
    if (positionsFilterBtn && positionsFilterDropdown && positionsFilterText && positionsFilterHidden) {
        // Toggle dropdown
        positionsFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = positionsFilterBtn.classList.contains('active');
            
            if (isActive) {
                positionsFilterBtn.classList.remove('active');
                positionsFilterDropdown.classList.remove('show');
            } else {
                positionsFilterBtn.classList.add('active');
                positionsFilterDropdown.classList.add('show');
            }
        });
        
        // Handle item selection
        positionsFilterDropdown.querySelectorAll('.status-filter-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const text = item.textContent;
                
                positionsFilterHidden.value = value;
                positionsFilterText.textContent = text;
                
                // Update active state
                positionsFilterDropdown.querySelectorAll('.status-filter-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
                
                // Close dropdown
                positionsFilterBtn.classList.remove('active');
                positionsFilterDropdown.classList.remove('show');
                
                // Reload positions (when implemented)
                // loadPositions();
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!positionsFilterBtn.contains(e.target) && !positionsFilterDropdown.contains(e.target)) {
                positionsFilterBtn.classList.remove('active');
                positionsFilterDropdown.classList.remove('show');
            }
        });
    }
    
    // Setup delete old applications button
    const deleteOldBtn = document.getElementById('btn-delete-old-applications');
    if (deleteOldBtn) {
        deleteOldBtn.addEventListener('click', handleDeleteOldApplications);
    }
    
    // Setup delete bot applications button
    const deleteBotBtn = document.getElementById('btn-delete-bot-applications');
    if (deleteBotBtn) {
        deleteBotBtn.addEventListener('click', handleDeleteBotApplications);
    }
    
    // Setup delete missing portfolio applications button
    const deleteMissingPortfolioBtn = document.getElementById('btn-delete-missing-portfolio-applications');
    if (deleteMissingPortfolioBtn) {
        deleteMissingPortfolioBtn.addEventListener('click', handleDeleteMissingPortfolioApplications);
    }
    
    // Setup support cases search
    const supportCasesSearchInput = document.getElementById('support-cases-search');
    if (supportCasesSearchInput) {
        let searchTimeout;
        supportCasesSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(loadSupportCases, 300);
        });
    }
    
    // Load initial applications
    loadApplications();
}

// Load Applications
async function loadApplications() {
    const listDiv = document.getElementById('applications-list');
    if (!listDiv) return;
    
    const activeTab = document.querySelector('.application-tab.active');
    const category = activeTab?.dataset.category || 'database';
    const searchInput = document.getElementById('applications-search');
    const statusFilterHidden = document.getElementById('applications-status-filter');
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    const searchQuery = searchInput?.value.trim() || '';
    let status = statusFilterHidden?.value || 'all';
    
    // Handle special filters (portfolio and bots)
    const isMissingPortfolioFilter = status === 'missing-portfolio';
    const isWithPortfolioFilter = status === 'with-portfolio';
    const isBotsDetectedFilter = status === 'bots-detected';
    
    if (isMissingPortfolioFilter || isWithPortfolioFilter || isBotsDetectedFilter) {
        status = 'all'; // Get all applications, we'll filter below
    }
    
    // If API bypass is enabled, use example data immediately
    if (apiBypass) {
        let exampleData = getExampleApplications(category, status, searchQuery);
        
        // Apply special filters
        if (isMissingPortfolioFilter) {
            exampleData = exampleData.filter(app => !hasPortfolio(app));
        } else if (isWithPortfolioFilter) {
            exampleData = exampleData.filter(app => hasPortfolio(app));
        } else if (isBotsDetectedFilter) {
            exampleData = exampleData.filter(app => isBotDetected(app));
        }
        
        displayApplications(exampleData, category);
        return;
    }
    
    listDiv.innerHTML = '<div class="loading-state">Loading applications...</div>';
    
    try {
        const params = new URLSearchParams({
            category: category,
            status: status
        });
        
        if (searchQuery) {
            params.append('search', searchQuery);
        }
        
        const response = await fetch(`../../api/applications/list.php?${params.toString()}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            let applications = result.data;
            
            // Apply special filters
            const currentFilter = statusFilterHidden?.value || 'all';
            if (currentFilter === 'missing-portfolio') {
                applications = applications.filter(app => !hasPortfolio(app));
            } else if (currentFilter === 'with-portfolio') {
                applications = applications.filter(app => hasPortfolio(app));
            } else if (currentFilter === 'bots-detected') {
                applications = applications.filter(app => isBotDetected(app));
            }
            
            displayApplications(applications, category);
        } else {
            listDiv.innerHTML = `<div class="empty-state">${result.message || 'Failed to load applications'}</div>`;
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        listDiv.innerHTML = `<div class="empty-state">Error loading applications: ${error.message}</div>`;
    }
}

// Handle Application Action (Accept/Deny/Block)
async function handleApplicationAction(appId, status) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    // Get current user info for processed_by
    const processedBy = {
        name: userName,
        email: userEmail,
        role: formatRoleName(userRole)
    };
    
    if (apiBypass) {
        // In bypass mode, just show a message and reload
        alert(`Application ${status === 'accepted' ? 'accepted' : status === 'declined' ? 'denied' : 'blocked'} (API Bypass Mode)`);
        loadApplications();
        return;
    }
    
    try {
        const response = await fetch(`../../api/applications/update.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: appId,
                status: status,
                processed_by: processedBy
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            loadApplications();
        } else {
            alert(result.message || 'Failed to update application');
        }
    } catch (error) {
        console.error('Error updating application:', error);
        alert('Error updating application: ' + error.message);
    }
}

// Handle Delete Application
async function handleDeleteApplication(appId) {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
        return;
    }
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        // In bypass mode, just show a message and reload
        alert('Application deleted (API Bypass Mode)');
        loadApplications();
        return;
    }
    
    try {
        const response = await fetch(`../../api/applications/delete.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: appId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            loadApplications();
        } else {
            alert(result.message || 'Failed to delete application');
        }
    } catch (error) {
        console.error('Error deleting application:', error);
        alert('Error deleting application: ' + error.message);
    }
}

// Handle Delete Old Applications (30+ days)
async function handleDeleteOldApplications() {
    if (!confirm('Are you sure you want to delete all applications older than 30 days? This action cannot be undone.')) {
        return;
    }
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        // In bypass mode, just show a message and reload
        alert('Old applications deleted (API Bypass Mode)');
        loadApplications();
        return;
    }
    
    try {
        const response = await fetch(`../../api/applications/delete_old.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Deleted ${result.deleted_count || 0} old applications`);
            loadApplications();
        } else {
            alert(result.message || 'Failed to delete old applications');
        }
    } catch (error) {
        console.error('Error deleting old applications:', error);
        alert('Error deleting old applications: ' + error.message);
    }
}

// Handle Delete Bot Detected Applications
async function handleDeleteBotApplications() {
    if (!confirm('Are you sure you want to delete all applications that are bot detected? This action cannot be undone.')) {
        return;
    }
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        // In bypass mode, get all applications and filter
        const allApplications = getExampleApplications('all', 'all', '');
        const botApps = allApplications.filter(app => isBotDetected(app));
        
        alert(`Would delete ${botApps.length} bot detected applications (API Bypass Mode)`);
        loadApplications();
        return;
    }
    
    try {
        // Get all applications first
        const response = await fetch(`../../api/applications/list.php?category=all&status=all`);
        const result = await response.json();
        
        if (!result.success || !result.data) {
            alert('Failed to load applications');
            return;
        }
        
        // Filter for bot detected only
        const botApps = result.data.filter(app => isBotDetected(app));
        
        if (botApps.length === 0) {
            alert('No bot detected applications found to delete.');
            return;
        }
        
        // Confirm with count
        if (!confirm(`Found ${botApps.length} bot detected applications. Delete them all? This action cannot be undone.`)) {
            return;
        }
        
        // Delete each bot application
        let deletedCount = 0;
        let failedCount = 0;
        
        for (const app of botApps) {
            try {
                const deleteResponse = await fetch(`../../api/applications/delete.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: app.id })
                });
                
                const deleteResult = await deleteResponse.json();
                if (deleteResult.success) {
                    deletedCount++;
                } else {
                    failedCount++;
                }
            } catch (error) {
                console.error(`Error deleting application ${app.id}:`, error);
                failedCount++;
            }
        }
        
        alert(`Deleted ${deletedCount} bot detected applications${failedCount > 0 ? `. ${failedCount} failed.` : '.'}`);
        loadApplications();
        
    } catch (error) {
        console.error('Error deleting bot applications:', error);
        alert('Error deleting bot applications: ' + error.message);
    }
}

// Handle Delete Missing Portfolio Applications
async function handleDeleteMissingPortfolioApplications() {
    if (!confirm('Are you sure you want to delete all applications that are missing a portfolio? This action cannot be undone.')) {
        return;
    }
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        // In bypass mode, get all applications and filter
        const allApplications = getExampleApplications('all', 'all', '');
        const missingPortfolioApps = allApplications.filter(app => !hasPortfolio(app));
        
        alert(`Would delete ${missingPortfolioApps.length} missing portfolio applications (API Bypass Mode)`);
        loadApplications();
        return;
    }
    
    try {
        // Get all applications first
        const response = await fetch(`../../api/applications/list.php?category=all&status=all`);
        const result = await response.json();
        
        if (!result.success || !result.data) {
            alert('Failed to load applications');
            return;
        }
        
        // Filter for missing portfolio only
        const missingPortfolioApps = result.data.filter(app => !hasPortfolio(app));
        
        if (missingPortfolioApps.length === 0) {
            alert('No missing portfolio applications found to delete.');
            return;
        }
        
        // Confirm with count
        if (!confirm(`Found ${missingPortfolioApps.length} missing portfolio applications. Delete them all? This action cannot be undone.`)) {
            return;
        }
        
        // Delete each missing portfolio application
        let deletedCount = 0;
        let failedCount = 0;
        
        for (const app of missingPortfolioApps) {
            try {
                const deleteResponse = await fetch(`../../api/applications/delete.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: app.id })
                });
                
                const deleteResult = await deleteResponse.json();
                if (deleteResult.success) {
                    deletedCount++;
                } else {
                    failedCount++;
                }
            } catch (error) {
                console.error(`Error deleting application ${app.id}:`, error);
                failedCount++;
            }
        }
        
        alert(`Deleted ${deletedCount} missing portfolio applications${failedCount > 0 ? `. ${failedCount} failed.` : '.'}`);
        loadApplications();
        
    } catch (error) {
        console.error('Error deleting missing portfolio applications:', error);
        alert('Error deleting missing portfolio applications: ' + error.message);
    }
}

// Check if application has portfolio (either URL or mentioned in cover letter)
function hasPortfolio(application) {
    // Check if portfolio URL exists
    if (application.portfolio_url && application.portfolio_url.trim() !== '') {
        return true;
    }
    
    // Check if portfolio is mentioned in cover letter
    if (application.coverLetter) {
        const coverLetterLower = application.coverLetter.toLowerCase();
        const portfolioKeywords = [
            'portfolio', 'artstation', 'behance', 'dribbble', 'deviantart',
            'personal website', 'my website', 'my work', 'view my work',
            'see my work', 'check out my', 'portfolio at', 'portfolio link',
            'www.', 'http://', 'https://', '.com', '.net', '.org'
        ];
        
        return portfolioKeywords.some(keyword => coverLetterLower.includes(keyword));
    }
    
    return false;
}

// Check if application shows bot-like characteristics
function isBotDetected(application) {
    // Check if application has bot flag (if stored in database)
    if (application.is_bot || application.bot_detected) {
        return true;
    }
    
    // Check for suspicious email patterns
    if (application.email) {
        const email = application.email.toLowerCase();
        const suspiciousPatterns = [
            'test@test.com', 'spam@', 'bot@', '@fake', 'noreply@',
            'example@', 'temp@', 'dummy@', '@temp', '@example'
        ];
        if (suspiciousPatterns.some(pattern => email.includes(pattern))) {
            return true;
        }
    }
    
    // Check for suspicious name patterns
    if (application.name) {
        const name = application.name.toLowerCase().trim();
        // Very short names, only numbers, or suspicious patterns
        if (name.length < 2 || /^[0-9]+$/.test(name) || name.includes('test') || name.includes('bot')) {
            return true;
        }
    }
    
    // Check for suspicious cover letter (too short, generic, or contains bot keywords)
    if (application.coverLetter) {
        const coverLetter = application.coverLetter.toLowerCase();
        // Very short cover letters
        if (coverLetter.length < 20) {
            return true;
        }
        // Suspicious keywords
        const botKeywords = ['test application', 'this is a test', 'automated submission', 'bot submission'];
        if (botKeywords.some(keyword => coverLetter.includes(keyword))) {
            return true;
        }
    }
    
    // Check if submitted very quickly (within seconds) - would need submission timestamp
    // This would require additional data tracking
    
    return false;
}

// Display Applications
function displayApplications(applications, category) {
    const listDiv = document.getElementById('applications-list');
    if (!listDiv) return;
    
    if (applications.length === 0) {
        listDiv.innerHTML = '<div class="empty-state">No applications found in this category.</div>';
        return;
    }
    
    const applicationsHTML = applications.map(app => {
        const statusClass = app.status === 'accepted' ? 'status-accepted' : 
                           app.status === 'declined' ? 'status-declined' : 'status-pending';
        const statusLabel = app.status.charAt(0).toUpperCase() + app.status.slice(1);
        const submittedDate = new Date(app.submitted_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Check if portfolio is missing for visual indicator
        const hasPort = hasPortfolio(app);
        const missingPortfolioClass = !hasPort ? 'missing-portfolio' : '';
        
        // Check if bot is detected
        const isBot = isBotDetected(app);
        const botDetectedClass = isBot ? 'bot-detected' : '';
        
        const cvLink = app.cv_path ? 
            `<a href="../../${app.cv_path}" target="_blank" class="cv-link">View CV</a>` : 
            '<span class="cv-missing">No CV</span>';
        
        const portfolioButton = app.portfolio_url ? 
            `<a href="${app.portfolio_url}" target="_blank" class="btn-view-portfolio" rel="noopener noreferrer">View Portfolio</a>` : '';
        
        return `
            <div class="application-card ${missingPortfolioClass} ${botDetectedClass}">
                <div class="application-card-header">
                    <div class="application-card-title">
                        <h3 class="application-name">${escapeHtml(app.name)}</h3>
                        <span class="application-company">${escapeHtml(app.company || 'Vilostudios')}</span>
                    </div>
                    <div class="application-status">
                        ${isBot ? `
                        <span class="bot-detected-badge">
                            <svg class="bot-detected-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Bot Detected
                        </span>
                        ` : ''}
                        ${!hasPort ? `
                        <span class="missing-portfolio-badge">
                            <svg class="missing-portfolio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            Missing Portfolio
                        </span>
                        ` : ''}
                        <span class="status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                </div>
                <div class="application-card-body">
                    <div class="application-info-row">
                        <div class="application-info-item">
                            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span>${escapeHtml(app.email)}</span>
                        </div>
                        ${app.phone ? `
                        <div class="application-info-item">
                            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>${escapeHtml(app.phone)}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="application-role">
                        <strong>Role:</strong> ${escapeHtml(app.role)}
                    </div>
                    <div class="application-department">
                        <strong>Department:</strong> ${escapeHtml(app.department)}
                    </div>
                    ${app.coverLetter ? `
                    <div class="application-cover-letter">
                        <strong>Cover Letter:</strong>
                        <p>${escapeHtml(app.coverLetter.substring(0, 200))}${app.coverLetter.length > 200 ? '...' : ''}</p>
                    </div>
                    ` : ''}
                    <div class="application-footer">
                        <div class="application-meta">
                            <span>Submitted: ${submittedDate}</span>
                            ${app.processed_at ? `<span>Processed: ${new Date(app.processed_at).toLocaleDateString()}</span>` : ''}
                        </div>
                        <div class="application-actions">
                            ${cvLink}
                            ${portfolioButton}
                            <button class="btn-view-details" data-app-id="${app.id}">View Details</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    listDiv.innerHTML = applicationsHTML;
    
    // Setup view details handlers
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const appId = btn.dataset.appId;
            viewApplicationDetails(appId, applications.find(a => a.id == appId));
        });
    });
}

// View Application Details
function viewApplicationDetails(appId, application) {
    // Create modal or detailed view
    const modal = document.createElement('div');
    modal.className = 'application-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Application Details</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h3>${escapeHtml(application.name)}</h3>
                    <p><strong>Company:</strong> ${escapeHtml(application.company || 'Vilostudios')}</p>
                    <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
                    ${application.phone ? `<p><strong>Phone:</strong> ${escapeHtml(application.phone)}</p>` : ''}
                    <p><strong>Role:</strong> ${escapeHtml(application.role)}</p>
                    <p><strong>Department:</strong> ${escapeHtml(application.department)}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${application.status}">${application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span></p>
                    <p><strong>Submitted:</strong> ${new Date(application.submitted_at).toLocaleString()}</p>
                    ${application.processed_at ? `
                        <p><strong>Processed:</strong> ${new Date(application.processed_at).toLocaleString()}</p>
                        ${application.processed_by ? `
                            <div style="margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-md); border-left: 3px solid var(--accent-orange);">
                                <p style="margin-bottom: var(--spacing-xs); color: var(--text-muted); font-size: var(--font-sm);"><strong>Processed By:</strong></p>
                                <p style="margin: 0; color: var(--text-primary);"><strong>${escapeHtml(application.processed_by.name)}</strong></p>
                                <p style="margin: var(--spacing-xs) 0 0 0; color: var(--text-secondary); font-size: var(--font-sm);">${escapeHtml(application.processed_by.email)}</p>
                                <p style="margin: var(--spacing-xs) 0 0 0; color: var(--text-secondary); font-size: var(--font-sm);">${escapeHtml(application.processed_by.role)}</p>
                            </div>
                        ` : ''}
                    ` : ''}
                </div>
                ${application.coverLetter ? `
                <div class="detail-section">
                    <h3>Cover Letter</h3>
                    <div class="cover-letter-content">${escapeHtml(application.coverLetter).replace(/\n/g, '<br>')}</div>
                </div>
                ` : ''}
                ${application.cv_path ? `
                <div class="detail-section">
                    <h3>CV</h3>
                    <a href="../../${application.cv_path}" target="_blank" class="cv-link-large">View CV File</a>
                </div>
                ` : ''}
                ${application.portfolio_url ? `
                <div class="detail-section">
                    <h3>Portfolio/Website</h3>
                    <a href="${application.portfolio_url}" target="_blank" class="portfolio-link-large" rel="noopener noreferrer">
                        ${application.portfolio_url}
                    </a>
                </div>
                ` : ''}
            </div>
            <div class="modal-actions">
                <div class="action-buttons-group">
                    <button class="btn-action btn-accept" data-action="accept" data-app-id="${appId}">
                        Accept
                    </button>
                    <button class="btn-action btn-deny" data-action="deny" data-app-id="${appId}">
                        Deny
                    </button>
                    <button class="btn-action btn-block" data-action="block" data-app-id="${appId}">
                        Block
                    </button>
                </div>
                <div class="action-buttons-group">
                    <button class="btn-action btn-delete" data-action="delete" data-app-id="${appId}">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Action button handlers
    modal.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('click', async () => {
            const action = btn.dataset.action;
            const appId = btn.dataset.appId;
            
            if (action === 'accept') {
                await handleApplicationAction(appId, 'accepted');
            } else if (action === 'deny') {
                await handleApplicationAction(appId, 'declined');
            } else if (action === 'block') {
                await handleApplicationAction(appId, 'blocked');
            } else if (action === 'delete') {
                await handleDeleteApplication(appId);
            }
            
            document.body.removeChild(modal);
        });
    });
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Open Create Position Modal
function openCreatePositionModal() {
    console.log('Opening position modal...');
    const modal = document.createElement('div');
    modal.className = 'position-modal application-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content position-modal-content">
            <div class="modal-header">
                <h2>Create New Position</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body position-modal-body">
                <form id="create-position-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="position-role" class="form-label">Role/Position Title *</label>
                            <input 
                                type="text" 
                                id="position-role" 
                                class="form-input" 
                                placeholder="e.g., Animation Director (作画監督 / Sakkan)"
                                required
                            >
                        </div>
                        <div class="form-group">
                            <label for="position-branch" class="form-label">Department/Branch *</label>
                            <select id="position-branch" class="form-input" required>
                                <option value="">Select Department</option>
                                <option value="animation">Animation</option>
                                <option value="character-design">Character Design</option>
                                <option value="color-design">Color Design</option>
                                <option value="background-art">Background Art</option>
                                <option value="3d-cgi">3D/CGI</option>
                                <option value="production">Production</option>
                                <option value="planning">Planning</option>
                                <option value="sound">Sound</option>
                                <option value="sound-music">Sound & Music</option>
                                <option value="editing">Editing</option>
                                <option value="photography-compositing">Photography & Compositing</option>
                                <option value="technology">Technology</option>
                                <option value="internal-management">Internal Management</option>
                                <option value="development">Development</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="position-job-type" class="form-label">Position Type *</label>
                            <select id="position-job-type" class="form-input" required>
                                <option value="database">Database Position</option>
                                <option value="project">Project-Specific Position</option>
                            </select>
                            <small class="form-help" id="job-type-help">
                                Database positions are added to our freelancer database. We will contact you when we have a project that matches your skills.
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="position-employment-type" class="form-label">Employment Type *</label>
                            <div class="status-filter-wrapper">
                                <button type="button" class="status-filter-btn" id="position-employment-type-btn">
                                    <span id="position-employment-type-text">Part-Time</span>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                                <div class="status-filter-dropdown" id="position-employment-type-dropdown">
                                    <div class="status-filter-item active" data-value="part-time">Part-Time</div>
                                    <div class="status-filter-item" data-value="permanent">Permanent</div>
                                    <div class="status-filter-item" data-value="contract">Contract</div>
                                    <div class="status-filter-item" data-value="internship">Internship</div>
                                    <div class="status-filter-item" data-value="management">Management Positions</div>
                                    <div class="status-filter-item" data-value="sound">Sound Positions</div>
                                </div>
                            </div>
                            <input type="hidden" id="position-employment-type" value="part-time" required>
                            <small class="form-help">Select the employment arrangement for this position</small>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="position-pay" class="form-label">Payment (Optional)</label>
                            <div class="payment-input-wrapper">
                                <select id="position-currency" class="form-input currency-select">
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="JPY">JPY (¥)</option>
                                </select>
                                <input 
                                    type="number" 
                                    id="position-pay" 
                                    class="form-input payment-input" 
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                >
                            </div>
                            <small class="form-help">Leave empty if payment varies by project</small>
                        </div>
                        <div class="form-group" id="scheduled-date-group">
                            <label for="position-scheduled-date" class="form-label">Scheduled Date (Optional)</label>
                            <input 
                                type="datetime-local" 
                                id="position-scheduled-date" 
                                class="form-input" 
                            >
                            <small class="form-help">When should this position be posted/active?</small>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="position-start-date" class="form-label">Start Date (Optional)</label>
                            <input 
                                type="datetime-local" 
                                id="position-start-date" 
                                class="form-input" 
                            >
                            <small class="form-help">When should this position start?</small>
                        </div>
                        <div class="form-group">
                            <label for="position-end-date" class="form-label">End Date (Optional)</label>
                            <input 
                                type="datetime-local" 
                                id="position-end-date" 
                                class="form-input" 
                            >
                            <small class="form-help">When should this position end?</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="position-description" class="form-label">Description *</label>
                        <div id="position-description-editor" class="quill-editor"></div>
                        <input type="hidden" id="position-description" required>
                    </div>
                    <div class="form-group">
                        <label for="position-requirements" class="form-label">Requirements *</label>
                        <div id="position-requirements-editor" class="quill-editor"></div>
                        <input type="hidden" id="position-requirements" required>
                    </div>
                    <div id="create-position-message"></div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary" id="submit-position-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 0.5rem;">
                                <path d="M20 6L9 17l-5-5"></path>
                            </svg>
                            Create Position
                        </button>
                        <button type="button" class="btn-secondary" id="cancel-position-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Wait a moment for DOM to be ready, then initialize Quill
    setTimeout(() => {
        // Check if Quill is loaded
        if (typeof Quill === 'undefined') {
            alert('Quill editor library is not loaded. Please refresh the page.');
            document.body.removeChild(modal);
            return;
        }
        
        try {
            initializeQuillEditors(modal);
            initializeEmploymentTypeDropdown(modal);
        } catch (error) {
            console.error('Error initializing Quill editors:', error);
            alert('Error initializing editors. Please try again.');
            document.body.removeChild(modal);
        }
    }, 100);
}

// Initialize Quill Editors in Modal
function initializeQuillEditors(modal) {
    // Initialize Quill editors
    const descriptionEditor = new Quill('#position-description-editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: 'Enter position description...'
    });
    
    const requirementsEditor = new Quill('#position-requirements-editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: 'Enter requirements...'
    });
    
    // Handle image uploads in Quill
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        
        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const range = descriptionEditor.getSelection(true);
                    descriptionEditor.insertEmbed(range.index, 'image', reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
    };
    
    descriptionEditor.getModule('toolbar').addHandler('image', imageHandler);
    
    const imageHandlerRequirements = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        
        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const range = requirementsEditor.getSelection(true);
                    requirementsEditor.insertEmbed(range.index, 'image', reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
    };
    
    requirementsEditor.getModule('toolbar').addHandler('image', imageHandlerRequirements);
    
    // Update job type help text
    const jobTypeSelect = document.getElementById('position-job-type');
    const jobTypeHelp = document.getElementById('job-type-help');
    jobTypeSelect.addEventListener('change', () => {
        if (jobTypeSelect.value === 'database') {
            jobTypeHelp.textContent = 'Database positions are added to our freelancer database. We will contact you when we have a project that matches your skills.';
        } else {
            jobTypeHelp.textContent = 'Project-specific positions are for immediate hire on specific projects.';
        }
    });
    
    // Hide scheduled date if start date is provided
    const scheduledDateGroup = document.getElementById('scheduled-date-group');
    const startDateInput = document.getElementById('position-start-date');
    const scheduledDateInput = document.getElementById('position-scheduled-date');
    
    const toggleScheduledDate = () => {
        if (startDateInput.value) {
            scheduledDateGroup.style.display = 'none';
            scheduledDateInput.value = ''; // Clear scheduled date if start date is set
        } else {
            scheduledDateGroup.style.display = 'block';
        }
    };
    
    startDateInput.addEventListener('input', toggleScheduledDate);
    // Check on load in case start date is pre-filled
    toggleScheduledDate();
    
    // Handle form submission
    const form = document.getElementById('create-position-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCreatePosition(descriptionEditor, requirementsEditor);
    });
    
    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('cancel-position-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Initialize Employment Type Dropdown
function initializeEmploymentTypeDropdown(modal) {
    const employmentTypeBtn = modal.querySelector('#position-employment-type-btn');
    const employmentTypeDropdown = modal.querySelector('#position-employment-type-dropdown');
    const employmentTypeText = modal.querySelector('#position-employment-type-text');
    const employmentTypeHidden = modal.querySelector('#position-employment-type');
    
    if (employmentTypeBtn && employmentTypeDropdown && employmentTypeText && employmentTypeHidden) {
        // Toggle dropdown
        employmentTypeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = employmentTypeBtn.classList.contains('active');
            
            if (isActive) {
                employmentTypeBtn.classList.remove('active');
                employmentTypeDropdown.classList.remove('show');
            } else {
                employmentTypeBtn.classList.add('active');
                employmentTypeDropdown.classList.add('show');
            }
        });
        
        // Handle item selection
        employmentTypeDropdown.querySelectorAll('.status-filter-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const text = item.textContent;
                
                employmentTypeHidden.value = value;
                employmentTypeText.textContent = text;
                
                // Update active state
                employmentTypeDropdown.querySelectorAll('.status-filter-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
                
                // Close dropdown
                employmentTypeBtn.classList.remove('active');
                employmentTypeDropdown.classList.remove('show');
            });
        });
        
        // Close dropdown when clicking outside
        const handleClickOutside = (e) => {
            if (!employmentTypeBtn.contains(e.target) && !employmentTypeDropdown.contains(e.target)) {
                employmentTypeBtn.classList.remove('active');
                employmentTypeDropdown.classList.remove('show');
            }
        };
        document.addEventListener('click', handleClickOutside);
    }
}

// Handle Create Position Form Submission
async function handleCreatePosition(descriptionEditor, requirementsEditor) {
    const messageDiv = document.getElementById('create-position-message');
    const submitBtn = document.getElementById('submit-position-btn');
    const form = document.getElementById('create-position-form');
    
    // Get Quill content
    const description = descriptionEditor.root.innerHTML;
    const requirements = requirementsEditor.root.innerHTML;
    
    // Validate
    if (!description || description === '<p><br></p>') {
        messageDiv.innerHTML = '<div class="form-message error">Description is required</div>';
        return;
    }
    
    if (!requirements || requirements === '<p><br></p>') {
        messageDiv.innerHTML = '<div class="form-message error">Requirements are required</div>';
        return;
    }
    
    const payValue = document.getElementById('position-pay').value;
    const currency = document.getElementById('position-currency').value;
    const scheduledDate = document.getElementById('position-scheduled-date').value;
    const startDate = document.getElementById('position-start-date').value;
    const endDate = document.getElementById('position-end-date').value;
    
    const formData = {
        role: document.getElementById('position-role').value.trim(),
        branch: document.getElementById('position-branch').value,
        jobType: document.getElementById('position-job-type').value,
        employmentType: document.getElementById('position-employment-type').value,
        pay: payValue ? formatPayWithCurrency(payValue, currency) : null,
        currency: currency,
        scheduled_date: scheduledDate || null,
        start_date: startDate || null,
        end_date: endDate || null,
        description: description,
        requirements: requirements
    };
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
    messageDiv.innerHTML = '';
    
    try {
        const response = await fetch('../../api/jobs/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            messageDiv.innerHTML = `<div class="form-message success">${result.message}</div>`;
            setTimeout(() => {
                // Close modal and reload applications if needed
                const modal = document.querySelector('.position-modal');
                if (modal) {
                    document.body.removeChild(modal);
                }
                // Optionally refresh the page or show success message
            }, 1500);
        } else {
            messageDiv.innerHTML = `<div class="form-message error">${result.message || 'Failed to create position'}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="form-message error">Error: ${error.message}</div>`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Position';
    }
}

// Load Positions
async function loadPositions() {
    const listDiv = document.getElementById('positions-list');
    if (!listDiv) return;
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    // If API bypass is enabled, use example data immediately
    if (apiBypass) {
        const examplePositions = getExamplePositions();
        displayPositions(examplePositions);
        return;
    }
    
    listDiv.innerHTML = '<div class="loading-state">Loading positions...</div>';
    
    try {
        // TODO: Create API endpoint for listing positions
        // For now, show placeholder
        listDiv.innerHTML = `
            <div class="empty-state">
                <p>Position listing feature coming soon.</p>
                <p>Click "Create Position" to add a new position.</p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading positions:', error);
        listDiv.innerHTML = `<div class="empty-state">Error loading positions: ${error.message}</div>`;
    }
}

// Get Example Positions (for API bypass)
function getExamplePositions() {
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const futureDate2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
    const futureDate3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    
    return [
        {
            id: 1,
            role: 'Animation Director (作画監督 / Sakkan)',
            branch: 'animation',
            jobType: 'database',
            employmentType: 'permanent',
            pay: 'USD 80000 - 120000',
            currency: 'USD',
            scheduled_date: futureDate1.toISOString(),
            start_date: new Date(futureDate1.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: null,
            description: '<p>We are looking for an experienced Animation Director to lead our animation team on various anime projects. The ideal candidate will have strong leadership skills and extensive experience in 2D animation production.</p>',
            requirements: '<ul><li>Minimum 5 years experience as Animation Director</li><li>Strong understanding of anime production pipeline</li><li>Excellent communication and leadership skills</li></ul>',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 2,
            role: 'Key Animator (原画 / Genga)',
            branch: 'animation',
            jobType: 'database',
            employmentType: 'contract',
            pay: 'EUR 50000 - 80000',
            currency: 'EUR',
            scheduled_date: futureDate2.toISOString(),
            start_date: new Date(futureDate2.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: new Date(futureDate2.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            description: '<p>Join our database of talented Key Animators. We will contact you when we have projects that match your skills and availability.</p>',
            requirements: '<ul><li>3+ years experience in key animation</li><li>Strong drawing and animation skills</li><li>Portfolio demonstrating anime-style animation</li></ul>',
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            role: 'Character Designer - Project: "The Adventure Quest"',
            branch: 'character-design',
            jobType: 'project',
            employmentType: 'contract',
            pay: 'JPY 7000000 - 9000000',
            currency: 'JPY',
            scheduled_date: futureDate3.toISOString(),
            start_date: new Date(futureDate3.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: new Date(futureDate3.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            description: '<p>Immediate opening for a Character Designer on our new fantasy adventure anime series. This is a project-specific position with a 12-month contract.</p>',
            requirements: '<ul><li>Experience in character design for anime</li><li>Ability to work within established style guides</li><li>Strong portfolio in fantasy character design</li></ul>',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 4,
            role: 'Software Developer - Production Tools',
            branch: 'technology',
            jobType: 'database',
            employmentType: 'permanent',
            pay: '$90,000 - $130,000',
            description: '<p>We are building internal production management tools and need experienced developers to join our technology team at Vilostudios Technologies.</p>',
            requirements: '<ul><li>Full-stack development experience</li><li>Knowledge of animation production workflows</li><li>Experience with Python, JavaScript, and modern frameworks</li></ul>',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            role: 'Sound Designer - Game Audio',
            branch: 'sound',
            jobType: 'database',
            employmentType: 'contract',
            pay: '$60,000 - $85,000',
            description: '<p>Hex Archive is seeking talented sound designers to add to our database for upcoming game and animation projects.</p>',
            requirements: '<ul><li>Experience in game audio or animation sound design</li><li>Proficiency with audio editing software</li><li>Creative portfolio demonstrating range of styles</li></ul>',
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 6,
            role: 'Animation Intern',
            branch: 'animation',
            jobType: 'database',
            employmentType: 'internship',
            pay: 'Unpaid internship with mentorship',
            description: '<p>We offer internship opportunities for aspiring animators to learn from our experienced team and gain real production experience.</p>',
            requirements: '<ul><li>Currently enrolled in animation program or recent graduate</li><li>Basic animation skills</li><li>Passion for anime production</li></ul>',
            created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}

// Display Positions
function displayPositions(positions) {
    const listDiv = document.getElementById('positions-list');
    if (!listDiv) return;
    
    if (positions.length === 0) {
        listDiv.innerHTML = '<div class="empty-state">No positions found.</div>';
        return;
    }
    
    const positionsHTML = positions.map(position => {
        const jobTypeLabel = position.jobType === 'database' ? 'Database Position' : 'Project Position';
        const employmentTypeLabel = position.employmentType.charAt(0).toUpperCase() + position.employmentType.slice(1);
        const createdDate = new Date(position.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="position-card">
                <div class="position-card-header">
                    <div class="position-card-title">
                        <h3 class="position-name">${escapeHtml(position.role)}</h3>
                        <span class="position-department">${escapeHtml(position.branch)}</span>
                    </div>
                    <div class="position-badges">
                        <span class="position-badge job-type-${position.jobType}">${jobTypeLabel}</span>
                        <span class="position-badge employment-type">${employmentTypeLabel}</span>
                    </div>
                </div>
                <div class="position-card-body">
                    ${position.pay ? `<div class="position-info-item"><strong>Pay:</strong> ${escapeHtml(position.pay)}</div>` : ''}
                    <div class="position-info-item"><strong>Created:</strong> ${createdDate}</div>
                    ${position.scheduled_date ? `
                        <div class="position-info-item">
                            <strong>Scheduled:</strong> 
                            ${new Date(position.scheduled_date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    ` : ''}
                    ${position.start_date || position.end_date ? `
                        <div class="position-info-item">
                            <strong>Duration:</strong> 
                            ${position.start_date ? new Date(position.start_date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'TBD'} 
                            ${position.start_date && position.end_date ? ' - ' : ''}
                            ${position.end_date ? new Date(position.end_date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : position.start_date ? ' (Open-ended)' : ''}
                        </div>
                    ` : ''}
                    ${position.description ? `<div class="position-description">${stripHtml(position.description)}</div>` : ''}
                </div>
                <div class="position-card-actions">
                    <button class="btn-position-action btn-edit" data-position-id="${position.id}" title="Edit position">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="btn-position-action btn-reschedule" data-position-id="${position.id}" title="Reschedule position">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Reschedule
                    </button>
                    <button class="btn-position-action btn-delete" data-position-id="${position.id}" title="Delete position">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    listDiv.innerHTML = positionsHTML;
    
    // Add event listeners for position actions
    listDiv.querySelectorAll('.btn-position-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const positionId = parseInt(btn.dataset.positionId);
            const action = btn.classList.contains('btn-edit') ? 'edit' : 
                          btn.classList.contains('btn-reschedule') ? 'reschedule' : 'delete';
            
            if (action === 'edit') {
                handleEditPosition(positionId);
            } else if (action === 'reschedule') {
                handleReschedulePosition(positionId);
            } else if (action === 'delete') {
                handleDeletePosition(positionId);
            }
        });
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper function to strip HTML tags
function stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Handle Edit Position
async function handleEditPosition(positionId) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        alert('Edit position feature (API Bypass Mode - Edit functionality will work with real API)');
        // TODO: In real implementation, fetch position data and open edit modal
        return;
    }
    
    try {
        // TODO: Fetch position data from API and open edit modal
        const response = await fetch(`../../api/jobs/get.php?id=${positionId}`);
        const result = await response.json();
        
        if (result.success) {
            openEditPositionModal(result.data);
        } else {
            alert(result.message || 'Failed to load position');
        }
    } catch (error) {
        console.error('Error loading position:', error);
        alert('Error loading position: ' + error.message);
    }
}

// Handle Delete Position
async function handleDeletePosition(positionId) {
    if (!confirm('Are you sure you want to delete this position? This action cannot be undone.')) {
        return;
    }
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        alert('Position deleted (API Bypass Mode)');
        loadPositions();
        return;
    }
    
    try {
        const response = await fetch(`../../api/jobs/delete.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: positionId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            loadPositions();
        } else {
            alert(result.message || 'Failed to delete position');
        }
    } catch (error) {
        console.error('Error deleting position:', error);
        alert('Error deleting position: ' + error.message);
    }
}

// Handle Reschedule Position
async function handleReschedulePosition(positionId) {
    const newDate = prompt('Enter new date (YYYY-MM-DD) or leave blank to cancel:');
    
    if (!newDate) {
        return;
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newDate)) {
        alert('Invalid date format. Please use YYYY-MM-DD');
        return;
    }
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        alert(`Position rescheduled to ${newDate} (API Bypass Mode)`);
        loadPositions();
        return;
    }
    
    try {
        const response = await fetch(`../../api/jobs/reschedule.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: positionId, new_date: newDate })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Position rescheduled successfully');
            loadPositions();
        } else {
            alert(result.message || 'Failed to reschedule position');
        }
    } catch (error) {
        console.error('Error rescheduling position:', error);
        alert('Error rescheduling position: ' + error.message);
    }
}

// Handle Export Positions
function handleExportPositions() {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    // Get current positions
    let positions = [];
    
    if (apiBypass) {
        positions = getExamplePositions();
    } else {
        // TODO: Fetch from API
        alert('Export feature requires API connection');
        return;
    }
    
    // Convert to CSV
    const csvContent = convertPositionsToCSV(positions);
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `positions_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Handle Import Positions
function handleImportPositions() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
            
            try {
                let positions = [];
                
                if (file.name.endsWith('.csv')) {
                    positions = parseCSVToPositions(content);
                } else if (file.name.endsWith('.json')) {
                    positions = JSON.parse(content);
                }
                
                if (apiBypass) {
                    alert(`Imported ${positions.length} positions (API Bypass Mode - Import will work with real API)`);
                    loadPositions();
                } else {
                    // TODO: Send to API
                    alert(`Imported ${positions.length} positions`);
                    loadPositions();
                }
            } catch (error) {
                console.error('Error importing positions:', error);
                alert('Error importing positions: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Convert Positions to CSV
function convertPositionsToCSV(positions) {
    const headers = ['ID', 'Role', 'Department', 'Job Type', 'Employment Type', 'Pay', 'Description', 'Requirements', 'Created At'];
    const rows = positions.map(pos => [
        pos.id,
        pos.role,
        pos.branch,
        pos.jobType,
        pos.employmentType,
        pos.pay || '',
        stripHtml(pos.description || ''),
        stripHtml(pos.requirements || ''),
        pos.created_at
    ]);
    
    return [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
}

// Parse CSV to Positions
function parseCSVToPositions(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const positions = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        positions.push({
            id: values[0],
            role: values[1],
            branch: values[2],
            jobType: values[3],
            employmentType: values[4],
            pay: values[5],
            description: values[6],
            requirements: values[7],
            created_at: values[8]
        });
    }
    
    return positions;
}

// Handle Export Freelancers
function handleExportFreelancers() {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    // Get current freelancers from the list
    let freelancers = [];
    
    if (apiBypass) {
        freelancers = getExampleFreelancers();
    } else {
        // Extract from DOM or fetch from API
        const freelancerItems = document.querySelectorAll('.freelancer-item');
        freelancerItems.forEach(item => {
            const name = item.querySelector('.freelancer-item-name')?.textContent.trim();
            const email = item.querySelector('.freelancer-item-email')?.textContent.trim();
            const dept = item.dataset.department;
            freelancers.push({ name, email, department: dept });
        });
        
        if (freelancers.length === 0) {
            alert('No freelancers to export');
            return;
        }
    }
    
    // Convert to CSV
    const csvContent = convertFreelancersToCSV(freelancers);
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `freelancers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Handle Import Freelancers
function handleImportFreelancers() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
            
            try {
                let freelancers = [];
                
                if (file.name.endsWith('.csv')) {
                    freelancers = parseCSVToFreelancers(content);
                } else if (file.name.endsWith('.json')) {
                    freelancers = JSON.parse(content);
                }
                
                if (apiBypass) {
                    alert(`Imported ${freelancers.length} freelancers (API Bypass Mode - Import will work with real API)`);
                    loadFreelancers();
                } else {
                    // TODO: Send to API
                    alert(`Imported ${freelancers.length} freelancers`);
                    loadFreelancers();
                }
            } catch (error) {
                console.error('Error importing freelancers:', error);
                alert('Error importing freelancers: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Convert Freelancers to CSV
function convertFreelancersToCSV(freelancers) {
    const headers = ['ID', 'Name', 'Email', 'Department', 'Roles', 'Created At'];
    const rows = freelancers.map(f => [
        f.id || '',
        f.name || '',
        f.email || '',
        f.department || '',
        f.roles || '',
        f.created_at || ''
    ]);
    
    return [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
}

// Parse CSV to Freelancers
function parseCSVToFreelancers(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const freelancers = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        freelancers.push({
            id: values[0],
            name: values[1],
            email: values[2],
            department: values[3],
            roles: values[4],
            created_at: values[5]
        });
    }
    
    return freelancers;
}

// Placeholder function for edit position modal
function openEditPositionModal(positionData) {
    // TODO: Implement edit modal similar to create modal but with pre-filled data
    alert('Edit position feature coming soon!');
}

// Load Freelancers
async function loadFreelancers() {
    const listDiv = document.getElementById('freelancer-database-list');
    if (!listDiv) return;
    
    const searchInput = document.getElementById('freelancer-search');
    const searchQuery = searchInput?.value.trim() || '';
    const activeFilterTag = document.querySelector('.filter-tag.active');
    const activeFilter = activeFilterTag?.dataset.filter || '';
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    // If API bypass is enabled, use example data immediately
    if (apiBypass) {
        const exampleFreelancers = getExampleFreelancers();
        renderFreelancerList(exampleFreelancers);
        return;
    }
    
    listDiv.innerHTML = '<div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.4);">Loading...</div>';
    
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (activeFilter) params.append('department', activeFilter);
        
        const response = await fetch(`../../api/freelancers/list.php?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        let result;
        
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            // When bypass is OFF, only show real data from API
            renderFreelancerList(result.data || []);
        } else {
            listDiv.innerHTML = `<div class="form-message error">${result.message || 'Failed to load freelancers'}</div>`;
        }
    } catch (error) {
        console.error('Error loading freelancers:', error);
        listDiv.innerHTML = `<div class="form-message error">Error: ${error.message}. Please check your database connection.</div>`;
    }
}

// Render Freelancer List
function renderFreelancerList(freelancers) {
    const listDiv = document.getElementById('freelancer-database-list');
    
    if (freelancers.length === 0) {
        listDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.4);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3; margin-bottom: 1rem;">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <p style="font-size: var(--font-md); margin-top: 0.5rem;">No freelancers found</p>
            </div>
        `;
        return;
    }
    
    listDiv.innerHTML = freelancers.map(freelancer => {
        const department = freelancer.department || '';
        const departments = freelancer.departments || [];
        const primaryDept = department || (departments.length > 0 ? departments[0] : 'general');
        const roles = freelancer.roles || 'No roles assigned';
        
        // Format department name for display
        const formatDepartmentName = (dept) => {
            const deptMap = {
                'animation': 'Animation',
                'character-design': 'Character Design',
                'color-design': 'Color Design',
                'background-art': 'Background Art',
                '3d-cgi': '3D/CG',
                'editing': 'Editing',
                'sound-design': 'Sound Design',
                'music': 'Music',
                'voice-acting': 'Voice Acting',
                'production': 'Production',
                'photography-compositing': 'Compositing'
            };
            return deptMap[dept] || dept.charAt(0).toUpperCase() + dept.slice(1).replace('-', ' ');
        };
        
        return `
        <div class="freelancer-item" data-department="${primaryDept}">
            <div class="freelancer-item-header">
                <div class="freelancer-item-info">
                    <div class="freelancer-item-name">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; opacity: 0.6;">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${escapeHtml(freelancer.name || 'N/A')}
                    </div>
                    ${freelancer.email ? `
                    <div class="freelancer-item-email">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem; opacity: 0.5;">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        ${escapeHtml(freelancer.email)}
                    </div>
                    ` : ''}
                    <div class="freelancer-item-skills">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem; opacity: 0.5;">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        ${escapeHtml(roles)}
                    </div>
                </div>
                <div class="freelancer-item-meta-right">
                    <span class="specialty-badge ${primaryDept.replace(/-/g, '-')}">${escapeHtml(formatDepartmentName(primaryDept))}</span>
                    ${departments.length > 1 ? `
                    <div class="freelancer-departments">
                        ${departments.slice(1).map(dept => `
                            <span class="department-tag">${escapeHtml(formatDepartmentName(dept))}</span>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
            <div class="freelancer-item-actions">
                <span class="freelancer-item-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem; opacity: 0.5;">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Joined: ${new Date(freelancer.created_at).toLocaleDateString()}
                </span>
                <div class="freelancer-action-buttons">
                    <button class="freelancer-action-btn view-btn" onclick="viewFreelancer(${freelancer.id})" title="View details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View
                    </button>
                    <button class="freelancer-action-btn edit-btn" onclick="editFreelancer(${freelancer.id})" title="Edit freelancer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="freelancer-action-btn remove-btn" onclick="removeFreelancer(${freelancer.id}, '${escapeHtml(freelancer.email || freelancer.name)}')" title="Remove from database">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// View Freelancer
async function viewFreelancer(id) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    try {
        const response = await fetch(`../../api/freelancers/get.php?id=${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        let result;
        
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            if (apiBypass) {
                // Use example data in bypass mode
                const exampleFreelancer = getExampleFreelancers().find(f => f.id === id) || {
                    id: id,
                    name: 'Example Freelancer',
                    email: 'example@freelancer.com',
                    department: 'animation',
                    departments: ['animation'],
                    roles: 'Key Animator',
                    created_at: new Date().toISOString()
                };
                showFreelancerModal(exampleFreelancer, 'view');
                return;
            }
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            const freelancer = result.data;
            showFreelancerModal(freelancer, 'view');
        } else {
            if (apiBypass) {
                const exampleFreelancer = getExampleFreelancers().find(f => f.id === id) || {
                    id: id,
                    name: 'Example Freelancer',
                    email: 'example@freelancer.com',
                    department: 'animation',
                    departments: ['animation'],
                    roles: 'Key Animator',
                    created_at: new Date().toISOString()
                };
                showFreelancerModal(exampleFreelancer, 'view');
            } else {
                alert(result.message || 'Failed to load freelancer details');
            }
        }
    } catch (error) {
        console.error('Error loading freelancer:', error);
        if (apiBypass) {
            // Use example data in bypass mode
            const exampleFreelancer = getExampleFreelancers().find(f => f.id === id) || {
                id: id,
                name: 'Example Freelancer',
                email: 'example@freelancer.com',
                department: 'animation',
                departments: ['animation'],
                roles: 'Key Animator',
                created_at: new Date().toISOString()
            };
            showFreelancerModal(exampleFreelancer, 'view');
        } else {
            alert('Error loading freelancer details: ' + error.message);
        }
    }
}

// Edit Freelancer
async function editFreelancer(id) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    try {
        const response = await fetch(`../../api/freelancers/get.php?id=${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        let result;
        
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            if (apiBypass) {
                // Use example data in bypass mode
                const exampleFreelancer = getExampleFreelancers().find(f => f.id === id) || {
                    id: id,
                    name: 'Example Freelancer',
                    email: 'example@freelancer.com',
                    department: 'animation',
                    departments: ['animation'],
                    roles: 'Key Animator',
                    created_at: new Date().toISOString()
                };
                showFreelancerModal(exampleFreelancer, 'edit');
                return;
            }
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            const freelancer = result.data;
            showFreelancerModal(freelancer, 'edit');
        } else {
            if (apiBypass) {
                const exampleFreelancer = getExampleFreelancers().find(f => f.id === id) || {
                    id: id,
                    name: 'Example Freelancer',
                    email: 'example@freelancer.com',
                    department: 'animation',
                    departments: ['animation'],
                    roles: 'Key Animator',
                    created_at: new Date().toISOString()
                };
                showFreelancerModal(exampleFreelancer, 'edit');
            } else {
                alert(result.message || 'Failed to load freelancer details');
            }
        }
    } catch (error) {
        console.error('Error loading freelancer:', error);
        if (apiBypass) {
            // Use example data in bypass mode
            const exampleFreelancer = getExampleFreelancers().find(f => f.id === id) || {
                id: id,
                name: 'Example Freelancer',
                email: 'example@freelancer.com',
                department: 'animation',
                departments: ['animation'],
                roles: 'Key Animator',
                created_at: new Date().toISOString()
            };
            showFreelancerModal(exampleFreelancer, 'edit');
        } else {
            alert('Error loading freelancer details: ' + error.message);
        }
    }
}

// Remove Freelancer
async function removeFreelancer(id, identifier) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (!confirm(`Are you sure you want to remove this freelancer from the database? This action cannot be undone.`)) {
        return;
    }
    
    if (!confirm(`Final confirmation: Remove freelancer permanently?`)) {
        return;
    }
    
    try {
        const response = await fetch('../../api/freelancers/remove.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        let result;
        
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            if (apiBypass) {
                // Simulate removal in bypass mode
                loadFreelancers();
                return;
            }
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            loadFreelancers();
        } else {
            if (apiBypass) {
                // Simulate removal in bypass mode
                loadFreelancers();
            } else {
                alert(result.message || 'Failed to remove freelancer');
            }
        }
    } catch (error) {
        console.error('Error removing freelancer:', error);
        if (apiBypass) {
            // Simulate removal in bypass mode
            loadFreelancers();
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Show Freelancer Modal
function showFreelancerModal(freelancer, mode = 'view') {
    const modal = document.createElement('div');
    modal.className = 'freelancer-modal-overlay';
    modal.innerHTML = `
        <div class="freelancer-modal">
            <div class="freelancer-modal-header">
                <h3>${mode === 'view' ? 'View' : 'Edit'} Freelancer</h3>
                <button class="modal-close-btn" onclick="this.closest('.freelancer-modal-overlay').remove()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="freelancer-modal-content">
                ${mode === 'view' ? renderFreelancerView(freelancer) : renderFreelancerEdit(freelancer)}
            </div>
            ${mode === 'edit' ? `
            <div class="freelancer-modal-footer">
                <button class="btn-secondary" onclick="this.closest('.freelancer-modal-overlay').remove()">Cancel</button>
                <button class="btn-primary" onclick="saveFreelancer(${freelancer.id})">Save Changes</button>
            </div>
            ` : `
            <div class="freelancer-modal-footer">
                <button class="btn-secondary" onclick="this.closest('.freelancer-modal-overlay').remove()">Close</button>
                <button class="btn-primary" onclick="editFreelancer(${freelancer.id})">Edit</button>
            </div>
            `}
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Render Freelancer View
function renderFreelancerView(freelancer) {
    const departments = freelancer.departments || [];
    const formatDepartmentName = (dept) => {
        const deptMap = {
            'animation': 'Animation',
            'character-design': 'Character Design',
            'color-design': 'Color Design',
            'background-art': 'Background Art',
            '3d-cgi': '3D/CG',
            'editing': 'Editing',
            'sound-design': 'Sound Design',
            'music': 'Music',
            'voice-acting': 'Voice Acting',
            'production': 'Production',
            'photography-compositing': 'Compositing'
        };
        return deptMap[dept] || dept.charAt(0).toUpperCase() + dept.slice(1).replace('-', ' ');
    };
    
    return `
        <div class="freelancer-detail-view">
            <div class="detail-row">
                <label>Name:</label>
                <div>${escapeHtml(freelancer.name || 'N/A')}</div>
            </div>
            <div class="detail-row">
                <label>Email:</label>
                <div>${escapeHtml(freelancer.email || 'No email on file')}</div>
            </div>
            <div class="detail-row">
                <label>Primary Department:</label>
                <div><span class="specialty-badge ${(freelancer.department || '').replace(/-/g, '-')}">${escapeHtml(formatDepartmentName(freelancer.department || ''))}</span></div>
            </div>
            ${departments.length > 0 ? `
            <div class="detail-row">
                <label>All Departments:</label>
                <div class="freelancer-departments">
                    ${departments.map(dept => `<span class="specialty-badge ${dept.replace(/-/g, '-')}">${escapeHtml(formatDepartmentName(dept))}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            <div class="detail-row">
                <label>Roles:</label>
                <div>${escapeHtml(freelancer.roles || 'No roles assigned')}</div>
            </div>
            <div class="detail-row">
                <label>Joined:</label>
                <div>${new Date(freelancer.created_at).toLocaleDateString()}</div>
            </div>
            ${freelancer.updated_at ? `
            <div class="detail-row">
                <label>Last Updated:</label>
                <div>${new Date(freelancer.updated_at).toLocaleDateString()}</div>
            </div>
            ` : ''}
        </div>
    `;
}

// Render Freelancer Edit Form
function renderFreelancerEdit(freelancer) {
    const departments = ['animation', 'character-design', 'color-design', 'background-art', '3d-cgi', 'editing', 'sound-design', 'music', 'voice-acting', 'production', 'photography-compositing'];
    const currentDepartments = freelancer.departments || [];
    const formatDepartmentName = (dept) => {
        const deptMap = {
            'animation': 'Animation',
            'character-design': 'Character Design',
            'color-design': 'Color Design',
            'background-art': 'Background Art',
            '3d-cgi': '3D/CG',
            'editing': 'Editing',
            'sound-design': 'Sound Design',
            'music': 'Music',
            'voice-acting': 'Voice Acting',
            'production': 'Production',
            'photography-compositing': 'Compositing'
        };
        return deptMap[dept] || dept.charAt(0).toUpperCase() + dept.slice(1).replace('-', ' ');
    };
    
    // Parse existing roles - assume format like "Role1, Role2" or structured data
    let rolesData = [];
    if (freelancer.roles) {
        // Try to parse as JSON first, otherwise split by comma
        try {
            rolesData = JSON.parse(freelancer.roles);
        } catch (e) {
            // If not JSON, treat as comma-separated and create entries with primary department
            const roles = freelancer.roles.split(',').map(r => r.trim()).filter(r => r);
            rolesData = roles.map((role, index) => ({
                role: role,
                department: index === 0 ? (freelancer.department || '') : ''
            }));
        }
    }
    
    // If no roles data, create one empty entry
    if (rolesData.length === 0) {
        rolesData = [{ role: '', department: freelancer.department || '' }];
    }
    
    return `
        <form id="edit-freelancer-form" onsubmit="saveFreelancer(${freelancer.id}); return false;">
            <div class="form-group">
                <label for="edit-name" class="form-label">Name</label>
                <input type="text" id="edit-name" class="form-input-enhanced" value="${escapeHtml(freelancer.name || '')}" required>
            </div>
            <div class="form-group">
                <label for="edit-email" class="form-label">Email</label>
                <input type="email" id="edit-email" class="form-input-enhanced" value="${escapeHtml(freelancer.email || '')}" placeholder="freelancer@example.com">
            </div>
            <div class="form-group">
                <label class="form-section-label">ROLES</label>
                <div id="roles-container" class="roles-container">
                    ${rolesData.map((roleData, index) => `
                        <div class="role-entry" data-index="${index}">
                            <div class="role-entry-header">
                                <span class="role-entry-label">${index === 0 ? 'MAIN ROLE' : `SECONDARY ROLE ${index}`}</span>
                                ${index > 0 ? `<button type="button" class="role-remove-btn" onclick="removeRoleEntry(${index})">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>` : ''}
                            </div>
                            <div class="role-entry-content">
                                <input type="text" class="role-input" placeholder="Enter role name" value="${escapeHtml(roleData.role || '')}" data-role-index="${index}">
                                <div class="form-select-wrapper-enhanced role-department-select">
                                    <select class="role-department-select-input" data-dept-index="${index}">
                                        <option value="">Select department</option>
                                        ${departments.map(dept => `
                                            <option value="${dept}" ${roleData.department === dept ? 'selected' : ''}>${formatDepartmentName(dept)}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="add-role-btn" onclick="addRoleEntry()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Secondary Role
                </button>
            </div>
        </form>
    `;
}

// Add Role Entry
function addRoleEntry() {
    const container = document.getElementById('roles-container');
    const index = container.children.length;
    const departments = ['animation', 'character-design', 'color-design', 'background-art', '3d-cgi', 'editing', 'sound-design', 'music', 'voice-acting', 'production', 'photography-compositing'];
    const formatDepartmentName = (dept) => {
        const deptMap = {
            'animation': 'Animation',
            'character-design': 'Character Design',
            'color-design': 'Color Design',
            'background-art': 'Background Art',
            '3d-cgi': '3D/CG',
            'editing': 'Editing',
            'sound-design': 'Sound Design',
            'music': 'Music',
            'voice-acting': 'Voice Acting',
            'production': 'Production',
            'photography-compositing': 'Compositing'
        };
        return deptMap[dept] || dept.charAt(0).toUpperCase() + dept.slice(1).replace('-', ' ');
    };
    
    const roleEntry = document.createElement('div');
    roleEntry.className = 'role-entry';
    roleEntry.setAttribute('data-index', index);
    roleEntry.innerHTML = `
        <div class="role-entry-header">
            <span class="role-entry-label">Secondary Role ${index}</span>
            <button type="button" class="role-remove-btn" onclick="removeRoleEntry(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="role-entry-content">
            <input type="text" class="role-input" placeholder="Enter role name" data-role-index="${index}">
            <div class="form-select-wrapper-enhanced role-department-select">
                <select class="role-department-select-input" data-dept-index="${index}">
                    <option value="">Select department</option>
                    ${departments.map(dept => `
                        <option value="${dept}">${formatDepartmentName(dept)}</option>
                    `).join('')}
                </select>
            </div>
        </div>
    `;
    container.appendChild(roleEntry);
}

// Remove Role Entry
function removeRoleEntry(index) {
    const container = document.getElementById('roles-container');
    const entry = container.querySelector(`[data-index="${index}"]`);
    if (entry) {
        entry.remove();
        // Re-index remaining entries
        Array.from(container.children).forEach((child, i) => {
            child.setAttribute('data-index', i);
            const label = child.querySelector('.role-entry-label');
            if (label) {
                label.textContent = i === 0 ? 'Main Role' : `Secondary Role ${i}`;
            }
            const roleInput = child.querySelector('.role-input');
            const deptSelect = child.querySelector('.role-department-select-input');
            if (roleInput) roleInput.setAttribute('data-role-index', i);
            if (deptSelect) deptSelect.setAttribute('data-dept-index', i);
            const removeBtn = child.querySelector('.role-remove-btn');
            if (removeBtn && i > 0) {
                removeBtn.setAttribute('onclick', `removeRoleEntry(${i})`);
            }
        });
    }
}

// Save Freelancer
async function saveFreelancer(id) {
    const name = document.getElementById('edit-name')?.value.trim();
    const email = document.getElementById('edit-email')?.value.trim();
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    // Collect roles with departments
    const roleEntries = [];
    const roleInputs = document.querySelectorAll('.role-input');
    const deptSelects = document.querySelectorAll('.role-department-select-input');
    
    // Get primary department from main role (first role)
    let primaryDepartment = '';
    
    roleInputs.forEach((input, index) => {
        const roleName = input.value.trim();
        const roleIndex = input.getAttribute('data-role-index');
        const deptSelect = Array.from(deptSelects).find(sel => sel.getAttribute('data-dept-index') === roleIndex);
        const dept = deptSelect ? deptSelect.value : '';
        
        if (roleName) {
            roleEntries.push({
                role: roleName,
                department: dept
            });
            
            // Set primary department from main role (index 0)
            if (index === 0 && dept) {
                primaryDepartment = dept;
            }
        }
    });
    
    // Collect all unique departments from roles
    const departments = [...new Set(roleEntries.map(r => r.department).filter(d => d))];
    
    // Format roles as JSON string for storage
    const roles = JSON.stringify(roleEntries);
    
    if (!name) {
        alert('Name is required');
        return;
    }
    
    try {
        const response = await fetch('../../api/freelancers/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                name,
                email,
                department: primaryDepartment,
                departments: departments.join(','),
                roles: roles
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        let result;
        
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            if (apiBypass) {
                // Simulate update in bypass mode
                document.querySelector('.freelancer-modal-overlay')?.remove();
                loadFreelancers();
                return;
            }
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            document.querySelector('.freelancer-modal-overlay')?.remove();
            loadFreelancers();
        } else {
            if (apiBypass) {
                // Simulate update in bypass mode
                document.querySelector('.freelancer-modal-overlay')?.remove();
                loadFreelancers();
            } else {
                alert(result.message || 'Failed to update freelancer');
            }
        }
    } catch (error) {
        console.error('Error updating freelancer:', error);
        if (apiBypass) {
            // Simulate update in bypass mode
            document.querySelector('.freelancer-modal-overlay')?.remove();
            loadFreelancers();
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Render System Settings Page
function renderSystemSettings() {
    const otherPages = document.getElementById('other-pages');
    
    otherPages.innerHTML = `
        <div class="system-settings-container">
            <div class="settings-header">
                <h2 class="settings-title">System Settings</h2>
            </div>
            
            <div class="storage-monitor-section">
                <h3 class="section-title">Storage Monitor</h3>
                <div class="storage-stats-grid">
                    <div class="storage-stat-card" id="storage-space-card">
                        <div class="storage-stat-header">
                            <h4 class="storage-stat-title">Space</h4>
                            <span class="storage-status-badge" id="storage-space-status">Loading...</span>
                        </div>
                        <div class="storage-stat-content">
                            <div class="storage-progress-bar">
                                <div class="storage-progress-fill" id="storage-space-progress"></div>
                            </div>
                            <div class="storage-stat-details">
                                <span class="storage-percent" id="storage-space-percent">0%</span>
                                <span class="storage-usage" id="storage-space-usage">Loading...</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="storage-stat-card" id="storage-inodes-card">
                        <div class="storage-stat-header">
                            <h4 class="storage-stat-title">Inodes</h4>
                            <span class="storage-status-badge" id="storage-inodes-status">Loading...</span>
                        </div>
                        <div class="storage-stat-content">
                            <div class="storage-progress-bar">
                                <div class="storage-progress-fill" id="storage-inodes-progress"></div>
                            </div>
                            <div class="storage-stat-details">
                                <span class="storage-percent" id="storage-inodes-percent">0%</span>
                                <span class="storage-usage" id="storage-inodes-usage">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load storage information
    loadStorageInfo();
}

// Load Storage Information
async function loadStorageInfo() {
    try {
        const response = await fetch('../../api/system/storage.php');
        const result = await response.json();
        
        if (result.success) {
            updateStorageDisplay(result);
        } else {
            showStorageError(result.message || 'Failed to load storage information');
        }
    } catch (error) {
        console.error('Error loading storage info:', error);
        showStorageError('Error loading storage information: ' + error.message);
    }
}

// Update Storage Display
function updateStorageDisplay(data) {
    // Update Space information
    const spaceCard = document.getElementById('storage-space-card');
    const spaceProgress = document.getElementById('storage-space-progress');
    const spacePercent = document.getElementById('storage-space-percent');
    const spaceUsage = document.getElementById('storage-space-usage');
    const spaceStatus = document.getElementById('storage-space-status');
    
    if (data.space) {
        const percent = data.space.used_percent;
        spaceProgress.style.width = percent + '%';
        spacePercent.textContent = percent.toFixed(2) + '%';
        spaceUsage.textContent = `${data.space.used_formatted} / ${data.space.total_formatted}`;
        
        // Update status badge
        spaceStatus.textContent = data.space.status === 'critical' ? 'Critical' : 
                                  data.space.status === 'warning' ? 'Warning' : 'OK';
        spaceStatus.className = 'storage-status-badge status-' + data.space.status;
        spaceCard.className = 'storage-stat-card status-' + data.space.status;
        
        // Show warning if needed
        if (data.space.status === 'critical' || data.space.status === 'warning') {
            showStorageWarning('space', percent, data.space.status);
        }
    }
    
    // Update Inodes information
    if (data.inodes) {
        const inodesCard = document.getElementById('storage-inodes-card');
        const inodesProgress = document.getElementById('storage-inodes-progress');
        const inodesPercent = document.getElementById('storage-inodes-percent');
        const inodesUsage = document.getElementById('storage-inodes-usage');
        const inodesStatus = document.getElementById('storage-inodes-status');
        
        const percent = data.inodes.used_percent;
        inodesProgress.style.width = percent + '%';
        inodesPercent.textContent = percent.toFixed(2) + '%';
        inodesUsage.textContent = `${data.inodes.used.toLocaleString()} / ${data.inodes.total.toLocaleString()}`;
        
        // Update status badge
        inodesStatus.textContent = data.inodes.status === 'critical' ? 'Critical' : 
                                   data.inodes.status === 'warning' ? 'Warning' : 'OK';
        inodesStatus.className = 'storage-status-badge status-' + data.inodes.status;
        inodesCard.className = 'storage-stat-card status-' + data.inodes.status;
        
        // Show warning if needed
        if (data.inodes.status === 'critical' || data.inodes.status === 'warning') {
            showStorageWarning('inodes', percent, data.inodes.status);
        }
    } else {
        // Inodes not available (Windows or error)
        const inodesCard = document.getElementById('storage-inodes-card');
        const inodesUsage = document.getElementById('storage-inodes-usage');
        inodesUsage.textContent = 'Not available on this system';
        const inodesStatus = document.getElementById('storage-inodes-status');
        inodesStatus.textContent = 'N/A';
        inodesStatus.className = 'storage-status-badge status-ok';
    }
}

// Show Storage Warning
function showStorageWarning(type, percent, status) {
    const message = status === 'critical' 
        ? `⚠️ CRITICAL: ${type === 'space' ? 'Storage' : 'Inode'} usage is at ${percent.toFixed(2)}%! Immediate action required.`
        : `⚠️ WARNING: ${type === 'space' ? 'Storage' : 'Inode'} usage is at ${percent.toFixed(2)}%. Consider cleaning up.`;
    
    // Show notification (you can replace this with a toast notification system)
    console.warn(message);
    
    // Optionally show an alert or notification
    if (status === 'critical') {
        // Only alert for critical, not warning (to avoid annoying users)
        const existingAlert = document.querySelector('.storage-critical-alert');
        if (!existingAlert) {
            const alert = document.createElement('div');
            alert.className = 'storage-critical-alert';
            alert.innerHTML = `
                <div class="critical-alert-content">
                    <strong>Critical Storage Warning</strong>
                    <p>${message}</p>
                    <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
                </div>
            `;
            document.body.appendChild(alert);
        }
    }
}

// Show Storage Error
function showStorageError(message) {
    const spaceUsage = document.getElementById('storage-space-usage');
    const inodesUsage = document.getElementById('storage-inodes-usage');
    if (spaceUsage) spaceUsage.textContent = 'Error loading data';
    if (inodesUsage) inodesUsage.textContent = 'Error loading data';
    console.error(message);
}

// Get Example Support Cases (for API bypass)
function getExampleSupportCases(status = 'all', searchQuery = '', emailFilter = 'all') {
    const allExamples = [
        {
            id: 1,
            case_id: 'CASE-20250118-ABC123',
            user_email: 'john.doe@example.com',
            user_name: 'John Doe',
            subject: 'Question about application process',
            message: 'Hello, I submitted an application for the Animation Director position last week and wanted to check on the status. Could you provide an update?',
            status: 'open',
            assigned_to: null,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            last_reply_at: null,
            reply_count: 0
        },
        {
            id: 2,
            case_id: 'CASE-20250117-XYZ789',
            user_email: 'sarah.smith@example.com',
            user_name: 'Sarah Smith',
            subject: 'Portfolio submission inquiry',
            message: 'I would like to submit my portfolio for consideration. What is the best way to do this? Should I upload it through the application portal or send it directly via email?',
            status: 'in_progress',
            assigned_to: 'Kevin MD',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            last_reply_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            reply_count: 1
        },
        {
            id: 3,
            case_id: 'CASE-20250116-DEF456',
            user_email: 'mike.wilson@example.com',
            user_name: 'Mike Wilson',
            subject: 'Internship opportunity',
            message: 'I am a student interested in animation internships. Are there any opportunities available for the upcoming summer?',
            status: 'resolved',
            assigned_to: 'Sarah Williams',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            last_reply_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            reply_count: 2
        },
        {
            id: 4,
            case_id: 'CASE-20250115-GHI789',
            user_email: 'lisa.chen@example.com',
            user_name: 'Lisa Chen',
            subject: 'Technical question about requirements',
            message: 'I noticed in the job posting that certain software experience is required. I have experience with similar software but not the exact ones listed. Would this be acceptable?',
            status: 'open',
            assigned_to: null,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            last_reply_at: null,
            reply_count: 0
        }
    ];
    
    // Filter by status
    let filtered = allExamples;
    if (status !== 'all') {
        filtered = filtered.filter(c => c.status === status);
    }
    
    // Filter by email
    if (emailFilter !== 'all') {
        filtered = filtered.filter(c => c.user_email === emailFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
            c.user_email.toLowerCase().includes(query) ||
            (c.user_name && c.user_name.toLowerCase().includes(query)) ||
            c.case_id.toLowerCase().includes(query) ||
            (c.subject && c.subject.toLowerCase().includes(query))
        );
    }
    
    return filtered;
}

// Load Support Cases
async function loadSupportCases() {
    const listDiv = document.getElementById('support-cases-list');
    if (!listDiv) return;
    
    const searchInput = document.getElementById('support-cases-search');
    const statusFilterHidden = document.getElementById('support-cases-status-filter');
    const emailFilterHidden = document.getElementById('support-cases-email-filter');
    
    const searchQuery = searchInput?.value.trim() || '';
    const status = statusFilterHidden?.value || 'all';
    const emailFilter = emailFilterHidden?.value || 'all';
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    // If API bypass is enabled, use example data immediately
    if (apiBypass) {
        const exampleData = getExampleSupportCases(status, searchQuery, emailFilter);
        // Update email filter dropdown with all available emails
        if (window.updateSupportCasesEmailFilter) {
            const allCases = getExampleSupportCases('all', '', 'all');
            window.updateSupportCasesEmailFilter(allCases);
        }
        displaySupportCases(exampleData);
        return;
    }
    
    listDiv.innerHTML = '<div class="loading-state">Loading support cases...</div>';
    
    try {
        const params = new URLSearchParams({
            status: status
        });
        
        if (emailFilter !== 'all') {
            params.append('email', emailFilter);
        }
        
        if (searchQuery) {
            params.append('search', searchQuery);
        }
        
        const response = await fetch(`../../api/support-cases/list.php?${params.toString()}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            // Update email filter dropdown with all available emails
            if (window.updateSupportCasesEmailFilter) {
                // Get all cases to populate email filter
                const allParams = new URLSearchParams({ status: 'all' });
                fetch(`../../api/support-cases/list.php?${allParams.toString()}`)
                    .then(r => r.json())
                    .then(allResult => {
                        if (allResult.success && allResult.data) {
                            window.updateSupportCasesEmailFilter(allResult.data);
                        }
                    })
                    .catch(err => console.error('Error loading all cases for email filter:', err));
            }
            displaySupportCases(result.data);
        } else {
            listDiv.innerHTML = `<div class="empty-state">${result.message || 'Failed to load support cases'}</div>`;
        }
    } catch (error) {
        console.error('Error loading support cases:', error);
        listDiv.innerHTML = '<div class="empty-state">Error loading support cases</div>';
    }
}

// Display Support Cases
function displaySupportCases(cases) {
    const listDiv = document.getElementById('support-cases-list');
    if (!listDiv) return;
    
    if (cases.length === 0) {
        listDiv.innerHTML = '<div class="empty-state">No support cases found.</div>';
        return;
    }
    
    const casesHTML = cases.map(caseItem => {
        const statusClass = `status-${caseItem.status}`;
        const statusLabel = caseItem.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const createdDate = new Date(caseItem.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const updatedDate = new Date(caseItem.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="support-case-card">
                <div class="support-case-header">
                    <div class="support-case-title-section">
                        <div class="support-case-id">${escapeHtml(caseItem.case_id)}</div>
                        <div class="support-case-subject">${escapeHtml(caseItem.subject || 'No Subject')}</div>
                    </div>
                    <div class="support-case-status-section">
                        <span class="status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                </div>
                <div class="support-case-body">
                    <div class="support-case-info">
                        <div class="support-case-info-item">
                            <strong>From:</strong> 
                            <a href="#" class="email-link" data-email="${escapeHtml(caseItem.user_email)}">
                                ${escapeHtml(caseItem.user_email)}
                            </a>
                            ${caseItem.user_name ? ` <span>(${escapeHtml(caseItem.user_name)})</span>` : ''}
                        </div>
                        ${caseItem.assigned_to ? `
                        <div class="support-case-info-item">
                            <strong>Assigned to:</strong> ${escapeHtml(caseItem.assigned_to)}
                        </div>
                        ` : ''}
                        <div class="support-case-info-item">
                            <strong>Created:</strong> ${createdDate}
                        </div>
                        <div class="support-case-info-item">
                            <strong>Updated:</strong> ${updatedDate}
                        </div>
                        ${caseItem.reply_count > 0 ? `
                        <div class="support-case-info-item">
                            <strong>Replies:</strong> ${caseItem.reply_count}
                        </div>
                        ` : ''}
                    </div>
                    <div class="support-case-message-preview">
                        ${escapeHtml(caseItem.message.substring(0, 200))}${caseItem.message.length > 200 ? '...' : ''}
                    </div>
                </div>
                <div class="support-case-actions">
                    <button class="btn-view-details" data-case-id="${caseItem.case_id}">View Details & Reply</button>
                </div>
            </div>
        `;
    }).join('');
    
    listDiv.innerHTML = casesHTML;
    
    // Setup view details handlers
    document.querySelectorAll('[data-case-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const caseId = btn.dataset.caseId;
            viewSupportCaseDetails(caseId, cases.find(c => c.case_id === caseId));
        });
    });
    
    // Setup email link handlers for filtering by email
    document.querySelectorAll('.email-link[data-email]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const email = link.dataset.email;
            const emailFilterHidden = document.getElementById('support-cases-email-filter');
            const emailFilterText = document.getElementById('support-cases-email-filter-text');
            const emailFilterBtn = document.getElementById('support-cases-email-filter-btn');
            const emailFilterDropdown = document.getElementById('support-cases-email-filter-dropdown');
            
            if (emailFilterHidden && emailFilterText) {
                emailFilterHidden.value = email;
                emailFilterText.textContent = email;
                
                // Update active state in dropdown
                if (emailFilterDropdown) {
                    emailFilterDropdown.querySelectorAll('.status-filter-item').forEach(item => {
                        item.classList.remove('active');
                        if (item.dataset.value === email) {
                            item.classList.add('active');
                        }
                    });
                }
                
                loadSupportCases();
            }
        });
    });
}

// View Support Case Details
async function viewSupportCaseDetails(caseId, caseData) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    let caseItem;
    
    try {
        if (apiBypass) {
            // Use example data in bypass mode
            const exampleCases = getExampleSupportCases('all', '');
            caseItem = exampleCases.find(c => c.case_id === caseId) || caseData;
            
            if (!caseItem) {
                alert('Case not found');
                return;
            }
            
            // Add example replies
            if (caseItem.reply_count > 0) {
                const replies = [
                    {
                        id: 1,
                        case_id: caseId,
                        reply_type: 'outgoing',
                        from_email: 'careersupport@vilostudios.com',
                        to_email: caseItem.user_email,
                        subject: 'Re: ' + caseItem.subject,
                        message: 'Thank you for contacting us. We have received your inquiry and will get back to you shortly.',
                        sent_by: caseItem.assigned_to || 'Support Team',
                        created_at: caseItem.last_reply_at || caseItem.updated_at
                    }
                ];
                
                // If there are multiple replies, add more example replies from different recruiters
                if (caseItem.reply_count > 1) {
                    replies.push({
                        id: 2,
                        case_id: caseId,
                        reply_type: 'outgoing',
                        from_email: 'careersupport@vilostudios.com',
                        to_email: caseItem.user_email,
                        subject: 'Re: ' + caseItem.subject,
                        message: 'Following up on your inquiry. We can help you with that. Please let us know if you have any further questions.',
                        sent_by: 'Sarah Williams',
                        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                    });
                }
                
                caseItem.replies = replies;
            } else {
                caseItem.replies = [];
            }
        } else {
            // Fetch full case with replies from API
            const response = await fetch(`../../api/support-cases/get.php?case_id=${caseId}`);
            const result = await response.json();
            
            if (!result.success || !result.data) {
                alert('Failed to load case details');
                return;
            }
            
            caseItem = result.data;
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'support-case-modal-overlay';
        modal.innerHTML = `
            <div class="support-case-modal">
                <div class="support-case-modal-header">
                    <h2>Support Case: ${escapeHtml(caseItem.case_id)}</h2>
                    <button class="btn-close-modal">&times;</button>
                </div>
                <div class="support-case-modal-body">
                    <div class="support-case-details">
                        <div class="support-case-detail-row">
                            <strong>From:</strong> ${escapeHtml(caseItem.user_email)}
                            ${caseItem.user_name ? ` (${escapeHtml(caseItem.user_name)})` : ''}
                        </div>
                        ${caseItem.assigned_to ? `
                        <div class="support-case-detail-row">
                            <strong>Primary Assignee:</strong> ${escapeHtml(caseItem.assigned_to)}
                        </div>
                        ` : ''}
                        ${caseItem.replies && caseItem.replies.length > 0 ? (() => {
                            const recruiterReplies = caseItem.replies.filter(r => r.reply_type === 'outgoing' && r.sent_by);
                            const uniqueRecruiters = [...new Set(recruiterReplies.map(r => r.sent_by))];
                            if (uniqueRecruiters.length > 0) {
                                return `<div class="support-case-detail-row">
                                    <strong>Recruiters who replied:</strong> ${uniqueRecruiters.map(r => escapeHtml(r)).join(', ')}
                                </div>`;
                            }
                            return '';
                        })() : ''}
                        <div class="support-case-detail-row">
                            <strong>Status:</strong> <span class="status-badge status-${caseItem.status}">${caseItem.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </div>
                        <div class="support-case-detail-row">
                            <strong>Subject:</strong> ${escapeHtml(caseItem.subject || 'No Subject')}
                        </div>
                    </div>
                    
                    <div class="support-case-conversation">
                        <h3>Conversation</h3>
                        <div class="conversation-messages">
                            <div class="conversation-message incoming">
                                <div class="message-header">
                                    <strong>From:</strong> ${escapeHtml(caseItem.user_email)}
                                    ${caseItem.user_name ? ` <span>(${escapeHtml(caseItem.user_name)})</span>` : ''}
                                    <span class="message-date">${new Date(caseItem.created_at).toLocaleString()}</span>
                                </div>
                                <div class="message-body">${escapeHtml(caseItem.message).replace(/\n/g, '<br>')}</div>
                            </div>
                            ${caseItem.replies && caseItem.replies.length > 0 ? 
                                caseItem.replies.map(reply => `
                                    <div class="conversation-message ${reply.reply_type}">
                                        <div class="message-header">
                                            <strong>${reply.reply_type === 'incoming' ? 'From' : 'To'}:</strong> ${escapeHtml(reply.reply_type === 'incoming' ? reply.from_email : reply.to_email)}
                                            ${reply.sent_by ? ` <span class="message-sent-by">by ${escapeHtml(reply.sent_by)}</span>` : ''}
                                            <span class="message-date">${new Date(reply.created_at).toLocaleString()}</span>
                                        </div>
                                        <div class="message-body">${escapeHtml(reply.message).replace(/\n/g, '<br>')}</div>
                                    </div>
                                `).join('') 
                                : ''
                            }
                        </div>
                    </div>
                    
                    <div class="support-case-reply-form">
                        <h3>Send Reply</h3>
                        <div class="form-group">
                            <label>Subject</label>
                            <input type="text" id="reply-subject" class="form-input" value="Re: ${escapeHtml(caseItem.subject || 'Career Support Inquiry')}" required>
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea id="reply-message" class="form-textarea" rows="8" required></textarea>
                        </div>
                        <div class="form-group">
                            <button class="btn-primary" id="btn-send-reply" data-case-id="${caseItem.case_id}" data-to-email="${caseItem.user_email}" data-to-name="${caseItem.user_name || ''}">Send Reply</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.btn-close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Send reply handler
        const sendReplyBtn = document.getElementById('btn-send-reply');
        sendReplyBtn.addEventListener('click', async () => {
            const subject = document.getElementById('reply-subject').value.trim();
            const message = document.getElementById('reply-message').value.trim();
            
            if (!subject || !message) {
                alert('Please fill in both subject and message');
                return;
            }
            
            sendReplyBtn.disabled = true;
            sendReplyBtn.textContent = 'Sending...';
            
            const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
            
            if (apiBypass) {
                // In bypass mode, just show a message and reload
                alert('Reply sent successfully! (API Bypass Mode)');
                modal.remove();
                loadSupportCases();
                return;
            }
            
            try {
                const response = await fetch('../../api/support-cases/reply.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        case_id: caseItem.case_id,
                        to_email: sendReplyBtn.dataset.toEmail,
                        to_name: sendReplyBtn.dataset.toName,
                        subject: subject,
                        message: message,
                        recruiter_name: userName,
                        recruiter_email: userEmail
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Close modal and reload
                    modal.remove();
                    loadSupportCases();
                    // Show success message
                    setTimeout(() => {
                        alert('Reply sent successfully! The case status has been updated to "In Progress" and assigned to you.');
                    }, 100);
                } else {
                    alert(result.message || 'Failed to send reply');
                    sendReplyBtn.disabled = false;
                    sendReplyBtn.textContent = 'Send Reply';
                }
            } catch (error) {
                console.error('Error sending reply:', error);
                alert('Error sending reply: ' + error.message);
                sendReplyBtn.disabled = false;
                sendReplyBtn.textContent = 'Send Reply';
            }
        });
        
    } catch (error) {
        console.error('Error loading case details:', error);
        alert('Error loading case details: ' + error.message);
    }
}

// Load Metrics
async function loadMetrics() {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        // Use example data in bypass mode
        loadExampleMetrics();
        return;
    }
    
    try {
        // Load all metrics in parallel
        const [monthlyApplicants, dailyApplicants, monthlyAccepted, dailyAccepted, personalStats, leaderboard] = await Promise.all([
            fetch('../../api/metrics/applicants.php?type=monthly&period=all').then(r => r.json()),
            fetch('../../api/metrics/applicants.php?type=daily&period=all').then(r => r.json()),
            fetch('../../api/metrics/applicants.php?type=monthly&period=accepted').then(r => r.json()),
            fetch('../../api/metrics/applicants.php?type=daily&period=accepted').then(r => r.json()),
            fetch(`../../api/metrics/personal.php?email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(userName)}`).then(r => r.json()),
            fetch('../../api/metrics/leaderboard.php').then(r => r.json())
        ]);
        
        // Render charts
        if (monthlyApplicants.success) {
            renderChart('monthly-applicants-chart', monthlyApplicants.data, 'Monthly Applicants', 'line');
        }
        
        if (dailyApplicants.success) {
            renderChart('daily-applicants-chart', dailyApplicants.data, 'Daily Applicants', 'bar');
        }
        
        if (monthlyAccepted.success) {
            renderChart('monthly-accepted-chart', monthlyAccepted.data, 'Accepted by Month', 'line');
        }
        
        if (dailyAccepted.success) {
            renderChart('daily-accepted-chart', dailyAccepted.data, 'Daily Accepted', 'bar');
        }
        
        // Render personal stats
        if (personalStats.success) {
            renderPersonalStats(personalStats.data);
        }
        
        // Render leaderboard
        if (leaderboard.success) {
            renderLeaderboard(leaderboard.data);
        }
        
    } catch (error) {
        console.error('Error loading metrics:', error);
    }
}

// Render Chart
function renderChart(canvasId, data, label, type = 'line') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !data || data.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    const chartData = {
        labels: data.map(d => d.label),
        datasets: [{
            label: label,
            data: data.map(d => d.value),
            borderColor: '#FF6B35',
            backgroundColor: type === 'bar' ? 'rgba(255, 107, 53, 0.3)' : 'rgba(255, 107, 53, 0.1)',
            borderWidth: 2,
            fill: type === 'line',
            tension: 0.4
        }]
    };
    
    const config = {
        type: type,
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    };
    
    canvas.chart = new Chart(ctx, config);
}

// Render Personal Stats
function renderPersonalStats(stats) {
    const content = document.getElementById('personal-stats-content');
    const badge = document.getElementById('personal-stats-badge');
    
    if (!content) return;
    
    const acceptanceRate = stats.total_processed > 0 
        ? Math.round((stats.accepted / stats.total_processed) * 100) 
        : 0;
    
    if (badge) {
        badge.textContent = `${acceptanceRate}% Acceptance Rate`;
    }
    
    content.innerHTML = `
        <div class="personal-stats-grid">
            <div class="stat-item">
                <div class="stat-value">${stats.total_processed}</div>
                <div class="stat-label">Total Processed</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.accepted}</div>
                <div class="stat-label">Accepted</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.declined}</div>
                <div class="stat-label">Declined</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.blocked}</div>
                <div class="stat-label">Blocked</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.this_month.total}</div>
                <div class="stat-label">This Month</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.this_month.accepted}</div>
                <div class="stat-label">Accepted This Month</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.today.total}</div>
                <div class="stat-label">Today</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.today.accepted}</div>
                <div class="stat-label">Accepted Today</div>
            </div>
        </div>
    `;
}

// Render Leaderboard
function renderLeaderboard(leaderboard) {
    const content = document.getElementById('leaderboard-content');
    if (!content) return;
    
    if (leaderboard.length === 0) {
        content.innerHTML = '<div class="empty-state">No recruiter data available yet.</div>';
        return;
    }
    
    const leaderboardHTML = leaderboard.map((recruiter, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'top-1' : rank === 2 ? 'top-2' : rank === 3 ? 'top-3' : '';
        
        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">#${rank}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${escapeHtml(recruiter.name)}</div>
                    <div class="leaderboard-stats">
                        <div class="leaderboard-stat">
                            <span>Processed:</span>
                            <span class="leaderboard-stat-value">${recruiter.total_processed}</span>
                        </div>
                        <div class="leaderboard-stat">
                            <span>Accepted:</span>
                            <span class="leaderboard-stat-value">${recruiter.accepted}</span>
                        </div>
                        <div class="leaderboard-stat">
                            <span>Rate:</span>
                            <span class="leaderboard-stat-value">${recruiter.acceptance_rate}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    content.innerHTML = `<div class="leaderboard-list">${leaderboardHTML}</div>`;
}

// Load Example Metrics (for API bypass)
function loadExampleMetrics() {
    // Example monthly applicants data
    const monthlyData = [
        { label: 'Jan 2024', value: 45 },
        { label: 'Feb 2024', value: 52 },
        { label: 'Mar 2024', value: 48 },
        { label: 'Apr 2024', value: 61 },
        { label: 'May 2024', value: 55 },
        { label: 'Jun 2024', value: 67 },
        { label: 'Jul 2024', value: 72 },
        { label: 'Aug 2024', value: 68 },
        { label: 'Sep 2024', value: 75 },
        { label: 'Oct 2024', value: 81 },
        { label: 'Nov 2024', value: 79 },
        { label: 'Dec 2024', value: 85 }
    ];
    
    // Example daily data (last 30 days)
    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyData.push({
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: Math.floor(Math.random() * 10) + 1
        });
    }
    
    // Example monthly accepted
    const monthlyAccepted = monthlyData.map(d => ({
        label: d.label,
        value: Math.floor(d.value * 0.35) // ~35% acceptance rate
    }));
    
    // Example daily accepted
    const dailyAccepted = dailyData.map(d => ({
        label: d.label,
        value: Math.floor(d.value * 0.35)
    }));
    
    // Render charts
    renderChart('monthly-applicants-chart', monthlyData, 'Monthly Applicants', 'line');
    renderChart('daily-applicants-chart', dailyData, 'Daily Applicants', 'bar');
    renderChart('monthly-accepted-chart', monthlyAccepted, 'Accepted by Month', 'line');
    renderChart('daily-accepted-chart', dailyAccepted, 'Daily Accepted', 'bar');
    
    // Example personal stats
    renderPersonalStats({
        total_processed: 156,
        accepted: 54,
        declined: 89,
        blocked: 13,
        this_month: { total: 23, accepted: 8 },
        today: { total: 3, accepted: 1 }
    });
    
    // Example leaderboard
    renderLeaderboard([
        { name: 'Kevin MD', total_processed: 245, accepted: 89, acceptance_rate: 36.3 },
        { name: 'Sarah Williams', total_processed: 198, accepted: 72, acceptance_rate: 36.4 },
        { name: 'John Smith', total_processed: 167, accepted: 58, acceptance_rate: 34.7 },
        { name: 'Emily Johnson', total_processed: 142, accepted: 51, acceptance_rate: 35.9 },
        { name: 'Michael Brown', total_processed: 128, accepted: 44, acceptance_rate: 34.4 }
    ]);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

