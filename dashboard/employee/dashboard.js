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

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Roles that can view default folders (producers and higher-ups only)
const DEFAULT_FOLDER_ROLES = ['manager', 'director', 'ambassador', 'producer'];

function canViewDefaultFolders() {
    const role = (userRole || '').toLowerCase().replace(/\s+/g, '_');
    return DEFAULT_FOLDER_ROLES.includes(role);
}

// Project higher-ups can edit default folders (rename, move, edit settings)
function getProjectHigherUps() {
    if (!currentEditingProject?.id) return [];
    const stored = localStorage.getItem(`vilostudios_project_${currentEditingProject.id}_higher_ups`);
    return stored ? JSON.parse(stored) : [];
}

function setProjectHigherUps(emails) {
    if (!currentEditingProject?.id) return;
    localStorage.setItem(`vilostudios_project_${currentEditingProject.id}_higher_ups`, JSON.stringify(emails));
}

function toggleProjectHigherUp(email) {
    const emails = getProjectHigherUps().map(e => e.toLowerCase().trim());
    const norm = (email || '').toLowerCase().trim();
    if (!norm) return;
    const idx = emails.indexOf(norm);
    if (idx >= 0) emails.splice(idx, 1);
    else emails.push(norm);
    setProjectHigherUps(emails);
}

function isProjectHigherUp(email) {
    const emails = getProjectHigherUps();
    const norm = (email || '').toLowerCase().trim();
    return emails.some(e => (e || '').toLowerCase().trim() === norm);
}

function canEditDefaultFolders() {
    const role = (userRole || '').toLowerCase().replace(/\s+/g, '_');
    if (role === 'manager') return true;
    return isProjectHigherUp(userEmail);
}

// Toast Notification System
function showNotification(message, type = 'success', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        // Fallback to alert if container doesn't exist
        alert(message);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icons for different types
    const icons = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>`,
        error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>`
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            ${icons[type] || icons.success}
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after duration
    const autoRemove = setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeToast(toast);
    });
    
    // Remove toast function
    function removeToast(element) {
        element.classList.add('removing');
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 250);
    }
}

// Update UI with user info
function updateProfileDisplay() {
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarUserEmail = document.getElementById('sidebar-user-email');
    const headerAvatar = document.getElementById('header-avatar');
    const headerUserName = document.getElementById('header-user-name');
    const headerUserRoleTag = document.getElementById('header-user-role-tag');
    
    if (!sidebarAvatar && !headerAvatar) {
        // Elements not ready yet, try again later
        setTimeout(updateProfileDisplay, 100);
        return;
    }
    
    const firstName = userName ? userName.split(' ')[0] : 'User';
    
    // Check if profile picture exists
    const profilePic = localStorage.getItem('vilostudios_profile_pic');
    
    if (profilePic && profilePic.trim() !== '') {
        // Update avatars with profile picture
        updateAllAvatars(profilePic);
    } else {
        // Use initials
        if (sidebarAvatar) {
            sidebarAvatar.textContent = userInitial || (userName ? userName.charAt(0).toUpperCase() : 'U');
            // Remove any img elements if they exist
            const existingImg = sidebarAvatar.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }
        }
        if (headerAvatar) {
            headerAvatar.textContent = userInitial || (userName ? userName.charAt(0).toUpperCase() : 'U');
            // Remove any img elements if they exist
            const existingImg = headerAvatar.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }
        }
    }
    
    if (sidebarUserName) sidebarUserName.textContent = firstName;
    if (sidebarUserEmail) sidebarUserEmail.textContent = userEmail;
    if (headerUserName) headerUserName.textContent = firstName;
    
    // Update role tag - uppercase
    if (headerUserRoleTag) {
        headerUserRoleTag.textContent = userRole.toUpperCase().replace('_', ' ');
        // Remove all role classes and add the current one
        headerUserRoleTag.className = 'header-user-role-tag';
        headerUserRoleTag.classList.add(userRole.toLowerCase().replace(' ', '_'));
    }
}

// Profile display will be called in main initialization - removed duplicate listener

// Roles and Permissions Data
const roles = [
    { id: 'manager', name: 'Manager', permissions: [] },
    { id: 'director', name: 'Director', permissions: [] },
    { id: 'producer', name: 'Producer', permissions: [] },
    { id: 'ambassador', name: 'Ambassador', permissions: [] },
    { id: 'internal_recruiter', name: 'Internal Recruiter', permissions: [] },
    { id: 'moderator', name: 'Moderator', permissions: [] },
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
    { id: 'communication', name: 'Communication & Support' },
    { id: 'community_management', name: 'Community Management' }
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
    },
    
    // Community Management
    { 
        id: 'community_view', 
        name: 'View Community', 
        description: 'View and access community users, posts, and content in the User Management dashboard page. Read-only access to community activity, user profiles, and forum content.', 
        category: 'community_management' 
    },
    { 
        id: 'community_moderate', 
        name: 'Moderate Community', 
        description: 'View, edit, delete, and manage community posts, comments, and content. Can moderate forum discussions, blog posts, and user-generated content to maintain community guidelines.', 
        category: 'community_management' 
    },
    { 
        id: 'community_ban_users', 
        name: 'Ban Community Users', 
        description: 'Ban and unban community users in the User Management dashboard page. Can restrict user access to community features, forums, and discussions for policy violations.', 
        category: 'community_management' 
    },
    { 
        id: 'community_manage_users', 
        name: 'Manage Community Users', 
        description: 'View, edit, and manage community user profiles, roles, and permissions. Can update user information, assign community roles (member, patreon, staff), and manage user accounts.', 
        category: 'community_management' 
    },
    { 
        id: 'community_manage_roles', 
        name: 'Manage Community Roles', 
        description: 'Assign and modify community-specific roles (member, patreon, staff, moderator) for community users. Can promote users to patreon supporters or staff members.', 
        category: 'community_management' 
    }
];

// Load role permissions from localStorage or use defaults
let rolePermissions = JSON.parse(localStorage.getItem('vilostudios_role_permissions') || '{}');

// Initialize default permissions if not set
if (Object.keys(rolePermissions).length === 0) {
    rolePermissions = {
        manager: permissions.map(p => p.id), // Manager has all permissions
        director: ['view_all_projects', 'create_projects', 'edit_projects'],
        producer: ['view_all_projects', 'create_projects', 'edit_projects'],
        ambassador: ['crm_clients', 'crm_documents', 'freelancer_database', 'freelancer_contacts', 'freelancer_numbers'],
        internal_recruiter: ['applications_view', 'applications_manage', 'positions_create', 'positions_manage', 'freelancer_database'],
        moderator: ['community_view', 'community_moderate', 'community_ban_users', 'community_manage_users'],
        talent: ['view_all_projects', 'freelancer_database', 'applications_view'],
        production_assistant: ['freelancer_database', 'freelancer_numbers', 'view_all_projects', 'applications_view', 'positions_create'],
        client: ['view_all_projects', 'crm_documents', 'send_communications']
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
    // #region agent log
    console.log('[DEBUG] initDashboard entry', {currentRole, rolesCount: roles.length, permissionsCount: permissions.length, hypothesisId: 'A'});
    // #endregion
    try {
        // #region agent log
        console.log('[DEBUG] Calling renderRolesList', {timestamp: Date.now(), hypothesisId: 'D'});
        // #endregion
    renderRolesList();
    } catch(e) {
        // #region agent log
        console.error('[DEBUG] renderRolesList error', {error: e.message, stack: e.stack, hypothesisId: 'D'});
        // #endregion
        console.error('Error in renderRolesList:', e);
    }
    try {
        // #region agent log
        console.log('[DEBUG] Calling renderPermissions', {timestamp: Date.now(), hypothesisId: 'D'});
        // #endregion
    renderPermissions();
    } catch(e) {
        // #region agent log
        console.error('[DEBUG] renderPermissions error', {error: e.message, stack: e.stack, hypothesisId: 'D'});
        // #endregion
        console.error('Error in renderPermissions:', e);
    }
    try {
        // #region agent log
        console.log('[DEBUG] Calling setupEventListeners', {timestamp: Date.now(), hypothesisId: 'C'});
        // #endregion
    setupEventListeners();
    } catch(e) {
        // #region agent log
        console.error('[DEBUG] setupEventListeners error', {error: e.message, stack: e.stack, hypothesisId: 'C'});
        // #endregion
        console.error('Error in setupEventListeners:', e);
    }
    
    // Show announcements link for ambassadors and managers
    const announcementsLink = document.getElementById('nav-ambassador-announcements');
    if (announcementsLink && (userRole === 'ambassador' || userRole === 'manager')) {
        announcementsLink.style.display = 'flex';
    }
    
    // Show cuts management link for staff only (not clients)
    const cutsManagementLink = document.getElementById('nav-cuts-management');
    if (cutsManagementLink && userRole !== 'client') {
        cutsManagementLink.style.display = 'flex';
    }
    
    // View as dropdown - only available to managers
    const viewAsWrapper = document.querySelector('.view-as-wrapper');
    if (viewAsWrapper) {
        const role = (userRole || '').toLowerCase();
        viewAsWrapper.style.display = role === 'manager' ? 'flex' : 'none';
    }
    
    // Role-based nav visibility (View as)
    updateNavForRole(viewAsRole);
}

// Role -> first visible page when switching roles
const ROLE_DEFAULT_PAGES = {
    manager: 'permissions',
    director: 'projects',
    producer: 'projects',
    ambassador: 'documents',
    internal_recruiter: 'freelancer-database',
    talent: 'pa-orders',
    production_assistant: 'pa-orders',
    client: 'projects'
};

// Update nav visibility based on viewAsRole
function updateNavForRole(role) {
    const navItems = document.querySelectorAll('.nav-item[data-roles]');
    const navSections = document.querySelectorAll('.nav-section[data-roles]');
    const allowedRoles = (role + '').split(',').map(r => r.trim());
    
    navItems.forEach(item => {
        const itemRoles = (item.getAttribute('data-roles') || '').split(',').map(r => r.trim());
        const visible = itemRoles.some(r => allowedRoles.includes(r));
        item.style.display = visible ? 'flex' : 'none';
        if (!visible && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
    
    navSections.forEach(section => {
        const sectionRoles = (section.getAttribute('data-roles') || '').split(',').map(r => r.trim());
        const visible = sectionRoles.some(r => allowedRoles.includes(r));
        section.style.display = visible ? 'block' : 'none';
    });
}

// Render roles list
function renderRolesList() {
    // #region agent log
    console.log('[DEBUG] renderRolesList entry', {currentRole, rolesCount: roles.length, hypothesisId: 'D'});
    // #endregion
    const rolesList = document.getElementById('roles-list');
    // #region agent log
    console.log('[DEBUG] rolesList element check', {found: !!rolesList, elementId: 'roles-list', hypothesisId: 'B'});
    // #endregion
    if (!rolesList) {
        console.error('roles-list element not found');
        return;
    }
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
    // #region agent log
    console.log('[DEBUG] renderRolesList exit', {rolesRendered: roles.length, rolesListChildren: rolesList.children.length, hypothesisId: 'D'});
    // #endregion
}

// Render permissions
function renderPermissions() {
    // #region agent log
    console.log('[DEBUG] renderPermissions entry', {currentRole, currentCategory, searchQuery, hypothesisId: 'D'});
    // #endregion
    const selectedRoleTitle = document.getElementById('selected-role-title');
    const permissionsList = document.getElementById('permissions-list');
    
    // #region agent log
    console.log('[DEBUG] Permission elements check', {selectedRoleTitle: !!selectedRoleTitle, permissionsList: !!permissionsList, hypothesisId: 'B'});
    // #endregion
    
    if (!selectedRoleTitle || !permissionsList) {
        console.error('Permission page elements not found:', { selectedRoleTitle, permissionsList });
        return;
    }
    
    const selectedRole = roles.find(r => r.id === currentRole);
    if (!selectedRole) {
        console.error('Selected role not found:', currentRole);
        return;
    }
    
    selectedRoleTitle.textContent = `${selectedRole.name} Permissions`;
    
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
    
    // Render permissions list (permissionsList already declared above)
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
    // #region agent log
    console.log('[DEBUG] renderPermissions exit', {sectionsRendered: Object.keys(grouped).length, permissionsListChildren: permissionsList.children.length, hypothesisId: 'D'});
    // #endregion
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
    const searchInput = document.getElementById('permission-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderPermissions();
    });
    }
    
    // Save button
    const saveBtn = document.getElementById('save-permissions-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
        // In a real app, this would save to the server
            showNotification('Permissions saved successfully!', 'success', 3000);
        });
    }
    
    // Navigation items - use simple event delegation
    const sidebar = document.querySelector('.sidebar');
    // #region agent log
    console.log('[DEBUG] Setting up navigation listeners', {sidebarFound: !!sidebar, navItemsCount: document.querySelectorAll('.nav-item').length, hypothesisId: 'C'});
    // #endregion
    if (sidebar) {
        // Remove old listener by cloning sidebar
        const newSidebar = sidebar.cloneNode(true);
        sidebar.parentNode.replaceChild(newSidebar, sidebar);
        
        // Attach fresh listener to new sidebar
        const freshSidebar = document.querySelector('.sidebar');
        if (freshSidebar) {
            freshSidebar.addEventListener('click', function(e) {
                // #region agent log
                console.log('[DEBUG] Sidebar clicked', {target: e.target.tagName, hypothesisId: 'C'});
                // #endregion
                
                const navItem = e.target.closest('.nav-item');
                // #region agent log
                console.log('[DEBUG] Nav item found', {found: !!navItem, hasPage: navItem ? !!navItem.dataset.page : false, page: navItem ? navItem.dataset.page : 'none', hypothesisId: 'C'});
                // #endregion
                
                if (!navItem || !navItem.dataset.page) {
                    console.log('[DEBUG] No nav item or page, returning');
                    return;
                }
                
            e.preventDefault();
                e.stopPropagation();
                const page = navItem.dataset.page;
                
                // #region agent log
                console.log('[DEBUG] About to switch page', {page, hypothesisId: 'C'});
                // #endregion
                
                // SIMPLE: Just remove all active, add to clicked, then switch page
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
                navItem.classList.add('active');
                
                // #region agent log
                console.log('[DEBUG] Calling switchPage', {page, hypothesisId: 'C'});
                // #endregion
                
                try {
                    switchPage(page);
                    // #region agent log
                    console.log('[DEBUG] switchPage completed', {page, hypothesisId: 'C'});
                    // #endregion
                } catch(error) {
                    // #region agent log
                    console.error('[DEBUG] Error in switchPage', {error: error.message, stack: error.stack, hypothesisId: 'C'});
                    // #endregion
                    console.error('Error switching page:', error);
                }
            });
        }
    }
    
    // Direct attachment as backup - REMOVED to avoid conflicts with sidebar handler
    // The sidebar event delegation should handle all clicks
    
    // View as dropdown
    const viewAsBtn = document.getElementById('view-as-btn');
    const viewAsDropdown = document.getElementById('view-as-dropdown');
    const viewAsRoleSpan = document.getElementById('view-as-role');
    
    if (viewAsBtn && viewAsDropdown && viewAsRoleSpan) {
        // Populate dropdown with roles (exclude moderator per user request)
        function renderViewAsDropdown() {
            viewAsDropdown.innerHTML = '';
            roles.filter(r => r.id !== 'moderator').forEach(role => {
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
                    
                    // Role-based nav visibility
                    updateNavForRole(viewAsRole);
                    
                    // Change the selected role in the roles panel and permissions view
                    currentRole = viewAsRole;
                    renderRolesList();
                    renderPermissions();
                    
                    // Switch to first visible page for this role
                    const defaultPage = ROLE_DEFAULT_PAGES[viewAsRole];
                    if (defaultPage && typeof switchPage === 'function') {
                        switchPage(defaultPage);
                    }
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
    
    // #region agent log
    console.log('[DEBUG] API Bypass button check', {
        buttonFound: !!apiBypassBtn,
        textFound: !!apiBypassText,
        userRole: userRole,
        isManager: userRole === 'manager' || userRole === 'Manager',
        hypothesisId: 'A'
    });
    // #endregion
    
    if (apiBypassBtn && (userRole === 'manager' || userRole === 'Manager')) {
        apiBypassBtn.style.display = 'flex';
        // #region agent log
        console.log('[DEBUG] API Bypass button displayed', {hypothesisId: 'A'});
        // #endregion
        
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
    // #region agent log
    console.log('[DEBUG] switchPage called', {page: page || 'undefined', hypothesisId: 'A'});
    // #endregion
    if (!page) {
        console.error('switchPage called without page parameter');
        return;
    }
    
    const permissionsPage = document.getElementById('permissions-page');
    const otherPages = document.getElementById('other-pages');
    const pageTitle = document.getElementById('page-title');
    
    // #region agent log
    console.log('[DEBUG] switchPage element check', {page, permissionsPage: !!permissionsPage, otherPages: !!otherPages, pageTitle: !!pageTitle, hypothesisId: 'B'});
    // #endregion
    
    if (!permissionsPage || !otherPages || !pageTitle) {
        console.error('Required page elements not found:', { 
            permissionsPage: !!permissionsPage, 
            otherPages: !!otherPages, 
            pageTitle: !!pageTitle 
        });
        // Try to find elements again after a delay
        setTimeout(() => {
            const retryPermissionsPage = document.getElementById('permissions-page');
            const retryOtherPages = document.getElementById('other-pages');
            const retryPageTitle = document.getElementById('page-title');
            if (retryPermissionsPage && retryOtherPages && retryPageTitle) {
                switchPage(page);
            }
        }, 100);
        return;
    }
    
    console.log('Switching to page:', page);
    
    switch(page) {
        case 'permissions':
            // #region agent log
            console.log('[DEBUG] Switching to permissions page', {permissionsPageDisplay: getComputedStyle(permissionsPage).display, otherPagesDisplay: getComputedStyle(otherPages).display, hypothesisId: 'E'});
            // #endregion
            permissionsPage.style.display = 'block';
            otherPages.style.display = 'none';
            pageTitle.textContent = 'Manager Dashboard';
            // Ensure permissions are rendered
            renderRolesList();
            renderPermissions();
            // #region agent log
            console.log('[DEBUG] Permissions page switched', {permissionsPageDisplay: getComputedStyle(permissionsPage).display, otherPagesDisplay: getComputedStyle(otherPages).display, hypothesisId: 'E'});
            // #endregion
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
        case 'project-editor':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderProjectEditorPage();
            pageTitle.textContent = 'Project Editor';
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
        case 'cuts-management':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderCutsManagementPage();
            pageTitle.textContent = 'Cuts Management';
            break;
        case 'create-position':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderCreatePositionPage();
            pageTitle.textContent = 'Create Position';
            break;
        case 'documents':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderDocumentsPage();
            pageTitle.textContent = 'Documents & Pricing';
            break;
        case 'settings':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderSystemSettings();
            pageTitle.textContent = 'Settings';
            break;
        case 'client-management':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            pageTitle.textContent = 'Client Management';
            renderClientManagementPage();
            setTimeout(() => updateProfileDisplay(), 100);
            break;
        case 'ambassador-announcements':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderAmbassadorAnnouncementsPage();
            pageTitle.textContent = 'Announcements';
            break;
        case 'pa-orders':
            permissionsPage.style.display = 'none';
            otherPages.style.display = 'block';
            renderPAOrdersPage();
            pageTitle.textContent = 'Submit Order';
            break;
        default:
            permissionsPage.style.display = 'block';
            otherPages.style.display = 'none';
            pageTitle.textContent = 'Manager Dashboard';
            // Ensure permissions are rendered
            renderRolesList();
            renderPermissions();
    }
    
    // SIMPLE: Update active nav item - one clean function
    function updateActiveNav() {
        // Remove active from all
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Add active to the current page
        const targetNav = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (targetNav) {
            targetNav.classList.add('active');
        }
    }
    
    // Update immediately and once more after a short delay
    updateActiveNav();
    setTimeout(updateActiveNav, 100);
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
                    <span id="user-management-title">All Users</span>
                </h3>
                <div class="user-management-tabs" style="display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-lg); border-bottom: 1px solid var(--border-default);">
                    <button class="user-tab active" data-tab="dashboard" style="padding: var(--spacing-md) var(--spacing-lg); background: none; border: none; border-bottom: 2px solid var(--accent-orange); color: var(--text-primary); font-weight: 600; cursor: pointer; transition: all 0.2s ease;">Dashboard Users</button>
                    <button class="user-tab" data-tab="community" style="padding: var(--spacing-md) var(--spacing-lg); background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-secondary); font-weight: 600; cursor: pointer; transition: all 0.2s ease;">Community Users</button>
                </div>
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
                    <div class="filter-tags" id="user-filter-tags">
                        <button class="filter-tag active" data-filter="">All</button>
                        <button class="filter-tag" data-filter="manager">Manager</button>
                        <button class="filter-tag" data-filter="ambassador">Ambassador</button>
                        <button class="filter-tag" data-filter="internal_recruiter">Recruiter</button>
                        <button class="filter-tag" data-filter="moderator">Moderator</button>
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
    
    // Setup tab switching
    let currentTab = 'dashboard';
    document.querySelectorAll('.user-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentTab = tab.dataset.tab;
            document.querySelectorAll('.user-tab').forEach(t => {
                t.classList.remove('active');
                t.style.borderBottomColor = 'transparent';
                t.style.color = 'var(--text-secondary)';
            });
            tab.classList.add('active');
            tab.style.borderBottomColor = 'var(--accent-orange)';
            tab.style.color = 'var(--text-primary)';
            
            // Update title
            const title = document.getElementById('user-management-title');
            if (title) {
                title.textContent = currentTab === 'community' ? 'Community Users' : 'All Users';
            }
            
            // Update filters based on tab
            const filterTags = document.getElementById('user-filter-tags');
            if (currentTab === 'community') {
                filterTags.innerHTML = `
                    <button class="filter-tag active" data-filter="">All</button>
                    <button class="filter-tag" data-filter="member">Member</button>
                    <button class="filter-tag" data-filter="patreon">Patreon</button>
                    <button class="filter-tag" data-filter="staff">Staff</button>
                    <button class="filter-tag" data-filter="banned">Banned</button>
                `;
            } else {
                filterTags.innerHTML = `
                    <button class="filter-tag active" data-filter="">All</button>
                    <button class="filter-tag" data-filter="manager">Manager</button>
                    <button class="filter-tag" data-filter="ambassador">Ambassador</button>
                    <button class="filter-tag" data-filter="internal_recruiter">Recruiter</button>
                    <button class="filter-tag" data-filter="moderator">Moderator</button>
                    <button class="filter-tag" data-filter="production_assistant">PA</button>
                    <button class="filter-tag" data-filter="client">Client</button>
                    <button class="filter-tag" data-filter="banned">Banned</button>
                `;
            }
            
            // Re-setup filter handlers
            document.querySelectorAll('.filter-tag').forEach(tag => {
                tag.addEventListener('click', () => {
                    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                    tag.classList.add('active');
                    loadUsers();
                });
            });
            
            loadUsers();
        });
    });
    
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
    
    const activeTab = document.querySelector('.user-tab.active');
    const currentTab = activeTab?.dataset.tab || 'dashboard';
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
        
        let apiEndpoint;
        if (currentTab === 'community') {
            apiEndpoint = `../../api/community/list.php?${params}`;
        } else {
            apiEndpoint = `../../api/users/list.php?${params}`;
        }
        
        const response = await fetch(apiEndpoint);
        
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
                if (currentTab === 'community') {
                    renderCommunityUserList(getExampleCommunityUsers());
                } else {
                renderUserList(getExampleUsers());
                }
                return;
            }
            throw new Error('Invalid response from server');
        }
        
        if (result.success) {
            if (currentTab === 'community') {
                renderCommunityUserList(result.data || []);
            } else {
            renderUserList(result.data || []);
            }
        } else {
            // If API fails and bypass is on, show example data
            if (apiBypass) {
                if (currentTab === 'community') {
                    renderCommunityUserList(getExampleCommunityUsers());
                } else {
                renderUserList(getExampleUsers());
                }
            } else {
                listDiv.innerHTML = `<div class="form-message error">${result.message || 'Failed to load users'}</div>`;
            }
        }
    } catch (error) {
        console.error('Error loading users:', error);
        // If API fails and bypass is on, show example data
        if (apiBypass) {
            if (currentTab === 'community') {
                renderCommunityUserList(getExampleCommunityUsers());
            } else {
            renderUserList(getExampleUsers());
            }
        } else {
            listDiv.innerHTML = `<div class="form-message error">Error: ${error.message}</div>`;
        }
    }
}

// Get Example Community Users (for API bypass)
function getExampleCommunityUsers() {
    return [
        { id: 1, username: 'animator123', email: 'user1@example.com', role: 'member', patreon_supporter: false, created_at: '2024-01-15 10:30:00', banned: false },
        { id: 2, username: 'creator_pro', email: 'user2@example.com', role: 'patreon', patreon_supporter: true, created_at: '2024-02-20 14:15:00', banned: false },
        { id: 3, username: 'kevin', email: 'kevin@vilostudios.com', role: 'staff', patreon_supporter: false, created_at: '2024-03-10 09:00:00', banned: false },
        { id: 4, username: 'banned_user', email: 'banned@example.com', role: 'member', patreon_supporter: false, created_at: '2024-01-20 08:00:00', banned: true }
    ];
}

// Render Community User List
function renderCommunityUserList(users) {
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
                <p style="font-size: var(--font-md); margin-top: 0.5rem;">No community users found</p>
            </div>
        `;
        return;
    }
    
    listDiv.innerHTML = users.map(user => {
        const role = user.role || 'member';
        const isBanned = user.banned || false;
        const statusClass = isBanned ? 'banned' : 'active';
        const roleColors = {
            'member': { bg: 'rgba(192, 192, 192, 0.15)', color: '#C0C0C0', border: 'rgba(192, 192, 192, 0.25)' },
            'patreon': { bg: 'rgba(255, 107, 53, 0.15)', color: '#FF6B35', border: 'rgba(255, 107, 53, 0.25)' },
            'staff': { bg: 'rgba(96, 165, 250, 0.15)', color: '#60A5FA', border: 'rgba(96, 165, 250, 0.25)' }
        };
        const roleColor = roleColors[role] || roleColors['member'];
        const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';
        const avatarUrl = user.profile_picture ? `../../${user.profile_picture}` : null;
        
        return `
        <div class="user-management-item" data-status="${statusClass}">
            <div class="user-item-header">
                <div class="user-item-info">
                    <div class="user-item-name">
                        ${avatarUrl ? 
                            `<img src="${avatarUrl}" alt="${user.username}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 0.5rem; object-fit: cover; border: 2px solid ${roleColor.border};" />` :
                            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; opacity: 0.6;">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>`
                        }
                        ${user.username || 'Unknown'}
                    </div>
                    <div class="user-item-email">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; opacity: 0.5;">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        ${user.email || 'No email'}
                    </div>
                    <div class="user-item-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; opacity: 0.5;">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Joined: ${createdDate}
                    </div>
                </div>
                <div class="user-item-actions">
                    <div class="user-item-tags">
                        <span class="role-tag" style="background: ${roleColor.bg}; color: ${roleColor.color}; border-color: ${roleColor.border};">
                            ${role.toUpperCase()}
                        </span>
                        ${user.patreon_supporter ? 
                            `<span class="role-tag" style="background: rgba(255, 107, 53, 0.15); color: #FF6B35; border-color: rgba(255, 107, 53, 0.25);">PATREON</span>` : 
                            ''
                        }
                        <span class="status-tag ${statusClass}">
                            ${isBanned ? 'BANNED' : 'ACTIVE'}
                        </span>
                    </div>
                    <div class="user-item-buttons" style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                        ${isBanned ? 
                            `<button class="action-btn unban-btn" data-user-id="${user.id}" data-email="${user.email}" title="Unban User">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                                Unban
                            </button>` :
                            `<button class="action-btn ban-btn" data-user-id="${user.id}" data-email="${user.email}" title="Ban User">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                                Ban
                            </button>`
                        }
                        <button class="action-btn timeout-btn" data-user-id="${user.id}" data-email="${user.email}" title="Timeout User" style="background: rgba(251, 191, 36, 0.15); color: #FBBF24; border-color: rgba(251, 191, 36, 0.3);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Timeout
                        </button>
                        <button class="action-btn remove-user-btn" data-user-id="${user.id}" data-email="${user.email}" title="Remove User" style="background: rgba(239, 68, 68, 0.15); color: #EF4444; border-color: rgba(239, 68, 68, 0.3);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Setup ban/unban handlers
    document.querySelectorAll('.ban-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const userId = btn.dataset.userId;
            const email = btn.dataset.email;
            await banCommunityUser(userId, email);
        });
    });
    
    document.querySelectorAll('.unban-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const userId = btn.dataset.userId;
            await unbanCommunityUser(userId);
        });
    });
    
    document.querySelectorAll('.timeout-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const userId = btn.dataset.userId;
            const email = btn.dataset.email;
            await timeoutCommunityUser(userId, email);
        });
    });
    
    document.querySelectorAll('.remove-user-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const userId = btn.dataset.userId;
            const email = btn.dataset.email;
            await removeCommunityUser(userId, email);
        });
    });
}

// Ban Community User
async function banCommunityUser(userId, email) {
    if (!confirm(`Are you sure you want to ban ${email}?`)) {
        return;
    }
    
    try {
        const response = await fetch('../../api/community/ban.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                id: userId,
                email: email
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadUsers();
        } else {
            showNotification(result.message || 'Failed to ban user', 'error');
        }
    } catch (error) {
        console.error('Error banning user:', error);
        showNotification('Error banning user', 'error');
    }
}

// Unban Community User
async function unbanCommunityUser(userId) {
    if (!confirm('Are you sure you want to unban this user?')) {
        return;
    }
    
    try {
        const response = await fetch('../../api/community/unban.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                id: userId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadUsers();
        } else {
            showNotification(result.message || 'Failed to unban user', 'error');
        }
    } catch (error) {
        console.error('Error unbanning user:', error);
        showNotification('Error unbanning user', 'error');
    }
}

// Timeout Community User
async function timeoutCommunityUser(userId, email) {
    const hours = prompt(`Enter timeout duration in hours for ${email}:\n\nExamples:\n- 1 hour\n- 24 hours (1 day)\n- 168 hours (1 week)`, '24');
    
    if (hours === null) return;
    
    const hoursNum = parseInt(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
        showNotification('Invalid timeout duration', 'error');
        return;
    }
    
    const reason = prompt('Enter reason for timeout (optional):', '');
    if (reason === null) return;
    
    if (!confirm(`Timeout ${email} for ${hoursNum} hour(s)?`)) {
        return;
    }
    
    try {
        const response = await fetch('../../api/community/timeout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                id: userId,
                email: email,
                hours: hoursNum,
                reason: reason
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadUsers();
        } else {
            showNotification(result.message || 'Failed to timeout user', 'error');
        }
    } catch (error) {
        console.error('Error timing out user:', error);
        showNotification('Error timing out user', 'error');
    }
}

