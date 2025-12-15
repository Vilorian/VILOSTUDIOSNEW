# Roles & Permissions System Guide

## Roles Overview

### Manager
- **Full Access**: Has access to everything
- **Permissions**: All permissions granted automatically
- **Use Case**: CEO, senior management

### Ambassador
- **Access**: 
  - Client list (CRM)
  - Client documents
  - Freelancer database (with contacts and emails)
  - Freelancer numbers/statistics
- **Use Case**: Business development, client relations

### Internal Recruiter
- **Access**:
  - View applications
  - Manage applications (accept/decline)
  - Create job positions
  - Manage job positions
  - Freelancer database (read-only)
- **Use Case**: HR, recruitment team

### Production Assistant
- **Access**:
  - Freelancer database (NO contact information, NO emails)
  - Freelancer numbers/statistics
- **Use Case**: External production assistants, coordinators

### Client
- **Access**:
  - Own projects only
- **Use Case**: External clients viewing their projects

### Freelancer
- **Access**:
  - Own projects only
- **Use Case**: Freelancers viewing their assigned projects

## Setup Instructions

1. **Run the database setup**:
   ```sql
   -- Run database/setup_roles_permissions.sql
   ```

2. **Set up kevin@vilostudios.com as manager**:
   ```sql
   -- Run database/setup_kevin_manager.sql
   -- Or manually:
   UPDATE admin_users 
   SET role = 'manager', password_hash = 'Tankcrev#1' 
   WHERE email = 'kevin@vilostudios.com';
   ```

3. **Hash passwords** (recommended):
   ```bash
   php api/auth/hash_password.php
   ```
   Then update the password_hash in the database.

## Permission Keys

- `access_all` - Full access (managers only)
- `crm_clients` - View/manage client list
- `crm_documents` - Access client documents
- `freelancer_database` - View freelancer database
- `freelancer_contacts` - View freelancer contact info and emails
- `freelancer_numbers` - View freelancer statistics
- `applications_view` - View job applications
- `applications_manage` - Accept/decline applications
- `positions_create` - Create job positions
- `positions_manage` - Edit/manage job positions
- `projects_own` - View own projects
- `projects_all` - View all projects

## Using Permissions in PHP

```php
require_once 'api/auth/check_permission.php';

// Check if user has permission
if (hasPermission('crm_clients')) {
    // Show CRM features
}

// Require permission (redirects if not)
requirePermission('applications_manage');

// Check role
if (isManager()) {
    // Manager-only code
}
```

## Adding New Users

### Add Manager:
```sql
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('manager@vilostudios.com', '$2y$10$...', 'manager');
```

### Add Ambassador:
```sql
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('ambassador@vilostudios.com', '$2y$10$...', 'ambassador');
```

### Add Internal Recruiter:
```sql
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('recruiter@vilostudios.com', '$2y$10$...', 'internal_recruiter');
```

### Add Production Assistant:
```sql
INSERT INTO production_assistants (name, email, password_hash) 
VALUES ('John Doe', 'john@example.com', '$2y$10$...');
```

### Add Client:
```sql
INSERT INTO clients (name, email, company, password_hash, status) 
VALUES ('Client Name', 'client@example.com', 'Company', '$2y$10$...', 'active');
```

## Security Notes

1. **Password Hashing**: Always use `password_hash()` for new passwords
2. **Session Security**: Sessions store permissions - ensure secure session handling
3. **Permission Checks**: Always check permissions before showing sensitive data
4. **Production Assistants**: Never show contact info/emails to production assistants


