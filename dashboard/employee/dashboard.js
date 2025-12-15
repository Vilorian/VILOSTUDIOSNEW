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
            otherPages.innerHTML = '<p style="margin-top: 2rem;">Projects interface coming soon...</p>';
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
            otherPages.innerHTML = '<p style="margin-top: 2rem;">Applications interface coming soon...</p>';
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
            otherPages.innerHTML = '<p style="margin-top: 2rem;">Settings interface coming soon...</p>';
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

// Render Freelancer Database Page
function renderFreelancerDatabasePage() {
    const otherPages = document.getElementById('other-pages');
    
    otherPages.innerHTML = `
        <div class="freelancer-database-panel">
            <div class="list-panel-header">
                <h3 class="panel-title">
                    <svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    VILOSTUDIOS Freelancers
                </h3>
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
    `;
    
    // Setup search and filter handlers
    const searchInput = document.getElementById('freelancer-search');
    searchInput.addEventListener('input', loadFreelancers);
    
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

// Load Freelancers
async function loadFreelancers() {
    const listDiv = document.getElementById('freelancer-database-list');
    if (!listDiv) return;
    
    const searchInput = document.getElementById('freelancer-search');
    const searchQuery = searchInput?.value.trim() || '';
    const activeFilterTag = document.querySelector('.filter-tag.active');
    const activeFilter = activeFilterTag?.dataset.filter || '';
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    listDiv.innerHTML = '<div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.4);">Loading...</div>';
    
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (activeFilter) params.append('department', activeFilter);
        if (apiBypass) params.append('bypass', '1');
        
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
            // If API fails and bypass is on, show example data
            if (apiBypass) {
                renderFreelancerList(getExampleFreelancers());
                return;
            }
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            // Only show example data if API bypass is enabled AND no real data exists
            if (apiBypass && (!result.data || result.data.length === 0)) {
                renderFreelancerList(getExampleFreelancers());
            } else {
                renderFreelancerList(result.data || []);
            }
        } else {
            // If API fails and bypass is on, show example data
            if (apiBypass) {
                renderFreelancerList(getExampleFreelancers());
            } else {
                listDiv.innerHTML = `<div class="form-message error">${result.message || 'Failed to load freelancers'}</div>`;
            }
        }
    } catch (error) {
        console.error('Error loading freelancers:', error);
        // Only show example data if API bypass is enabled
        if (apiBypass) {
            renderFreelancerList(getExampleFreelancers());
        } else {
            listDiv.innerHTML = `<div class="form-message error">Error: ${error.message}. Please check your database connection.</div>`;
        }
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

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