// Remove Community User
async function removeCommunityUser(userId, email) {
    if (!confirm(`WARNING: This will permanently delete user ${email} and all their posts/comments.\n\nThis action cannot be undone!\n\nAre you absolutely sure?`)) {
        return;
    }
    
    if (!confirm(`Final confirmation: Delete ${email} permanently?`)) {
        return;
    }
    
    try {
        const response = await fetch('../../api/community/remove_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                id: userId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadUsers();
        } else {
            showNotification(result.message || 'Failed to remove user', 'error');
        }
    } catch (error) {
        console.error('Error removing user:', error);
        showNotification('Error removing user', 'error');
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
            portfolio_url: 'https://sarahjohnson-animation.portfolio.com',
            genre: 'drama, action, sci-fi'
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
            cv_path: null,
            genre: 'action, comedy'
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
            portfolio_url: 'https://emmawilliams-art.portfolio.com',
            genre: 'fantasy, sci-fi'
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
        'director': 'Director',
        'producer': 'Producer',
        'ambassador': 'Ambassador',
        'internal_recruiter': 'Internal Recruiter',
        'moderator': 'Moderator',
        'talent': 'Production Assistant',
        'production_assistant': 'PA',
        'client': 'Client',
        'freelancer': 'Freelancer'
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
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
        const role = typeof viewAsRole !== 'undefined' ? viewAsRole : (typeof userRole !== 'undefined' ? userRole : '');
        const isClient = (role + '').toLowerCase() === 'client';
        const filtered = isClient && userEmail ? exampleProjects.filter(p => (p.client_email || p.client_name) === userEmail) : exampleProjects;
        displayProjects(filtered);
        return;
    }
    
    const role = typeof viewAsRole !== 'undefined' ? viewAsRole : (typeof userRole !== 'undefined' ? userRole : '');
    const isClient = (role + '').toLowerCase() === 'client';
    const url = isClient && userEmail ? `../../api/projects/list.php?client_email=${encodeURIComponent(userEmail)}` : '../../api/projects/list.php';
    
    try {
        const response = await fetch(url);
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
    const stored = JSON.parse(localStorage.getItem('vilostudios_projects') || '[]');
    if (stored.length > 0) {
        return stored.map(p => ({ ...p, team_member_count: p.team_member_count || 0 }));
    }
    return [
        {
            id: 1,
            project_name: 'Wuthering Waves - Where Are You Rover?',
            client_name: 'Kuro Games',
            client_email: 'client@kurogames.com',
            cover_image_path: 'src/videos/Kuro Games/COVER.jpg',
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
            } else if (project.cover_image_path.startsWith('uploads/') || project.cover_image_path.startsWith('src/')) {
                coverImage = `../../${project.cover_image_path}`;
            } else if (project.cover_image_path.startsWith('data:')) {
                coverImage = project.cover_image_path;
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
                // Navigate to full project editor page
                openProjectEditor(projectId, projectData);
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

// ============================================
// PROJECT EDITOR - FULL PAGE EDITING MODE
// ============================================

// Current project editor state
let currentEditingProject = null;
let projectEditorFolders = [];

// Starter document content - explains how the project system works
function getStarterProjectDocument() {
    const content = `# VILOSTUDIOS Project Guide
## How This Project System Works

Welcome to your new project! This guide explains how to use the project system effectively.

### FOLDER STRUCTURE
Projects are organized into folders:
- **Deliverables** – Final files to deliver to the client
- **Covers & Artwork** – Cover images, artwork, and promotional materials
- **Pictures & Screenshots** – Reference images and work-in-progress screenshots
- **Documents** – Scripts, contracts, notes, and documentation
- **Videos** – Animation clips, previews, and final renders
- **Other Files** – Miscellaneous files that don't fit other categories

### CUSTOM FOLDERS
You can create additional folders via the + button. Each folder can be:
- **Public Showcase** – Visible to everyone, can appear on the portfolio
- **Client Access** – Visible to staff and client only
- **Staff Only** – Internal use, hidden from clients

### FILES
- **Upload** – Click Upload Files to add files to any folder
- **Visibility** – Toggle whether each file is visible to the client
- **Downloads** – Control if clients can download each file
- **Move** – Move files between folders as needed
- **Preview** – Click the eye icon to preview images, videos, and PDFs

### ROLES & PERMISSIONS
- **Producers, Directors, Managers** – Can see all folders including defaults
- **Other staff** – See only custom folders they have access to
- **Clients** – See folders marked for client access

### BEST PRACTICES
1. Keep Deliverables organized with final, approved versions only
2. Use Documents for scripts, schedules, and project notes
3. Staff-only folders for internal work-in-progress
4. Enable portfolio visibility for projects you want to showcase

---
*This document was automatically added to every new project. You can edit or delete it.*`;

    const dataUrl = 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(content)));
    return {
        name: 'Project Guide - How It Works.txt',
        dataUrl: dataUrl,
        type: 'text/plain',
        size: new Blob([content]).size,
        isVisible: true,
        isDownloadable: true,
        uploadedAt: new Date().toISOString(),
        isStarterDoc: true
    };
}

// Ensure starter document exists in Documents folder (for existing projects)
function ensureStarterDocumentExists() {
    const documentsFolder = projectEditorFolders.find(f => f.id === 'documents');
    if (!documentsFolder) return;
    
    const starterDocName = 'Project Guide - How It Works.txt';
    const hasStarterDoc = documentsFolder.files?.some(f => f.name === starterDocName);
    
    if (!hasStarterDoc) {
        const starterDoc = getStarterProjectDocument();
        documentsFolder.files = documentsFolder.files || [];
        documentsFolder.files.unshift(starterDoc);
        saveProjectFolders();
    }
}

// Open Project Editor (Full Page)
function openProjectEditor(projectId, projectData) {
    currentEditingProject = {
        ...projectData,
        id: projectId
    };
    
    // Load project folders from storage or initialize defaults
    const storedFolders = localStorage.getItem(`vilostudios_project_${projectId}_folders`);
    if (storedFolders) {
        projectEditorFolders = JSON.parse(storedFolders);
        ensureStarterDocumentExists();
    } else {
        // Initialize default folder structure with starter document
        const starterDoc = getStarterProjectDocument();
        projectEditorFolders = [
            { id: 'deliverables', name: 'Deliverables', icon: 'package', files: [], isDefault: true },
            { id: 'covers', name: 'Covers & Artwork', icon: 'image', files: [], isDefault: true },
            { id: 'pictures', name: 'Pictures & Screenshots', icon: 'camera', files: [], isDefault: true },
            { id: 'documents', name: 'Documents', icon: 'file-text', files: [starterDoc], isDefault: true },
            { id: 'videos', name: 'Videos', icon: 'video', files: [], isDefault: true },
            { id: 'other', name: 'Other Files', icon: 'folder', files: [], isDefault: true }
        ];
        saveProjectFolders();
    }
    
    // Switch to project editor page
    switchPage('project-editor');
}

// Render Project Editor Page
function renderProjectEditorPage() {
    const otherPages = document.getElementById('other-pages');
    if (!otherPages || !currentEditingProject) {
        // No project selected, go back to projects
        switchPage('projects');
        return;
    }
    
    const project = currentEditingProject;
    
    otherPages.innerHTML = `
        <div class="project-editor-page">
            <!-- Header with back button -->
            <div class="project-editor-header">
                <button class="btn-back-to-projects" onclick="switchPage('projects')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Projects
                </button>
                <div class="project-editor-title-section">
                    <h1 class="project-editor-title">${escapeHtml(project.project_name)}</h1>
                    ${project.client_name ? `<span class="project-editor-client">Client: ${escapeHtml(project.client_name)}</span>` : ''}
                </div>
                <div class="project-editor-actions">
                    <button class="btn-secondary" onclick="saveProjectChanges()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save All Changes
                    </button>
                </div>
            </div>
            
            <!-- Main Editor Layout -->
            <div class="project-editor-layout">
                <!-- Left Sidebar - Folder Navigation -->
                <div class="project-editor-sidebar">
                    <div class="folder-nav-header">
                        <h3>Project Files</h3>
                        <button class="btn-icon-small" onclick="openCreateFolderModal()" title="Create New Folder">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                        </button>
                    </div>
                    <div class="folder-nav-list" id="folder-nav-list">
                        ${renderFolderNavigation()}
                    </div>
                    
                    <!-- Project Settings Section -->
                    <div class="project-settings-section">
                        <h4>Project Settings</h4>
                        <button class="btn-settings-item" onclick="showProjectDetailsEditor()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                            Project Details
                        </button>
                        <button class="btn-settings-item" onclick="showVisibilitySettings()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            Visibility Settings
                        </button>
                        <button class="btn-settings-item" onclick="showTeamMembers()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            Team Members
                        </button>
                    </div>
                </div>
                
                <!-- Main Content Area -->
                <div class="project-editor-content">
                    <div id="project-editor-main-content">
                        ${(function() {
                            const visible = getVisibleFolders();
                            const firstId = visible[0]?.id;
                            if (!firstId) {
                                return '<div class="empty-state">No folders available. Create a folder to get started.</div>';
                            }
                            return renderFolderContent(firstId);
                        })()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup folder click handlers
    setupFolderNavHandlers();
}

// Get folders visible to current user (default folders only for producers/managers+)
function getVisibleFolders() {
    const canViewDefaults = canViewDefaultFolders();
    return projectEditorFolders.filter(f => !f.isDefault || canViewDefaults);
}

// Render Folder Navigation
function renderFolderNavigation() {
    const visibleFolders = getVisibleFolders();
    return visibleFolders.map((folder, index) => `
        <div class="folder-nav-item ${index === 0 ? 'active' : ''} ${folder.staffOnly ? 'staff-only' : ''}" 
             data-folder-id="${folder.id}"
             oncontextmenu="showFolderContextMenu(event, '${folder.id}'); return false;">
            <div class="folder-nav-icon">
                ${getFolderIcon(folder.icon)}
            </div>
            <span class="folder-nav-name">${escapeHtml(folder.name)}</span>
            ${folder.staffOnly ? '<span class="staff-only-badge" title="Staff Only">Staff</span>' : ''}
            <span class="folder-nav-count">${folder.files?.length || 0}</span>
            ${(!folder.isDefault || canEditDefaultFolders()) ? `
                <button class="btn-folder-menu" onclick="event.stopPropagation(); showFolderMenu('${folder.id}')" title="Folder Options">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                </button>
            ` : ''}
        </div>
    `).join('');
}

// Get Folder Icon SVG
function getFolderIcon(iconName) {
    const icons = {
        'folder': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        'package': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        'box': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        'image': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
        'camera': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
        'file-text': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        'video': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
        'film': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>',
        'music': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
        'headphones': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
        'layers': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        'edit-3': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
        'aperture': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></svg>'
    };
    return icons[iconName] || icons['folder'];
}

// Setup Folder Navigation Handlers
function setupFolderNavHandlers() {
    document.querySelectorAll('.folder-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.folder-nav-item').forEach(i => i.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');
            // Render folder content
            const folderId = item.dataset.folderId;
            const contentArea = document.getElementById('project-editor-main-content');
            if (contentArea) {
                contentArea.innerHTML = renderFolderContent(folderId);
                setupFileHandlers();
            }
        });
    });
}

// Render Folder Content
function renderFolderContent(folderId) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder) return '<div class="empty-state">Folder not found</div>';
    
    // Default folders restricted to producers/managers - block access for other roles
    if (folder.isDefault && !canViewDefaultFolders()) {
        return '<div class="empty-state">You do not have permission to view this folder.</div>';
    }
    
    const files = folder.files || [];
    
    return `
        <div class="folder-content-header">
            <div class="folder-content-title">
                <div class="folder-icon-large">${getFolderIcon(folder.icon)}</div>
                <div>
                    <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
                        <h2>${escapeHtml(folder.name)}</h2>
                        ${folder.staffOnly ? '<span class="staff-only-badge-large" title="Staff Only Folder">Staff Only</span>' : ''}
                    </div>
                    <p class="folder-file-count">${files.length} file${files.length !== 1 ? 's' : ''}</p>
                </div>
            </div>
            <div class="folder-content-actions">
                <button class="btn-primary" onclick="openUploadFileModal('${folderId}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload Files
                </button>
            </div>
        </div>
        
        <!-- Visibility Controls for Folder -->
        <div class="folder-visibility-controls">
            <div class="visibility-control-group">
                ${!folder.staffOnly ? `
                <label class="visibility-toggle">
                    <input type="checkbox" id="folder-visible-${folderId}" ${folder.isVisible !== false ? 'checked' : ''} onchange="toggleFolderVisibility('${folderId}', event.target.checked)">
                    <span class="toggle-slider"></span>
                    <span class="toggle-label">Folder Visible to Clients</span>
                </label>
                ` : `
                <div class="staff-only-notice">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>This is a staff-only folder and will not be visible to clients</span>
                </div>
                `}
                <label class="visibility-toggle">
                    <input type="checkbox" id="folder-downloadable-${folderId}" ${folder.isDownloadable !== false ? 'checked' : ''} onchange="(function(e){fetch('http://127.0.0.1:7242/ingest/466a7b45-817d-47e1-b056-9ade69de8f1f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard.js:3370',message:'onchange event fired',data:{folderId:'${folderId}',checked:e.target.checked},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});toggleFolderDownloadable('${folderId}', e.target.checked);})(event)">
                    <span class="toggle-slider"></span>
                    <span class="toggle-label">Allow Downloads</span>
                </label>
            </div>
        </div>
        
        <!-- Files Grid -->
        <div class="folder-files-container">
            ${files.length === 0 ? `
                <div class="empty-folder-state">
                    <div class="empty-folder-icon">${getFolderIcon(folder.icon)}</div>
                    <h3>No files yet</h3>
                    <p>Upload files to this folder to get started</p>
                    <button class="btn-secondary" onclick="openUploadFileModal('${folderId}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Upload First File
                    </button>
                </div>
            ` : `
                <div class="files-grid">
                    ${files.map((file, index) => renderFileCard(file, folderId, index)).join('')}
                </div>
            `}
        </div>
    `;
}

// Render File Card
function renderFileCard(file, folderId, fileIndex) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    const isStaffOnly = folder?.staffOnly || false;
    
    const isImage = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
    const isVideo = file.type?.startsWith('video/') || /\.(mp4|webm|mov|avi)$/i.test(file.name);
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    
    let previewContent = '';
    if (isImage && file.dataUrl) {
        previewContent = `<img src="${file.dataUrl}" alt="${escapeHtml(file.name)}" class="file-preview-image">`;
    } else if (isVideo) {
        previewContent = `<div class="file-preview-icon video">${getFolderIcon('video')}</div>`;
    } else if (isPdf) {
        previewContent = `<div class="file-preview-icon pdf"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>`;
    } else {
        previewContent = `<div class="file-preview-icon">${getFolderIcon('file-text')}</div>`;
    }
    
    return `
        <div class="file-card" data-folder-id="${folderId}" data-file-index="${fileIndex}">
            <div class="file-card-preview">
                ${previewContent}
                <div class="file-card-overlay">
                    <button class="btn-file-action" onclick="previewFile('${folderId}', ${fileIndex})" title="Preview">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    <button class="btn-file-action" onclick="downloadFile('${folderId}', ${fileIndex})" title="Download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </button>
                    <button class="btn-file-action btn-move" onclick="openMoveFileModal('${folderId}', ${fileIndex})" title="Move to folder">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3M15 19l-3 3-3-3"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
                        </svg>
                    </button>
                    <button class="btn-file-action btn-delete" onclick="deleteFile('${folderId}', ${fileIndex})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="file-card-info">
                <h4 class="file-card-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</h4>
                <div class="file-card-meta">
                    <span class="file-size">${formatFileSize(file.size)}</span>
                    <span class="file-date">${file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
                ${!isStaffOnly ? `
                <div class="file-visibility-controls">
                    <label class="mini-toggle" title="Visible to clients">
                        <input type="checkbox" ${file.isVisible !== false ? 'checked' : ''} onchange="toggleFileVisibility('${folderId}', ${fileIndex}, this.checked)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                    </label>
                    <label class="mini-toggle" title="Downloadable">
                        <input type="checkbox" ${file.isDownloadable !== false ? 'checked' : ''} onchange="toggleFileDownloadable('${folderId}', ${fileIndex}, this.checked)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </label>
                </div>
                ` : `
                <div class="file-staff-only-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Staff Only</span>
                </div>
                `}
            </div>
        </div>
    `;
}

// Format File Size
function formatFileSize(bytes) {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// Setup File Handlers
function setupFileHandlers() {
    // File drag and drop handlers can be added here
}

// Open Upload File Modal
function openUploadFileModal(folderId) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder) return;
    
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.id = 'upload-file-modal';
    modal.innerHTML = `
        <div class="project-modal upload-modal">
            <div class="project-modal-header">
                <h2>Upload Files to ${escapeHtml(folder.name)}</h2>
                <button class="btn-close-modal" onclick="closeUploadModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <div class="upload-drop-zone" id="upload-drop-zone">
                    <div class="upload-drop-content">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <h3>Drag & drop files here</h3>
                        <p>or click to browse</p>
                        <input type="file" id="file-upload-input" multiple style="display: none;">
                        <button class="btn-secondary" onclick="document.getElementById('file-upload-input').click()">Browse Files</button>
                    </div>
                </div>
                
                <!-- File Preview List -->
                <div class="upload-file-list" id="upload-file-list" style="display: none;">
                    <h4>Selected Files</h4>
                    <div class="upload-files-container" id="upload-files-container"></div>
                    <!-- Upload Progress -->
                    <div class="upload-progress-container" id="upload-progress-container" style="display: none;">
                        <div class="upload-progress-header">
                            <span class="upload-progress-text" id="upload-progress-text">Uploading files...</span>
                            <span class="upload-progress-percent" id="upload-progress-percent">0%</span>
                        </div>
                        <div class="upload-progress-bar">
                            <div class="upload-progress-fill" id="upload-progress-fill"></div>
                        </div>
                        <div class="upload-progress-details" id="upload-progress-details"></div>
                    </div>
                </div>
                
                <!-- Visibility Options -->
                <div class="upload-visibility-options">
                    <div class="visibility-options-header">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <h4>Default Visibility Settings</h4>
                    </div>
                    <div class="visibility-options-list">
                        <div class="visibility-option-item">
                            <div class="visibility-option-info">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                <span class="visibility-option-label">Visible to Clients</span>
                            </div>
                            <label class="visibility-toggle">
                                <input type="checkbox" id="upload-visible" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="visibility-option-item">
                            <div class="visibility-option-info">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                <span class="visibility-option-label">Allow Downloads</span>
                            </div>
                            <label class="visibility-toggle">
                                <input type="checkbox" id="upload-downloadable" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="project-modal-footer">
                <button class="btn-secondary" onclick="closeUploadModal()">Cancel</button>
                <button class="btn-primary" id="upload-confirm-btn" onclick="confirmFileUpload('${folderId}')" disabled>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload Files
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup file input handler
    const fileInput = document.getElementById('file-upload-input');
    const dropZone = document.getElementById('upload-drop-zone');
    
    // Store selected files
    window.pendingUploadFiles = [];
    
    fileInput.addEventListener('change', (e) => {
        handleFileSelection(e.target.files);
    });
    
    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFileSelection(e.dataTransfer.files);
    });
    
    // Click to browse
    dropZone.addEventListener('click', (e) => {
        if (e.target !== fileInput && !e.target.closest('button')) {
            fileInput.click();
        }
    });
}

// Handle File Selection
function handleFileSelection(files) {
    const fileList = document.getElementById('upload-file-list');
    const filesContainer = document.getElementById('upload-files-container');
    const confirmBtn = document.getElementById('upload-confirm-btn');
    
    if (files.length === 0) return;
    
    // Add files to pending list
    window.pendingUploadFiles = window.pendingUploadFiles || [];
    for (let i = 0; i < files.length; i++) {
        window.pendingUploadFiles.push(files[i]);
    }
    
    // Show file list
    fileList.style.display = 'block';
    confirmBtn.disabled = false;
    
    // Render file previews
    filesContainer.innerHTML = window.pendingUploadFiles.map((file, index) => `
        <div class="upload-file-item">
            <div class="upload-file-icon">
                ${file.type.startsWith('image/') ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'}
            </div>
            <div class="upload-file-info">
                <span class="upload-file-name">${escapeHtml(file.name)}</span>
                <span class="upload-file-size">${formatFileSize(file.size)}</span>
            </div>
            <button class="btn-remove-file" onclick="removeUploadFile(${index})" title="Remove">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');
}

// Remove Upload File
function removeUploadFile(index) {
    window.pendingUploadFiles.splice(index, 1);
    
    const filesContainer = document.getElementById('upload-files-container');
    const fileList = document.getElementById('upload-file-list');
    const confirmBtn = document.getElementById('upload-confirm-btn');
    
    if (window.pendingUploadFiles.length === 0) {
        fileList.style.display = 'none';
        confirmBtn.disabled = true;
        filesContainer.innerHTML = '';
    } else {
        handleFileSelection([]);
    }
}

// Confirm File Upload
async function confirmFileUpload(folderId) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder || !window.pendingUploadFiles || window.pendingUploadFiles.length === 0) return;
    
    const isVisible = document.getElementById('upload-visible').checked;
    const isDownloadable = document.getElementById('upload-downloadable').checked;
    
    const confirmBtn = document.getElementById('upload-confirm-btn');
    const progressContainer = document.getElementById('upload-progress-container');
    const progressFill = document.getElementById('upload-progress-fill');
    const progressText = document.getElementById('upload-progress-text');
    const progressPercent = document.getElementById('upload-progress-percent');
    const progressDetails = document.getElementById('upload-progress-details');
    
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span class="spinner"></span> Uploading...';
    progressContainer.style.display = 'block';
    
    const totalFiles = window.pendingUploadFiles.length;
    let processedFiles = 0;
    
    // Process each file
    for (let i = 0; i < window.pendingUploadFiles.length; i++) {
        const file = window.pendingUploadFiles[i];
        try {
            // Check if file should be zipped (MP4 or CSP)
            const isVideo = file.type?.startsWith('video/') || /\.(mp4|webm|mov|avi)$/i.test(file.name);
            const isCSP = /\.csp$/i.test(file.name);
            
            let processedFile = file;
            let fileName = file.name;
            let fileSize = file.size;
            let fileType = file.type;
            
            if (isVideo || isCSP) {
                // Show progress for zipping
                progressText.textContent = `Compressing ${file.name}...`;
                progressDetails.textContent = `File ${i + 1} of ${totalFiles}: ${file.name}`;
                
                // Zip the file
                const zip = new JSZip();
                const fileData = await readFileAsArrayBuffer(file);
                zip.file(file.name, fileData);
                
                const zipBlob = await zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 6 }
                }, (metadata) => {
                    // Update zip progress
                    if (metadata.percent) {
                        progressFill.style.width = `${((processedFiles / totalFiles) * 100) + ((metadata.percent / totalFiles))}%`;
                    }
                });
                
                fileName = file.name.replace(/\.(mp4|csp)$/i, '.zip');
                fileSize = zipBlob.size;
                fileType = 'application/zip';
                processedFile = zipBlob;
            }
            
            // Update progress
            progressText.textContent = `Processing ${file.name}...`;
            progressDetails.textContent = `File ${i + 1} of ${totalFiles}: ${fileName}`;
            
            // Convert to data URL
            const dataUrl = await readFileAsDataUrl(processedFile);
            
            folder.files.push({
                name: fileName,
                type: fileType,
                size: fileSize,
                dataUrl: dataUrl,
                uploadedAt: new Date().toISOString(),
                isVisible: isVisible,
                isDownloadable: isDownloadable,
                originalName: isVideo || isCSP ? file.name : undefined,
                isZipped: isVideo || isCSP
            });
            
            processedFiles++;
            const progress = (processedFiles / totalFiles) * 100;
            progressFill.style.width = `${progress}%`;
            progressPercent.textContent = `${Math.round(progress)}%`;
            
        } catch (error) {
            console.error('Error processing file:', file.name, error);
            progressDetails.textContent = `Error processing ${file.name}: ${error.message}`;
        }
    }
    
    progressText.textContent = 'Saving files...';
    progressDetails.textContent = `Uploaded ${processedFiles} of ${totalFiles} files`;
    
    // Save to localStorage
    saveProjectFolders();
    
    // Close modal and refresh
    setTimeout(() => {
        closeUploadModal();
        
        // Refresh folder content
        const contentArea = document.getElementById('project-editor-main-content');
        if (contentArea) {
            contentArea.innerHTML = renderFolderContent(folderId);
            setupFileHandlers();
        }
        
        // Update folder count in navigation
        const folderNavList = document.getElementById('folder-nav-list');
        if (folderNavList) {
            folderNavList.innerHTML = renderFolderNavigation();
            setupFolderNavHandlers();
            // Re-select the current folder
            const currentFolderNav = document.querySelector(`.folder-nav-item[data-folder-id="${folderId}"]`);
            if (currentFolderNav) {
                document.querySelectorAll('.folder-nav-item').forEach(i => i.classList.remove('active'));
                currentFolderNav.classList.add('active');
            }
        }
        
        showNotification(`${processedFiles} file(s) uploaded successfully!`, 'success');
        window.pendingUploadFiles = [];
    }, 500);
}

// Read File as Array Buffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Read File as Data URL
function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        if (file instanceof Blob) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsDataURL(file);
        }
    });
}

// Open Move File Modal
function openMoveFileModal(sourceFolderId, fileIndex) {
    const sourceFolder = projectEditorFolders.find(f => f.id === sourceFolderId);
    if (!sourceFolder || !sourceFolder.files[fileIndex]) return;
    
    const file = sourceFolder.files[fileIndex];
    const availableFolders = projectEditorFolders.filter(f => f.id !== sourceFolderId);
    
    if (availableFolders.length === 0) {
        showNotification('No other folders available to move file to.', 'info');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.id = 'move-file-modal';
    modal.innerHTML = `
        <div class="project-modal">
            <div class="project-modal-header">
                <h2>Move File to Another Folder</h2>
                <button class="btn-close-modal" onclick="closeMoveFileModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <div class="form-group">
                    <label class="form-label">File: ${escapeHtml(file.name)}</label>
                </div>
                <div class="form-group">
                    <label for="move-target-folder" class="form-label">Move to Folder *</label>
                    <select id="move-target-folder" class="form-input" required>
                        <option value="">Select a folder</option>
                        ${availableFolders.map(f => `
                            <option value="${f.id}">${escapeHtml(f.name)}${f.staffOnly ? ' (Staff Only)' : ''}</option>
                        `).join('')}
                    </select>
                </div>
                <div id="move-file-message"></div>
                <div class="project-modal-footer">
                    <button class="btn-secondary" onclick="closeMoveFileModal()">Cancel</button>
                    <button class="btn-primary" onclick="confirmMoveFile('${sourceFolderId}', ${fileIndex})">Move File</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMoveFileModal();
    });
}

// Confirm Move File
function confirmMoveFile(sourceFolderId, fileIndex) {
    const targetFolderId = document.getElementById('move-target-folder').value;
    const messageDiv = document.getElementById('move-file-message');
    
    if (!targetFolderId) {
        messageDiv.innerHTML = '<div class="form-message error">Please select a target folder</div>';
        return;
    }
    
    const sourceFolder = projectEditorFolders.find(f => f.id === sourceFolderId);
    const targetFolder = projectEditorFolders.find(f => f.id === targetFolderId);
    
    if (!sourceFolder || !targetFolder || !sourceFolder.files[fileIndex]) {
        messageDiv.innerHTML = '<div class="form-message error">Error: Folder or file not found</div>';
        return;
    }
    
    // Move file
    const file = sourceFolder.files[fileIndex];
    sourceFolder.files.splice(fileIndex, 1);
    targetFolder.files.push(file);
    
    // Save to localStorage
    saveProjectFolders();
    
    // Close modal
    closeMoveFileModal();
    
    // Refresh folder content if currently viewing source folder
    const contentArea = document.getElementById('project-editor-main-content');
    if (contentArea) {
        const currentFolderNav = document.querySelector('.folder-nav-item.active');
        if (currentFolderNav) {
            const currentFolderId = currentFolderNav.dataset.folderId;
            contentArea.innerHTML = renderFolderContent(currentFolderId);
            setupFileHandlers();
        }
    }
    
    // Update folder counts in navigation
    const folderNavList = document.getElementById('folder-nav-list');
    if (folderNavList) {
        folderNavList.innerHTML = renderFolderNavigation();
        setupFolderNavHandlers();
    }
    
    showNotification(`File moved to ${targetFolder.name} successfully!`, 'success');
}

// Close Move File Modal
function closeMoveFileModal() {
    const modal = document.getElementById('move-file-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Close Upload Modal
function closeUploadModal() {
    const modal = document.getElementById('upload-file-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
    window.pendingUploadFiles = [];
}

// Save Project Folders to Storage
function saveProjectFolders() {
    if (currentEditingProject) {
        localStorage.setItem(`vilostudios_project_${currentEditingProject.id}_folders`, JSON.stringify(projectEditorFolders));
    }
}

// Toggle Folder Visibility
function toggleFolderVisibility(folderId, isVisible) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/466a7b45-817d-47e1-b056-9ade69de8f1f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard.js:3723',message:'toggleFolderVisibility called',data:{folderId,isVisible,projectEditorFoldersLength:projectEditorFolders?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const folder = projectEditorFolders.find(f => f.id === folderId);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/466a7b45-817d-47e1-b056-9ade69de8f1f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard.js:3726',message:'folder lookup result',data:{folderFound:!!folder,folderId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (folder) {
        folder.isVisible = isVisible;
        saveProjectFolders();
        showNotification(`Folder visibility ${isVisible ? 'enabled' : 'disabled'}`, 'info');
    }
}

// Toggle Folder Downloadable
function toggleFolderDownloadable(folderId, isDownloadable) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/466a7b45-817d-47e1-b056-9ade69de8f1f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard.js:3733',message:'toggleFolderDownloadable called',data:{folderId,isDownloadable,projectEditorFoldersLength:projectEditorFolders?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const folder = projectEditorFolders.find(f => f.id === folderId);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/466a7b45-817d-47e1-b056-9ade69de8f1f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard.js:3736',message:'folder lookup result',data:{folderFound:!!folder,folderId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (folder) {
        folder.isDownloadable = isDownloadable;
        saveProjectFolders();
        showNotification(`Downloads ${isDownloadable ? 'enabled' : 'disabled'} for folder`, 'info');
    }
}

// Toggle File Visibility
function toggleFileVisibility(folderId, fileIndex, isVisible) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (folder && folder.files[fileIndex]) {
        folder.files[fileIndex].isVisible = isVisible;
        saveProjectFolders();
    }
}

// Toggle File Downloadable
function toggleFileDownloadable(folderId, fileIndex, isDownloadable) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (folder && folder.files[fileIndex]) {
        folder.files[fileIndex].isDownloadable = isDownloadable;
        saveProjectFolders();
    }
}

// Delete File
function deleteFile(folderId, fileIndex) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder || !folder.files[fileIndex]) return;
    
    const fileName = folder.files[fileIndex].name;
    
    showConfirmDialog(
        'Delete File',
        `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
        'Delete',
        'Cancel',
        () => {
            folder.files.splice(fileIndex, 1);
            saveProjectFolders();
            
            // Refresh content
            const contentArea = document.getElementById('project-editor-main-content');
            if (contentArea) {
                contentArea.innerHTML = renderFolderContent(folderId);
                setupFileHandlers();
            }
            
            // Update navigation count
            const folderNavList = document.getElementById('folder-nav-list');
            if (folderNavList) {
                folderNavList.innerHTML = renderFolderNavigation();
                setupFolderNavHandlers();
                const currentFolderNav = document.querySelector(`.folder-nav-item[data-folder-id="${folderId}"]`);
                if (currentFolderNav) {
                    document.querySelectorAll('.folder-nav-item').forEach(i => i.classList.remove('active'));
                    currentFolderNav.classList.add('active');
                }
            }
            
            showNotification('File deleted successfully', 'success');
        }
    );
}

// Download File
function downloadFile(folderId, fileIndex) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder || !folder.files[fileIndex]) return;
    
    const file = folder.files[fileIndex];
    
    // Create download link
    const link = document.createElement('a');
    link.href = file.dataUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Preview File
function previewFile(folderId, fileIndex) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder || !folder.files[fileIndex]) return;
    
    const file = folder.files[fileIndex];
    const isImage = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
    const isVideo = file.type?.startsWith('video/') || /\.(mp4|webm|mov|avi)$/i.test(file.name);
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    const isText = file.type === 'text/plain' || /\.(txt|md|log)$/i.test(file.name);
    
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay file-preview-modal';
    modal.id = 'file-preview-modal';
    
    let previewContent = '';
    if (isImage) {
        previewContent = `<img src="${file.dataUrl}" alt="${escapeHtml(file.name)}" class="preview-full-image">`;
    } else if (isVideo) {
        previewContent = `<video src="${file.dataUrl}" controls class="preview-full-video"></video>`;
    } else if (isPdf) {
        previewContent = `<iframe src="${file.dataUrl}" class="preview-full-pdf"></iframe>`;
    } else if (isText && file.dataUrl) {
        try {
            const base64 = file.dataUrl.split(',')[1];
            const textContent = base64 ? decodeURIComponent(escape(atob(base64))) : '';
            previewContent = `<pre class="preview-text-content">${escapeHtml(textContent)}</pre>`;
        } catch (e) {
            previewContent = `
            <div class="preview-unsupported">
                <p>Could not display text content. <a href="#" onclick="downloadFile('${folderId}', ${fileIndex}); closeFilePreview(); return false;">Download</a> to view.</p>
            </div>`;
        }
    } else {
        previewContent = `
            <div class="preview-unsupported">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h3>Preview not available</h3>
                <p>This file type cannot be previewed. Click download to view the file.</p>
                <button class="btn-primary" onclick="downloadFile('${folderId}', ${fileIndex}); closeFilePreview();">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download File
                </button>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="file-preview-container">
            <div class="file-preview-header">
                <h3>${escapeHtml(file.name)}</h3>
                <div class="file-preview-actions">
                    <button class="btn-icon" onclick="downloadFile('${folderId}', ${fileIndex})" title="Download">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="closeFilePreview()" title="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="file-preview-content">
                ${previewContent}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFilePreview();
        }
    });
    
    // Close on escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeFilePreview();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Close File Preview
