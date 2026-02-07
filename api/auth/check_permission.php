<?php
/**
 * Permission Check Helper
 * Use this to check if a user has a specific permission
 */

session_start();

function hasPermission($permissionKey) {
    if (!isset($_SESSION['user_permissions'])) {
        return false;
    }
    
    $permissions = $_SESSION['user_permissions'];
    
    // If user has access_all, grant all permissions
    if (in_array('access_all', $permissions)) {
        return true;
    }
    
    return in_array($permissionKey, $permissions);
}

function requirePermission($permissionKey, $redirectUrl = '../login.html') {
    if (!hasPermission($permissionKey)) {
        header('Location: ' . $redirectUrl);
        exit;
    }
}

function getUserRole() {
    return $_SESSION['user_role'] ?? null;
}

function isManager() {
    return getUserRole() === 'manager';
}

function isAmbassador() {
    return getUserRole() === 'ambassador';
}

function isInternalRecruiter() {
    return getUserRole() === 'internal_recruiter';
}

function isModerator() {
    return getUserRole() === 'moderator';
}

function isProductionAssistant() {
    return getUserRole() === 'production_assistant';
}

function isClient() {
    return getUserRole() === 'client';
}

function isFreelancer() {
    return getUserRole() === 'freelancer';
}

// Common permission checks
function canViewFreelancerContacts() {
    return hasPermission('freelancer_contacts') || hasPermission('access_all');
}

function canViewCRM() {
    return hasPermission('crm_clients') || hasPermission('access_all');
}

function canManageApplications() {
    return hasPermission('applications_manage') || hasPermission('access_all');
}

function canCreatePositions() {
    return hasPermission('positions_create') || hasPermission('access_all');
}
?>