function closeFilePreview() {
    const modal = document.getElementById('file-preview-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Open Create Folder Modal
function openCreateFolderModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.id = 'create-folder-modal';
    modal.innerHTML = `
        <div class="project-modal wide-modal">
            <div class="project-modal-header">
                <h2>Create New Folder</h2>
                <button class="btn-close-modal" onclick="closeCreateFolderModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <div class="form-group">
                    <label for="new-folder-name">Folder Name *</label>
                    <input type="text" id="new-folder-name" class="form-input" placeholder="Enter folder name" required>
                </div>
                
                <div class="form-group">
                    <label>Folder Type & Icon</label>
                    <div class="folder-type-grid" id="folder-type-selector">
                        <button type="button" class="folder-type-option" data-icon="package" data-type="deliverables">
                            ${getFolderIcon('package')}
                            <span class="folder-type-label">Deliverables</span>
                            <span class="folder-type-desc">Final deliverables</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="folder" data-type="general">
                            ${getFolderIcon('folder')}
                            <span class="folder-type-label">General</span>
                            <span class="folder-type-desc">General files</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="film" data-type="animation">
                            ${getFolderIcon('film')}
                            <span class="folder-type-label">Animation</span>
                            <span class="folder-type-desc">Animation files</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="music" data-type="sound">
                            ${getFolderIcon('music')}
                            <span class="folder-type-label">Sound</span>
                            <span class="folder-type-desc">Sound effects</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="headphones" data-type="music">
                            ${getFolderIcon('headphones')}
                            <span class="folder-type-label">Music</span>
                            <span class="folder-type-desc">Music tracks</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="layers" data-type="compositing">
                            ${getFolderIcon('layers')}
                            <span class="folder-type-label">Compositing</span>
                            <span class="folder-type-desc">Composite files</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="edit-3" data-type="storyboard">
                            ${getFolderIcon('edit-3')}
                            <span class="folder-type-label">Storyboards</span>
                            <span class="folder-type-desc">Storyboard art</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="image" data-type="reference">
                            ${getFolderIcon('image')}
                            <span class="folder-type-label">References</span>
                            <span class="folder-type-desc">Reference images</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="video" data-type="renders">
                            ${getFolderIcon('video')}
                            <span class="folder-type-label">Renders</span>
                            <span class="folder-type-desc">Rendered videos</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="file-text" data-type="scripts">
                            ${getFolderIcon('file-text')}
                            <span class="folder-type-label">Scripts</span>
                            <span class="folder-type-desc">Script files</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="box" data-type="assets">
                            ${getFolderIcon('box')}
                            <span class="folder-type-label">Assets</span>
                            <span class="folder-type-desc">Project assets</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="camera" data-type="footage">
                            ${getFolderIcon('camera')}
                            <span class="folder-type-label">Footage</span>
                            <span class="folder-type-desc">Raw footage</span>
                        </button>
                        <button type="button" class="folder-type-option" data-icon="aperture" data-type="fx">
                            ${getFolderIcon('aperture')}
                            <span class="folder-type-label">VFX</span>
                            <span class="folder-type-desc">Visual effects</span>
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Visibility Settings *</label>
                    <div class="visibility-options">
                        <label class="visibility-option">
                            <input type="radio" name="folder-visibility" value="public" class="form-radio">
                            <div class="visibility-option-content">
                                <div class="visibility-option-header">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                    </svg>
                                    <strong>Public Showcase</strong>
                                </div>
                                <small>Visible to everyone and can be showcased in portfolio</small>
                            </div>
                        </label>
                        <label class="visibility-option">
                            <input type="radio" name="folder-visibility" value="client" class="form-radio" checked>
                            <div class="visibility-option-content">
                                <div class="visibility-option-header">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="8.5" cy="7" r="4"/>
                                        <line x1="20" y1="8" x2="20" y2="14"/>
                                        <line x1="23" y1="11" x2="17" y2="11"/>
                                    </svg>
                                    <strong>Client Access</strong>
                                </div>
                                <small>Visible to staff and client only (no portfolio)</small>
                            </div>
                        </label>
                        <label class="visibility-option">
                            <input type="radio" name="folder-visibility" value="staff" class="form-radio">
                            <div class="visibility-option-content">
                                <div class="visibility-option-header">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    <strong>Staff Only</strong>
                                </div>
                                <small>Hidden from clients - internal use only</small>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Download Permissions</label>
                    <div class="download-permissions">
                        <label class="checkbox-label">
                            <input type="checkbox" id="new-folder-client-downloadable" class="form-checkbox" checked>
                            <span>Client Downloads</span>
                        </label>
                        <small class="form-hint">Allow clients to download files from this folder</small>
                    </div>
                    <div class="download-permissions">
                        <label class="checkbox-label">
                            <input type="checkbox" id="new-folder-staff-downloadable" class="form-checkbox" checked>
                            <span>Staff Downloads</span>
                        </label>
                        <small class="form-hint">Allow staff members on this project to download files</small>
                    </div>
                </div>
            </div>
            <div class="project-modal-footer">
                <button class="btn-secondary" onclick="closeCreateFolderModal()">Cancel</button>
                <button class="btn-primary" onclick="createNewFolder()">Create Folder</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup folder type selector
    document.querySelectorAll('.folder-type-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.folder-type-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Auto-fill folder name if empty
            const nameInput = document.getElementById('new-folder-name');
            if (!nameInput.value.trim()) {
                const typeLabel = btn.querySelector('.folder-type-label').textContent;
                nameInput.value = typeLabel;
            }
        });
    });
    
    // Focus input
    document.getElementById('new-folder-name').focus();
}

// Close Create Folder Modal
function closeCreateFolderModal() {
    const modal = document.getElementById('create-folder-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Create New Folder
function createNewFolder() {
    const nameInput = document.getElementById('new-folder-name');
    const selectedIcon = document.querySelector('.folder-type-option.active');
    const visibilityRadio = document.querySelector('input[name="folder-visibility"]:checked');
    const clientDownloadableCheckbox = document.getElementById('new-folder-client-downloadable');
    const staffDownloadableCheckbox = document.getElementById('new-folder-staff-downloadable');
    
    const name = nameInput.value.trim();
    if (!name) {
        showNotification('Please enter a folder name', 'error');
        return;
    }
    
    const icon = selectedIcon?.dataset.icon || 'folder';
    const folderType = selectedIcon?.dataset.type || 'general';
    const visibility = visibilityRadio?.value || 'client';
    const folderId = 'custom_' + Date.now();
    
    const newFolder = {
        id: folderId,
        name: name,
        icon: icon,
        type: folderType,
        files: [],
        isDefault: false,
        isVisible: true,
        isDownloadable: clientDownloadableCheckbox ? clientDownloadableCheckbox.checked : true,
        isStaffDownloadable: staffDownloadableCheckbox ? staffDownloadableCheckbox.checked : true,
        visibility: visibility, // 'public', 'client', or 'staff'
        staffOnly: visibility === 'staff', // For backwards compatibility
        publicShowcase: visibility === 'public'
    };
    
    projectEditorFolders.push(newFolder);
    
    saveProjectFolders();
    closeCreateFolderModal();
    
    // Refresh navigation
    const folderNavList = document.getElementById('folder-nav-list');
    if (folderNavList) {
        folderNavList.innerHTML = renderFolderNavigation();
        setupFolderNavHandlers();
    }
    
    // Show success message with visibility info
    let visibilityMessage = '';
    if (visibility === 'public') {
        visibilityMessage = ' (Public Showcase)';
    } else if (visibility === 'staff') {
        visibilityMessage = ' (Staff Only)';
    } else {
        visibilityMessage = ' (Client Access)';
    }
    
    showNotification(`Folder "${name}" created successfully${visibilityMessage}!`, 'success');
}

// Show Folder Context Menu (Right-Click)
function showFolderContextMenu(event, folderId) {
    event.preventDefault();
    event.stopPropagation();
    
    // Remove any existing menu
    const existingMenu = document.querySelector('.folder-context-menu');
    if (existingMenu) existingMenu.remove();
    
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder) return;
    
    const menu = document.createElement('div');
    menu.className = 'folder-context-menu';
    const canEdit = !folder.isDefault || canEditDefaultFolders();
    menu.innerHTML = `
        ${canEdit ? `
            <button onclick="editFolderPrompt('${folderId}'); closeFolderContextMenu();">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Folder
            </button>
            <button onclick="renameFolderPrompt('${folderId}'); closeFolderContextMenu();">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
                Rename
            </button>
            <div class="context-menu-divider"></div>
            <button onclick="moveFolderPrompt('${folderId}'); closeFolderContextMenu();">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8L22 12L18 16"/>
                    <path d="M2 12H22"/>
                </svg>
                Move Folder
            </button>
            ${!folder.isDefault ? `
            <div class="context-menu-divider"></div>
            <button onclick="deleteFolderPrompt('${folderId}'); closeFolderContextMenu();" class="danger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete Folder
            </button>
            ` : ''}
        ` : `
            <button onclick="closeFolderContextMenu();" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Default Folder (Protected)
            </button>
        `}
    `;
    
    // Position at mouse cursor
    menu.style.position = 'fixed';
    menu.style.top = event.clientY + 'px';
    menu.style.left = event.clientX + 'px';
    
    document.body.appendChild(menu);
    
    // Adjust position if menu goes off screen
    setTimeout(() => {
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = (event.clientX - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = (event.clientY - rect.height) + 'px';
        }
    }, 0);
    
    // Close on click outside
    setTimeout(() => {
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        document.addEventListener('click', closeMenu);
    }, 0);
}

// Close Folder Context Menu
function closeFolderContextMenu() {
    const menu = document.querySelector('.folder-context-menu');
    if (menu) menu.remove();
}

// Show Folder Menu
function showFolderMenu(folderId) {
    // Remove any existing menu
    const existingMenu = document.querySelector('.folder-context-menu');
    if (existingMenu) existingMenu.remove();
    
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder || (folder.isDefault && !canEditDefaultFolders())) return;
    
    const menu = document.createElement('div');
    menu.className = 'folder-context-menu';
    menu.innerHTML = `
        <button onclick="editFolderPrompt('${folderId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Folder
        </button>
        <button onclick="renameFolderPrompt('${folderId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
            Rename
        </button>
        <div class="context-menu-divider"></div>
        <button onclick="moveFolderPrompt('${folderId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8L22 12L18 16"/>
                <path d="M2 12H22"/>
            </svg>
            Move Folder
        </button>
        ${!folder.isDefault ? `
        <div class="context-menu-divider"></div>
        <button onclick="deleteFolderPrompt('${folderId}')" class="danger">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete Folder
        </button>
        ` : ''}
    `;
    
    // Position near the clicked button
    const navItem = document.querySelector(`.folder-nav-item[data-folder-id="${folderId}"]`);
    if (navItem) {
        const rect = navItem.getBoundingClientRect();
        menu.style.top = rect.bottom + 'px';
        menu.style.left = rect.left + 'px';
    }
    
    document.body.appendChild(menu);
    
    // Close on click outside
    setTimeout(() => {
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        document.addEventListener('click', closeMenu);
    }, 0);
}

// Edit Folder Prompt (Full Settings)
function editFolderPrompt(folderId) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder || (folder.isDefault && !canEditDefaultFolders())) return;
    
    const modal = document.createElement('div');
    modal.id = 'edit-folder-modal';
    modal.className = 'project-modal-overlay';
    modal.innerHTML = `
        <div class="project-modal wide-modal">
            <div class="project-modal-header">
                <h2>Edit Folder Settings</h2>
                <button class="btn-close-modal" onclick="closeEditFolderModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <div class="form-group">
                    <label for="edit-folder-name">Folder Name *</label>
                    <input type="text" id="edit-folder-name" class="form-input" value="${escapeHtml(folder.name)}" required>
                </div>
                
                <div class="form-group">
                    <label>Visibility Settings *</label>
                    <div class="visibility-options">
                        <label class="visibility-option">
                            <input type="radio" name="edit-folder-visibility" value="public" class="form-radio" ${folder.visibility === 'public' ? 'checked' : ''}>
                            <div class="visibility-option-content">
                                <div class="visibility-option-header">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                    </svg>
                                    <strong>Public Showcase</strong>
                                </div>
                                <small>Visible to everyone and can be showcased in portfolio</small>
                            </div>
                        </label>
                        <label class="visibility-option">
                            <input type="radio" name="edit-folder-visibility" value="client" class="form-radio" ${(folder.visibility || 'client') === 'client' ? 'checked' : ''}>
                            <div class="visibility-option-content">
                                <div class="visibility-option-header">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="8.5" cy="7" r="4"/>
                                        <line x1="20" y1="8" x2="20" y2="14"/>
                                        <line x1="23" y1="11" x2="17" y2="11"/>
                                    </svg>
                                    <strong>Client Access</strong>
                                </div>
                                <small>Visible to staff and client only (no portfolio)</small>
                            </div>
                        </label>
                        <label class="visibility-option">
                            <input type="radio" name="edit-folder-visibility" value="staff" class="form-radio" ${folder.visibility === 'staff' ? 'checked' : ''}>
                            <div class="visibility-option-content">
                                <div class="visibility-option-header">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    <strong>Staff Only</strong>
                                </div>
                                <small>Hidden from clients - internal use only</small>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Download Permissions</label>
                    <div class="download-permissions">
                        <label class="checkbox-label">
                            <input type="checkbox" id="edit-folder-client-downloadable" class="form-checkbox" ${folder.isDownloadable !== false ? 'checked' : ''}>
                            <span>Client Downloads</span>
                        </label>
                        <small class="form-hint">Allow clients to download files from this folder</small>
                    </div>
                    <div class="download-permissions">
                        <label class="checkbox-label">
                            <input type="checkbox" id="edit-folder-staff-downloadable" class="form-checkbox" ${folder.isStaffDownloadable !== false ? 'checked' : ''}>
                            <span>Staff Downloads</span>
                        </label>
                        <small class="form-hint">Allow staff members on this project to download files</small>
                    </div>
                </div>
            </div>
            <div class="project-modal-footer">
                <button class="btn-secondary" onclick="closeEditFolderModal()">Cancel</button>
                <button class="btn-primary" onclick="saveEditedFolder('${folderId}')">Save Changes</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('edit-folder-name').focus();
}

// Close Edit Folder Modal
function closeEditFolderModal() {
    const modal = document.getElementById('edit-folder-modal');
    if (modal) document.body.removeChild(modal);
}

// Save Edited Folder
function saveEditedFolder(folderId) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder) return;
    
    const nameInput = document.getElementById('edit-folder-name');
    const visibilityRadio = document.querySelector('input[name="edit-folder-visibility"]:checked');
    const clientDownloadableCheckbox = document.getElementById('edit-folder-client-downloadable');
    const staffDownloadableCheckbox = document.getElementById('edit-folder-staff-downloadable');
    
    const name = nameInput.value.trim();
    if (!name) {
        showNotification('Please enter a folder name', 'error');
        return;
    }
    
    const visibility = visibilityRadio?.value || 'client';
    
    folder.name = name;
    folder.visibility = visibility;
    folder.staffOnly = visibility === 'staff';
    folder.publicShowcase = visibility === 'public';
    folder.isDownloadable = clientDownloadableCheckbox ? clientDownloadableCheckbox.checked : true;
    folder.isStaffDownloadable = staffDownloadableCheckbox ? staffDownloadableCheckbox.checked : true;
    
    saveProjectFolders();
    closeEditFolderModal();
    
    // Refresh navigation
    const folderNavList = document.getElementById('folder-nav-list');
    if (folderNavList) {
        folderNavList.innerHTML = renderFolderNavigation();
        setupFolderNavHandlers();
    }
    
    showNotification('Folder settings updated successfully!', 'success');
}

// Move Folder Prompt
function moveFolderPrompt(folderId) {
    const folderIndex = projectEditorFolders.findIndex(f => f.id === folderId);
    if (folderIndex === -1) return;
    
    const folder = projectEditorFolders[folderIndex];
    if (folder.isDefault && !canEditDefaultFolders()) return;
    
    const modal = document.createElement('div');
    modal.id = 'move-folder-modal';
    modal.className = 'project-modal-overlay';
    modal.innerHTML = `
        <div class="project-modal small-modal">
            <div class="project-modal-header">
                <h2>Move Folder</h2>
                <button class="btn-close-modal" onclick="closeMoveFolderModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                    Move "${escapeHtml(folder.name)}" to a new position
                </p>
                <div class="form-group">
                    <label>Move To Position</label>
                    <select id="move-folder-position" class="form-input">
                        <option value="first">First (Top)</option>
                        ${projectEditorFolders.map((f, idx) => {
                            if (idx !== folderIndex) {
                                return `<option value="${idx}" ${idx === folderIndex - 1 ? 'selected' : ''}>After "${escapeHtml(f.name)}"</option>`;
                            }
                            return '';
                        }).join('')}
                        <option value="last">Last (Bottom)</option>
                    </select>
                </div>
            </div>
            <div class="project-modal-footer">
                <button class="btn-secondary" onclick="closeMoveFolderModal()">Cancel</button>
                <button class="btn-primary" onclick="executeMoveFolder('${folderId}', ${folderIndex})">Move Folder</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close Move Folder Modal
function closeMoveFolderModal() {
    const modal = document.getElementById('move-folder-modal');
    if (modal) document.body.removeChild(modal);
}

// Execute Move Folder
function executeMoveFolder(folderId, currentIndex) {
    const positionSelect = document.getElementById('move-folder-position');
    const newPosition = positionSelect.value;
    
    // Remove folder from current position
    const [folder] = projectEditorFolders.splice(currentIndex, 1);
    
    // Insert at new position
    if (newPosition === 'first') {
        projectEditorFolders.unshift(folder);
    } else if (newPosition === 'last') {
        projectEditorFolders.push(folder);
    } else {
        const targetIndex = parseInt(newPosition);
        // Adjust index if moving down
        const insertIndex = targetIndex >= currentIndex ? targetIndex : targetIndex + 1;
        projectEditorFolders.splice(insertIndex, 0, folder);
    }
    
    saveProjectFolders();
    closeMoveFolderModal();
    
    // Refresh navigation
    const folderNavList = document.getElementById('folder-nav-list');
    if (folderNavList) {
        folderNavList.innerHTML = renderFolderNavigation();
        setupFolderNavHandlers();
    }
    
    showNotification('Folder moved successfully!', 'success');
}

// Rename Folder Prompt
function renameFolderPrompt(folderId) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder) return;
    
    const newName = prompt('Enter new folder name:', folder.name);
    if (newName && newName.trim()) {
        folder.name = newName.trim();
        saveProjectFolders();
        
        // Refresh navigation
        const folderNavList = document.getElementById('folder-nav-list');
        if (folderNavList) {
            folderNavList.innerHTML = renderFolderNavigation();
            setupFolderNavHandlers();
        }
        
        showNotification('Folder renamed successfully!', 'success');
    }
    
    // Close context menu
    const menu = document.querySelector('.folder-context-menu');
    if (menu) menu.remove();
}

// Delete Folder Prompt (default folders cannot be deleted)
function deleteFolderPrompt(folderId) {
    const folder = projectEditorFolders.find(f => f.id === folderId);
    if (!folder) return;
    if (folder.isDefault) {
        showNotification('Default folders cannot be deleted', 'error');
        return;
    }
    
    // Close context menu first
    const menu = document.querySelector('.folder-context-menu');
    if (menu) menu.remove();
    
    showConfirmDialog(
        'Delete Folder',
        `Are you sure you want to delete "${folder.name}"? All files in this folder will be permanently deleted.`,
        'Delete',
        'Cancel',
        () => {
            const index = projectEditorFolders.findIndex(f => f.id === folderId);
            if (index > -1) {
                projectEditorFolders.splice(index, 1);
                saveProjectFolders();
                
                // Refresh navigation and content
                const folderNavList = document.getElementById('folder-nav-list');
                if (folderNavList) {
                    folderNavList.innerHTML = renderFolderNavigation();
                    setupFolderNavHandlers();
                    
                    // Select first folder
                    const firstFolder = document.querySelector('.folder-nav-item');
                    if (firstFolder) {
                        firstFolder.click();
                    }
                }
                
                showNotification('Folder deleted successfully!', 'success');
            }
        }
    );
}

// Show Project Details Editor
function showProjectDetailsEditor() {
    const project = currentEditingProject;
    if (!project) return;
    
    const contentArea = document.getElementById('project-editor-main-content');
    if (!contentArea) return;
    
    // Deselect all folders
    document.querySelectorAll('.folder-nav-item').forEach(i => i.classList.remove('active'));
    
    contentArea.innerHTML = `
        <div class="project-details-editor">
            <div class="folder-content-header">
                <div class="folder-content-title">
                    <div class="folder-icon-large">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                    </div>
                    <div>
                        <h2>Project Details</h2>
                        <p class="folder-file-count">Edit project information</p>
                    </div>
                </div>
            </div>
            
            <form id="project-details-form" class="project-details-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="detail-project-name">Project Name *</label>
                        <input type="text" id="detail-project-name" class="form-input" value="${escapeHtml(project.project_name || '')}" required>
                    </div>
                    <div class="form-group">
                        <label for="detail-client-select">Client</label>
                        <select id="detail-client-select" class="form-input form-select">
                            <option value="" data-name="">— Select client (email = login) —</option>
                            ${(JSON.parse(localStorage.getItem('vilostudios_crm_clients') || '[]')).map(c => {
                                const email = (c.email || '').trim();
                                const name = (c.name || c.company || 'Unknown').trim();
                                const label = email ? `${escapeHtml(name)} — ${escapeHtml(email)}` : escapeHtml(name);
                                const sel = (project.client_email === email) ? ' selected' : '';
                                return `<option value="${escapeHtml(email)}" data-name="${escapeHtml(name)}"${sel}>${label}</option>`;
                            }).join('')}
                        </select>
                        <small class="form-hint">Client's email is used for login—they see only projects tied to it</small>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Cover Image</label>
                    <div class="cover-image-editor">
                        <div class="cover-preview-large" id="detail-cover-preview">
                            ${project.cover_image_path ? `<img src="${project.cover_image_path.startsWith('data:') ? project.cover_image_path : '../../' + project.cover_image_path}" alt="Cover">` : '<div class="no-cover">No cover image</div>'}
                        </div>
                        <div class="cover-actions">
                            <input type="file" id="detail-cover-input" accept="image/*" style="display: none;">
                            <button type="button" class="btn-secondary" onclick="document.getElementById('detail-cover-input').click()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                Upload New Cover
                            </button>
                            <button type="button" class="btn-secondary" onclick="removeCoverImage()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                                Remove Cover
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="detail-creation-date">Creation Date</label>
                        <input type="date" id="detail-creation-date" class="form-input" value="${project.creation_date || ''}">
                    </div>
                    <div class="form-group">
                        <label for="detail-finished-date">Finished Date</label>
                        <input type="date" id="detail-finished-date" class="form-input" value="${project.finished_date || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="detail-description">Project Description</label>
                    <textarea id="detail-description" class="form-input" rows="4" placeholder="Enter project description...">${escapeHtml(project.description || '')}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="detail-tags-input">Tags</label>
                    <div class="tags-input-wrapper">
                        <div class="tags-list" id="detail-tags-list">
                            ${(project.tags || []).map(tag => `
                                <span class="tag-chip" data-tag="${escapeHtml(tag)}">
                                    ${escapeHtml(tag)}
                                    <button type="button" class="tag-remove" onclick="removeProjectTag('${escapeHtml(tag).replace(/'/g, "\\'")}')" aria-label="Remove tag">&times;</button>
                                </span>
                            `).join('')}
                        </div>
                        <input type="text" id="detail-tags-input" class="form-input tags-input" placeholder="Type a tag and press Enter..." autocomplete="off">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save Details
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Setup cover image handler
    const coverInput = document.getElementById('detail-cover-input');
    const coverPreview = document.getElementById('detail-cover-preview');
    
    coverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                coverPreview.innerHTML = `<img src="${event.target.result}" alt="Cover">`;
                currentEditingProject.newCoverImage = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Setup tag input
    const tagsInput = document.getElementById('detail-tags-input');
    const tagsList = document.getElementById('detail-tags-list');
    
    tagsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = tagsInput.value.trim().replace(/,$/, '');
            if (value && !(currentEditingProject.tags || []).includes(value)) {
                addProjectTag(value);
                tagsInput.value = '';
                renderProjectTags();
            }
        }
    });
    
    tagsInput.addEventListener('blur', () => {
        const value = tagsInput.value.trim().replace(/,$/, '');
        if (value && !(currentEditingProject.tags || []).includes(value)) {
            addProjectTag(value);
            tagsInput.value = '';
            renderProjectTags();
        }
    });
    
    // Setup form submission
    document.getElementById('project-details-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProjectDetails();
    });
}

function addProjectTag(tag) {
    if (!currentEditingProject) return;
    currentEditingProject.tags = currentEditingProject.tags || [];
    if (!currentEditingProject.tags.includes(tag)) {
        currentEditingProject.tags.push(tag);
    }
}

function removeProjectTag(tag) {
    if (!currentEditingProject?.tags) return;
    currentEditingProject.tags = currentEditingProject.tags.filter(t => t !== tag);
    renderProjectTags();
}

function renderProjectTags() {
    const tagsList = document.getElementById('detail-tags-list');
    if (!tagsList || !currentEditingProject) return;
    
    const tags = currentEditingProject.tags || [];
    tagsList.innerHTML = tags.map(tag => `
        <span class="tag-chip" data-tag="${escapeHtml(tag)}">
            ${escapeHtml(tag)}
            <button type="button" class="tag-remove" onclick="removeProjectTag('${escapeHtml(tag).replace(/'/g, "\\'")}')" aria-label="Remove tag">&times;</button>
        </span>
    `).join('');
}

// Save Project Details
function saveProjectDetails() {
    const clientSelect = document.getElementById('detail-client-select');
    const opt = clientSelect?.selectedOptions?.[0];
    currentEditingProject.project_name = document.getElementById('detail-project-name').value;
    currentEditingProject.client_name = opt ? (opt.dataset.name || '') : '';
    currentEditingProject.client_email = clientSelect?.value?.trim() || null;
    currentEditingProject.creation_date = document.getElementById('detail-creation-date').value;
    currentEditingProject.finished_date = document.getElementById('detail-finished-date').value;
    currentEditingProject.description = document.getElementById('detail-description').value;
    
    // Add any tag typed but not yet confirmed
    const tagsInput = document.getElementById('detail-tags-input');
    if (tagsInput) {
        const pending = tagsInput.value.trim().replace(/,$/, '');
        if (pending && !(currentEditingProject.tags || []).includes(pending)) {
            currentEditingProject.tags = currentEditingProject.tags || [];
            currentEditingProject.tags.push(pending);
        }
    }
    
    // Save to localStorage for demo
    const projects = JSON.parse(localStorage.getItem('vilostudios_projects') || '[]');
    const index = projects.findIndex(p => p.id == currentEditingProject.id);
    if (index > -1) {
        projects[index] = { ...projects[index], ...currentEditingProject };
    } else {
        projects.push(currentEditingProject);
    }
    localStorage.setItem('vilostudios_projects', JSON.stringify(projects));
    
    // Update header title
    const titleEl = document.querySelector('.project-editor-title');
    if (titleEl) {
        titleEl.textContent = currentEditingProject.project_name;
    }
    
    const clientEl = document.querySelector('.project-editor-client');
    if (clientEl) {
        clientEl.textContent = currentEditingProject.client_name ? `Client: ${currentEditingProject.client_name}` : '';
    }
    
    showNotification('Project details saved successfully!', 'success');
}

// Remove Cover Image
function removeCoverImage() {
    currentEditingProject.cover_image_path = null;
    currentEditingProject.newCoverImage = null;
    
    const coverPreview = document.getElementById('detail-cover-preview');
    if (coverPreview) {
        coverPreview.innerHTML = '<div class="no-cover">No cover image</div>';
    }
}

// Show Visibility Settings
function showVisibilitySettings() {
    const project = currentEditingProject;
    if (!project) return;
    
    const contentArea = document.getElementById('project-editor-main-content');
    if (!contentArea) return;
    
    // Deselect all folders
    document.querySelectorAll('.folder-nav-item').forEach(i => i.classList.remove('active'));
    
    contentArea.innerHTML = `
        <div class="visibility-settings-editor">
            <div class="folder-content-header">
                <div class="folder-content-title">
                    <div class="folder-icon-large">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </div>
                    <div>
                        <h2>Visibility Settings</h2>
                        <p class="folder-file-count">Control who can see and access this project</p>
                    </div>
                </div>
            </div>
            
            <div class="visibility-settings-content">
                <div class="visibility-section">
                    <h3>Project Visibility</h3>
                    <div class="visibility-options">
                        <label class="visibility-option ${project.is_public ? 'active' : ''}">
                            <input type="radio" name="project-visibility" value="public" ${project.is_public ? 'checked' : ''} onchange="updateProjectVisibility('public')">
                            <div class="visibility-option-content">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="2" y1="12" x2="22" y2="12"/>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                </svg>
                                <div>
                                    <strong>Public</strong>
                                    <p>Anyone can view this project in the portfolio</p>
                                </div>
                            </div>
                        </label>
                        <label class="visibility-option ${!project.is_public && !project.is_hidden ? 'active' : ''}">
                            <input type="radio" name="project-visibility" value="private" ${!project.is_public && !project.is_hidden ? 'checked' : ''} onchange="updateProjectVisibility('private')">
                            <div class="visibility-option-content">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <div>
                                    <strong>Private (NDA)</strong>
                                    <p>Only team members and authorized clients can view</p>
                                </div>
                            </div>
                        </label>
                        <label class="visibility-option ${project.is_hidden ? 'active' : ''}">
                            <input type="radio" name="project-visibility" value="hidden" ${project.is_hidden ? 'checked' : ''} onchange="updateProjectVisibility('hidden')">
                            <div class="visibility-option-content">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                </svg>
                                <div>
                                    <strong>Hidden</strong>
                                    <p>Project is completely hidden from all views</p>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="visibility-section">
                    <h3>NDA Settings</h3>
                    <label class="visibility-toggle large">
                        <input type="checkbox" id="nda-enabled" ${project.nda_enabled ? 'checked' : ''} onchange="toggleNDA(this.checked)">
                        <span class="toggle-slider"></span>
                        <div class="toggle-content">
                            <strong>Enable NDA Protection</strong>
                            <p>Require NDA agreement before viewing project details</p>
                        </div>
                    </label>
                    
                    <div class="nda-date-setting" id="nda-date-setting" style="${project.nda_enabled ? '' : 'display: none;'}">
                        <label for="nda-expiry-date">NDA Expiry Date (Optional)</label>
                        <input type="date" id="nda-expiry-date" class="form-input" value="${project.nda_date || ''}" onchange="updateNDADate(this.value)">
                        <p class="help-text">Leave empty to keep project under NDA indefinitely</p>
                    </div>
                </div>
                
                <div class="visibility-section">
                    <h3>Lock Settings</h3>
                    <label class="visibility-toggle large">
                        <input type="checkbox" id="project-locked" ${project.is_locked ? 'checked' : ''} onchange="toggleProjectLock(this.checked)">
                        <span class="toggle-slider"></span>
                        <div class="toggle-content">
                            <strong>Lock Project</strong>
                            <p>Prevent any modifications to this project</p>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    `;
}

// Update Project Visibility
function updateProjectVisibility(type) {
    currentEditingProject.is_public = type === 'public';
    currentEditingProject.is_hidden = type === 'hidden';
    
    // Update radio styling
    document.querySelectorAll('.visibility-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.querySelector('input').checked) {
            opt.classList.add('active');
        }
    });
    
    saveProjectToStorage();
    showNotification('Visibility updated', 'success');
}

// Toggle NDA
function toggleNDA(enabled) {
    currentEditingProject.nda_enabled = enabled;
    
    const ndaDateSetting = document.getElementById('nda-date-setting');
    if (ndaDateSetting) {
        ndaDateSetting.style.display = enabled ? 'block' : 'none';
    }
    
    saveProjectToStorage();
}

// Update NDA Date
function updateNDADate(date) {
    currentEditingProject.nda_date = date || null;
    saveProjectToStorage();
}

// Toggle Project Lock
function toggleProjectLock(locked) {
    currentEditingProject.is_locked = locked;
    saveProjectToStorage();
    showNotification(locked ? 'Project locked' : 'Project unlocked', 'success');
}

// Save Project to Storage
function saveProjectToStorage() {
    const projects = JSON.parse(localStorage.getItem('vilostudios_projects') || '[]');
    const index = projects.findIndex(p => p.id == currentEditingProject.id);
    if (index > -1) {
        projects[index] = { ...projects[index], ...currentEditingProject };
    } else {
        projects.push(currentEditingProject);
    }
    localStorage.setItem('vilostudios_projects', JSON.stringify(projects));
}

// Show Team Members (Now Project Role Management)
function showTeamMembers() {
    const project = currentEditingProject;
    if (!project) return;
    
    const contentArea = document.getElementById('project-editor-main-content');
    if (!contentArea) return;
    
    // Deselect all folders
    document.querySelectorAll('.folder-nav-item').forEach(i => i.classList.remove('active'));
    
    // Load project roles from storage or initialize
    const storedRoles = localStorage.getItem(`vilostudios_project_${project.id}_roles`);
    let projectRoles = storedRoles ? JSON.parse(storedRoles) : [];
    
    // Standard project roles for credits (Manager is default higher-up)
    const availableRoles = [
        'Manager',
        'Director',
        'Producer',
        'Executive Producer',
        'Animation Director',
        'Lead Animator',
        'Key Animator',
        'Inbetweener',
        'Layout Artist',
        'Background Artist',
        'Character Designer',
        'Art Director',
        'Music Composer',
        'Sound Director',
        'Voice Director',
        'Script Writer',
        'Storyboard Artist',
        'Color Designer',
        'Editor',
        'Post-Production',
        'Production Assistant',
        'Coordinator',
        'Other'
    ];
    
    // Group roles by category for credits
    const roleGroups = {
        'Leadership': ['Manager', 'Director', 'Producer', 'Executive Producer'],
        'Production': ['Coordinator', 'Production Assistant'],
        'Animation': ['Animation Director', 'Lead Animator', 'Key Animator', 'Inbetweener', 'Layout Artist'],
        'Art & Design': ['Art Director', 'Character Designer', 'Background Artist', 'Storyboard Artist', 'Color Designer'],
        'Post-Production': ['Editor', 'Post-Production', 'Music Composer', 'Sound Director', 'Voice Director'],
        'Writing': ['Script Writer'],
        'Other': ['Other']
    };
    
    contentArea.innerHTML = `
        <div class="project-roles-editor">
            <div class="folder-content-header">
                <div class="folder-content-title">
                    <div class="folder-icon-large">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <div>
                        <h2>Project Roles & Credits</h2>
                        <p class="folder-file-count">Manage team roles and credits for this project</p>
                    </div>
                </div>
                <div class="folder-content-actions">
                    <button class="btn-primary" onclick="openAddProjectRoleModal()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <line x1="20" y1="8" x2="20" y2="14"/>
                            <line x1="23" y1="11" x2="17" y2="11"/>
                        </svg>
                        Add Project Role
                    </button>
                </div>
            </div>
            
            <!-- Roles List by Category -->
            <div class="project-roles-container">
                ${Object.keys(roleGroups).map(category => {
                    const categoryRoles = projectRoles.filter(r => roleGroups[category].includes(r.role));
                    if (categoryRoles.length === 0) return '';
                    
                    return `
                        <div class="role-category-section">
                            <h3 class="role-category-title">${category}</h3>
                            <div class="project-roles-list">
                                ${categoryRoles.map((member, index) => {
                                    const actualIndex = projectRoles.findIndex(r => r.id === member.id);
                                    return `
                                        <div class="project-role-card">
                                            <div class="project-role-avatar">
                                                ${member.avatar ? `<img src="${member.avatar}" alt="${escapeHtml(member.name)}">` : `<span>${(member.name || 'U').charAt(0).toUpperCase()}</span>`}
                                            </div>
                                            <div class="project-role-info">
                                                <h4>${escapeHtml(member.name)}</h4>
                                                <p class="project-role-title">${escapeHtml(member.role)}</p>
                                                ${member.email ? `<span class="project-role-email">${escapeHtml(member.email)}</span>` : ''}
                                                ${member.department ? `<span class="project-role-department">${escapeHtml(member.department)}</span>` : ''}
                                            </div>
                                            <div class="project-role-actions">
                                                <button class="btn-higher-up ${member.email && isProjectHigherUp(member.email) ? 'active' : ''} ${!member.email ? 'disabled' : ''}" 
                                                    onclick="toggleProjectHigherUp('${(member.email || '').replace(/'/g, "\\'")}'); showTeamMembers();" 
                                                    title="Higher Up (can edit default folders)"
                                                    ${!member.email ? 'disabled' : ''}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                                    </svg>
                                                    Higher Up
                                                </button>
                                                <button class="btn-icon-small" onclick="editProjectRole('${member.id}')" title="Edit">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                </button>
                                                <button class="btn-icon-small" onclick="removeProjectRole('${member.id}')" title="Remove">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                <!-- Unassigned Roles -->
                ${projectRoles.filter(r => !Object.values(roleGroups).flat().includes(r.role)).length > 0 ? `
                    <div class="role-category-section">
                        <h3 class="role-category-title">Other Roles</h3>
                        <div class="project-roles-list">
                            ${projectRoles.filter(r => !Object.values(roleGroups).flat().includes(r.role)).map((member, index) => {
                                const actualIndex = projectRoles.findIndex(r => r.id === member.id);
                                return `
                                    <div class="project-role-card">
                                        <div class="project-role-avatar">
                                            ${member.avatar ? `<img src="${member.avatar}" alt="${escapeHtml(member.name)}">` : `<span>${(member.name || 'U').charAt(0).toUpperCase()}</span>`}
                                        </div>
                                        <div class="project-role-info">
                                            <h4>${escapeHtml(member.name)}</h4>
                                            <p class="project-role-title">${escapeHtml(member.role)}</p>
                                            ${member.email ? `<span class="project-role-email">${escapeHtml(member.email)}</span>` : ''}
                                        </div>
                                        <div class="project-role-actions">
                                            <button class="btn-higher-up ${member.email && isProjectHigherUp(member.email) ? 'active' : ''} ${!member.email ? 'disabled' : ''}" 
                                                onclick="toggleProjectHigherUp('${(member.email || '').replace(/'/g, "\\'")}'); showTeamMembers();" 
                                                title="Higher Up (can edit default folders)"
                                                ${!member.email ? 'disabled' : ''}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                                </svg>
                                                Higher Up
                                            </button>
                                            <button class="btn-icon-small" onclick="editProjectRole('${member.id}')" title="Edit">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                            <button class="btn-icon-small" onclick="removeProjectRole('${member.id}')" title="Remove">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${projectRoles.length > 0 ? `
                <p class="higher-ups-help" style="margin-top: 1rem; font-size: 0.8125rem; color: var(--text-muted);">
                    <strong>Higher Ups</strong> can edit default folders (rename, move, visibility). Managers are always higher-ups.
                </p>
                ` : ''}
                
                ${projectRoles.length === 0 ? `
                    <div class="empty-folder-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <h3>No project roles assigned yet</h3>
                        <p>Add team members with specific roles for this project. These will appear in the project credits.</p>
                        <button class="btn-secondary" onclick="openAddProjectRoleModal()">Add First Role</button>
                    </div>
                ` : ''}
            </div>
            
            <!-- Credits Preview -->
            ${projectRoles.length > 0 ? `
                <div class="credits-preview-section">
                    <h3 class="credits-preview-title">Credits Preview</h3>
                    <div class="credits-preview">
                        ${Object.keys(roleGroups).map(category => {
                            const categoryRoles = projectRoles.filter(r => roleGroups[category].includes(r.role));
                            if (categoryRoles.length === 0) return '';
                            
                            return `
                                <div class="credits-category">
                                    <h4 class="credits-category-title">${category}</h4>
                                    <div class="credits-names">
                                        ${categoryRoles.map(member => `
                                            <div class="credit-item">
                                                <span class="credit-name">${escapeHtml(member.name)}</span>
                                                <span class="credit-role">${escapeHtml(member.role)}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        ${projectRoles.filter(r => !Object.values(roleGroups).flat().includes(r.role)).length > 0 ? `
                            <div class="credits-category">
                                <h4 class="credits-category-title">Other</h4>
                                <div class="credits-names">
                                    ${projectRoles.filter(r => !Object.values(roleGroups).flat().includes(r.role)).map(member => `
                                        <div class="credit-item">
                                            <span class="credit-name">${escapeHtml(member.name)}</span>
                                            <span class="credit-role">${escapeHtml(member.role)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // Store available roles globally for modal
    window.availableProjectRoles = availableRoles;
    window.currentProjectRoles = projectRoles;
}

// Open Add Project Role Modal
function openAddProjectRoleModal() {
    const project = currentEditingProject;
    if (!project) return;
    
    const availableRoles = window.availableProjectRoles || [
        'Manager', 'Director', 'Producer', 'Executive Producer', 'Animation Director', 'Lead Animator',
        'Key Animator', 'Inbetweener', 'Layout Artist', 'Background Artist', 'Character Designer',
        'Art Director', 'Music Composer', 'Sound Director', 'Voice Director', 'Script Writer',
        'Storyboard Artist', 'Color Designer', 'Editor', 'Post-Production', 'Production Assistant',
        'Coordinator', 'Other'
    ];
    
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.id = 'add-project-role-modal';
    modal.innerHTML = `
        <div class="project-modal">
            <div class="project-modal-header">
                <h2>Add Project Role</h2>
                <button class="btn-close-modal" onclick="closeAddProjectRoleModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <form id="add-project-role-form">
                    <div class="form-group">
                        <label for="role-name">Name *</label>
                        <input type="text" id="role-name" class="form-input" placeholder="Enter full name..." required>
                    </div>
                    
                    <div class="form-group">
                        <label for="role-email">Email *</label>
                        <input type="email" id="role-email" class="form-input" placeholder="name@example.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="role-select">Project Role *</label>
                        <select id="role-select" class="form-input" required>
                            <option value="">Select a role...</option>
                            ${availableRoles.map(role => `
                                <option value="${escapeHtml(role)}">${escapeHtml(role)}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="role-custom">Custom Role (if "Other" selected)</label>
                        <input type="text" id="role-custom" class="form-input" placeholder="Enter custom role name..." style="display: none;">
                    </div>
                    
                    <div class="form-group higher-up-toggle-wrapper">
                        <input type="checkbox" id="role-higher-up" class="sr-only">
                        <label for="role-higher-up" class="higher-up-toggle-label">
                            <span class="higher-up-toggle-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                Higher Up
                            </span>
                        </label>
                        <span class="higher-up-help">Can edit default folders (rename, move, visibility). Managers are always higher-ups.</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="role-department">Department (Optional)</label>
                        <input type="text" id="role-department" class="form-input" placeholder="e.g., Animation, Art, Production...">
                    </div>
                </form>
            </div>
            <div class="project-modal-footer">
                <button class="btn-secondary" onclick="closeAddProjectRoleModal()">Cancel</button>
                <button class="btn-primary" onclick="confirmAddProjectRole()">Add Role</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle role select change
    const roleSelect = document.getElementById('role-select');
    const customRoleInput = document.getElementById('role-custom');
    const higherUpCheckbox = document.getElementById('role-higher-up');
    
    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'Other') {
            customRoleInput.style.display = 'block';
            customRoleInput.required = true;
        } else {
            customRoleInput.style.display = 'none';
            customRoleInput.required = false;
            customRoleInput.value = '';
        }
        // Managers are default higher-ups - auto-check when Manager selected
        if (roleSelect.value === 'Manager' && higherUpCheckbox) {
            higherUpCheckbox.checked = true;
        }
    });
}

// Close Add Project Role Modal
function closeAddProjectRoleModal() {
    const modal = document.getElementById('add-project-role-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Confirm Add Project Role
function confirmAddProjectRole() {
    const project = currentEditingProject;
    if (!project) return;
    
    const nameInput = document.getElementById('role-name');
    const emailInput = document.getElementById('role-email');
    const roleSelect = document.getElementById('role-select');
    const customRoleInput = document.getElementById('role-custom');
    const departmentInput = document.getElementById('role-department');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const role = roleSelect ? roleSelect.value : '';
    const customRole = customRoleInput ? customRoleInput.value.trim() : '';
    const department = departmentInput ? departmentInput.value.trim() : '';
    
    if (!name || !email || !role) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Load existing roles
    const storedRoles = localStorage.getItem(`vilostudios_project_${project.id}_roles`);
    let projectRoles = storedRoles ? JSON.parse(storedRoles) : [];
    
    // Create new role
    const newRole = {
        id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        email: email,
        role: role === 'Other' && customRole ? customRole : role,
        department: department || null,
        addedAt: new Date().toISOString()
    };
    
    // Check if email already exists for this role
    const existing = projectRoles.find(r => r.email === email && r.role === newRole.role);
    if (existing) {
        showNotification('This email is already assigned to this role for this project', 'error');
        return;
    }
    
    projectRoles.push(newRole);
    localStorage.setItem(`vilostudios_project_${project.id}_roles`, JSON.stringify(projectRoles));
    
    // Add to project higher_ups when Manager role or Higher Up checkbox is checked
    const higherUpCheckbox = document.getElementById('role-higher-up');
    const markAsHigherUp = (higherUpCheckbox && higherUpCheckbox.checked) || newRole.role === 'Manager';
    if (markAsHigherUp && email) {
        const higherUps = getProjectHigherUps();
        const norm = email.toLowerCase().trim();
        if (!higherUps.some(e => (e || '').toLowerCase().trim() === norm)) {
            higherUps.push(email);
            setProjectHigherUps(higherUps);
        }
    }
    
    closeAddProjectRoleModal();
    showTeamMembers();
    
    showNotification('Project role added successfully!', 'success');
}

// Edit Project Role
function editProjectRole(roleId) {
    const project = currentEditingProject;
    if (!project) return;
    
    const storedRoles = localStorage.getItem(`vilostudios_project_${project.id}_roles`);
    let projectRoles = storedRoles ? JSON.parse(storedRoles) : [];
    const role = projectRoles.find(r => r.id === roleId);
    
    if (!role) return;
    
    const availableRoles = window.availableProjectRoles || [];
    
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.id = 'edit-project-role-modal';
    modal.innerHTML = `
        <div class="project-modal">
            <div class="project-modal-header">
                <h2>Edit Project Role</h2>
                <button class="btn-close-modal" onclick="closeEditProjectRoleModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <form id="edit-project-role-form">
                    <div class="form-group">
                        <label for="edit-role-name">Name *</label>
                        <input type="text" id="edit-role-name" class="form-input" value="${escapeHtml(role.name)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-role-email">Email *</label>
                        <input type="email" id="edit-role-email" class="form-input" value="${escapeHtml(role.email)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-role-select">Project Role *</label>
                        <select id="edit-role-select" class="form-input" required>
                            <option value="">Select a role...</option>
                            ${availableRoles.map(r => `
                                <option value="${escapeHtml(r)}" ${r === role.role ? 'selected' : ''}>${escapeHtml(r)}</option>
                            `).join('')}
                            ${!availableRoles.includes(role.role) ? `<option value="${escapeHtml(role.role)}" selected>${escapeHtml(role.role)} (Custom)</option>` : ''}
                        </select>
                    </div>
                    
                    <div class="form-group higher-up-toggle-wrapper">
                        <input type="checkbox" id="edit-role-higher-up" class="sr-only" ${role.email && isProjectHigherUp(role.email) ? 'checked' : ''}>
                        <label for="edit-role-higher-up" class="higher-up-toggle-label">
                            <span class="higher-up-toggle-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                Higher Up
                            </span>
                        </label>
                        <span class="higher-up-help">Can edit default folders (rename, move, visibility). Managers are always higher-ups.</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-role-department">Department (Optional)</label>
                        <input type="text" id="edit-role-department" class="form-input" value="${escapeHtml(role.department || '')}" placeholder="e.g., Animation, Art, Production...">
                    </div>
                </form>
            </div>
            <div class="project-modal-footer">
                <button class="btn-secondary" onclick="closeEditProjectRoleModal()">Cancel</button>
                <button class="btn-primary" onclick="confirmEditProjectRole('${roleId}')">Save Changes</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-check Higher Up when Manager selected
    const roleSelect = document.getElementById('edit-role-select');
    const higherUpCheckbox = document.getElementById('edit-role-higher-up');
    if (roleSelect && higherUpCheckbox) {
        roleSelect.addEventListener('change', () => {
            if (roleSelect.value === 'Manager') higherUpCheckbox.checked = true;
        });
    }
}

// Close Edit Project Role Modal
function closeEditProjectRoleModal() {
    const modal = document.getElementById('edit-project-role-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Confirm Edit Project Role
function confirmEditProjectRole(roleId) {
    const project = currentEditingProject;
    if (!project) return;
    
    const nameInput = document.getElementById('edit-role-name');
    const emailInput = document.getElementById('edit-role-email');
    const roleSelect = document.getElementById('edit-role-select');
    const departmentInput = document.getElementById('edit-role-department');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const role = roleSelect ? roleSelect.value : '';
    const department = departmentInput ? departmentInput.value.trim() : '';
    
    if (!name || !email || !role) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Load existing roles
    const storedRoles = localStorage.getItem(`vilostudios_project_${project.id}_roles`);
    let projectRoles = storedRoles ? JSON.parse(storedRoles) : [];
    
    const index = projectRoles.findIndex(r => r.id === roleId);
    if (index > -1) {
        const oldEmail = projectRoles[index].email || '';
        projectRoles[index].name = name;
        projectRoles[index].email = email;
        projectRoles[index].role = role;
        projectRoles[index].department = department || null;
        
        localStorage.setItem(`vilostudios_project_${project.id}_roles`, JSON.stringify(projectRoles));
        
        // Update higher_ups: remove old email, add new if Higher Up checked or role is Manager
        const higherUpCheckbox = document.getElementById('edit-role-higher-up');
        const markAsHigherUp = (higherUpCheckbox && higherUpCheckbox.checked) || role === 'Manager';
        let higherUps = getProjectHigherUps();
        const oldNorm = (oldEmail || '').toLowerCase().trim();
        const newNorm = (email || '').toLowerCase().trim();
        higherUps = higherUps.filter(e => (e || '').toLowerCase().trim() !== oldNorm);
        if (markAsHigherUp && email) {
            if (!higherUps.some(e => (e || '').toLowerCase().trim() === newNorm)) {
                higherUps.push(email);
            }
        }
        setProjectHigherUps(higherUps);
        
        closeEditProjectRoleModal();
        showTeamMembers();
        
        showNotification('Project role updated successfully!', 'success');
    }
}

// Remove Project Role
function removeProjectRole(roleId) {
    const project = currentEditingProject;
    if (!project) return;
    
    const storedRoles = localStorage.getItem(`vilostudios_project_${project.id}_roles`);
    let projectRoles = storedRoles ? JSON.parse(storedRoles) : [];
    const role = projectRoles.find(r => r.id === roleId);
    
    if (!role) return;
    
    showConfirmDialog(
        'Remove Project Role',
        `Are you sure you want to remove "${role.name}" from this project's credits?`,
        'Remove',
        'Cancel',
        () => {
            const index = projectRoles.findIndex(r => r.id === roleId);
            if (index > -1) {
                projectRoles.splice(index, 1);
                localStorage.setItem(`vilostudios_project_${project.id}_roles`, JSON.stringify(projectRoles));
                
                showTeamMembers();
                showNotification('Project role removed successfully', 'success');
            }
        }
    );
}

// Legacy functions for compatibility
function openAddTeamMemberModal() {
    openAddProjectRoleModal();
}

function removeTeamMember(index) {
    const project = currentEditingProject;
    if (!project) return;
    
    const storedRoles = localStorage.getItem(`vilostudios_project_${project.id}_roles`);
    let projectRoles = storedRoles ? JSON.parse(storedRoles) : [];
    
    if (projectRoles[index]) {
        removeProjectRole(projectRoles[index].id);
    }
}

// Save All Project Changes
function saveProjectChanges() {
    saveProjectFolders();
    saveProjectToStorage();
    showNotification('All changes saved successfully!', 'success');
}

// ============================================
// END PROJECT EDITOR
// ============================================

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
                        <select id="client-select" class="form-input form-select">
                            <option value="" data-name="">— Select client (email = login) —</option>
                            ${(JSON.parse(localStorage.getItem('vilostudios_crm_clients') || '[]')).map(c => {
                                const email = (c.email || '').trim();
                                const name = (c.name || c.company || 'Unknown').trim();
                                const label = email ? `${escapeHtml(name)} — ${escapeHtml(email)}` : escapeHtml(name);
                                return `<option value="${escapeHtml(email)}" data-name="${escapeHtml(name)}">${label}</option>`;
                            }).join('')}
                        </select>
                        <input type="hidden" id="client-name" value="">
                        <small class="form-hint">Select a CRM client. Their email is used for login—they'll only see projects tied to it.</small>
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
                    
                    <!-- Portfolio Visibility -->
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="portfolio-visible" class="checkbox-input" checked>
                            <span>Visible on Portfolio</span>
                        </label>
                        <small style="color: var(--text-secondary); font-size: var(--font-sm); margin-top: var(--spacing-xs); display: block;">
                            Show this project on the public portfolio when enabled
                        </small>
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
    
    // Client select handler - sync client_name from selected option
    const clientSelect = document.getElementById('client-select');
    const clientNameInput = document.getElementById('client-name');
    if (clientSelect && clientNameInput) {
        clientSelect.addEventListener('change', () => {
            const opt = clientSelect.selectedOptions[0];
            clientNameInput.value = opt ? (opt.dataset.name || '') : '';
        });
    }
    
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
            
            const ndaEnabled = document.getElementById('nda-enabled').checked;
            const portfolioVisible = document.getElementById('portfolio-visible').checked;
            
            const clientEmail = document.getElementById('client-select')?.value?.trim() || null;
            const projectData = {
                project_name: document.getElementById('project-name').value.trim(),
                client_name: document.getElementById('client-name').value.trim() || null,
                client_email: clientEmail,
                cover_image: coverImage,
                creation_date: document.getElementById('creation-date').value || null,
                finished_date: document.getElementById('finished-date').value || null,
                nda_enabled: ndaEnabled,
                nda_date: document.getElementById('nda-date').value || null,
                portfolio_visible: portfolioVisible,
                team_members: members,
                created_by: userName
            };
            
            const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
            
            if (apiBypass) {
                const projects = JSON.parse(localStorage.getItem('vilostudios_projects') || '[]');
                const newId = Math.max(0, ...projects.map(p => p.id || 0)) + 1;
                const newProject = {
                    id: newId,
                    project_name: projectData.project_name,
                    client_name: projectData.client_name,
                    client_email: projectData.client_email,
                    cover_image_path: coverImage || null,
                    creation_date: projectData.creation_date,
                    finished_date: projectData.finished_date,
                    nda_enabled: projectData.nda_enabled ? 1 : 0,
                    nda_date: projectData.nda_date,
                    is_public: projectData.portfolio_visible ? 1 : 0,
                    is_locked: 0,
                    is_hidden: 0,
                    team_member_count: members.length,
                    created_at: new Date().toISOString()
                };
                projects.push(newProject);
                localStorage.setItem('vilostudios_projects', JSON.stringify(projects));
                modal.remove();
                renderProjectsPage();
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
                <div class="add-freelancer-page">
                    <div class="add-freelancer-intro">
                        <p class="add-freelancer-intro-text">Add a new freelancer to the talent database. Required fields are marked with <span class="required-star">*</span>.</p>
                    </div>
                    <form id="add-freelancer-form" class="add-freelancer-form">
                        <div class="add-freelancer-sections">
                            <div class="add-freelancer-section add-freelancer-section-main">
                                <h4 class="add-freelancer-section-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    Basic Information
                                </h4>
                                <div class="add-freelancer-row">
                                    <div class="form-group">
                                        <label for="add-freelancer-name" class="form-label">Name <span class="required-star">*</span></label>
                                        <input type="text" id="add-freelancer-name" name="name" class="form-input" required placeholder="e.g., Jane Smith">
                                    </div>
                                    <div class="form-group">
                                        <label for="add-freelancer-email" class="form-label">Email</label>
                                        <input type="email" id="add-freelancer-email" name="email" class="form-input" placeholder="freelancer@example.com">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="add-freelancer-phone" class="form-label">Phone (optional)</label>
                                    <input type="tel" id="add-freelancer-phone" name="phone" class="form-input" placeholder="+1 (555) 000-0000">
                                </div>
                            </div>

                            <div class="add-freelancer-section">
                                <h4 class="add-freelancer-section-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                    Role & Department
                                </h4>
                                <div class="add-freelancer-row">
                                    <div class="form-group">
                                        <label for="add-freelancer-main-role" class="form-label">Main Role</label>
                                        <input type="text" id="add-freelancer-main-role" name="main_role" class="form-input" placeholder="e.g., Key Animator, Sound Designer">
                                    </div>
                                    <div class="form-group">
                                        <label for="add-freelancer-main-department" class="form-label">Primary Department</label>
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
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Additional Departments <span class="form-label-hint">Click to select</span></label>
                                    <div class="add-freelancer-dept-chips" id="add-freelancer-dept-chips">
                                        <button type="button" class="dept-chip" data-value="animation">Animation</button>
                                        <button type="button" class="dept-chip" data-value="character-design">Character Design</button>
                                        <button type="button" class="dept-chip" data-value="color-design">Color Design</button>
                                        <button type="button" class="dept-chip" data-value="background-art">Background Art</button>
                                        <button type="button" class="dept-chip" data-value="3d-cgi">3D/CG</button>
                                        <button type="button" class="dept-chip" data-value="editing">Editing</button>
                                        <button type="button" class="dept-chip" data-value="sound-design">Sound Design</button>
                                        <button type="button" class="dept-chip" data-value="music">Music</button>
                                        <button type="button" class="dept-chip" data-value="voice-acting">Voice Acting</button>
                                        <button type="button" class="dept-chip" data-value="production">Production</button>
                                        <button type="button" class="dept-chip" data-value="photography-compositing">Compositing</button>
                                        <button type="button" class="dept-chip" data-value="technology">Technology</button>
                                        <button type="button" class="dept-chip" data-value="internal-management">Internal Management</button>
                                        <button type="button" class="dept-chip" data-value="development">Development</button>
                                    </div>
                                    <input type="hidden" name="departments_json" id="add-freelancer-departments-json" value="[]">
                                </div>
                            </div>

                            <div class="add-freelancer-section">
                                <h4 class="add-freelancer-section-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    Notes (optional)
                                </h4>
                                <div class="form-group">
                                    <textarea id="add-freelancer-notes" name="notes" class="form-input form-textarea" rows="3" placeholder="Portfolio link, availability, specializations, etc."></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="add-freelancer-actions">
                            <button type="button" class="btn-secondary" id="btn-cancel-add-freelancer">Cancel</button>
                            <button type="submit" class="btn-primary" id="btn-submit-add-freelancer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Freelancer
                            </button>
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
    const deptChipsContainer = document.getElementById('add-freelancer-dept-chips');
    const deptJsonInput = document.getElementById('add-freelancer-departments-json');

    if (deptChipsContainer) {
        deptChipsContainer.querySelectorAll('.dept-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
                syncAddFreelancerDepartments();
            });
        });
    }

    function syncAddFreelancerDepartments() {
        if (!deptChipsContainer || !deptJsonInput) return;
        const selected = Array.from(deptChipsContainer.querySelectorAll('.dept-chip.selected')).map(c => c.dataset.value);
        deptJsonInput.value = JSON.stringify(selected);
    }

    function resetAddFreelancerDeptChips() {
        if (deptChipsContainer) {
            deptChipsContainer.querySelectorAll('.dept-chip').forEach(c => c.classList.remove('selected'));
        }
        if (deptJsonInput) deptJsonInput.value = '[]';
    }

    if (addFreelancerForm) {
        addFreelancerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // TODO: Implement add freelancer functionality
            const departmentsRaw = deptJsonInput ? deptJsonInput.value : '[]';
            let departments = [];
            try { departments = JSON.parse(departmentsRaw) || []; } catch (_) {}
            const formData = {
                name: document.getElementById('add-freelancer-name')?.value,
                email: document.getElementById('add-freelancer-email')?.value,
                phone: document.getElementById('add-freelancer-phone')?.value,
                main_role: document.getElementById('add-freelancer-main-role')?.value,
                main_department: document.getElementById('add-freelancer-main-department')?.value,
                departments,
                notes: document.getElementById('add-freelancer-notes')?.value
            };
            console.log('Add freelancer form submitted', formData);
            alert('Add freelancer functionality coming soon');
        });
    }

    const cancelBtn = document.getElementById('btn-cancel-add-freelancer');
    if (cancelBtn && addFreelancerForm) {
        cancelBtn.addEventListener('click', () => {
            addFreelancerForm.reset();
            resetAddFreelancerDeptChips();
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
                        <div class="status-filter-wrapper">
                            <button class="status-filter-btn" id="positions-branch-filter-btn">
                                <span id="positions-branch-filter-text">All Departments</span>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="status-filter-dropdown" id="positions-branch-filter-dropdown">
                                <div class="status-filter-item active" data-value="all">All Departments</div>
                                <div class="status-filter-item" data-value="animation">Animation</div>
                                <div class="status-filter-item" data-value="character-design">Character Design</div>
                                <div class="status-filter-item" data-value="color-design">Color Design</div>
                                <div class="status-filter-item" data-value="background-art">Background Art</div>
                                <div class="status-filter-item" data-value="3d-cgi">3D/CGI</div>
                                <div class="status-filter-item" data-value="production">Production</div>
                                <div class="status-filter-item" data-value="planning">Planning</div>
                                <div class="status-filter-item" data-value="sound">Sound</div>
                                <div class="status-filter-item" data-value="sound-music">Sound & Music</div>
                                <div class="status-filter-item" data-value="editing">Editing</div>
                                <div class="status-filter-item" data-value="photography-compositing">Photography & Compositing</div>
                                <div class="status-filter-item" data-value="technology">Technology</div>
                                <div class="status-filter-item" data-value="internal-management">Internal Management</div>
                                <div class="status-filter-item" data-value="development">Development</div>
                            </div>
                        </div>
                        <div class="status-filter-wrapper">
                            <button class="status-filter-btn" id="positions-employment-filter-btn">
                                <span id="positions-employment-filter-text">All Employment Types</span>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="status-filter-dropdown" id="positions-employment-filter-dropdown">
                                <div class="status-filter-item active" data-value="all">All Employment Types</div>
                                <div class="status-filter-item" data-value="part-time">Part-Time</div>
                                <div class="status-filter-item" data-value="permanent">Permanent</div>
                                <div class="status-filter-item" data-value="contract">Contract</div>
                                <div class="status-filter-item" data-value="internship">Internship</div>
                                <div class="status-filter-item" data-value="management">Management</div>
                                <div class="status-filter-item" data-value="sound">Sound</div>
                            </div>
                        </div>
                        <input type="hidden" id="positions-type-filter" value="all">
                        <input type="hidden" id="positions-branch-filter" value="all">
                        <input type="hidden" id="positions-employment-filter" value="all">
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
                switchPage('create-position');
            } catch (error) {
                console.error('Error navigating to position editor:', error);
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
                
                // Reload positions
                loadPositions();
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
    
    // Setup positions branch filter dropdown
    const positionsBranchFilterBtn = document.getElementById('positions-branch-filter-btn');
    const positionsBranchFilterDropdown = document.getElementById('positions-branch-filter-dropdown');
    const positionsBranchFilterText = document.getElementById('positions-branch-filter-text');
    const positionsBranchFilterHidden = document.getElementById('positions-branch-filter');
    
    if (positionsBranchFilterBtn && positionsBranchFilterDropdown && positionsBranchFilterText && positionsBranchFilterHidden) {
        // Toggle dropdown
        positionsBranchFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = positionsBranchFilterBtn.classList.contains('active');
            
            if (isActive) {
                positionsBranchFilterBtn.classList.remove('active');
                positionsBranchFilterDropdown.classList.remove('show');
            } else {
                positionsBranchFilterBtn.classList.add('active');
                positionsBranchFilterDropdown.classList.add('show');
            }
        });
        
        // Handle item selection
        positionsBranchFilterDropdown.querySelectorAll('.status-filter-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const text = item.textContent;
                
                positionsBranchFilterHidden.value = value;
                positionsBranchFilterText.textContent = text;
                
                // Update active state
                positionsBranchFilterDropdown.querySelectorAll('.status-filter-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
                
                // Close dropdown
                positionsBranchFilterBtn.classList.remove('active');
                positionsBranchFilterDropdown.classList.remove('show');
                
                // Reload positions
                loadPositions();
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!positionsBranchFilterBtn.contains(e.target) && !positionsBranchFilterDropdown.contains(e.target)) {
                positionsBranchFilterBtn.classList.remove('active');
                positionsBranchFilterDropdown.classList.remove('show');
            }
        });
    }
    
    // Setup positions employment type filter dropdown
    const positionsEmploymentFilterBtn = document.getElementById('positions-employment-filter-btn');
    const positionsEmploymentFilterDropdown = document.getElementById('positions-employment-filter-dropdown');
    const positionsEmploymentFilterText = document.getElementById('positions-employment-filter-text');
    const positionsEmploymentFilterHidden = document.getElementById('positions-employment-filter');
    
    if (positionsEmploymentFilterBtn && positionsEmploymentFilterDropdown && positionsEmploymentFilterText && positionsEmploymentFilterHidden) {
        // Toggle dropdown
        positionsEmploymentFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = positionsEmploymentFilterBtn.classList.contains('active');
            
            if (isActive) {
                positionsEmploymentFilterBtn.classList.remove('active');
                positionsEmploymentFilterDropdown.classList.remove('show');
            } else {
                positionsEmploymentFilterBtn.classList.add('active');
                positionsEmploymentFilterDropdown.classList.add('show');
            }
        });
        
        // Handle item selection
        positionsEmploymentFilterDropdown.querySelectorAll('.status-filter-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const text = item.textContent;
                
                positionsEmploymentFilterHidden.value = value;
                positionsEmploymentFilterText.textContent = text;
                
                // Update active state
                positionsEmploymentFilterDropdown.querySelectorAll('.status-filter-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
                
                // Close dropdown
                positionsEmploymentFilterBtn.classList.remove('active');
                positionsEmploymentFilterDropdown.classList.remove('show');
                
                // Reload positions
                loadPositions();
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!positionsEmploymentFilterBtn.contains(e.target) && !positionsEmploymentFilterDropdown.contains(e.target)) {
                positionsEmploymentFilterBtn.classList.remove('active');
                positionsEmploymentFilterDropdown.classList.remove('show');
            }
        });
    }
    
    // Setup positions search
    const positionsSearchInput = document.getElementById('positions-search');
    if (positionsSearchInput) {
        let searchTimeout;
        positionsSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(loadPositions, 300);
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
    
    // Setup support cases status filter dropdown
    const supportCasesStatusFilterBtn = document.getElementById('support-cases-status-filter-btn');
    const supportCasesStatusFilterDropdown = document.getElementById('support-cases-status-filter-dropdown');
    const supportCasesStatusFilterText = document.getElementById('support-cases-status-filter-text');
    const supportCasesStatusFilterHidden = document.getElementById('support-cases-status-filter');
    
    if (supportCasesStatusFilterBtn && supportCasesStatusFilterDropdown && supportCasesStatusFilterText && supportCasesStatusFilterHidden) {
        // Toggle dropdown
        supportCasesStatusFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = supportCasesStatusFilterBtn.classList.contains('active');
            
            if (isActive) {
                supportCasesStatusFilterBtn.classList.remove('active');
                supportCasesStatusFilterDropdown.classList.remove('show');
            } else {
                supportCasesStatusFilterBtn.classList.add('active');
                supportCasesStatusFilterDropdown.classList.add('show');
            }
        });
        
        // Handle item selection using event delegation (works with dynamically added items)
        supportCasesStatusFilterDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.status-filter-item');
            if (!item) return;
            
            e.stopPropagation();
            
            const value = item.dataset.value;
            const text = item.textContent;
            
            supportCasesStatusFilterHidden.value = value;
            supportCasesStatusFilterText.textContent = text;
            
            // Update active state
            supportCasesStatusFilterDropdown.querySelectorAll('.status-filter-item').forEach(el => {
                el.classList.remove('active');
            });
            item.classList.add('active');
            
            // Close dropdown
            supportCasesStatusFilterBtn.classList.remove('active');
            supportCasesStatusFilterDropdown.classList.remove('show');
            
            // Reload support cases
            loadSupportCases();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!supportCasesStatusFilterBtn.contains(e.target) && !supportCasesStatusFilterDropdown.contains(e.target)) {
                supportCasesStatusFilterBtn.classList.remove('active');
                supportCasesStatusFilterDropdown.classList.remove('show');
            }
        });
    }
    
    // Setup support cases email filter dropdown
    const supportCasesEmailFilterBtn = document.getElementById('support-cases-email-filter-btn');
    const supportCasesEmailFilterDropdown = document.getElementById('support-cases-email-filter-dropdown');
    const supportCasesEmailFilterText = document.getElementById('support-cases-email-filter-text');
    const supportCasesEmailFilterHidden = document.getElementById('support-cases-email-filter');
    
    if (supportCasesEmailFilterBtn && supportCasesEmailFilterDropdown && supportCasesEmailFilterText && supportCasesEmailFilterHidden) {
        // Toggle dropdown
        supportCasesEmailFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = supportCasesEmailFilterBtn.classList.contains('active');
            
            if (isActive) {
                supportCasesEmailFilterBtn.classList.remove('active');
                supportCasesEmailFilterDropdown.classList.remove('show');
            } else {
                supportCasesEmailFilterBtn.classList.add('active');
                supportCasesEmailFilterDropdown.classList.add('show');
            }
        });
        
        // Handle item selection
        supportCasesEmailFilterDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.status-filter-item');
            if (!item) return;
            
            const value = item.dataset.value;
            const text = item.textContent;
            
            supportCasesEmailFilterHidden.value = value;
            supportCasesEmailFilterText.textContent = text;
            
            // Update active state
            supportCasesEmailFilterDropdown.querySelectorAll('.status-filter-item').forEach(el => {
                el.classList.remove('active');
            });
            item.classList.add('active');
            
            // Close dropdown
            supportCasesEmailFilterBtn.classList.remove('active');
            supportCasesEmailFilterDropdown.classList.remove('show');
            
            // Reload support cases
            loadSupportCases();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!supportCasesEmailFilterBtn.contains(e.target) && !supportCasesEmailFilterDropdown.contains(e.target)) {
                supportCasesEmailFilterBtn.classList.remove('active');
                supportCasesEmailFilterDropdown.classList.remove('show');
            }
        });
    }
    
    // Function to update email filter dropdown with available emails
    window.updateSupportCasesEmailFilter = function(cases) {
        const emailFilterDropdown = document.getElementById('support-cases-email-filter-dropdown');
        const emailFilterHidden = document.getElementById('support-cases-email-filter');
        if (!emailFilterDropdown) return;
        
        // Get unique emails from cases
        const uniqueEmails = [...new Set(cases.map(c => c.user_email).filter(Boolean))].sort();
        
        // Get current selected value
        const currentValue = emailFilterHidden?.value || 'all';
        
        // Build dropdown HTML
        let dropdownHTML = '';
        dropdownHTML += `<div class="status-filter-item ${currentValue === 'all' ? 'active' : ''}" data-value="all">All Emails</div>`;
        uniqueEmails.forEach(email => {
            const isActive = currentValue === email;
            dropdownHTML += `<div class="status-filter-item ${isActive ? 'active' : ''}" data-value="${escapeHtml(email)}">${escapeHtml(email)}</div>`;
        });
        
        emailFilterDropdown.innerHTML = dropdownHTML;
        
        // Note: Event listener is already attached in the initial setup above using event delegation
        // So dynamically added items will automatically work
    };
    
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
                    ${app.genre ? `
                    <div class="application-genre">
                        <strong>Genre Specialization:</strong> ${escapeHtml(app.genre)}
                    </div>
                    ` : ''}
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
                    ${application.genre ? `<p><strong>Genre Specialization:</strong> ${escapeHtml(application.genre)}</p>` : ''}
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

// Render Create Position Page
function renderCreatePositionPage() {
    const otherPages = document.getElementById('other-pages');
    if (!otherPages) return;
    
    otherPages.innerHTML = `
        <div class="position-editor-page">
            <!-- Header with back button -->
            <div class="position-editor-header">
                <button class="btn-back-to-applications" onclick="switchPage('applications')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Applications
                </button>
                <div class="position-editor-title-section">
                    <h1 class="position-editor-title">Create New Position</h1>
            </div>
                <div class="position-editor-actions">
                    <button class="btn-secondary" onclick="switchPage('applications')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Cancel
                    </button>
                </div>
            </div>
            
            <!-- Main Editor Layout -->
            <div class="position-editor-layout">
                <!-- Main Content Area -->
                <div class="position-editor-content">
                    <div class="position-editor-form-container">
                <form id="create-position-form">
                    <div class="form-row">
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
                    
                    <!-- Language Tabs -->
                    <div class="language-tabs-container">
                        <div class="language-tabs">
                            <button type="button" class="language-tab active" data-lang="en">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                    <path d="M2 8h20M12 4v16"></path>
                                </svg>
                                EN
                            </button>
                            <button type="button" class="language-tab" data-lang="ja">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 2v20M2 12h20"></path>
                                </svg>
                                JP
                            </button>
                            <button type="button" class="language-tab" data-lang="zh">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                    <path d="M2 12h20"></path>
                                </svg>
                                ZH
                            </button>
                            <button type="button" class="language-tab" data-lang="ko">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M8 8l8 8M16 8l-8 8"></path>
                                </svg>
                                KO
                            </button>
                        </div>
                        
                        <!-- English Content -->
                        <div class="language-content active" data-lang="en">
                            <div class="form-group">
                                <label for="position-role-en" class="form-label">Role/Position Title (English) *</label>
                                <input 
                                    type="text" 
                                    id="position-role-en" 
                                    class="form-input" 
                                    placeholder="e.g., Animation Director"
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label for="position-description-en" class="form-label">Description (English) *</label>
                                <div id="position-description-editor-en" class="quill-editor"></div>
                                <input type="hidden" id="position-description-en" required>
                            </div>
                            <div class="form-group">
                                <label for="position-requirements-en" class="form-label">Requirements (English) *</label>
                                <div id="position-requirements-editor-en" class="quill-editor"></div>
                                <input type="hidden" id="position-requirements-en" required>
                            </div>
                        </div>
                        
                        <!-- Japanese Content -->
                        <div class="language-content" data-lang="ja">
                            <div class="form-group">
                                <label for="position-role-ja" class="form-label">役職/ポジション名 (Japanese)</label>
                                <input 
                                    type="text" 
                                    id="position-role-ja" 
                                    class="form-input" 
                                    placeholder="例: 作画監督"
                                >
                            </div>
                            <div class="form-group">
                                <label for="position-description-ja" class="form-label">説明 (Japanese)</label>
                                <div id="position-description-editor-ja" class="quill-editor"></div>
                                <input type="hidden" id="position-description-ja">
                            </div>
                            <div class="form-group">
                                <label for="position-requirements-ja" class="form-label">要件 (Japanese)</label>
                                <div id="position-requirements-editor-ja" class="quill-editor"></div>
                                <input type="hidden" id="position-requirements-ja">
                            </div>
                        </div>
                        
                        <!-- Chinese Content -->
                        <div class="language-content" data-lang="zh">
                            <div class="form-group">
                                <label for="position-role-zh" class="form-label">职位/岗位名称 (Chinese)</label>
                                <input 
                                    type="text" 
                                    id="position-role-zh" 
                                    class="form-input" 
                                    placeholder="例如: 动画导演"
                                >
                            </div>
                            <div class="form-group">
                                <label for="position-description-zh" class="form-label">描述 (Chinese)</label>
                                <div id="position-description-editor-zh" class="quill-editor"></div>
                                <input type="hidden" id="position-description-zh">
                            </div>
                            <div class="form-group">
                                <label for="position-requirements-zh" class="form-label">要求 (Chinese)</label>
                                <div id="position-requirements-editor-zh" class="quill-editor"></div>
                                <input type="hidden" id="position-requirements-zh">
                            </div>
                        </div>
                        
                        <!-- Korean Content -->
                        <div class="language-content" data-lang="ko">
                            <div class="form-group">
                                <label for="position-role-ko" class="form-label">직책명 (Korean)</label>
                                <input 
                                    type="text" 
                                    id="position-role-ko" 
                                    class="form-input" 
                                    placeholder="예: 애니메이션 감독"
                                >
                            </div>
                            <div class="form-group">
                                <label for="position-description-ko" class="form-label">설명 (Korean)</label>
                                <div id="position-description-editor-ko" class="quill-editor"></div>
                                <input type="hidden" id="position-description-ko">
                            </div>
                            <div class="form-group">
                                <label for="position-requirements-ko" class="form-label">요구사항 (Korean)</label>
                                <div id="position-requirements-editor-ko" class="quill-editor"></div>
                                <input type="hidden" id="position-requirements-ko">
                            </div>
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
    
    // Wait a moment for DOM to be ready, then initialize Quill
    setTimeout(() => {
        // Check if Quill is loaded
        if (typeof Quill === 'undefined') {
            showNotification('Quill editor library is not loaded. Please refresh the page.', 'error');
            switchPage('applications');
            return;
        }
        
        try {
            const container = document.getElementById('create-position-form');
            if (container) {
                initializeQuillEditors(container.parentElement);
                initializeEmploymentTypeDropdown(container.parentElement);
                // Setup form handlers (submit, cancel)
                const form = document.getElementById('create-position-form');
                const cancelBtn = document.getElementById('cancel-position-btn');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        handleCreatePosition(window.positionEditors || {});
                    });
                }
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => switchPage('positions'));
                }
            }
        } catch (error) {
            console.error('Error initializing Quill editors:', error);
            showNotification('Error initializing editors. Please try again.', 'error');
            switchPage('applications');
        }
    }, 100);
}

// Initialize Quill Editors in Container (works for both modal and page)
function initializeQuillEditors(container) {
    const editors = {};
    
    // Initialize Quill editors for each language
    const languages = ['en', 'ja', 'zh', 'ko'];
    const placeholders = {
        en: { description: 'Enter position description...', requirements: 'Enter requirements...' },
        ja: { description: '説明を入力...', requirements: '要件を入力...' },
        zh: { description: '输入描述...', requirements: '输入要求...' },
        ko: { description: '직책 설명을 입력하세요...', requirements: '요구사항을 입력하세요...' }
    };
    
    languages.forEach(lang => {
        const p = placeholders[lang] || placeholders.en;
        // Description editor
        const descEditorId = `#position-description-editor-${lang}`;
        const descEditorEl = container.querySelector(descEditorId);
        if (descEditorEl) {
            editors[`description-${lang}`] = new Quill(descEditorId, {
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
                placeholder: p.description
            });
        }
        
        // Requirements editor
        const reqEditorId = `#position-requirements-editor-${lang}`;
        const reqEditorEl = container.querySelector(reqEditorId);
        if (reqEditorEl) {
            editors[`requirements-${lang}`] = new Quill(reqEditorId, {
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
                placeholder: p.requirements
            });
        }
    });
    
    // Store editors globally for form submission
    window.positionEditors = editors;
    
    // Initialize language tabs
    initializeLanguageTabs(container);
    
    // Handle image uploads in all Quill editors
    languages.forEach(lang => {
        const descEditor = editors[`description-${lang}`];
        const reqEditor = editors[`requirements-${lang}`];
        
        if (descEditor) {
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
                            const range = descEditor.getSelection(true);
                            descEditor.insertEmbed(range.index, 'image', reader.result);
                        };
                        reader.readAsDataURL(file);
                    }
                };
            };
            descEditor.getModule('toolbar').addHandler('image', imageHandler);
        }
        
        if (reqEditor) {
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
                            const range = reqEditor.getSelection(true);
                            reqEditor.insertEmbed(range.index, 'image', reader.result);
                        };
                        reader.readAsDataURL(file);
                    }
                };
            };
            reqEditor.getModule('toolbar').addHandler('image', imageHandler);
        }
    });
    
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
    
    // Store editors globally for form submission (already set above)
}

// Initialize Employment Type Dropdown
function initializeEmploymentTypeDropdown(container) {
    const employmentTypeBtn = container.querySelector('#position-employment-type-btn');
    const employmentTypeDropdown = container.querySelector('#position-employment-type-dropdown');
    const employmentTypeText = container.querySelector('#position-employment-type-text');
    const employmentTypeHidden = container.querySelector('#position-employment-type');
    
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

// Initialize Language Tabs
function initializeLanguageTabs(container) {
    const languageTabs = container.querySelectorAll('.language-tab');
    const languageContents = container.querySelectorAll('.language-content');
    
    languageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const lang = tab.dataset.lang;
            
            // Update active tab
            languageTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            languageContents.forEach(content => {
                content.classList.remove('active');
                if (content.dataset.lang === lang) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Setup position form submit, cancel, and other handlers
function setupPositionFormHandlers() {
    const form = document.getElementById('create-position-form');
    const cancelBtn = document.getElementById('cancel-position-btn');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const editors = window.positionEditors || {};
            handleCreatePosition(editors);
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            switchPage('positions');
        });
    }
}

// Handle Create Position Form Submission
async function handleCreatePosition(editors) {
    const messageDiv = document.getElementById('create-position-message');
    const submitBtn = document.getElementById('submit-position-btn');
    const form = document.getElementById('create-position-form');
    
    // Get translations for all languages
    const translations = {};
    const languages = ['en', 'ja', 'zh', 'ko'];
    
    languages.forEach(lang => {
        const roleEl = document.getElementById(`position-role-${lang}`);
        const descEditor = editors[`description-${lang}`];
        const reqEditor = editors[`requirements-${lang}`];
        
        if (roleEl && descEditor && reqEditor) {
            const role = roleEl.value.trim();
            const description = descEditor.root.innerHTML;
            const requirements = reqEditor.root.innerHTML;
            
            // Only add if at least role is provided
            if (role || (description && description !== '<p><br></p>') || (requirements && requirements !== '<p><br></p>')) {
                translations[lang] = {
                    role: role || '',
                    description: description || '',
                    requirements: requirements || ''
                };
            }
        }
    });
    
    // Validate - English is required
    if (!translations.en || !translations.en.role) {
        messageDiv.innerHTML = '<div class="form-message error">English role/position title is required</div>';
        return;
    }
    
    if (!translations.en.description || translations.en.description === '<p><br></p>') {
        messageDiv.innerHTML = '<div class="form-message error">English description is required</div>';
        return;
    }
    
    if (!translations.en.requirements || translations.en.requirements === '<p><br></p>') {
        messageDiv.innerHTML = '<div class="form-message error">English requirements are required</div>';
        return;
    }
    
    const payValue = document.getElementById('position-pay').value;
    const currency = document.getElementById('position-currency').value;
    const scheduledDate = document.getElementById('position-scheduled-date').value;
    const startDate = document.getElementById('position-start-date').value;
    const endDate = document.getElementById('position-end-date').value;
    
    const formData = {
        branch: document.getElementById('position-branch').value,
        jobType: document.getElementById('position-job-type').value,
        employmentType: document.getElementById('position-employment-type').value,
        pay: payValue ? formatPayWithCurrency(payValue, currency) : null,
        currency: currency,
        scheduled_date: scheduledDate || null,
        start_date: startDate || null,
        end_date: endDate || null,
        translations: translations
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
            showNotification('Position created successfully!', 'success');
            setTimeout(() => {
                // Navigate back to applications page
                switchPage('applications');
                loadPositions(); // Refresh positions list
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
    
    // Get filter values
    const typeFilter = document.getElementById('positions-type-filter')?.value || 'all';
    const branchFilter = document.getElementById('positions-branch-filter')?.value || 'all';
    const employmentFilter = document.getElementById('positions-employment-filter')?.value || 'all';
    const searchInput = document.getElementById('positions-search');
    const searchQuery = searchInput?.value.trim() || '';
    
    // If API bypass is enabled, use example data immediately
    if (apiBypass) {
        let examplePositions = getExamplePositions();
        
        // Apply filters
        if (typeFilter !== 'all') {
            examplePositions = examplePositions.filter(pos => pos.jobType === typeFilter);
        }
        
        if (branchFilter !== 'all') {
            examplePositions = examplePositions.filter(pos => pos.branch === branchFilter);
        }
        
        if (employmentFilter !== 'all') {
            examplePositions = examplePositions.filter(pos => pos.employmentType === employmentFilter);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            examplePositions = examplePositions.filter(pos => 
                pos.role.toLowerCase().includes(query) ||
                pos.branch.toLowerCase().includes(query) ||
                (pos.description && stripHtml(pos.description).toLowerCase().includes(query))
            );
        }
        
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
// Render Client Management Page
function renderClientManagementPage() {
    const otherPages = document.getElementById('other-pages');
    
    // Load data from localStorage
    const ambassadorAnnouncements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
    const kanbanCards = JSON.parse(localStorage.getItem('vilostudios_marketing_kanban') || '[]');
    const crmClients = JSON.parse(localStorage.getItem('vilostudios_crm_clients') || '[]');
    const clientMeetings = JSON.parse(localStorage.getItem('vilostudios_client_meetings') || '{}');
    const expandedClient = localStorage.getItem('vilostudios_expanded_client') || null;
    
    otherPages.innerHTML = `
        <div class="crm-page-container">
            <!-- CRM Tabs Header -->
            <div class="crm-tabs-header">
                <div class="crm-tabs">
                    <button type="button" class="crm-tab active" data-crm-tab="clients">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Clients
                    </button>
                    <button type="button" class="crm-tab" data-crm-tab="scheduler">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Scheduler
                    </button>
                    <button type="button" class="crm-tab" data-crm-tab="kanban">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="18" rx="1"></rect>
                            <rect x="14" y="3" width="7" height="12" rx="1"></rect>
                        </svg>
                        Kanban
                    </button>
                    <button type="button" class="crm-tab" data-crm-tab="ambassadors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        Ambassadors
                    </button>
                </div>
            </div>
            
            <!-- CRM Tab Contents -->
            <div class="crm-tab-contents">
                <!-- Clients Tab -->
                <div class="crm-tab-content active" data-crm-content="clients">
                    <div class="crm-content-header">
                        <div>
                            <h2 class="crm-content-title">Clients</h2>
                            <p class="crm-content-subtitle">Manage client relationships and meetings</p>
                        </div>
                        <button class="btn-primary" onclick="showAddClientModal()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Client
                        </button>
                    </div>
                
                <div class="client-folders-container">
                    ${crmClients.length === 0 ? '<p class="empty-state">No clients yet. Add one to get started!</p>' : ''}
                    ${crmClients.map((client, index) => {
                        const clientId = client.id || `client-${index}`;
                        const meetings = clientMeetings[clientId] || [];
                        const isExpanded = expandedClient === clientId;
                        return `
                            <div class="client-folder ${isExpanded ? 'expanded' : ''}" data-client-id="${clientId}">
                                <div class="client-folder-header" onclick="toggleClientFolder('${clientId}')">
                                    <div class="folder-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div class="folder-info">
                                        <h3 class="folder-name">${escapeHtml(client.name)}</h3>
                                        <span class="folder-meta">${escapeHtml(client.company || 'No company')} • ${meetings.length} meeting${meetings.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div class="folder-actions">
                                        <span class="status-badge status-${client.status || 'active'}">${client.status || 'active'}</span>
                                        <button class="btn-icon" onclick="event.stopPropagation(); editClient(${index})" title="Edit Client">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button class="btn-icon" onclick="event.stopPropagation(); showAddMeetingModal('${clientId}')" title="Add Meeting">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </button>
                                        <button class="btn-icon" onclick="event.stopPropagation(); deleteClient(${index})" title="Delete Client">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="folder-chevron">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                <div class="client-folder-content" style="display: ${isExpanded ? 'block' : 'none'};">
                                    <div class="folder-contacts">
                                        <h4>Contact Information</h4>
                                        <div class="contacts-grid">
                                            ${client.email ? `
                                                <div class="contact-item">
                                                    <div class="contact-icon email">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                            <polyline points="22,6 12,13 2,6"></polyline>
                                                        </svg>
                                                    </div>
                                                    <div class="contact-info">
                                                        <span class="contact-label">Email</span>
                                                        <a href="mailto:${escapeHtml(client.email)}" class="contact-value">${escapeHtml(client.email)}</a>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            ${client.discord ? `
                                                <div class="contact-item">
                                                    <div class="contact-icon discord">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                                        </svg>
                                                    </div>
                                                    <div class="contact-info">
                                                        <span class="contact-label">Discord</span>
                                                        <span class="contact-value">${escapeHtml(client.discord)}</span>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            ${client.linkedin ? `
                                                <div class="contact-item">
                                                    <div class="contact-icon linkedin">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                        </svg>
                                                    </div>
                                                    <div class="contact-info">
                                                        <span class="contact-label">LinkedIn</span>
                                                        <a href="${escapeHtml(client.linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-value">View Profile</a>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            ${!client.email && !client.discord && !client.linkedin ? '<p class="empty-state-small">No contact information added. Edit client to add contacts.</p>' : ''}
                                        </div>
                                    </div>
                                    
                                    <div class="folder-meetings">
                                        <h4>Meetings</h4>
                                        ${meetings.length === 0 ? '<p class="empty-state-small">No meetings yet. Click the + button to add one.</p>' : ''}
                                        ${meetings.map((meeting, meetingIndex) => `
                                            <div class="meeting-item">
                                                <div class="meeting-icon">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                                    </svg>
                                                </div>
                                                <div class="meeting-info">
                                                    <h5>${escapeHtml(meeting.title)}</h5>
                                                    <p>${new Date(meeting.date).toLocaleDateString()} ${meeting.time || ''}</p>
                                                    ${meeting.description ? `<p class="meeting-description">${escapeHtml(meeting.description)}</p>` : ''}
                                                </div>
                                                <button class="btn-icon" onclick="deleteMeeting('${clientId}', ${meetingIndex})" title="Delete Meeting">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                    
                                    <div class="folder-documents">
                                        <div class="folder-section-header">
                                            <h4>Documents</h4>
                                            <button class="btn-icon-small" onclick="showUploadDocumentModal('${clientId}')" title="Upload Document">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                </svg>
                                            </button>
                                        </div>
                                        ${(() => {
                                            const clientDocuments = JSON.parse(localStorage.getItem('vilostudios_client_documents') || '{}');
                                            const docs = clientDocuments[clientId] || [];
                                            if (docs.length === 0) {
                                                return '<p class="empty-state-small">No documents yet. Click the + button to upload one.</p>';
                                            }
                                            return docs.map((doc, docIndex) => `
                                                <div class="document-item">
                                                    <div class="document-icon">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                                            <polyline points="13 2 13 9 20 9"></polyline>
                                                        </svg>
                                                    </div>
                                                    <div class="document-info">
                                                        <h5>${escapeHtml(doc.name)}</h5>
                                                        <div class="document-meta">
                                                            <span class="document-category">${escapeHtml(doc.category || 'Uncategorized')}</span>
                                                            <span class="document-size">${(doc.size / 1024).toFixed(1)} KB</span>
                                                            <span class="document-date">${new Date(doc.uploaded_at).toLocaleDateString()}</span>
                                                            ${doc.version ? `<span class="document-version">v${doc.version}</span>` : ''}
                                                        </div>
                                                        ${doc.description ? `<p class="document-description">${escapeHtml(doc.description)}</p>` : ''}
                                                    </div>
                                                    <div class="document-actions">
                                                        <button class="btn-icon" onclick="downloadDocument('${clientId}', ${docIndex})" title="Download">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                <polyline points="7 10 12 15 17 10"></polyline>
                                                                <line x1="12" y1="15" x2="12" y2="3"></line>
                                                            </svg>
                                                        </button>
                                                        <button class="btn-icon" onclick="deleteDocument('${clientId}', ${docIndex})" title="Delete">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            `).join('');
                                        })()}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                </div>
                
                <!-- Scheduler Tab -->
                <div class="crm-tab-content" data-crm-content="scheduler">
                    <div class="crm-content-header">
                        <div>
                            <h2 class="crm-content-title">Scheduler</h2>
                            <p class="crm-content-subtitle">Track deadlines and manage your calendar</p>
                        </div>
                        <div class="crm-content-actions">
                            <div class="view-toggle">
                                <button class="view-toggle-btn active" id="calendar-view-btn" onclick="switchCalendarView('calendar')">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    Calendar
                                </button>
                                <button class="view-toggle-btn" id="timeline-view-btn" onclick="switchCalendarView('timeline')">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="12" y1="2" x2="12" y2="22"></line>
                                        <polyline points="19 15 12 22 5 15"></polyline>
                                    </svg>
                                    Timeline
                                </button>
                            </div>
                            <button class="btn-primary" onclick="showAddDeadlineModal()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Deadline
                            </button>
                        </div>
                    </div>
                    <div class="calendar-container">
                        <div class="calendar-view" id="calendar-view">
                            <div class="calendar-timeline" id="calendar-timeline">
                                <div class="timeline-header">
                                    <button class="btn-nav" id="prev-month">&larr;</button>
                                    <h3 id="current-month-year"></h3>
                                    <button class="btn-nav" id="next-month">&rarr;</button>
                                </div>
                                <div class="calendar-grid" id="calendar-grid"></div>
                            </div>
                        </div>
                        <div class="timeline-view" id="timeline-view" style="display: none;">
                            <div class="timeline-filters">
                                <select id="timeline-filter-type" class="form-select" onchange="updateTimelineView()">
                                    <option value="all">All Types</option>
                                    <option value="deadline">Deadlines</option>
                                    <option value="kanban">Kanban Cards</option>
                                    <option value="announcement">Announcements</option>
                                    <option value="meeting">Meetings</option>
                                </select>
                                <select id="timeline-filter-priority" class="form-select" onchange="updateTimelineView()">
                                    <option value="all">All Priorities</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div class="timeline-list" id="timeline-list"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Kanban Tab -->
                <div class="crm-tab-content" data-crm-content="kanban">
                    <div class="crm-content-header">
                        <div>
                            <h2 class="crm-content-title">Marketing Kanban</h2>
                            <p class="crm-content-subtitle">Track marketing progress through the workflow pipeline</p>
                        </div>
                    </div>
                    <div class="kanban-board" id="marketing-kanban-board">
                        <div class="kanban-column">
                            <div class="kanban-column-header">
                                <h3>Assets & Branding</h3>
                                <span class="kanban-count" id="count-assets_branding">0</span>
                            </div>
                            <div class="kanban-column-body" id="column-assets_branding"></div>
                            <button class="btn-add-card" onclick="addKanbanCard('assets_branding')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Card
                            </button>
                        </div>
                        <div class="kanban-column">
                            <div class="kanban-column-header">
                                <h3>Research & Ideas</h3>
                                <span class="kanban-count" id="count-research_ideas">0</span>
                            </div>
                            <div class="kanban-column-body" id="column-research_ideas"></div>
                            <button class="btn-add-card" onclick="addKanbanCard('research_ideas')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Card
                            </button>
                        </div>
                        <div class="kanban-column">
                            <div class="kanban-column-header">
                                <h3>Scripts/Content</h3>
                                <span class="kanban-count" id="count-scripts_content">0</span>
                            </div>
                            <div class="kanban-column-body" id="column-scripts_content"></div>
                            <button class="btn-add-card" onclick="addKanbanCard('scripts_content')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Card
                            </button>
                        </div>
                        <div class="kanban-column">
                            <div class="kanban-column-header">
                                <h3>Recordings</h3>
                                <span class="kanban-count" id="count-recordings">0</span>
                            </div>
                            <div class="kanban-column-body" id="column-recordings"></div>
                            <button class="btn-add-card" onclick="addKanbanCard('recordings')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Card
                            </button>
                        </div>
                        <div class="kanban-column">
                            <div class="kanban-column-header">
                                <h3>Editing</h3>
                                <span class="kanban-count" id="count-editing">0</span>
                            </div>
                            <div class="kanban-column-body" id="column-editing"></div>
                            <button class="btn-add-card" onclick="addKanbanCard('editing')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Card
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Ambassadors Tab -->
                <div class="crm-tab-content" data-crm-content="ambassadors">
                    <div class="crm-content-header">
                        <div>
                            <h2 class="crm-content-title">Ambassador Network</h2>
                            <p class="crm-content-subtitle">Communicate with ambassadors and post announcements</p>
                        </div>
                        <div class="notification-center-wrapper">
                            <button class="notification-bell-btn" id="notification-bell-btn" onclick="toggleNotificationCenter()" title="Notifications">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                                <span class="notification-badge" id="notification-count" style="display: none;">0</span>
                            </button>
                            <div class="notification-center" id="notification-center" style="display: none;">
                                <div class="notification-center-header">
                                    <h3>Notifications</h3>
                                    <button class="btn-icon-small" onclick="toggleNotificationCenter()" title="Close">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div class="notification-center-content" id="notification-center-content"></div>
                            </div>
                        </div>
                    </div>
                
                <div class="updates-container">
                    <div class="updates-form">
                        <h3>Post New Update</h3>
                        <form id="ambassador-announcement-form">
                            <div class="form-group">
                                <label for="announcement-title" class="form-label">Title</label>
                                <input type="text" id="announcement-title" class="form-input" placeholder="e.g., We need an ambassador to speak on video about the future of anime" required>
                            </div>
                            <div class="form-group">
                                <label for="announcement-content" class="form-label">Content</label>
                                <textarea id="announcement-content" class="form-input" rows="4" placeholder="Enter announcement details..." required></textarea>
                            </div>
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label for="announcement-priority" class="form-label">Priority</label>
                                    <select id="announcement-priority" class="form-select">
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="announcement-deadline" class="form-label">Deadline</label>
                                    <input type="date" id="announcement-deadline" class="form-input">
                                </div>
                            </div>
                            <button type="submit" class="btn-primary">Post Update</button>
                        </form>
                    </div>
                    
                    <div class="updates-list">
                        <h3>Recent Updates</h3>
                        <div id="announcements-list" class="announcements-container">
                            ${ambassadorAnnouncements.length === 0 ? '<p class="empty-state">No updates yet. Post one to get started!</p>' : ''}
                            ${ambassadorAnnouncements.map((announcement, index) => {
                                let deadlineDate = null;
                                let isOverdue = false;
                                if (announcement.deadline) {
                                    deadlineDate = new Date(announcement.deadline);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    deadlineDate.setHours(0, 0, 0, 0);
                                    isOverdue = deadlineDate < today;
                                }
                                return `
                                <div class="announcement-card priority-${announcement.priority}">
                                    <div class="announcement-header">
                                        <h4>${escapeHtml(announcement.title)}</h4>
                                        <span class="priority-badge priority-${announcement.priority}">${announcement.priority}</span>
                                    </div>
                                    <p class="announcement-content">${escapeHtml(announcement.content)}</p>
                                    <div class="announcement-meta">
                                        ${announcement.madeBy || announcement.madeByEmail ? `
                                            <div class="announcement-meta-item announcement-author-item">
                                                ${announcement.madeByProfilePic ? `
                                                    <img src="${escapeHtml(announcement.madeByProfilePic)}" alt="${escapeHtml(announcement.madeBy || 'User')}" class="announcement-author-avatar">
                                                ` : `
                                                    <div class="announcement-author-avatar-initial">${(announcement.madeBy || 'U').charAt(0).toUpperCase()}</div>
                                                `}
                                                <div class="announcement-author">
                                                    <span class="author-name">${escapeHtml(announcement.madeBy || 'Unknown')}</span>
                                                    ${announcement.madeByEmail ? `<span class="author-email">${escapeHtml(announcement.madeByEmail)}</span>` : ''}
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${deadlineDate ? `
                                            <div class="announcement-meta-item ${isOverdue ? 'overdue' : ''}">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                <span>Deadline: ${deadlineDate.toLocaleDateString()}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="announcement-footer">
                                        <span class="announcement-date">Posted: ${new Date(announcement.date).toLocaleDateString()}</span>
                                        <button class="btn-icon" onclick="deleteAnnouncement(${index})" title="Delete">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        
        <!-- Modals -->
        <div id="add-deadline-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Deadline</h3>
                    <button class="modal-close" onclick="closeModal('add-deadline-modal')">&times;</button>
                </div>
                <form id="add-deadline-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="form-input" id="deadline-title" required>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" class="form-input" id="deadline-date" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-input" id="deadline-description" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Add Deadline</button>
                </form>
            </div>
        </div>
        
        <div id="add-client-modal" class="modal" style="display: none;">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>Add New Client</h3>
                    <button class="modal-close" onclick="closeModal('add-client-modal')">&times;</button>
                </div>
                <form id="add-client-form" class="client-form">
                    <div class="form-section">
                        <h4 class="form-section-title">Basic Information</h4>
                        <div class="form-group">
                            <label for="client-name" class="form-label">Client Name *</label>
                            <input type="text" class="form-input" id="client-name" required placeholder="Enter client name">
                        </div>
                        <div class="form-group">
                            <label for="client-company" class="form-label">Company</label>
                            <input type="text" class="form-input" id="client-company" placeholder="Enter company name">
                        </div>
                        <div class="form-group">
                            <label for="client-status" class="form-label">Status</label>
                            <select class="form-select" id="client-status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="prospect">Prospect</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4 class="form-section-title">Contact Information</h4>
                        <div class="form-group">
                            <label for="client-email" class="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                Email Address
                            </label>
                            <input type="email" class="form-input" id="client-email" placeholder="client@example.com">
                        </div>
                        <div class="form-group">
                            <label for="client-discord" class="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                                Discord Username
                            </label>
                            <input type="text" class="form-input" id="client-discord" placeholder="username#1234">
                        </div>
                        <div class="form-group">
                            <label for="client-linkedin" class="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn Profile URL
                            </label>
                            <input type="url" class="form-input" id="client-linkedin" placeholder="https://linkedin.com/in/username">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('add-client-modal')">Cancel</button>
                        <button type="submit" class="btn-primary">Add Client</button>
                    </div>
                </form>
            </div>
        </div>
        
        <div id="edit-client-modal" class="modal" style="display: none;">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>Edit Client</h3>
                    <button class="modal-close" onclick="closeModal('edit-client-modal')">&times;</button>
                </div>
                <form id="edit-client-form" class="client-form">
                    <div class="form-section">
                        <h4 class="form-section-title">Basic Information</h4>
                        <div class="form-group">
                            <label for="edit-client-name" class="form-label">Client Name *</label>
                            <input type="text" class="form-input" id="edit-client-name" required placeholder="Enter client name">
                        </div>
                        <div class="form-group">
                            <label for="edit-client-company" class="form-label">Company</label>
                            <input type="text" class="form-input" id="edit-client-company" placeholder="Enter company name">
                        </div>
                        <div class="form-group">
                            <label for="edit-client-status" class="form-label">Status</label>
                            <select class="form-select" id="edit-client-status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="prospect">Prospect</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4 class="form-section-title">Contact Information</h4>
                        <div class="form-group">
                            <label for="edit-client-email" class="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                Email Address
                            </label>
                            <input type="email" class="form-input" id="edit-client-email" placeholder="client@example.com">
                        </div>
                        <div class="form-group">
                            <label for="edit-client-discord" class="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                                Discord Username
                            </label>
                            <input type="text" class="form-input" id="edit-client-discord" placeholder="username#1234">
                        </div>
                        <div class="form-group">
                            <label for="edit-client-linkedin" class="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn Profile URL
                            </label>
                            <input type="url" class="form-input" id="edit-client-linkedin" placeholder="https://linkedin.com/in/username">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('edit-client-modal')">Cancel</button>
                        <button type="submit" class="btn-primary">Save Changes</button>
                    </div>
                    <input type="hidden" id="edit-client-index">
                </form>
            </div>
        </div>
        
        <div id="add-meeting-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Meeting</h3>
                    <button class="modal-close" onclick="closeModal('add-meeting-modal')">&times;</button>
                </div>
                <form id="add-meeting-form">
                    <div class="form-group">
                        <label>Meeting Title</label>
                        <input type="text" class="form-input" id="meeting-title" required>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" class="form-input" id="meeting-date" required>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" class="form-input" id="meeting-time">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-input" id="meeting-description" rows="3"></textarea>
                    </div>
                    <input type="hidden" id="meeting-client-id">
                    <button type="submit" class="btn-primary">Add Meeting</button>
                </form>
            </div>
        </div>
        
        <div id="add-kanban-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="kanban-modal-title">Add Kanban Card</h3>
                    <button class="modal-close" onclick="closeModal('add-kanban-modal')">&times;</button>
                </div>
                <form id="add-kanban-form">
                    <div class="form-group">
                        <label>Title *</label>
                        <input type="text" class="form-input" id="kanban-title" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-input" id="kanban-description" rows="3"></textarea>
                    </div>
                    <div class="form-group-row">
                        <div class="form-group">
                            <label>Priority</label>
                            <select class="form-select" id="kanban-priority">
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Assignee</label>
                            <input type="text" class="form-input" id="kanban-assignee" placeholder="Name or email">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Deadline</label>
                        <input type="date" class="form-input" id="kanban-deadline">
                    </div>
                    <div class="form-group">
                        <label>Attachments</label>
                        <div class="file-upload-area" id="kanban-file-upload-area">
                            <input type="file" id="kanban-file-input" multiple style="display: none;" accept="*/*">
                            <div class="file-upload-placeholder">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                </svg>
                                <span>Click to upload files or drag and drop</span>
                            </div>
                            <div class="file-list" id="kanban-file-list"></div>
                        </div>
                    </div>
                    <input type="hidden" id="kanban-column">
                    <input type="hidden" id="kanban-card-id">
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('add-kanban-modal')">Cancel</button>
                        <button type="submit" class="btn-primary" id="kanban-submit-btn">Add Card</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Initialize all components
    initializeCRMTabs();
    initializeAmbassadorNetwork();
    initializeKanbanBoard();
    setupKanbanForm();
    initializeCalendar();
    initializeCRM();
}

// Initialize CRM Tabs
function initializeCRMTabs() {
    const container = document.querySelector('.crm-page-container');
    if (!container) return;
    
    const tabs = container.querySelectorAll('.crm-tab');
    const contents = container.querySelectorAll('.crm-tab-content');
    
    // Ensure only active tab is visible on load
    contents.forEach(content => {
        const isActive = content.classList.contains('active');
        content.style.display = isActive ? 'block' : 'none';
    });
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.crmTab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            contents.forEach(content => {
                const isTarget = content.dataset.crmContent === targetTab;
                content.classList.toggle('active', isTarget);
                content.style.display = isTarget ? 'block' : 'none';
            });
            
            if (targetTab === 'kanban') {
                initializeKanbanBoard();
            } else if (targetTab === 'scheduler') {
                initializeCalendar();
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

// Initialize Ambassador Network
function initializeAmbassadorNetwork() {
    const form = document.getElementById('ambassador-announcement-form');
    if (form) {
        // Remove any existing listeners to prevent duplicates
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        const freshForm = document.getElementById('ambassador-announcement-form');
        freshForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('announcement-title').value.trim();
            const content = document.getElementById('announcement-content').value.trim();
            const priority = document.getElementById('announcement-priority').value;
            const deadline = document.getElementById('announcement-deadline').value;
            
            if (!title || !content) {
                if (typeof showNotification === 'function') {
                    showNotification('Please fill in both title and content fields.', 'error');
                } else {
                    alert('Please fill in both title and content fields.');
                }
                return;
            }
            
            // Automatically get current user's name, email, and profile picture (matching dashboard)
            const currentUser = JSON.parse(localStorage.getItem('vilostudios_user') || '{}');
            // Use the same userName variable that's used in the dashboard
            const madeBy = userName || currentUser.name || currentUser.email?.split('@')[0] || 'Unknown';
            const madeByEmail = userEmail || currentUser.email || null;
            const madeByProfilePic = localStorage.getItem('vilostudios_profile_pic') || null;
            
            const announcements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
            announcements.unshift({
                id: `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title,
                content,
                priority,
                deadline: deadline || null,
                madeBy: madeBy,
                madeByEmail: madeByEmail,
                madeByProfilePic: madeByProfilePic,
                date: new Date().toISOString(),
                readBy: []
            });
            localStorage.setItem('vilostudios_ambassador_announcements', JSON.stringify(announcements));
            
            // Update notification badge
            updateNotificationBadge();
            
            // Show success notification
            if (typeof showNotification === 'function') {
                showNotification('Announcement posted successfully!', 'success');
            }
            
            // Reset form
            freshForm.reset();
            document.getElementById('announcement-priority').value = 'medium';
            
            // Re-render to show new announcement
            renderClientManagementPage();
            
            // Scroll to the updates list after a brief delay to ensure DOM is updated
            setTimeout(() => {
                const updatesList = document.querySelector('.updates-list');
                if (updatesList) {
                    updatesList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Highlight the new announcement briefly
                    const firstCard = updatesList.querySelector('.announcement-card');
                    if (firstCard) {
                        firstCard.style.animation = 'pulse 0.5s ease-in-out';
                        setTimeout(() => {
                            firstCard.style.animation = '';
                        }, 500);
                    }
                }
            }, 100);
        });
    }
    
    // Call notification functions if they exist
    if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge();
    }
    if (typeof loadNotificationCenter === 'function') {
        loadNotificationCenter();
    }
}

// Notification badge and center functions
function updateNotificationBadge() {
    const badge = document.getElementById('notification-count');
    if (!badge) {
        console.log('[DEBUG] Notification badge element not found');
        return;
    }
    
    const announcements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
    const currentUserEmail = userEmail;
    const unreadCount = announcements.filter(ann => {
        return !ann.readBy || !ann.readBy.includes(currentUserEmail);
    }).length;
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
        badge.style.display = 'flex';
        console.log('[DEBUG] Notification badge updated', {unreadCount});
    } else {
        badge.style.display = 'none';
    }
}

function loadNotificationCenter() {
    const centerContent = document.getElementById('notification-center-content');
    if (!centerContent) return;
    
    const announcements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
    const currentUserEmail = userEmail;
    
    // Sort by date (newest first)
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    if (sortedAnnouncements.length === 0) {
        centerContent.innerHTML = '<div class="empty-state">No announcements yet.</div>';
        return;
    }
    
    centerContent.innerHTML = sortedAnnouncements.map(announcement => {
        const isRead = announcement.readBy && announcement.readBy.includes(currentUserEmail);
        const deadlineDate = announcement.deadline ? new Date(announcement.deadline) : null;
        const isOverdue = deadlineDate && deadlineDate < new Date();
        
        return `
            <div class="notification-item ${isRead ? 'read' : 'unread'}" data-announcement-id="${announcement.id}">
                <div class="notification-item-header">
                    <h4>${escapeHtml(announcement.title)}</h4>
                    ${!isRead ? '<span class="notification-priority-indicator priority-' + announcement.priority + '"></span>' : ''}
                </div>
                <p class="notification-content">${escapeHtml(announcement.content)}</p>
                <div class="notification-meta">
                    ${announcement.madeBy ? `<span>By: ${escapeHtml(announcement.madeBy)}</span>` : ''}
                    ${deadlineDate ? `<span class="${isOverdue ? 'overdue' : ''}">Deadline: ${deadlineDate.toLocaleDateString()}</span>` : ''}
                    <span>${new Date(announcement.date).toLocaleDateString()}</span>
                </div>
                ${!isRead ? `
                    <div class="notification-actions">
                        <button class="btn-secondary btn-small" onclick="markAnnouncementAsRead('${announcement.id}')">Mark as Read</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    updateNotificationBadge();
}

function toggleNotificationCenter() {
    const center = document.getElementById('notification-center');
    if (!center) {
        console.log('[DEBUG] Notification center element not found');
        return;
    }
    
    const isVisible = center.style.display === 'block' || center.classList.contains('show');
    
    if (isVisible) {
        center.style.display = 'none';
        center.classList.remove('show');
    } else {
        // Load notifications before showing
        loadNotificationCenter();
        center.style.display = 'block';
        center.classList.add('show');
    }
}

function markAnnouncementAsRead(announcementId) {
    if (!announcementId) return;
    
    const announcements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
    const currentUserEmail = userEmail;
    
    const announcement = announcements.find(ann => ann.id === announcementId);
    if (announcement) {
        if (!announcement.readBy) {
            announcement.readBy = [];
        }
        if (!announcement.readBy.includes(currentUserEmail)) {
            announcement.readBy.push(currentUserEmail);
            localStorage.setItem('vilostudios_ambassador_announcements', JSON.stringify(announcements));
            updateNotificationBadge();
            // Re-render if on announcements page
            if (document.getElementById('ambassador-announcements-list')) {
                renderAmbassadorAnnouncementsPage();
            }
        }
    }
}

// Delete announcement
function deleteAnnouncement(index) {
    const announcements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
    announcements.splice(index, 1);
    localStorage.setItem('vilostudios_ambassador_announcements', JSON.stringify(announcements));
    renderClientManagementPage();
}

// PA Order translations (en, ja, zh, ko)
const PA_ORDER_TRANSLATIONS = {
    en: {
        title: 'Submit Order',
        subtitle: 'Submit your availability for roles, productions, and pricing. Your order will be sent to orders@vilostudios.com.',
        yourInfo: 'Your Information',
        email: 'Email',
        name: 'Name',
        orderDetails: 'Order Details',
        rolesLabel: 'Roles you want to apply for',
        rolesPlaceholder: 'e.g., Key Animator, Inbetweener, Background Artist',
        productionLabel: 'Production / Project',
        productionPlaceholder: 'e.g., Project Name or type of production',
        pricingLabel: 'Your Pricing / Rate',
        pricingPlaceholder: 'e.g., $X per cut, hourly rate, or negotiable',
        notesLabel: 'Additional Notes',
        notesPlaceholder: 'Any additional details about your availability, experience, or preferences...',
        sendOrder: 'Send Order',
        sending: 'Sending...',
        success: 'Order sent successfully! We will be in touch at ',
        successSuffix: '.',
        error: 'Could not send order. You can email us directly at orders@vilostudios.com with your details.'
    },
    ja: {
        title: 'オーダー送信',
        subtitle: '役職、制作、料金のご希望を送信してください。orders@vilostudios.com に送信されます。',
        yourInfo: 'お客様情報',
        email: 'メールアドレス',
        name: 'お名前',
        orderDetails: 'オーダー詳細',
        rolesLabel: 'ご希望の役職',
        rolesPlaceholder: '例：原画、動画、背景美術',
        productionLabel: '制作・プロジェクト',
        productionPlaceholder: '例：プロジェクト名または制作タイプ',
        pricingLabel: '料金・レート',
        pricingPlaceholder: '例：1カットあたり○○円、時給、要相談',
        notesLabel: '備考',
        notesPlaceholder: '稼働状況、経験、ご希望など…',
        sendOrder: '送信する',
        sending: '送信中...',
        success: 'オーダーを送信しました。',
        successSuffix: '',
        error: '送信できませんでした。orders@vilostudios.com まで直接メールでご連絡ください。'
    },
    zh: {
        title: '提交订单',
        subtitle: '提交您的职位、制作和报价意向。订单将发送至 orders@vilostudios.com。',
        yourInfo: '您的信息',
        email: '邮箱',
        name: '姓名',
        orderDetails: '订单详情',
        rolesLabel: '申请的职位',
        rolesPlaceholder: '例：原画师、动画师、背景美术',
        productionLabel: '制作/项目',
        productionPlaceholder: '例：项目名称或制作类型',
        pricingLabel: '您的报价/费率',
        pricingPlaceholder: '例：每卡XX元、时薪或面议',
        notesLabel: '备注',
        notesPlaceholder: '关于您的档期、经验或偏好的额外说明…',
        sendOrder: '发送订单',
        sending: '发送中...',
        success: '订单已成功发送！我们会通过 ',
        successSuffix: ' 联系您。',
        error: '无法发送订单。请直接发送邮件至 orders@vilostudios.com。'
    },
    ko: {
        title: '주문 제출',
        subtitle: '역할, 제작, 가격에 대한 정보를 제출하세요. orders@vilostudios.com으로 전송됩니다.',
        yourInfo: '귀하의 정보',
        email: '이메일',
        name: '이름',
        orderDetails: '주문 세부정보',
        rolesLabel: '지원 희망 역할',
        rolesPlaceholder: '예: 원화, 동화, 배경 미술',
        productionLabel: '제작 / 프로젝트',
        productionPlaceholder: '예: 프로젝트명 또는 제작 유형',
        pricingLabel: '가격 / 레이트',
        pricingPlaceholder: '예: 컷당 XX원, 시간당 또는 협의',
        notesLabel: '추가 메모',
        notesPlaceholder: '가용 시간, 경력 또는 선호사항에 대한 추가 정보...',
        sendOrder: '주문 보내기',
        sending: '전송 중...',
        success: '주문이 성공적으로 전송되었습니다! ',
        successSuffix: '(으)로 연락드리겠습니다.',
        error: '주문을 보낼 수 없습니다. orders@vilostudios.com으로 직접 이메일을 보내 주세요.'
    }
};

function getPAOrderLang() {
    return localStorage.getItem('vilostudios-pa-order-lang') || 'en';
}

function setPAOrderLang(lang) {
    if (['en', 'ja', 'zh', 'ko'].includes(lang)) {
        localStorage.setItem('vilostudios-pa-order-lang', lang);
    }
}

// Render PA Orders Page (Production Assistants - Talent role)
function renderPAOrdersPage() {
    const otherPages = document.getElementById('other-pages');
    const userData = JSON.parse(localStorage.getItem('vilostudios_user') || '{}');
    const userEmail = userData.email || '';
    const userName = userData.name || userData.username || '';
    const lang = getPAOrderLang();
    const t = PA_ORDER_TRANSLATIONS[lang] || PA_ORDER_TRANSLATIONS.en;
    
    otherPages.innerHTML = `
        <div class="pa-orders-page">
            <div class="pa-orders-header">
                <div class="pa-orders-header-row">
                    <h2 class="pa-orders-title">${t.title}</h2>
                    <div class="pa-order-lang-switcher">
                        <button type="button" class="pa-order-lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
                        <button type="button" class="pa-order-lang-btn ${lang === 'ja' ? 'active' : ''}" data-lang="ja">日本語</button>
                        <button type="button" class="pa-order-lang-btn ${lang === 'zh' ? 'active' : ''}" data-lang="zh">中文</button>
                        <button type="button" class="pa-order-lang-btn ${lang === 'ko' ? 'active' : ''}" data-lang="ko">한국어</button>
                    </div>
                </div>
                <p class="pa-orders-subtitle">${t.subtitle}</p>
            </div>
            
            <form id="pa-order-form" class="pa-order-form">
                <div class="form-section pa-order-section">
                    <h3>${t.yourInfo}</h3>
                    <div class="form-group">
                        <label for="pa-order-email" class="form-label">${t.email} *</label>
                        <input type="email" id="pa-order-email" class="form-input" value="${escapeHtml(userEmail)}" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label for="pa-order-name" class="form-label">${t.name} *</label>
                        <input type="text" id="pa-order-name" class="form-input" value="${escapeHtml(userName)}" required placeholder="">
                    </div>
                </div>
                
                <div class="form-section pa-order-section">
                    <h3>${t.orderDetails}</h3>
                    <div class="form-group">
                        <label for="pa-order-roles" class="form-label">${t.rolesLabel} *</label>
                        <input type="text" id="pa-order-roles" class="form-input" required placeholder="${escapeHtml(t.rolesPlaceholder)}">
                    </div>
                    <div class="form-group">
                        <label for="pa-order-production" class="form-label">${t.productionLabel} *</label>
                        <input type="text" id="pa-order-production" class="form-input" required placeholder="${escapeHtml(t.productionPlaceholder)}">
                    </div>
                    <div class="form-group">
                        <label for="pa-order-pricing" class="form-label">${t.pricingLabel}</label>
                        <input type="text" id="pa-order-pricing" class="form-input" placeholder="${escapeHtml(t.pricingPlaceholder)}">
                    </div>
                    <div class="form-group">
                        <label for="pa-order-notes" class="form-label">${t.notesLabel}</label>
                        <textarea id="pa-order-notes" class="form-input" rows="4" placeholder="${escapeHtml(t.notesPlaceholder)}"></textarea>
                    </div>
                </div>
                
                <div class="pa-order-actions">
                    <button type="submit" class="btn-primary" id="pa-order-submit-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polyline points="22 2 15 22 11 13 2 9 22 2"></polyline>
                        </svg>
                        ${t.sendOrder}
                    </button>
                </div>
            </form>
            
            <div id="pa-order-status" class="pa-order-status" style="display: none;"></div>
        </div>
    `;
    
    const form = document.getElementById('pa-order-form');
    const submitBtn = document.getElementById('pa-order-submit-btn');
    const statusDiv = document.getElementById('pa-order-status');
    
    // Language switcher
    document.querySelectorAll('.pa-order-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setPAOrderLang(btn.dataset.lang);
            renderPAOrdersPage();
        });
    });
    
    if (form && submitBtn && statusDiv) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tCur = PA_ORDER_TRANSLATIONS[getPAOrderLang()] || PA_ORDER_TRANSLATIONS.en;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>' + tCur.sending + '</span>';
            statusDiv.style.display = 'none';
            
            const data = {
                email: document.getElementById('pa-order-email').value.trim(),
                name: document.getElementById('pa-order-name').value.trim(),
                roles: document.getElementById('pa-order-roles').value.trim(),
                production: document.getElementById('pa-order-production').value.trim(),
                pricing: document.getElementById('pa-order-pricing').value.trim() || 'Not specified',
                notes: document.getElementById('pa-order-notes').value.trim() || ''
            };
            
            try {
                const response = await fetch('../../api/pa-orders/send.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json().catch(() => ({}));
                
                if (response.ok && result.success) {
                    statusDiv.className = 'pa-order-status success';
                    statusDiv.textContent = (lang === 'ja' ? tCur.success : tCur.success + data.email + (tCur.successSuffix || '.'));
                    statusDiv.style.display = 'block';
                    form.reset();
                    document.getElementById('pa-order-email').value = data.email;
                    document.getElementById('pa-order-name').value = data.name;
                } else {
                    throw new Error(result.message || 'Failed to send');
                }
            } catch (err) {
                statusDiv.className = 'pa-order-status error';
                statusDiv.textContent = tCur.error;
                statusDiv.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polyline points="22 2 15 22 11 13 2 9 22 2"></polyline></svg> ' + tCur.sendOrder;
            }
        });
    }
}

// Render Ambassador Announcements Page
function renderAmbassadorAnnouncementsPage() {
    const otherPages = document.getElementById('other-pages');
    const announcements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('vilostudios_user') || '{}');
    const currentUserEmail = currentUser.email || userEmail || '';
    
    // Sort by date (newest first)
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Filter options
    const unreadCount = sortedAnnouncements.filter(a => !a.readBy || !a.readBy.includes(currentUserEmail)).length;
    
    otherPages.innerHTML = `
        <div class="ambassador-announcements-page">
            <div class="announcements-page-header">
                <div>
                    <h2 class="page-title">Announcements</h2>
                    <p class="page-subtitle">Stay updated with important announcements from VILOSTUDIOS</p>
                </div>
                <div class="announcements-filters">
                    <select id="announcements-filter-priority" class="form-select" onchange="filterAnnouncements()">
                        <option value="all">All Priorities</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <select id="announcements-filter-status" class="form-select" onchange="filterAnnouncements()">
                        <option value="all">All</option>
                        <option value="unread">Unread (${unreadCount})</option>
                        <option value="read">Read</option>
                    </select>
                </div>
            </div>
            
            <div class="announcements-list" id="ambassador-announcements-list">
                ${sortedAnnouncements.length === 0 ? '<div class="empty-state">No announcements yet.</div>' : ''}
                ${sortedAnnouncements.map(announcement => {
                    const isRead = announcement.readBy && announcement.readBy.includes(currentUserEmail);
                    const deadlineDate = announcement.deadline ? new Date(announcement.deadline) : null;
                    const isOverdue = deadlineDate && deadlineDate < new Date();
                    const isToday = deadlineDate && deadlineDate.toDateString() === new Date().toDateString();
                    
                    return `
                        <div class="announcement-item-card ${isRead ? 'read' : 'unread'}" data-announcement-id="${announcement.id || ''}" data-priority="${announcement.priority || 'medium'}" data-status="${isRead ? 'read' : 'unread'}">
                            <div class="announcement-item-header">
                                <div class="announcement-item-left">
                                    ${!isRead ? '<span class="unread-indicator"></span>' : ''}
                                    <h3 class="announcement-item-title">${escapeHtml(announcement.title)}</h3>
                                </div>
                                <div class="announcement-item-right">
                                    <span class="priority-badge priority-${announcement.priority || 'medium'}">${announcement.priority || 'medium'}</span>
                                    ${!isRead ? `
                                        <button class="btn-mark-read-small" onclick="markAnnouncementAsRead('${announcement.id || ''}')" title="Mark as Read">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="announcement-item-body">
                                <p class="announcement-item-content">${escapeHtml(announcement.content)}</p>
                                ${announcement.madeBy ? `
                                    <div class="announcement-item-author">
                                        ${announcement.madeByProfilePic ? `
                                            <img src="${escapeHtml(announcement.madeByProfilePic)}" alt="${escapeHtml(announcement.madeBy)}" class="announcement-author-avatar-small">
                                        ` : `
                                            <div class="announcement-author-avatar-small-initial">${(announcement.madeBy || 'U').charAt(0).toUpperCase()}</div>
                                        `}
                                        <div>
                                            <div class="announcement-author-name">${escapeHtml(announcement.madeBy)}</div>
                                            ${announcement.madeByEmail ? `<div class="announcement-author-email">${escapeHtml(announcement.madeByEmail)}</div>` : ''}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="announcement-item-footer">
                                <div class="announcement-item-meta">
                                    <span class="announcement-date">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        Posted: ${new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    ${deadlineDate ? `
                                        <span class="announcement-deadline ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            Deadline: ${deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Filter announcements
function filterAnnouncements() {
    const priorityFilter = document.getElementById('announcements-filter-priority')?.value || 'all';
    const statusFilter = document.getElementById('announcements-filter-status')?.value || 'all';
    const items = document.querySelectorAll('.announcement-item-card');
    
    items.forEach(item => {
        const priority = item.dataset.priority;
        const status = item.dataset.status;
        
        let show = true;
        
        if (priorityFilter !== 'all' && priority !== priorityFilter) {
            show = false;
        }
        
        if (statusFilter !== 'all' && status !== statusFilter) {
            show = false;
        }
        
        item.style.display = show ? 'block' : 'none';
    });
}

// Initialize Kanban Board
function initializeKanbanBoard() {
    let kanbanCards = JSON.parse(localStorage.getItem('vilostudios_marketing_kanban') || '[]');
    
    // Migration: Convert old column names to new ones
    const columnMapping = {
        'assets': 'assets_branding',
        'research': 'research_ideas',
        'scripts': 'scripts_content',
        'recordings': 'recordings',
        'editing': 'editing'
    };
    
    // Ensure all cards have IDs and migrate column names
    let needsSave = false;
    kanbanCards = kanbanCards.map((card, index) => {
        if (!card.id) {
            card.id = `card-${Date.now()}-${index}`;
            needsSave = true;
        }
        // Migrate old column names
        if (columnMapping[card.column]) {
            card.column = columnMapping[card.column];
            needsSave = true;
        }
        // Ensure default values for new fields
        if (!card.priority) card.priority = 'medium';
        if (!card.assignee) card.assignee = null;
        if (!card.deadline) card.deadline = null;
        return card;
    });
    
    if (needsSave) {
    localStorage.setItem('vilostudios_marketing_kanban', JSON.stringify(kanbanCards));
    }
    
    const columns = ['assets_branding', 'research_ideas', 'scripts_content', 'recordings', 'editing'];
    
    columns.forEach(column => {
        const columnBody = document.getElementById(`column-${column}`);
        const columnCards = kanbanCards.filter(card => card.column === column);
        const countEl = document.getElementById(`count-${column}`);
        
        if (countEl) countEl.textContent = columnCards.length;
        
        if (columnBody) {
            columnBody.innerHTML = '';
            columnCards.forEach(card => {
                const cardEl = createKanbanCard(card, card.id);
                columnBody.appendChild(cardEl);
            });
            
            // Enable drop zone
            columnBody.addEventListener('dragover', (e) => {
                e.preventDefault();
                columnBody.classList.add('drag-over');
            });
            
            columnBody.addEventListener('dragleave', () => {
                columnBody.classList.remove('drag-over');
            });
            
            columnBody.addEventListener('drop', (e) => {
                e.preventDefault();
                columnBody.classList.remove('drag-over');
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                moveKanbanCard(data.cardId, column);
            });
        }
    });
}

// Create kanban card element
function createKanbanCard(card, cardId) {
    const cardEl = document.createElement('div');
    cardEl.className = 'kanban-card';
    cardEl.draggable = true;
    cardEl.dataset.cardId = cardId;
    
    // Priority badge
    const priorityBadge = card.priority ? `<span class="kanban-priority-badge priority-${card.priority}">${card.priority}</span>` : '';
    
    // Assignee display
    const assigneeDisplay = card.assignee ? `<div class="kanban-assignee"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ${escapeHtml(card.assignee)}</div>` : '';
    
    // Deadline display
    let deadlineDisplay = '';
    if (card.deadline) {
        const deadlineDate = new Date(card.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);
        const isOverdue = deadlineDate < today;
        const isToday = deadlineDate.getTime() === today.getTime();
        deadlineDisplay = `<div class="kanban-deadline ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${deadlineDate.toLocaleDateString()}
        </div>`;
    }
    
    cardEl.innerHTML = `
        <div class="kanban-card-header">
            ${priorityBadge}
            <button class="btn-icon-small" onclick="event.stopPropagation(); editKanbanCard('${cardId}')" title="Edit">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
        </div>
        <div class="kanban-card-content">
            <h4>${escapeHtml(card.title)}</h4>
            <p>${escapeHtml(card.description || '')}</p>
        </div>
        <div class="kanban-card-footer">
            ${assigneeDisplay}
            ${deadlineDisplay}
            ${card.attachments && card.attachments.length > 0 ? `
                <div class="kanban-attachments">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                    <span>${card.attachments.length} file${card.attachments.length !== 1 ? 's' : ''}</span>
                </div>
            ` : ''}
        </div>
        <button class="btn-icon" onclick="event.stopPropagation(); deleteKanbanCardById('${cardId}')" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        </button>
    `;
    
    cardEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({cardId, column: card.column}));
    });
    
    return cardEl;
}

// Add kanban card
function addKanbanCard(column) {
    document.getElementById('kanban-column').value = column;
    document.getElementById('kanban-card-id').value = '';
    document.getElementById('kanban-modal-title').textContent = 'Add Kanban Card';
    document.getElementById('kanban-submit-btn').textContent = 'Add Card';
    
    // Reset form
    const form = document.getElementById('add-kanban-form');
    form.reset();
    document.getElementById('kanban-column').value = column;
    document.getElementById('kanban-priority').value = 'medium';
    
    document.getElementById('add-kanban-modal').style.display = 'flex';
}

// Edit kanban card
function editKanbanCard(cardId) {
    const kanbanCards = JSON.parse(localStorage.getItem('vilostudios_marketing_kanban') || '[]');
    const card = kanbanCards.find(c => c.id === cardId);
    
    if (!card) return;
    
    document.getElementById('kanban-card-id').value = cardId;
    document.getElementById('kanban-column').value = card.column;
    document.getElementById('kanban-title').value = card.title || '';
    document.getElementById('kanban-description').value = card.description || '';
    document.getElementById('kanban-priority').value = card.priority || 'medium';
    document.getElementById('kanban-assignee').value = card.assignee || '';
    document.getElementById('kanban-deadline').value = card.deadline ? card.deadline.split('T')[0] : '';
    document.getElementById('kanban-modal-title').textContent = 'Edit Kanban Card';
    document.getElementById('kanban-submit-btn').textContent = 'Save Changes';
    
    // Show existing attachments
    const fileList = document.getElementById('kanban-file-list');
    if (fileList && card.attachments && card.attachments.length > 0) {
        fileList.innerHTML = card.attachments.map((att, index) => `
            <div class="file-item existing">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span class="file-name">${escapeHtml(att.name)}</span>
                ${att.size ? `<span class="file-size">(${(att.size / 1024).toFixed(1)} KB)</span>` : ''}
            </div>
        `).join('');
    }
    
    document.getElementById('add-kanban-modal').style.display = 'flex';
}

// Setup kanban form submission
function setupKanbanForm() {
    const form = document.getElementById('add-kanban-form');
    if (!form) return;
    
    // File upload handling
    const fileInput = document.getElementById('kanban-file-input');
    const fileUploadArea = document.getElementById('kanban-file-upload-area');
    const fileList = document.getElementById('kanban-file-list');
    let selectedFiles = [];
    
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            selectedFiles = [...selectedFiles, ...files];
            updateFileList();
        });
        
        // Drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('drag-over');
        });
        
        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('drag-over');
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            selectedFiles = [...selectedFiles, ...files];
            updateFileList();
        });
    }
    
    function updateFileList() {
        if (!fileList) return;
        
        if (selectedFiles.length === 0) {
            fileList.innerHTML = '';
            return;
        }
        
        fileList.innerHTML = selectedFiles.map((file, index) => `
            <div class="file-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span class="file-name">${escapeHtml(file.name)}</span>
                <span class="file-size">(${(file.size / 1024).toFixed(1)} KB)</span>
                <button type="button" class="btn-icon-small" onclick="removeFile(${index})" title="Remove">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
    }
    
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
    };
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const cardId = document.getElementById('kanban-card-id').value;
        const title = document.getElementById('kanban-title').value;
        const description = document.getElementById('kanban-description').value;
        const cardColumn = document.getElementById('kanban-column').value;
        const priority = document.getElementById('kanban-priority').value;
        const assignee = document.getElementById('kanban-assignee').value.trim() || null;
        const deadline = document.getElementById('kanban-deadline').value || null;
        
        // Convert files to base64 for storage (in production, upload to server)
        const attachments = selectedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            // In production, this would be a URL to the uploaded file
            data: null // Store file reference, not actual data
        }));
        
        const kanbanCards = JSON.parse(localStorage.getItem('vilostudios_marketing_kanban') || '[]');
        
        if (cardId) {
            // Edit existing card
            const cardIndex = kanbanCards.findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                const existingAttachments = kanbanCards[cardIndex].attachments || [];
                kanbanCards[cardIndex] = {
                    ...kanbanCards[cardIndex],
                    title,
                    description,
                    column: cardColumn,
                    priority,
                    assignee,
                    deadline,
                    attachments: attachments.length > 0 ? [...existingAttachments, ...attachments] : existingAttachments,
                    updated_at: new Date().toISOString()
                };
            }
        } else {
            // Add new card
        kanbanCards.push({
            id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title,
            description,
            column: cardColumn,
                priority,
                assignee,
                deadline,
                attachments: attachments,
                date: new Date().toISOString(),
                created_at: new Date().toISOString()
            });
        }
        
        localStorage.setItem('vilostudios_marketing_kanban', JSON.stringify(kanbanCards));
        
        closeModal('add-kanban-modal');
        form.reset();
        selectedFiles = [];
        updateFileList();
        renderClientManagementPage();
    };
}

// Move kanban card to different column
function moveKanbanCard(cardId, newColumn) {
    const kanbanCards = JSON.parse(localStorage.getItem('vilostudios_marketing_kanban') || '[]');
    const card = kanbanCards.find(c => c.id === cardId);
    if (card) {
        card.column = newColumn;
        localStorage.setItem('vilostudios_marketing_kanban', JSON.stringify(kanbanCards));
        renderClientManagementPage();
    }
}

// Delete kanban card by ID
function deleteKanbanCardById(cardId) {
    if (!confirm('Are you sure you want to delete this card?')) return;
    const kanbanCards = JSON.parse(localStorage.getItem('vilostudios_marketing_kanban') || '[]');
    const filtered = kanbanCards.filter(card => card.id !== cardId);
    localStorage.setItem('vilostudios_marketing_kanban', JSON.stringify(filtered));
    renderClientManagementPage();
}

// Show upload document modal
function showUploadDocumentModal(clientId) {
    document.getElementById('document-client-id').value = clientId;
    document.getElementById('upload-document-modal').style.display = 'flex';
    
    const form = document.getElementById('upload-document-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('document-name').value;
        const category = document.getElementById('document-category').value;
        const description = document.getElementById('document-description').value;
        const fileInput = document.getElementById('document-file');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a file');
            return;
        }
        
        const clientDocuments = JSON.parse(localStorage.getItem('vilostudios_client_documents') || '{}');
        if (!clientDocuments[clientId]) {
            clientDocuments[clientId] = [];
        }
        
        // Get existing documents for versioning
        const existingDocs = clientDocuments[clientId].filter(d => d.name === name);
        const version = existingDocs.length > 0 ? existingDocs.length + 1 : 1;
        
        clientDocuments[clientId].push({
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            category,
            description,
            size: file.size,
            type: file.type,
            version,
            uploaded_at: new Date().toISOString(),
            uploaded_by: userName || userEmail || 'Unknown',
            file_name: file.name
        });
        
        localStorage.setItem('vilostudios_client_documents', JSON.stringify(clientDocuments));
        
        closeModal('upload-document-modal');
        form.reset();
        renderClientManagementPage();
    };
}

// Download document
function downloadDocument(clientId, docIndex) {
    const clientDocuments = JSON.parse(localStorage.getItem('vilostudios_client_documents') || '{}');
    const docs = clientDocuments[clientId] || [];
    const doc = docs[docIndex];
    
    if (!doc) return;
    
    // In production, this would fetch the actual file from the server
    alert(`Downloading ${doc.name}...\n\nIn production, this would download the file from the server.`);
}

// Delete document
function deleteDocument(clientId, docIndex) {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    const clientDocuments = JSON.parse(localStorage.getItem('vilostudios_client_documents') || '{}');
    const docs = clientDocuments[clientId] || [];
    docs.splice(docIndex, 1);
    clientDocuments[clientId] = docs;
    
    localStorage.setItem('vilostudios_client_documents', JSON.stringify(clientDocuments));
    renderClientManagementPage();
}

// Initialize Calendar
function initializeCalendar() {
    let currentDate = new Date();
    
    const updateCalendar = () => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthYear = document.getElementById('current-month-year');
        if (monthYear) {
            monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        }
        
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const deadlines = JSON.parse(localStorage.getItem('vilostudios_deadlines') || '[]');
        
        calendarGrid.innerHTML = '';
        
        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Collect all deadlines for this day
            const dayDeadlines = deadlines.filter(d => d.date && d.date.startsWith(dateStr));
            
            // Add kanban card deadlines
            const kanbanCards = JSON.parse(localStorage.getItem('vilostudios_marketing_kanban') || '[]');
            const kanbanDeadlines = kanbanCards.filter(card => card.deadline && card.deadline.startsWith(dateStr));
            
            // Add announcement deadlines
            const announcements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
            const announcementDeadlines = announcements.filter(a => a.deadline && a.deadline.startsWith(dateStr));
            
            // Add client meetings
            const clientMeetings = JSON.parse(localStorage.getItem('vilostudios_client_meetings') || '{}');
            let meetingDeadlines = [];
            Object.values(clientMeetings).forEach(meetings => {
                meetings.forEach(meeting => {
                    if (meeting.date && meeting.date.startsWith(dateStr)) {
                        meetingDeadlines.push(meeting);
                    }
                });
            });
            
            const totalDeadlines = dayDeadlines.length + kanbanDeadlines.length + announcementDeadlines.length + meetingDeadlines.length;
            
            if (totalDeadlines > 0) {
                dayCell.classList.add('has-deadline');
                const deadlineCount = document.createElement('span');
                deadlineCount.className = 'deadline-count';
                deadlineCount.textContent = totalDeadlines;
                dayCell.appendChild(deadlineCount);
                
                // Add tooltip with details
                const tooltip = [];
                if (dayDeadlines.length > 0) tooltip.push(`${dayDeadlines.length} deadline${dayDeadlines.length !== 1 ? 's' : ''}`);
                if (kanbanDeadlines.length > 0) tooltip.push(`${kanbanDeadlines.length} kanban card${kanbanDeadlines.length !== 1 ? 's' : ''}`);
                if (announcementDeadlines.length > 0) tooltip.push(`${announcementDeadlines.length} announcement${announcementDeadlines.length !== 1 ? 's' : ''}`);
                if (meetingDeadlines.length > 0) tooltip.push(`${meetingDeadlines.length} meeting${meetingDeadlines.length !== 1 ? 's' : ''}`);
                dayCell.title = tooltip.join(', ');
            }
            
            calendarGrid.appendChild(dayCell);
        }
    };
    
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
    
        updateCalendar();
        updateTimelineView();
    
    const deadlineForm = document.getElementById('add-deadline-form');
    if (deadlineForm) {
        deadlineForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('deadline-title').value;
            const date = document.getElementById('deadline-date').value;
            const description = document.getElementById('deadline-description').value;
            
            const deadlines = JSON.parse(localStorage.getItem('vilostudios_deadlines') || '[]');
            deadlines.push({ title, date, description });
            localStorage.setItem('vilostudios_deadlines', JSON.stringify(deadlines));
            
            closeModal('add-deadline-modal');
            deadlineForm.reset();
            updateCalendar();
            updateTimelineView();
        });
    }
}

// Switch between calendar and timeline views
function switchCalendarView(view) {
    const calendarView = document.getElementById('calendar-view');
    const timelineView = document.getElementById('timeline-view');
    const calendarBtn = document.getElementById('calendar-view-btn');
    const timelineBtn = document.getElementById('timeline-view-btn');
    
    if (view === 'calendar') {
        calendarView.style.display = 'block';
        timelineView.style.display = 'none';
        calendarBtn.classList.add('active');
        timelineBtn.classList.remove('active');
    } else {
        calendarView.style.display = 'none';
        timelineView.style.display = 'block';
        calendarBtn.classList.remove('active');
        timelineBtn.classList.add('active');
        updateTimelineView();
    }
}

// Update timeline view with all deadlines
function updateTimelineView() {
    const timelineList = document.getElementById('timeline-list');
    if (!timelineList) return;
    
    const typeFilter = document.getElementById('timeline-filter-type')?.value || 'all';
    const priorityFilter = document.getElementById('timeline-filter-priority')?.value || 'all';
    
    // Collect all deadlines from different sources
    const allDeadlines = [];
    
    // Regular deadlines
    const deadlines = JSON.parse(localStorage.getItem('vilostudios_deadlines') || '[]');
    deadlines.forEach(d => {
        if (typeFilter === 'all' || typeFilter === 'deadline') {
            allDeadlines.push({
                type: 'deadline',
                title: d.title,
                date: d.date,
                description: d.description,
                priority: 'medium'
            });
        }
    });
    
    // Kanban card deadlines
    const kanbanCards = JSON.parse(localStorage.getItem('vilostudios_marketing_kanban') || '[]');
    kanbanCards.forEach(card => {
        if (card.deadline && (typeFilter === 'all' || typeFilter === 'kanban')) {
            if (priorityFilter === 'all' || priorityFilter === card.priority) {
                allDeadlines.push({
                    type: 'kanban',
                    title: card.title,
                    date: card.deadline,
                    description: card.description,
                    priority: card.priority || 'medium',
                    assignee: card.assignee,
                    cardId: card.id
                });
            }
        }
    });
    
    // Announcement deadlines
    const announcements = JSON.parse(localStorage.getItem('vilostudios_ambassador_announcements') || '[]');
    announcements.forEach(announcement => {
        if (announcement.deadline && (typeFilter === 'all' || typeFilter === 'announcement')) {
            if (priorityFilter === 'all' || priorityFilter === announcement.priority) {
                allDeadlines.push({
                    type: 'announcement',
                    title: announcement.title,
                    date: announcement.deadline,
                    description: announcement.content,
                    priority: announcement.priority || 'medium'
                });
            }
        }
    });
    
    // Client meetings
    const clientMeetings = JSON.parse(localStorage.getItem('vilostudios_client_meetings') || '{}');
    Object.keys(clientMeetings).forEach(clientId => {
        const meetings = clientMeetings[clientId];
        meetings.forEach(meeting => {
            if (typeFilter === 'all' || typeFilter === 'meeting') {
                allDeadlines.push({
                    type: 'meeting',
                    title: meeting.title,
                    date: meeting.date,
                    description: meeting.description,
                    time: meeting.time,
                    priority: 'medium',
                    clientId: clientId
                });
            }
        });
    });
    
    // Sort by date
    allDeadlines.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
    
    // Render timeline items
    if (allDeadlines.length === 0) {
        timelineList.innerHTML = '<div class="empty-state">No deadlines found. Add one to get started!</div>';
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    timelineList.innerHTML = allDeadlines.map(item => {
        const deadlineDate = new Date(item.date);
        deadlineDate.setHours(0, 0, 0, 0);
        const isOverdue = deadlineDate < today;
        const isToday = deadlineDate.getTime() === today.getTime();
        const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        
        let typeIcon = '';
        let typeLabel = '';
        let typeColor = '';
        
        switch(item.type) {
            case 'deadline':
                typeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
                typeLabel = 'Deadline';
                typeColor = 'var(--accent-orange)';
                break;
            case 'kanban':
                typeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>';
                typeLabel = 'Kanban';
                typeColor = 'var(--accent-blue)';
                break;
            case 'announcement':
                typeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>';
                typeLabel = 'Announcement';
                typeColor = 'var(--accent-purple)';
                break;
            case 'meeting':
                typeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
                typeLabel = 'Meeting';
                typeColor = 'var(--accent-green)';
                break;
        }
        
        return `
            <div class="timeline-item ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}" data-type="${item.type}">
                <div class="timeline-item-date">
                    <div class="timeline-date-day">${deadlineDate.getDate()}</div>
                    <div class="timeline-date-month">${deadlineDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div class="timeline-date-year">${deadlineDate.getFullYear()}</div>
                </div>
                <div class="timeline-item-content">
                    <div class="timeline-item-header">
                        <div class="timeline-item-type" style="color: ${typeColor};">
                            ${typeIcon}
                            <span>${typeLabel}</span>
                        </div>
                        <span class="priority-badge priority-${item.priority}">${item.priority}</span>
                    </div>
                    <h4 class="timeline-item-title">${escapeHtml(item.title)}</h4>
                    ${item.description ? `<p class="timeline-item-description">${escapeHtml(item.description)}</p>` : ''}
                    ${item.assignee ? `<div class="timeline-item-assignee">Assigned to: ${escapeHtml(item.assignee)}</div>` : ''}
                    ${item.time ? `<div class="timeline-item-time">Time: ${escapeHtml(item.time)}</div>` : ''}
                    <div class="timeline-item-meta">
                        ${isOverdue ? '<span class="timeline-overdue-badge">Overdue</span>' : ''}
                        ${isToday ? '<span class="timeline-today-badge">Today</span>' : ''}
                        ${!isOverdue && !isToday ? `<span class="timeline-days-badge">${daysUntil} day${daysUntil !== 1 ? 's' : ''} until</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show add deadline modal
function showAddDeadlineModal() {
    document.getElementById('add-deadline-modal').style.display = 'flex';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deadline-date').value = today;
}

// Toggle client folder
function toggleClientFolder(clientId) {
    const currentExpanded = localStorage.getItem('vilostudios_expanded_client');
    if (currentExpanded === clientId) {
        localStorage.removeItem('vilostudios_expanded_client');
    } else {
        localStorage.setItem('vilostudios_expanded_client', clientId);
    }
    renderClientManagementPage();
}

// Show add meeting modal
function showAddMeetingModal(clientId) {
    document.getElementById('meeting-client-id').value = clientId;
    document.getElementById('add-meeting-modal').style.display = 'flex';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('meeting-date').value = today;
}

// Initialize CRM
function initializeCRM() {
    const form = document.getElementById('add-client-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('client-name').value;
            const email = document.getElementById('client-email').value.trim();
            const discord = document.getElementById('client-discord').value.trim();
            const linkedin = document.getElementById('client-linkedin').value.trim();
            const company = document.getElementById('client-company').value.trim();
            const status = document.getElementById('client-status').value;
            
            const clients = JSON.parse(localStorage.getItem('vilostudios_crm_clients') || '[]');
            clients.push({ 
                id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name, 
                email: email || null,
                discord: discord || null,
                linkedin: linkedin || null,
                company: company || null, 
                status 
            });
            localStorage.setItem('vilostudios_crm_clients', JSON.stringify(clients));
            
            closeModal('add-client-modal');
            form.reset();
            renderClientManagementPage();
        });
    }
    
    // Edit client form
    const editForm = document.getElementById('edit-client-form');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = parseInt(document.getElementById('edit-client-index').value);
            const name = document.getElementById('edit-client-name').value;
            const email = document.getElementById('edit-client-email').value.trim();
            const discord = document.getElementById('edit-client-discord').value.trim();
            const linkedin = document.getElementById('edit-client-linkedin').value.trim();
            const company = document.getElementById('edit-client-company').value.trim();
            const status = document.getElementById('edit-client-status').value;
            
            const clients = JSON.parse(localStorage.getItem('vilostudios_crm_clients') || '[]');
            if (clients[index]) {
                clients[index] = {
                    ...clients[index],
                    name,
                    email: email || null,
                    discord: discord || null,
                    linkedin: linkedin || null,
                    company: company || null,
                    status
                };
                localStorage.setItem('vilostudios_crm_clients', JSON.stringify(clients));
            }
            
            closeModal('edit-client-modal');
            editForm.reset();
            renderClientManagementPage();
        });
    }
    
    // Add meeting form
    const meetingForm = document.getElementById('add-meeting-form');
    if (meetingForm) {
        meetingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const clientId = document.getElementById('meeting-client-id').value;
            const title = document.getElementById('meeting-title').value;
            const date = document.getElementById('meeting-date').value;
            const time = document.getElementById('meeting-time').value;
            const description = document.getElementById('meeting-description').value;
            
            const clientMeetings = JSON.parse(localStorage.getItem('vilostudios_client_meetings') || '{}');
            if (!clientMeetings[clientId]) {
                clientMeetings[clientId] = [];
            }
            clientMeetings[clientId].push({
                title,
                date,
                time,
                description
            });
            localStorage.setItem('vilostudios_client_meetings', JSON.stringify(clientMeetings));
            
            closeModal('add-meeting-modal');
            meetingForm.reset();
            renderClientManagementPage();
        });
    }
}

// Delete meeting
function deleteMeeting(clientId, meetingIndex) {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    const clientMeetings = JSON.parse(localStorage.getItem('vilostudios_client_meetings') || '{}');
    if (clientMeetings[clientId]) {
        clientMeetings[clientId].splice(meetingIndex, 1);
        localStorage.setItem('vilostudios_client_meetings', JSON.stringify(clientMeetings));
        renderClientManagementPage();
    }
}

// Show add client modal
function showAddClientModal() {
    document.getElementById('add-client-modal').style.display = 'flex';
}

// Delete client
function deleteClient(index) {
    if (!confirm('Are you sure you want to delete this client? This will also delete all associated meetings.')) return;
    const clients = JSON.parse(localStorage.getItem('vilostudios_crm_clients') || '[]');
    const client = clients[index];
    if (client && client.id) {
        // Delete associated meetings
        const clientMeetings = JSON.parse(localStorage.getItem('vilostudios_client_meetings') || '{}');
        delete clientMeetings[client.id];
        localStorage.setItem('vilostudios_client_meetings', JSON.stringify(clientMeetings));
    }
    clients.splice(index, 1);
    localStorage.setItem('vilostudios_crm_clients', JSON.stringify(clients));
    renderClientManagementPage();
}

// Edit client
function editClient(index) {
    const clients = JSON.parse(localStorage.getItem('vilostudios_crm_clients') || '[]');
    const client = clients[index];
    if (!client) return;
    
    // Populate edit form
    document.getElementById('edit-client-index').value = index;
    document.getElementById('edit-client-name').value = client.name || '';
    document.getElementById('edit-client-email').value = client.email || '';
    document.getElementById('edit-client-discord').value = client.discord || '';
    document.getElementById('edit-client-linkedin').value = client.linkedin || '';
    document.getElementById('edit-client-company').value = client.company || '';
    document.getElementById('edit-client-status').value = client.status || 'active';
    
    // Show edit modal
    document.getElementById('edit-client-modal').style.display = 'flex';
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

function renderSystemSettings() {
    const otherPages = document.getElementById('other-pages');
    if (!otherPages) return;
    
    const currentUser = JSON.parse(localStorage.getItem('vilostudios_user') || '{}');
    const currentProfilePic = localStorage.getItem('vilostudios_profile_pic') || '';
    const twoFAEnabled = localStorage.getItem('vilostudios_2fa_enabled') === 'true';
    const currentUserName = currentUser.name || userName || currentUser.email?.split('@')[0] || 'User';
    const currentUserInitial = currentUserName.charAt(0).toUpperCase();
    const defaultAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23FF6B35'/%3E%3Ctext x='60' y='75' font-size='48' font-weight='bold' fill='%23000' text-anchor='middle'%3E${currentUserInitial}%3C/text%3E%3C/svg%3E`;
    const hasProfilePic = !!(currentProfilePic && currentProfilePic.trim());
    
    otherPages.innerHTML = `
        <div class="system-settings-container">
            <div class="settings-page-header">
                <h2 class="settings-page-title">Settings</h2>
                <p class="settings-page-subtitle">Manage your profile and account</p>
            </div>
            
            <div class="settings-cards">
                <!-- Profile Card -->
                <div class="settings-card">
                    <div class="settings-card-header">
                        <h3 class="settings-card-title">Profile Picture</h3>
                    </div>
                    <div class="settings-card-body profile-card-body">
                        <div class="profile-avatar-wrap">
                            <img id="profile-pic-preview" src="${currentProfilePic || defaultAvatar}" alt="Profile" class="profile-avatar-img">
                        </div>
                        <div class="profile-actions-wrap">
                            <label for="profile-pic-input" class="btn-profile-action btn-upload">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                Upload New
                            </label>
                            <input type="file" id="profile-pic-input" accept="image/*" style="display:none">
                            <button type="button" class="btn-profile-action btn-remove" id="remove-profile-pic-btn" ${!hasProfilePic ? 'disabled' : ''}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                                Remove
                            </button>
                            <button type="button" class="btn-profile-action btn-save" id="save-profile-pic-btn" style="display:none">Save Picture</button>
                        </div>
                        <div id="profile-pic-message" class="settings-message" style="display:none"></div>
                    </div>
                </div>
                
                <!-- Username Card -->
                <div class="settings-card">
                    <div class="settings-card-header">
                        <h3 class="settings-card-title">Username</h3>
                        <span class="settings-card-hint">Your display name</span>
                    </div>
                    <form id="username-form" class="settings-card-body">
                        <input type="text" id="username-input" class="form-input" value="${escapeHtml(currentUserName)}" placeholder="Enter username" required>
                        <button type="submit" class="btn-settings-primary">Update Username</button>
                        <div id="username-message" class="settings-message" style="display:none"></div>
                    </form>
                </div>
                
                <!-- Password Card -->
                <div class="settings-card">
                    <div class="settings-card-header">
                        <h3 class="settings-card-title">Change Password</h3>
                    </div>
                    <form id="password-form" class="settings-card-body">
                        <input type="password" id="current-password" class="form-input" placeholder="Current password" required>
                        <input type="password" id="new-password" class="form-input" placeholder="New password (min 8 chars)" minlength="8" required>
                        <input type="password" id="confirm-password" class="form-input" placeholder="Confirm new password" required>
                        <button type="submit" class="btn-settings-primary">Update Password</button>
                        <div id="password-message" class="settings-message" style="display:none"></div>
                    </form>
                </div>
                
                <!-- 2FA Card -->
                <div class="settings-card">
                    <div class="settings-card-header settings-card-header-flex">
                        <div>
                            <h3 class="settings-card-title">Two-Factor Auth (2FA)</h3>
                            <span class="settings-card-hint">PIN-based security</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="twofa-toggle" ${twoFAEnabled ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div id="twofa-pin-section" class="settings-card-body" style="display:${twoFAEnabled ? 'block' : 'none'}">
                        <input type="text" id="twofa-pin" class="form-input" placeholder="6-digit PIN" maxlength="6" pattern="[0-9]{6}" value="${escapeHtml(localStorage.getItem('vilostudios_2fa_pin') || '')}">
                        <button type="button" class="btn-settings-primary" id="save-twofa-pin-btn">Save 2FA PIN</button>
                        <div id="twofa-message" class="settings-message" style="display:none"></div>
                    </div>
                </div>
                
                <!-- Storage Card -->
                <div class="settings-card">
                    <div class="settings-card-header">
                        <h3 class="settings-card-title">Storage</h3>
                    </div>
                    <div class="settings-card-body storage-card-body">
                        <div class="storage-stat-card" id="storage-space-card">
                            <div class="storage-stat-header">
                                <span>Space</span>
                                <span id="storage-space-status" class="storage-badge">OK</span>
                            </div>
                            <div class="storage-bar"><div id="storage-space-progress" class="storage-bar-fill" style="width:0%"></div></div>
                            <span id="storage-space-percent" class="storage-percent">0%</span>
                            <div class="storage-detail" id="storage-space-usage">Loading...</div>
                        </div>
                        <div class="storage-stat-card" id="storage-inodes-card">
                            <div class="storage-stat-header">
                                <span>Inodes</span>
                                <span id="storage-inodes-status" class="storage-badge">OK</span>
                            </div>
                            <div class="storage-bar"><div id="storage-inodes-progress" class="storage-bar-fill" style="width:0%"></div></div>
                            <span id="storage-inodes-percent" class="storage-percent">0%</span>
                            <div class="storage-detail" id="storage-inodes-usage">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load storage information after a short delay to ensure DOM is ready
    setTimeout(() => {
        loadStorageInfo();
    }, 100);
    
    // Setup event listeners after a short delay to ensure DOM is ready
    setTimeout(() => {
        setupSettingsEventListeners();
        // Don't create cropper modal automatically - it will be created when needed
    }, 100);
}

// Cropper.js instance (global for cleanup)
let profileCropperInstance = null;

// Create cropper modal - uses Cropper.js for reliable, professional cropping
function createCropperModal(imageSrc) {
    const existingModal = document.getElementById('image-cropper-modal');
    if (existingModal) existingModal.remove();
    if (profileCropperInstance) {
        try { profileCropperInstance.destroy(); } catch (_) {}
        profileCropperInstance = null;
    }
    
    const modal = document.createElement('div');
    modal.id = 'image-cropper-modal';
    modal.className = 'profile-cropper-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Crop profile picture');
    modal.innerHTML = `
        <div class="profile-cropper-backdrop"></div>
        <div class="profile-cropper-dialog">
            <div class="profile-cropper-header">
                <h3>Crop Profile Picture</h3>
                <button type="button" class="profile-cropper-close" title="Close" aria-label="Close">&times;</button>
            </div>
            <div class="profile-cropper-body">
                <div class="profile-cropper-wrap">
                    <img id="profile-cropper-image" src="${imageSrc}" alt="Crop preview">
                </div>
            </div>
            <div class="profile-cropper-footer">
                <button type="button" class="btn-secondary profile-cropper-cancel">Cancel</button>
                <button type="button" class="btn-primary profile-cropper-save">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save & Crop
                </button>
            </div>
        </div>
    `;
    
    const backdrop = modal.querySelector('.profile-cropper-backdrop');
    const closeBtn = modal.querySelector('.profile-cropper-close');
    const cancelBtn = modal.querySelector('.profile-cropper-cancel');
    const saveBtn = modal.querySelector('.profile-cropper-save');
    const imgEl = modal.querySelector('#profile-cropper-image');
    
    const handleClose = () => { closeCropperModal(); };
    
    closeBtn.addEventListener('click', handleClose);
    cancelBtn.addEventListener('click', handleClose);
    backdrop.addEventListener('click', handleClose);
    
    saveBtn.addEventListener('click', () => {
        saveCropperAndClose();
    });
    
    modal.querySelector('.profile-cropper-dialog').addEventListener('click', (e) => e.stopPropagation());
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    modal._escapeHandler = handleEscape;
    
    document.body.appendChild(modal);
    
    // Init Cropper.js after img loads
    imgEl.onload = () => {
        if (profileCropperInstance) {
            try { profileCropperInstance.destroy(); } catch (_) {}
        }
        profileCropperInstance = new Cropper(imgEl, {
            aspectRatio: 1,
            viewMode: 2,
            dragMode: 'move',
            autoCropArea: 0.9,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true
        });
    };
    imgEl.onerror = () => {
        alert('Failed to load image. Please try again.');
        handleClose();
    };
    if (imgEl.complete) imgEl.onload();
    
    return modal;
}

function closeCropperModal() {
    const modal = document.getElementById('image-cropper-modal');
    if (modal) {
        if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
        }
        modal.remove();
    }
    if (profileCropperInstance) {
        try { profileCropperInstance.destroy(); } catch (_) {}
        profileCropperInstance = null;
    }
}

function saveCropperAndClose() {
    if (!profileCropperInstance) {
        closeCropperModal();
        return;
    }
    const canvas = profileCropperInstance.getCroppedCanvas({ width: 400, height: 400 });
    if (canvas) {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        localStorage.setItem('vilostudios_profile_pic', dataUrl);
        const profilePicPreview = document.getElementById('profile-pic-preview');
        const removeProfilePicBtn = document.getElementById('remove-profile-pic-btn');
        const profilePicMessage = document.getElementById('profile-pic-message');
        if (profilePicPreview) profilePicPreview.src = dataUrl;
        const saveBtn = document.getElementById('save-profile-pic-btn');
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.style.display = 'flex';
        }
        if (removeProfilePicBtn) removeProfilePicBtn.disabled = false;
        showMessage(profilePicMessage, 'Profile picture cropped! Click "Save Profile Picture" to apply.', 'success');
        setTimeout(() => { if (profilePicMessage) profilePicMessage.style.display = 'none'; }, 3000);
        updateAllAvatars(dataUrl);
    }
    closeCropperModal();
}

// Setup Settings Event Listeners
function setupSettingsEventListeners() {
    // Profile Picture Upload
    const profilePicInput = document.getElementById('profile-pic-input');
    const profilePicPreview = document.getElementById('profile-pic-preview');
    const removeProfilePicBtn = document.getElementById('remove-profile-pic-btn');
    const profilePicMessage = document.getElementById('profile-pic-message');
    
    // Save Profile Picture Button
    const saveProfilePicBtn = document.getElementById('save-profile-pic-btn');
    if (saveProfilePicBtn) {
        saveProfilePicBtn.addEventListener('click', () => {
            const currentPic = localStorage.getItem('vilostudios_profile_pic');
            if (currentPic) {
                // Save to localStorage (already saved, but update all avatars)
                saveProfilePicture(currentPic);
                showMessage(profilePicMessage, 'Profile picture saved and updated across all locations!', 'success');
                
                // Clear message after 3 seconds
                setTimeout(() => {
                    if (profilePicMessage) profilePicMessage.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showMessage(profilePicMessage, 'Please select a valid image file', 'error');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showMessage(profilePicMessage, 'Image size must be less than 5MB', 'error');
                    return;
                }
                
                // Read file and open cropper
                const reader = new FileReader();
                reader.onload = (e) => {
                    openImageCropper(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Don't setup cropper modal automatically - only when a file is selected
    // The modal will be created and set up in openImageCropper() when needed
    
    // Remove Profile Picture
    if (removeProfilePicBtn) {
        removeProfilePicBtn.addEventListener('click', () => {
            // Remove from localStorage
            localStorage.removeItem('vilostudios_profile_pic');
            
            // Reset to default (user initial)
            const currentUser = JSON.parse(localStorage.getItem('vilostudios_user') || '{}');
            const currentUserName = currentUser.name || currentUser.email?.split('@')[0] || 'U';
            const currentUserInitial = currentUserName.charAt(0).toUpperCase();
            const defaultSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23FF6B35'/%3E%3Ctext x='60' y='75' font-size='48' font-weight='bold' fill='%23000' text-anchor='middle'%3E${currentUserInitial}%3C/text%3E%3C/svg%3E`;
            if (profilePicPreview) profilePicPreview.src = defaultSvg;
            
            // Hide save button
            const saveBtn = document.getElementById('save-profile-pic-btn');
            if (saveBtn) {
                saveBtn.style.display = 'none';
                saveBtn.disabled = true;
            }
            
            // Update avatar in sidebar and header
            updateAllAvatars('');
            
            showMessage(profilePicMessage, 'Profile picture removed', 'success');
            removeProfilePicBtn.disabled = true;
            
            // Clear message after 3 seconds
            setTimeout(() => {
                if (profilePicMessage) profilePicMessage.style.display = 'none';
            }, 3000);
        });
    }
    
    // Username Form
    const usernameForm = document.getElementById('username-form');
    const usernameMessage = document.getElementById('username-message');
    
    if (usernameForm) {
        usernameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username-input');
            if (!usernameInput) return;
            
            const newUsername = usernameInput.value.trim();
            
            if (!newUsername) {
                showMessage(usernameMessage, 'Username cannot be empty', 'error');
                return;
            }
            
            // Update user data
            const currentUserData = JSON.parse(localStorage.getItem('vilostudios_user') || '{}');
            currentUserData.name = newUsername;
            localStorage.setItem('vilostudios_user', JSON.stringify(currentUserData));
            
            // Update global userName
            if (typeof userName !== 'undefined') {
                window.userName = newUsername;
            }
            
            // Update UI
            updateProfileDisplay();
            
            showMessage(usernameMessage, 'Username updated successfully!', 'success');
            
            // Clear message after 3 seconds
            setTimeout(() => {
                if (usernameMessage) usernameMessage.style.display = 'none';
            }, 3000);
        });
    }
    
    // Password Form
    const passwordForm = document.getElementById('password-form');
    const passwordMessage = document.getElementById('password-message');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password')?.value;
            const newPassword = document.getElementById('new-password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            
            // Validate
            if (!currentPassword) {
                showMessage(passwordMessage, 'Please enter your current password', 'error');
                return;
            }
            
            if (newPassword.length < 8) {
                showMessage(passwordMessage, 'New password must be at least 8 characters long', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showMessage(passwordMessage, 'New passwords do not match', 'error');
                return;
            }
            
            // In a real app, this would make an API call to verify current password and update
            // For now, we'll just show a success message
            showMessage(passwordMessage, 'Password updated successfully!', 'success');
            passwordForm.reset();
            
            // Clear message after 3 seconds
            setTimeout(() => {
                if (passwordMessage) passwordMessage.style.display = 'none';
            }, 3000);
        });
    }
    
    // 2FA Toggle
    const twoFAToggle = document.getElementById('twofa-toggle');
    const twoFAPinSection = document.getElementById('twofa-pin-section');
    const twoFAMessage = document.getElementById('twofa-message');
    const saveTwoFAPinBtn = document.getElementById('save-twofa-pin-btn');
    
    if (twoFAToggle) {
        twoFAToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            if (twoFAPinSection) twoFAPinSection.style.display = enabled ? 'block' : 'none';
            localStorage.setItem('vilostudios_2fa_enabled', enabled ? 'true' : 'false');
            
            if (!enabled) {
                // Clear PIN when disabling
                const pinInput = document.getElementById('twofa-pin');
                if (pinInput) pinInput.value = '';
                localStorage.removeItem('vilostudios_2fa_pin');
                if (twoFAMessage) twoFAMessage.style.display = 'none';
            }
        });
    }
    
    // Save 2FA PIN
    if (saveTwoFAPinBtn) {
        saveTwoFAPinBtn.addEventListener('click', () => {
            const pinInput = document.getElementById('twofa-pin');
            if (!pinInput) return;
            
            const pin = pinInput.value.trim();
            
            if (!pin) {
                showMessage(twoFAMessage, 'Please enter a 6-digit PIN', 'error');
                return;
            }
            
            if (!/^\d{6}$/.test(pin)) {
                showMessage(twoFAMessage, 'PIN must be exactly 6 digits', 'error');
                return;
            }
            
            // Save PIN (in a real app, this would be encrypted)
            localStorage.setItem('vilostudios_2fa_pin', pin);
            showMessage(twoFAMessage, '2FA PIN saved successfully!', 'success');
            
            // Clear message after 3 seconds
            setTimeout(() => {
                if (twoFAMessage) twoFAMessage.style.display = 'none';
            }, 3000);
        });
    }
}

// Open Image Cropper - full-screen popup using Cropper.js
function openImageCropper(imageSrc) {
    closeCropperModal();
    createCropperModal(imageSrc);
}

// Helper function to show messages
function showMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
}

// Save profile picture and update all locations
function saveProfilePicture(imageUrl) {
    if (!imageUrl) return;
    
    // Save to localStorage
    localStorage.setItem('vilostudios_profile_pic', imageUrl);
    
    // Update all avatar locations
    updateAllAvatars(imageUrl);
}

// Update profile picture in sidebar and header
function updateProfilePicture(imageUrl) {
    // This function is called when preview is updated, but doesn't save yet
    // The save button will call saveProfilePicture() which updates all avatars
}

// Update all avatar locations with profile picture
function updateAllAvatars(imageUrl) {
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const headerAvatar = document.getElementById('header-avatar');
    
    if (!imageUrl || imageUrl.trim() === '') {
        // No image, use initials
        if (sidebarAvatar) {
            sidebarAvatar.innerHTML = userInitial || (userName ? userName.charAt(0).toUpperCase() : 'U');
        }
        if (headerAvatar) {
            headerAvatar.innerHTML = userInitial || (userName ? userName.charAt(0).toUpperCase() : 'U');
        }
        return;
    }
    
        // Convert avatars to show images
        if (sidebarAvatar) {
            if (sidebarAvatar.tagName === 'IMG') {
                sidebarAvatar.src = imageUrl;
            sidebarAvatar.onerror = function() {
                // If image fails to load, fall back to initials
                this.style.display = 'none';
                sidebarAvatar.innerHTML = userInitial || (userName ? userName.charAt(0).toUpperCase() : 'U');
            };
            } else {
            // Replace div content with img
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Profile Picture';
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%;';
            img.onerror = function() {
                // If image fails to load, fall back to initials
                sidebarAvatar.innerHTML = userInitial || (userName ? userName.charAt(0).toUpperCase() : 'U');
            };
                sidebarAvatar.innerHTML = '';
                sidebarAvatar.appendChild(img);
            }
        }
        
        if (headerAvatar) {
            if (headerAvatar.tagName === 'IMG') {
                headerAvatar.src = imageUrl;
            headerAvatar.onerror = function() {
                // If image fails to load, fall back to initials
                this.style.display = 'none';
                headerAvatar.innerHTML = userInitial || (userName ? userName.charAt(0).toUpperCase() : 'U');
            };
            } else {
            // Replace div content with img
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Profile Picture';
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%;';
            img.onerror = function() {
                // If image fails to load, fall back to initials
                headerAvatar.innerHTML = userInitial || (userName ? userName.charAt(0).toUpperCase() : 'U');
            };
                headerAvatar.innerHTML = '';
                headerAvatar.appendChild(img);
        }
    }
}

// Load Storage Information
async function loadStorageInfo() {
    // Check if API bypass is enabled
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        // Use mock data when API bypass is enabled
        const mockData = {
            success: true,
            space: {
                used: 2048576000, // 2GB in bytes
                total: 10737418240, // 10GB in bytes
                used_percent: 19.07,
                used_formatted: '2.0 GB',
                total_formatted: '10.0 GB',
                status: 'ok'
            },
            inodes: {
                used: 45000,
                total: 500000,
                used_percent: 9.0,
                used_formatted: '45,000',
                total_formatted: '500,000',
                status: 'ok'
            }
        };
        updateStorageDisplay(mockData);
        return;
    }
    
    try {
        const response = await fetch('../../api/system/storage.php');
        
        // Check if response is actually JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON - API endpoint may not exist');
        }
        
        const result = await response.json();
        
        if (result.success) {
            updateStorageDisplay(result);
        } else {
            showStorageError(result.message || 'Failed to load storage information');
        }
    } catch (error) {
        console.error('Error loading storage info:', error);
        // Only show error if API bypass is not enabled
        if (!apiBypass) {
        showStorageError('Error loading storage information: ' + error.message);
        }
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
    
    if (spaceCard && spaceProgress && spacePercent && spaceUsage && spaceStatus && data.space) {
        const percent = data.space.used_percent || 0;
        spaceProgress.style.width = percent + '%';
        spacePercent.textContent = percent.toFixed(2) + '%';
        spaceUsage.textContent = `${data.space.used_formatted || '0 GB'} / ${data.space.total_formatted || '0 GB'}`;
        
        // Determine status based on percentage
        let status = data.space.status || 'ok';
        if (percent >= 90) {
            status = 'critical';
        } else if (percent >= 75) {
            status = 'warning';
        }
        
        // Update status badge
        spaceStatus.textContent = status === 'critical' ? 'Critical' : 
                                  status === 'warning' ? 'Warning' : 'OK';
        spaceStatus.className = 'storage-badge status-' + status;
        spaceCard.className = 'storage-stat-card status-' + status;
        
        // Show warning if needed
        if (status === 'critical' || status === 'warning') {
            showStorageWarning('space', percent, status);
        }
    }
    
    // Update Inodes information
        const inodesCard = document.getElementById('storage-inodes-card');
        const inodesProgress = document.getElementById('storage-inodes-progress');
        const inodesPercent = document.getElementById('storage-inodes-percent');
        const inodesUsage = document.getElementById('storage-inodes-usage');
        const inodesStatus = document.getElementById('storage-inodes-status');
        
    if (inodesCard && inodesProgress && inodesPercent && inodesUsage && inodesStatus && data.inodes) {
        const percent = data.inodes.used_percent || 0;
        inodesProgress.style.width = percent + '%';
        inodesPercent.textContent = percent.toFixed(2) + '%';
        
        // Format inodes usage
        const usedFormatted = data.inodes.used_formatted || data.inodes.used?.toLocaleString() || '0';
        const totalFormatted = data.inodes.total_formatted || data.inodes.total?.toLocaleString() || '0';
        inodesUsage.textContent = `${usedFormatted} / ${totalFormatted}`;
        
        // Determine status based on percentage
        let status = data.inodes.status || 'ok';
        if (percent >= 90) {
            status = 'critical';
        } else if (percent >= 75) {
            status = 'warning';
        }
        
        // Update status badge
        inodesStatus.textContent = status === 'critical' ? 'Critical' : 
                                   status === 'warning' ? 'Warning' : 'OK';
        inodesStatus.className = 'storage-badge status-' + status;
        inodesCard.className = 'storage-stat-card status-' + status;
        
        // Show warning if needed
        if (status === 'critical' || status === 'warning') {
            showStorageWarning('inodes', percent, status);
        }
    }
    
    // Handle case where inodes might not be available
    if (!data.inodes && inodesCard && inodesUsage && inodesStatus) {
        inodesUsage.textContent = 'Not available on this system';
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
            displaySupportCases(result.data);
            
            // Update email filter dropdown with all available emails
            if (window.updateSupportCasesEmailFilter) {
                // Get all cases to populate email filter (only if we haven't loaded all already)
                if (status !== 'all' || emailFilter !== 'all') {
                const allParams = new URLSearchParams({ status: 'all' });
                fetch(`../../api/support-cases/list.php?${allParams.toString()}`)
                    .then(r => r.json())
                    .then(allResult => {
                        if (allResult.success && allResult.data) {
                            window.updateSupportCasesEmailFilter(allResult.data);
                        }
                    })
                    .catch(err => console.error('Error loading all cases for email filter:', err));
                } else {
                    // We already have all cases, use them directly
                    window.updateSupportCasesEmailFilter(result.data);
            }
            }
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

// ============================================
// DOCUMENTS & PRICING PAGE
// ============================================

let currentDocumentTab = 'public';
let documentsQuillEditor = null;

// Render Documents Page
// ============================================
// CUTS MANAGEMENT SYSTEM
// ============================================

// Cuts Management State
let cutsManagementData = {
    cuts: [],
    budget: {
        total: 0,
        spent: 0,
        perCut: 0,
        maxCuts: 0
    }
};

// Render Cuts Management Page
function renderCutsManagementPage(selectedProjectId = 'all') {
    const otherPages = document.getElementById('other-pages');
    if (!otherPages) return;
    
    // Load cuts data from storage
    const storedCuts = localStorage.getItem('vilostudios_cuts_management');
    if (storedCuts) {
        cutsManagementData = JSON.parse(storedCuts);
    } else {
        // Initialize default budget if director
        if (userRole === 'director') {
            cutsManagementData.budget = {
                total: 0,
                spent: 0,
                perCut: 0,
                maxCuts: 0
            };
        }
        cutsManagementData.cuts = [];
        cutsManagementData.cutsByProject = {}; // Store cuts per project
    }
    
    // Migrate old structure to new structure (cutsByProject)
    if (!cutsManagementData.cutsByProject) {
        cutsManagementData.cutsByProject = {};
        const allCuts = cutsManagementData.cuts || [];
        allCuts.forEach(cut => {
            const projectId = cut.projectId || 'no-project';
            if (!cutsManagementData.cutsByProject[projectId]) {
                cutsManagementData.cutsByProject[projectId] = [];
            }
            cutsManagementData.cutsByProject[projectId].push(cut);
        });
        localStorage.setItem('vilostudios_cuts_management', JSON.stringify(cutsManagementData));
    }
    
    // Get cuts for selected project or all cuts
    let cuts = [];
    if (selectedProjectId === 'all') {
        // Get all cuts from all projects
        cuts = Object.values(cutsManagementData.cutsByProject || {}).flat();
    } else {
        cuts = cutsManagementData.cutsByProject[selectedProjectId] || [];
    }
    
    // Get all projects for filter dropdown
    const projects = JSON.parse(localStorage.getItem('vilostudios_projects') || '[]');
    const budget = cutsManagementData.budget || { total: 0, spent: 0, perCut: 0, maxCuts: 0 };
    
    // Count by format
    const cspCount = cuts.filter(c => c.format === 'csp' || c.name?.toLowerCase().endsWith('.csp')).length;
    const mp4Count = cuts.filter(c => c.format === 'mp4' || c.name?.toLowerCase().endsWith('.mp4')).length;
    const totalCuts = cuts.length;
    
    otherPages.innerHTML = `
        <div class="cuts-management-panel">
            <div class="cuts-management-header">
                <div class="cuts-header-top">
                    <h3 class="panel-title">
                        <svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                        </svg>
                        Cuts Management
                    </h3>
                    <div class="cuts-header-actions">
                        <button class="btn-secondary" onclick="exportCuts()" title="Export Cuts">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export
                        </button>
                        <button class="btn-secondary" onclick="importCuts()" title="Import Cuts">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            Import
                        </button>
                        <button class="btn-primary" onclick="openUploadCutModal()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            Upload Cut
                        </button>
                    </div>
                </div>
                
                <!-- Project Filter -->
                <div class="cuts-project-filter">
                    <label for="cuts-project-filter" class="form-label">Filter by Project</label>
                    <select id="cuts-project-filter" class="form-input" onchange="filterCutsByProject(this.value)" style="max-width: 300px;">
                        <option value="all" ${selectedProjectId === 'all' ? 'selected' : ''}>All Projects</option>
                        ${projects.map(project => `
                            <option value="${escapeHtml(project.id || project.project_id)}" ${selectedProjectId === (project.id || project.project_id) ? 'selected' : ''}>
                                ${escapeHtml(project.project_name || project.name || 'Unnamed Project')}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <!-- Budget Overview (Director Only) -->
                ${userRole === 'director' ? `
                    <div class="budget-overview">
                        <div class="budget-card">
                            <div class="budget-card-header">
                                <h4>Budget Management</h4>
                                <button class="btn-icon-small" onclick="openBudgetSettingsModal()" title="Edit Budget">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="budget-stats">
                                <div class="budget-stat">
                                    <span class="budget-label">Total Budget</span>
                                    <span class="budget-value">$${formatNumber(budget.total)}</span>
                                </div>
                                <div class="budget-stat">
                                    <span class="budget-label">Spent</span>
                                    <span class="budget-value spent">$${formatNumber(budget.spent)}</span>
                                </div>
                                <div class="budget-stat">
                                    <span class="budget-label">Remaining</span>
                                    <span class="budget-value remaining">$${formatNumber(budget.total - budget.spent)}</span>
                                </div>
                                <div class="budget-stat">
                                    <span class="budget-label">Per Cut</span>
                                    <span class="budget-value">$${formatNumber(budget.perCut)}</span>
                                </div>
                                <div class="budget-stat">
                                    <span class="budget-label">Max Cuts</span>
                                    <span class="budget-value">${budget.maxCuts || 'Unlimited'}</span>
                                </div>
                            </div>
                            <div class="budget-progress">
                                <div class="budget-progress-bar">
                                    <div class="budget-progress-fill" style="width: ${budget.total > 0 ? (budget.spent / budget.total * 100) : 0}%"></div>
                                </div>
                                <span class="budget-progress-text">${budget.total > 0 ? ((budget.spent / budget.total * 100).toFixed(1)) : 0}% used</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Cuts Summary -->
                <div class="cuts-summary">
                    <div class="cuts-summary-card">
                        <div class="cuts-summary-icon csp">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <path d="M8 12h8M12 8v8"/>
                            </svg>
                        </div>
                        <div class="cuts-summary-info">
                            <span class="cuts-summary-label">CSP Files</span>
                            <span class="cuts-summary-count">${cspCount}</span>
                        </div>
                    </div>
                    <div class="cuts-summary-card">
                        <div class="cuts-summary-icon mp4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="23 7 16 12 23 17 23 7"/>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                            </svg>
                        </div>
                        <div class="cuts-summary-info">
                            <span class="cuts-summary-label">MP4 Files</span>
                            <span class="cuts-summary-count">${mp4Count}</span>
                        </div>
                    </div>
                    <div class="cuts-summary-card">
                        <div class="cuts-summary-icon total">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                        </div>
                        <div class="cuts-summary-info">
                            <span class="cuts-summary-label">Total Cuts</span>
                            <span class="cuts-summary-count">${totalCuts}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Filters and Search -->
            <div class="cuts-filters">
                <div class="cuts-search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input type="text" id="cuts-search-input" class="form-input" placeholder="Search by name..." oninput="filterCuts()">
                </div>
                <div class="cuts-format-filters">
                    <button class="format-filter-btn ${!window.currentCutFilter || window.currentCutFilter === 'all' ? 'active' : ''}" onclick="filterCutsByFormat('all')">
                        All Formats
                    </button>
                    <button class="format-filter-btn ${window.currentCutFilter === 'csp' ? 'active' : ''}" onclick="filterCutsByFormat('csp')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                        </svg>
                        CSP (${cspCount})
                    </button>
                    <button class="format-filter-btn ${window.currentCutFilter === 'mp4' ? 'active' : ''}" onclick="filterCutsByFormat('mp4')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="23 7 16 12 23 17 23 7"/>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                        MP4 (${mp4Count})
                    </button>
                </div>
            </div>
            
            <!-- Cuts List -->
            <div class="cuts-list-container" id="cuts-list-container">
                ${renderCutsList(cuts)}
            </div>
        </div>
    `;
    
    // Initialize filters
    window.currentCutFilter = 'all';
    setupCutsHandlers();
}

// Render Cuts List
function renderCutsList(cuts, filterFormat = 'all', searchQuery = '') {
    if (!cuts || cuts.length === 0) {
        return `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h3>No cuts uploaded yet</h3>
                <p>Upload your first cut to get started</p>
                <button class="btn-primary" onclick="openUploadCutModal()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload First Cut
                </button>
            </div>
        `;
    }
    
    // Filter cuts
    let filteredCuts = [...cuts];
    
    if (filterFormat !== 'all') {
        filteredCuts = filteredCuts.filter(cut => {
            const format = cut.format || (cut.name?.toLowerCase().endsWith('.csp') ? 'csp' : cut.name?.toLowerCase().endsWith('.mp4') ? 'mp4' : '');
            return format === filterFormat;
        });
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredCuts = filteredCuts.filter(cut => 
            cut.name?.toLowerCase().includes(query) ||
            cut.projectName?.toLowerCase().includes(query) ||
            cut.uploadedBy?.toLowerCase().includes(query)
        );
    }
    
    if (filteredCuts.length === 0) {
        return `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <h3>No cuts found</h3>
                <p>Try adjusting your filters or search query</p>
            </div>
        `;
    }
    
    // Sort by date (newest first)
    filteredCuts.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    return `
        <div class="cuts-grid">
            ${filteredCuts.map((cut, index) => {
                const format = cut.format || (cut.name?.toLowerCase().endsWith('.csp') ? 'csp' : cut.name?.toLowerCase().endsWith('.mp4') ? 'mp4' : 'unknown');
                const isCsp = format === 'csp';
                const isMp4 = format === 'mp4';
                const fileSize = cut.size ? formatFileSize(cut.size) : 'Unknown';
                const uploadDate = cut.uploadedAt ? new Date(cut.uploadedAt).toLocaleDateString() : 'Unknown';
                
                return `
                    <div class="cut-card" data-cut-id="${cut.id}">
                        <div class="cut-card-header">
                            <div class="cut-format-badge ${format}">
                                ${isCsp ? `
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <path d="M8 12h8M12 8v8"/>
                                    </svg>
                                    CSP
                                ` : isMp4 ? `
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polygon points="23 7 16 12 23 17 23 7"/>
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                    </svg>
                                    MP4
                                ` : format.toUpperCase()}
                            </div>
                            <div class="cut-card-actions">
                                <button class="btn-icon-small" onclick="downloadCut('${cut.id}')" title="Download">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="7 10 12 15 17 10"/>
                                        <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                </button>
                                <button class="btn-icon-small" onclick="deleteCut('${cut.id}')" title="Delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="cut-card-preview">
                            ${isMp4 && cut.dataUrl ? `
                                <video src="${cut.dataUrl}" class="cut-preview-video" muted></video>
                            ` : isCsp ? `
                                <div class="cut-preview-icon csp">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <path d="M8 12h8M12 8v8"/>
                                    </svg>
                                </div>
                            ` : `
                                <div class="cut-preview-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                </div>
                            `}
                        </div>
                        <div class="cut-card-info">
                            <h4 class="cut-card-name" title="${escapeHtml(cut.name)}">${escapeHtml(cut.name)}</h4>
                            ${cut.projectName ? `<p class="cut-project-name">${escapeHtml(cut.projectName)}</p>` : ''}
                            <div class="cut-card-meta">
                                <span class="cut-size">${fileSize}</span>
                                <span class="cut-date">${uploadDate}</span>
                            </div>
                            ${cut.uploadedBy ? `<p class="cut-uploader">Uploaded by ${escapeHtml(cut.uploadedBy)}</p>` : ''}
                            ${cut.cost && userRole === 'director' ? `<p class="cut-cost">Cost: $${formatNumber(cut.cost)}</p>` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Setup Cuts Handlers
function setupCutsHandlers() {
    // Search handler is already set up via oninput
    // Project filter handler is set up via onchange
}

// Filter Cuts by Project
function filterCutsByProject(projectId) {
    window.currentCutProject = projectId || 'all';
    renderCutsManagementPage(projectId || 'all');
}

// Filter Cuts
function filterCuts() {
    const searchInput = document.getElementById('cuts-search-input');
    const searchQuery = searchInput ? searchInput.value : '';
    const container = document.getElementById('cuts-list-container');
    const cuts = cutsManagementData.cuts || [];
    
    if (container) {
        container.innerHTML = renderCutsList(cuts, window.currentCutFilter || 'all', searchQuery);
    }
}

// Filter Cuts by Format
function filterCutsByFormat(format) {
    window.currentCutFilter = format;
    
    // Update filter button states
    document.querySelectorAll('.format-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-render list
    const searchInput = document.getElementById('cuts-search-input');
    const searchQuery = searchInput ? searchInput.value : '';
    const container = document.getElementById('cuts-list-container');
    const cuts = cutsManagementData.cuts || [];
    
    if (container) {
        container.innerHTML = renderCutsList(cuts, format, searchQuery);
    }
}

// Open Upload Cut Modal
function openUploadCutModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.id = 'upload-cut-modal';
    modal.innerHTML = `
        <div class="project-modal upload-modal">
            <div class="project-modal-header">
                <h2>Upload Cut</h2>
                <button class="btn-close-modal" onclick="closeUploadCutModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <form id="upload-cut-form">
                    <div class="form-group">
                        <label for="cut-file-input">Cut File * (CSP or MP4)</label>
                        <div class="upload-drop-zone" id="cut-drop-zone">
                            <div class="upload-drop-content">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <h3>Drag & drop cut file here</h3>
                                <p>or click to browse</p>
                                <input type="file" id="cut-file-input" accept=".csp,.mp4" style="display: none;">
                                <button type="button" class="btn-secondary" onclick="document.getElementById('cut-file-input').click()">Browse Files</button>
                                <p class="help-text">Supported formats: CSP (Clip Studio Paint), MP4</p>
                            </div>
                        </div>
                        <div id="cut-file-preview" style="display: none; margin-top: var(--spacing-md);"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="cut-name">Cut Name *</label>
                        <input type="text" id="cut-name" class="form-input" placeholder="Enter cut name..." required>
                    </div>
                    
                    <div class="form-group">
                        <label for="cut-project-select">Project *</label>
                        <select id="cut-project-select" class="form-input" required>
                            <option value="">Select a project...</option>
                            <option value="no-project">No Project (Unassigned)</option>
                        </select>
                        <p class="help-text">Cuts are organized by project</p>
                    </div>
                    
                    ${userRole === 'director' ? `
                        <div class="form-group">
                            <label for="cut-cost">Cost (Optional)</label>
                            <input type="number" id="cut-cost" class="form-input" placeholder="0.00" step="0.01" min="0">
                            <p class="help-text">Cost per cut for budget tracking</p>
                        </div>
                    ` : ''}
                </form>
            </div>
            <div class="project-modal-footer">
                <button class="btn-secondary" onclick="closeUploadCutModal()">Cancel</button>
                <button class="btn-primary" id="upload-cut-confirm-btn" onclick="confirmCutUpload()" disabled>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload Cut
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup file input
    const fileInput = document.getElementById('cut-file-input');
    const dropZone = document.getElementById('cut-drop-zone');
    const preview = document.getElementById('cut-file-preview');
    const confirmBtn = document.getElementById('upload-cut-confirm-btn');
    
    window.pendingCutFile = null;
    
    // File input handler
    fileInput.addEventListener('change', (e) => {
        handleCutFileSelection(e.target.files[0]);
    });
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleCutFileSelection(file);
        }
    });
    
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    function handleCutFileSelection(file) {
        if (!file) return;
        
        // Validate file type
        const fileName = file.name.toLowerCase();
        const isCsp = fileName.endsWith('.csp');
        const isMp4 = fileName.endsWith('.mp4');
        
        if (!isCsp && !isMp4) {
            showNotification('Please select a CSP or MP4 file', 'error');
            return;
        }
        
        window.pendingCutFile = file;
        confirmBtn.disabled = false;
        
        // Show preview
        preview.style.display = 'block';
        if (isMp4) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `
                    <div class="cut-preview-container">
                        <video src="${e.target.result}" controls class="cut-preview-video-small"></video>
                        <div class="cut-preview-info">
                            <strong>${escapeHtml(file.name)}</strong>
                            <span>${formatFileSize(file.size)}</span>
                        </div>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = `
                <div class="cut-preview-container">
                    <div class="cut-preview-icon csp">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                        </svg>
                    </div>
                    <div class="cut-preview-info">
                        <strong>${escapeHtml(file.name)}</strong>
                        <span>${formatFileSize(file.size)}</span>
                    </div>
                </div>
            `;
        }
        
        // Auto-fill name if empty
        const nameInput = document.getElementById('cut-name');
        if (nameInput && !nameInput.value) {
            nameInput.value = file.name.replace(/\.(csp|mp4)$/i, '');
        }
    }
    
    // Populate projects datalist
    const projects = JSON.parse(localStorage.getItem('vilostudios_projects') || '[]');
    const projectsList = document.getElementById('projects-list');
    if (projectsList && projects.length > 0) {
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.project_name || project.name || '';
            projectsList.appendChild(option);
        });
    }
}

// Close Upload Cut Modal
function closeUploadCutModal() {
    const modal = document.getElementById('upload-cut-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
    window.pendingCutFile = null;
}

// Confirm Cut Upload
async function confirmCutUpload() {
    const file = window.pendingCutFile;
    if (!file) return;
    
    const nameInput = document.getElementById('cut-name');
    const projectInput = document.getElementById('cut-project');
    const costInput = document.getElementById('cut-cost');
    const confirmBtn = document.getElementById('upload-cut-confirm-btn');
    
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
        showNotification('Please enter a cut name', 'error');
        return;
    }
    
    const fileName = file.name.toLowerCase();
    const format = fileName.endsWith('.csp') ? 'csp' : fileName.endsWith('.mp4') ? 'mp4' : 'unknown';
    
    // Check budget if director
    const budget = cutsManagementData.budget || {};
    const cost = costInput && costInput.value ? parseFloat(costInput.value) : budget.perCut || 0;
    
    if (userRole === 'director' && budget.maxCuts > 0) {
        const currentCuts = cutsManagementData.cuts?.length || 0;
        if (currentCuts >= budget.maxCuts) {
            showNotification(`Maximum cuts limit reached (${budget.maxCuts})`, 'error');
            return;
        }
    }
    
    if (userRole === 'director' && budget.total > 0) {
        const newSpent = budget.spent + cost;
        if (newSpent > budget.total) {
            showNotification('Uploading this cut would exceed the budget!', 'error');
            return;
        }
    }
    
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span class="spinner"></span> Uploading...';
    
    try {
        // Read file as data URL
        const dataUrl = await readFileAsDataUrl(file);
        
        // Create cut object
        const cut = {
            id: `cut-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: name,
            fileName: file.name,
            format: format,
            size: file.size,
            dataUrl: dataUrl,
            projectName: projectInput ? projectInput.value.trim() : null,
            uploadedBy: userName || userEmail,
            uploadedAt: new Date().toISOString(),
            cost: userRole === 'director' && cost > 0 ? cost : null
        };
        
        // Add to cuts array
        if (!cutsManagementData.cuts) {
            cutsManagementData.cuts = [];
        }
        cutsManagementData.cuts.push(cut);
        
        // Update budget if director
        if (userRole === 'director' && cost > 0) {
            if (!cutsManagementData.budget) {
                cutsManagementData.budget = { total: 0, spent: 0, perCut: 0, maxCuts: 0 };
            }
            cutsManagementData.budget.spent = (cutsManagementData.budget.spent || 0) + cost;
        }
        
        // Save to localStorage
        localStorage.setItem('vilostudios_cuts_management', JSON.stringify(cutsManagementData));
        
        // Close modal and refresh
        closeUploadCutModal();
        renderCutsManagementPage();
        
        showNotification('Cut uploaded successfully!', 'success');
    } catch (error) {
        console.error('Error uploading cut:', error);
        showNotification('Error uploading cut. Please try again.', 'error');
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Upload Cut';
    }
}

// Delete Cut
function deleteCut(cutId) {
    const cut = cutsManagementData.cuts?.find(c => c.id === cutId);
    if (!cut) return;
    
    showConfirmDialog(
        'Delete Cut',
        `Are you sure you want to delete "${cut.name}"? This action cannot be undone.`,
        'Delete',
        'Cancel',
        () => {
            const index = cutsManagementData.cuts.findIndex(c => c.id === cutId);
            if (index > -1) {
                // Remove cost from budget if director
                if (userRole === 'director' && cut.cost) {
                    cutsManagementData.budget.spent = Math.max(0, (cutsManagementData.budget.spent || 0) - cut.cost);
                }
                
                cutsManagementData.cuts.splice(index, 1);
                localStorage.setItem('vilostudios_cuts_management', JSON.stringify(cutsManagementData));
                
                renderCutsManagementPage();
                showNotification('Cut deleted successfully', 'success');
            }
        }
    );
}

// Download Cut
function downloadCut(cutId) {
    const cut = cutsManagementData.cuts?.find(c => c.id === cutId);
    if (!cut || !cut.dataUrl) return;
    
    const link = document.createElement('a');
    link.href = cut.dataUrl;
    link.download = cut.fileName || cut.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Open Budget Settings Modal (Director Only)
function openBudgetSettingsModal() {
    const budget = cutsManagementData.budget || { total: 0, spent: 0, perCut: 0, maxCuts: 0 };
    
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.id = 'budget-settings-modal';
    modal.innerHTML = `
        <div class="project-modal small-modal">
            <div class="project-modal-header">
                <h2>Budget Settings</h2>
                <button class="btn-close-modal" onclick="closeBudgetSettingsModal()">&times;</button>
            </div>
            <div class="project-modal-body">
                <form id="budget-settings-form">
                    <div class="form-group">
                        <label for="budget-total">Total Budget</label>
                        <input type="number" id="budget-total" class="form-input" placeholder="0.00" step="0.01" min="0" value="${budget.total || 0}">
                        <p class="help-text">Total budget allocated for cuts</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="budget-per-cut">Cost Per Cut</label>
                        <input type="number" id="budget-per-cut" class="form-input" placeholder="0.00" step="0.01" min="0" value="${budget.perCut || 0}">
                        <p class="help-text">Default cost per cut (can be overridden per cut)</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="budget-max-cuts">Maximum Cuts</label>
                        <input type="number" id="budget-max-cuts" class="form-input" placeholder="0" step="1" min="0" value="${budget.maxCuts || 0}">
                        <p class="help-text">Maximum number of cuts allowed (0 = unlimited)</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="budget-reset">Reset Spent Amount</label>
                        <button type="button" class="btn-secondary" onclick="resetBudgetSpent()">Reset to $0</button>
                        <p class="help-text">Current spent: $${formatNumber(budget.spent || 0)}</p>
                    </div>
                </form>
            </div>
            <div class="project-modal-footer">
                <button class="btn-secondary" onclick="closeBudgetSettingsModal()">Cancel</button>
                <button class="btn-primary" onclick="saveBudgetSettings()">Save Budget</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close Budget Settings Modal
function closeBudgetSettingsModal() {
    const modal = document.getElementById('budget-settings-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Save Budget Settings
function saveBudgetSettings() {
    const totalInput = document.getElementById('budget-total');
    const perCutInput = document.getElementById('budget-per-cut');
    const maxCutsInput = document.getElementById('budget-max-cuts');
    
    if (!cutsManagementData.budget) {
        cutsManagementData.budget = { total: 0, spent: 0, perCut: 0, maxCuts: 0 };
    }
    
    cutsManagementData.budget.total = totalInput ? parseFloat(totalInput.value) || 0 : 0;
    cutsManagementData.budget.perCut = perCutInput ? parseFloat(perCutInput.value) || 0 : 0;
    cutsManagementData.budget.maxCuts = maxCutsInput ? parseInt(maxCutsInput.value) || 0 : 0;
    
    // Ensure spent doesn't exceed total
    if (cutsManagementData.budget.spent > cutsManagementData.budget.total) {
        cutsManagementData.budget.spent = cutsManagementData.budget.total;
    }
    
    localStorage.setItem('vilostudios_cuts_management', JSON.stringify(cutsManagementData));
    
    closeBudgetSettingsModal();
    renderCutsManagementPage();
    
    showNotification('Budget settings saved!', 'success');
}

// Reset Budget Spent
function resetBudgetSpent() {
    if (confirm('Are you sure you want to reset the spent amount to $0? This action cannot be undone.')) {
        if (!cutsManagementData.budget) {
            cutsManagementData.budget = { total: 0, spent: 0, perCut: 0, maxCuts: 0 };
        }
        cutsManagementData.budget.spent = 0;
        localStorage.setItem('vilostudios_cuts_management', JSON.stringify(cutsManagementData));
        
        const modal = document.getElementById('budget-settings-modal');
        if (modal) {
            modal.querySelector('#budget-total').value = cutsManagementData.budget.total;
            modal.querySelector('#budget-per-cut').value = cutsManagementData.budget.perCut;
            modal.querySelector('#budget-max-cuts').value = cutsManagementData.budget.maxCuts;
            modal.querySelector('.help-text').textContent = `Current spent: $${formatNumber(0)}`;
        }
        
        showNotification('Budget spent amount reset', 'success');
    }
}

// Format Number (for currency)
function formatNumber(num) {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ============================================
// END CUTS MANAGEMENT SYSTEM
// ============================================

function renderDocumentsPage() {
    const otherPages = document.getElementById('other-pages');
    
    otherPages.innerHTML = `
        <div class="documents-panel">
            <div class="documents-header">
                <div class="documents-header-top">
                    <h3 class="panel-title">
                        <svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"></path>
                            <path d="M14 2V8H20"></path>
                        </svg>
                        Documents & Pricing
                    </h3>
                    <button class="btn-create-document" id="btn-create-document">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        Create Document
                    </button>
                </div>
                <!-- Tabs -->
                <div class="documents-tabs">
                    <button class="documents-tab active" data-tab="public" id="tab-public">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11Z"></path>
                            <path d="M21 21L16.65 16.65"></path>
                        </svg>
                        Public Documents
                    </button>
                    <button class="documents-tab" data-tab="private" id="tab-private">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"></path>
                        </svg>
                        Private Documents
                    </button>
                    <button class="documents-tab" data-tab="templates" id="tab-templates">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"></path>
                            <path d="M14 2V8H20"></path>
                        </svg>
                        Templates
                    </button>
                </div>
            </div>
            
            <div id="documents-content" class="documents-content">
                <div class="loading-state">Loading documents...</div>
            </div>
        </div>
    `;
    
    // Setup create document button
    const createDocumentBtn = document.getElementById('btn-create-document');
    if (createDocumentBtn) {
        createDocumentBtn.addEventListener('click', () => {
            openCreateDocumentModal();
        });
    }
    
    // Setup tab switching
    document.querySelectorAll('.documents-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            currentDocumentTab = tabType;
            
            // Update active tab
            document.querySelectorAll('.documents-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Load documents for selected tab
            loadDocuments(tabType);
        });
    });
    
    // Load initial documents (public)
    loadDocuments('public');
}

// Load Documents
async function loadDocuments(type) {
    const contentDiv = document.getElementById('documents-content');
    if (!contentDiv) return;
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        const exampleDocs = getExampleDocuments(type);
        displayDocuments(exampleDocs, type);
        return;
    }
    
    try {
        const response = await fetch(`../../api/documents/list.php?type=${type}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            displayDocuments(result.data, type);
        } else {
            contentDiv.innerHTML = `<div class="empty-state">${result.message || 'Failed to load documents'}</div>`;
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        contentDiv.innerHTML = '<div class="empty-state">Error loading documents</div>';
    }
}

// Get Example Documents (for API bypass)
function getExampleDocuments(type) {
    const allDocs = [
        { id: 1, title: 'Terms of Service', slug: 'terms-of-service', type: 'public', category: 'terms-of-service', content: '<h2>Terms of Service</h2><p>Welcome to VILOSTUDIOS...</p>', created_at: '2024-01-15 10:00:00' },
        { id: 2, title: 'Privacy Policy', slug: 'privacy-policy', type: 'public', category: 'privacy-policy', content: '<h2>Privacy Policy</h2><p>Your privacy is important...</p>', created_at: '2024-01-15 10:00:00' },
        { id: 3, title: 'Client Contract Template', slug: 'client-contract-template', type: 'template', category: null, content: '<h2>Client Contract</h2><p>This is a template...</p>', created_at: '2024-01-15 10:00:00' },
        { id: 4, title: 'Internal Pricing Guide', slug: 'internal-pricing-guide', type: 'private', category: null, content: '<h2>Internal Pricing Guide</h2><p>Confidential pricing information...</p>', created_at: '2024-01-15 10:00:00' }
    ];
    
    if (type === 'all') {
        return allDocs;
    }
    
    if (type === 'templates') {
        return allDocs.filter(doc => doc.type === 'template');
    }
    
    return allDocs.filter(doc => doc.type === type);
}

// Display Documents
function displayDocuments(documents, type) {
    const contentDiv = document.getElementById('documents-content');
    if (!contentDiv) return;
    
    if (documents.length === 0) {
        contentDiv.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3; margin-bottom: 1rem;">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"></path>
                    <path d="M14 2V8H20"></path>
                </svg>
                <p>No ${type === 'public' ? 'public' : type === 'private' ? 'private' : 'template'} documents yet.</p>
                <button class="btn-primary" onclick="openCreateDocumentModal()" style="margin-top: 1rem;">
                    Create Document
                </button>
            </div>
        `;
        return;
    }
    
    const documentsHTML = documents.map(doc => {
        const categoryBadge = doc.category ? `<span class="document-category-badge">${doc.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>` : '';
        const date = new Date(doc.created_at || doc.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        return `
            <div class="document-card" data-doc-id="${doc.id}">
                <div class="document-card-header">
                    <div class="document-card-title-row">
                        <h4 class="document-card-title">${doc.title}</h4>
                        ${categoryBadge ? categoryBadge : ''}
                    </div>
                    <div class="document-card-actions">
                        <button class="btn-action-icon" onclick="openEditDocumentModal(${doc.id})" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"></path>
                                <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"></path>
                            </svg>
                        </button>
                        <button class="btn-action-icon" onclick="downloadDocument(${doc.id}, '${doc.title}')" title="Download">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                        <button class="btn-action-icon btn-danger" onclick="deleteDocument(${doc.id}, '${doc.title}')" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="document-card-meta">
                    <span class="document-card-date">Created: ${date}</span>
                    ${doc.slug ? `<span class="document-card-slug">Slug: ${doc.slug}</span>` : ''}
                </div>
                <div class="document-card-preview">
                    ${doc.content ? stripHtml(doc.content).substring(0, 150) + '...' : 'No content'}
                </div>
            </div>
        `;
    }).join('');
    
    contentDiv.innerHTML = `<div class="documents-grid">${documentsHTML}</div>`;
}

// Strip HTML tags
function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Open Create Document Modal - redirects to editor page
function openCreateDocumentModal() {
    window.location.href = `document-editor.html?type=${currentDocumentTab}`;
}

// Open Edit Document Modal (wrapper) - redirects to editor page
async function openEditDocumentModal(docId) {
    window.location.href = `document-editor.html?id=${docId}`;
}

// Open Document Modal (main function)
async function openDocumentModal(docId, defaultType = 'public') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content modal-content-large">
            <div class="modal-header">
                <h3>${docId ? 'Edit Document' : 'Create Document'}</h3>
                <button class="modal-close" onclick="closeDocumentModal()">&times;</button>
            </div>
            <form id="document-form" class="document-form">
                <div class="form-group">
                    <label for="document-title" class="form-label">Title *</label>
                    <input type="text" id="document-title" class="form-input" required placeholder="Enter document title">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="document-type" class="form-label">Type *</label>
                        <select id="document-type" class="form-input" required>
                            <option value="public" ${defaultType === 'public' ? 'selected' : ''}>Public (shown on Resources page)</option>
                            <option value="private" ${defaultType === 'private' ? 'selected' : ''}>Private</option>
                            <option value="template" ${defaultType === 'template' ? 'selected' : ''}>Template</option>
                        </select>
                    </div>
                    <div class="form-group" id="category-group" style="display: ${defaultType === 'public' ? 'block' : 'none'};">
                        <label for="document-category" class="form-label">Category (for public documents)</label>
                        <select id="document-category" class="form-input">
                            <option value="">Select category</option>
                            <option value="terms-of-service">Terms of Service</option>
                            <option value="privacy-policy">Privacy Policy</option>
                            <option value="cookie-policy">Cookie Policy</option>
                            <option value="community-guidelines">Community Guidelines</option>
                            <option value="content-policy">Content Policy</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="document-slug" class="form-label">Slug (URL-friendly identifier) *</label>
                    <input type="text" id="document-slug" class="form-input" required placeholder="e.g., terms-of-service" pattern="[a-z0-9-]+">
                    <small class="form-help">Only lowercase letters, numbers, and hyphens allowed</small>
                </div>
                
                <div class="form-group">
                    <label for="document-content" class="form-label">Content *</label>
                    <div id="document-content-editor" class="quill-editor-large"></div>
                    <input type="hidden" id="document-content" required>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary" id="submit-document-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 0.5rem;">
                            <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        ${docId ? 'Update Document' : 'Create Document'}
                    </button>
                    <button type="button" class="btn-secondary" onclick="closeDocumentModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show category field when type is public
    const typeSelect = modal.querySelector('#document-type');
    const categoryGroup = modal.querySelector('#category-group');
    typeSelect.addEventListener('change', (e) => {
        categoryGroup.style.display = e.target.value === 'public' ? 'block' : 'none';
    });
    
    // Auto-generate slug from title
    const titleInput = modal.querySelector('#document-title');
    const slugInput = modal.querySelector('#document-slug');
    titleInput.addEventListener('input', (e) => {
        if (!docId && !slugInput.dataset.manual) {
            slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
    });
    slugInput.addEventListener('input', () => {
        slugInput.dataset.manual = 'true';
    });
    
    // Initialize Quill editor
    setTimeout(() => {
        if (typeof Quill === 'undefined') {
            alert('Quill editor library is not loaded. Please refresh the page.');
            document.body.removeChild(modal);
            return;
        }
        
        try {
            documentsQuillEditor = new Quill('#document-content-editor', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        ['blockquote', 'code-block'],
                        ['clean']
                    ]
                },
                placeholder: 'Enter document content...'
            });
            
            // Load document if editing
            if (docId) {
                loadDocumentForEdit(docId);
            }
        } catch (error) {
            console.error('Error initializing Quill editor:', error);
            alert('Error initializing editor. Please try again.');
            document.body.removeChild(modal);
        }
    }, 100);
    
    // Handle form submission
    const form = modal.querySelector('#document-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitDocumentForm(docId);
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDocumentModal();
        }
    });
}

// Load Document for Edit
async function loadDocumentForEdit(docId) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    let docData;
    
    if (apiBypass) {
        const allDocs = getExampleDocuments('all');
        docData = allDocs.find(d => d.id === docId);
    } else {
        try {
            const response = await fetch(`../../api/documents/get.php?id=${docId}`);
            const result = await response.json();
            if (result.success && result.data) {
                docData = result.data;
            } else {
                alert('Failed to load document');
                return;
            }
        } catch (error) {
            console.error('Error loading document:', error);
            alert('Error loading document');
            return;
        }
    }
    
    if (!docData) {
        alert('Document not found');
        return;
    }
    
    // Fill form fields
    document.getElementById('document-title').value = docData.title || '';
    document.getElementById('document-slug').value = docData.slug || '';
    document.getElementById('document-type').value = docData.type || 'public';
    document.getElementById('document-category').value = docData.category || '';
    
    // Update category visibility
    const categoryGroup = document.getElementById('category-group');
    categoryGroup.style.display = docData.type === 'public' ? 'block' : 'none';
    
    // Set Quill content
    if (documentsQuillEditor && docData.content) {
        documentsQuillEditor.root.innerHTML = docData.content;
    }
}

// Submit Document Form
async function submitDocumentForm(docId) {
    const form = document.getElementById('document-form');
    const submitBtn = document.getElementById('submit-document-btn');
    
    if (!documentsQuillEditor) {
        alert('Editor not initialized');
        return;
    }
    
    const content = documentsQuillEditor.root.innerHTML;
    const title = document.getElementById('document-title').value;
    const slug = document.getElementById('document-slug').value;
    const type = document.getElementById('document-type').value;
    const category = type === 'public' ? document.getElementById('document-category').value : null;
    
    if (!content.trim()) {
        alert('Please enter document content');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = docId ? 'Updating...' : 'Creating...';
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        // Simulate API call
        setTimeout(() => {
            alert(docId ? 'Document updated successfully!' : 'Document created successfully!');
            closeDocumentModal();
            loadDocuments(currentDocumentTab);
            submitBtn.disabled = false;
        }, 500);
        return;
    }
    
    try {
        const url = docId ? '../../api/documents/update.php' : '../../api/documents/create.php';
        const method = docId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: docId || null,
                title,
                slug,
                content,
                type,
                category
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(docId ? 'Document updated successfully!' : 'Document created successfully!');
            closeDocumentModal();
            loadDocuments(currentDocumentTab);
        } else {
            alert(result.message || 'Failed to save document');
        }
    } catch (error) {
        console.error('Error saving document:', error);
        alert('Error saving document');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = docId ? 'Update Document' : 'Create Document';
    }
}

// Close Document Modal
function closeDocumentModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        documentsQuillEditor = null;
        document.body.removeChild(modal);
    }
}

// Download Document
async function downloadDocument(docId, title) {
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    let docData;
    
    if (apiBypass) {
        const allDocs = getExampleDocuments('all');
        docData = allDocs.find(d => d.id === docId);
    } else {
        try {
            const response = await fetch(`../../api/documents/get.php?id=${docId}`);
            const result = await response.json();
            if (result.success && result.data) {
                docData = result.data;
            } else {
                alert('Failed to load document');
                return;
            }
        } catch (error) {
            console.error('Error loading document:', error);
            alert('Error loading document');
            return;
        }
    }
    
    if (!docData) {
        alert('Document not found');
        return;
    }
    
    // Create HTML document
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${docData.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        p {
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <h1>${docData.title}</h1>
    ${docData.content}
</body>
</html>
    `;
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docData.slug || title}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Delete Document
async function deleteDocument(docId, title) {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
        return;
    }
    
    const apiBypass = localStorage.getItem('vilostudios_api_bypass') === 'true';
    
    if (apiBypass) {
        alert('Document deleted successfully!');
        loadDocuments(currentDocumentTab);
        return;
    }
    
    try {
        const response = await fetch('../../api/documents/delete.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: docId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Document deleted successfully!');
            loadDocuments(currentDocumentTab);
        } else {
            alert(result.message || 'Failed to delete document');
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error deleting document');
    }
}

// Initialize on load - MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // #region agent log
    console.log('[DEBUG] DOMContentLoaded fired', {timestamp: Date.now(), hypothesisId: 'A'});
    // #endregion
    console.log('DOMContentLoaded fired');
    
    // Check for JavaScript errors
    try {
        console.log('[DEBUG] Starting initialization...');
    } catch(e) {
        console.error('[DEBUG] Error in DOMContentLoaded start:', e);
    }
    
    try {
    // Check if we should navigate to documents page
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page === 'documents') {
            setTimeout(() => {
        switchPage('documents');
            }, 100);
        return;
    }
    
        // Initialize dashboard with delay to ensure DOM is ready
        setTimeout(() => {
            try {
                console.log('Initializing dashboard...');
                
                // Check if required elements exist
                const permissionsPage = document.getElementById('permissions-page');
                const otherPages = document.getElementById('other-pages');
                const pageTitle = document.getElementById('page-title');
                const rolesList = document.getElementById('roles-list');
                const permissionsList = document.getElementById('permissions-list');
                
                // #region agent log
                console.log('[DEBUG] Element existence check', {
                    permissionsPage: !!permissionsPage,
                    otherPages: !!otherPages,
                    pageTitle: !!pageTitle,
                    rolesList: !!rolesList,
                    permissionsList: !!permissionsList,
                    permissionsPageDisplay: permissionsPage ? getComputedStyle(permissionsPage).display : 'N/A',
                    otherPagesDisplay: otherPages ? getComputedStyle(otherPages).display : 'N/A',
                    hypothesisId: 'B'
                });
                // #endregion
                console.log('Elements check:', {
                    permissionsPage: !!permissionsPage,
                    otherPages: !!otherPages,
                    pageTitle: !!pageTitle,
                    rolesList: !!rolesList,
                    permissionsList: !!permissionsList
                });
                
                if (!permissionsPage || !otherPages || !pageTitle) {
                    console.error('Critical page elements missing!');
                    return;
                }
                
                // Show permissions page by default
                permissionsPage.style.display = 'block';
                otherPages.style.display = 'none';
                pageTitle.textContent = 'Manager Dashboard';
                
                // Update profile display first
                // #region agent log
                console.log('[DEBUG] Calling updateProfileDisplay', {timestamp: Date.now(), hypothesisId: 'A'});
                // #endregion
                updateProfileDisplay();
                
                // Initialize dashboard functions
                // #region agent log
                console.log('[DEBUG] Calling initDashboard', {timestamp: Date.now(), hypothesisId: 'A'});
                // #endregion
    initDashboard();
                
                // Initialize notification badge
                setTimeout(() => {
                    updateNotificationBadge();
                }, 200);
                
                // Set active nav item
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                    if (nav.dataset.page === 'permissions') {
                        nav.classList.add('active');
                    }
                });
                
                console.log('Dashboard initialized successfully');
            } catch (error) {
                console.error('Error initializing dashboard:', error);
                console.error(error.stack);
            }
        }, 100);
    } catch (error) {
        console.error('Error in DOMContentLoaded:', error);
        console.error(error.stack);
    }
});

