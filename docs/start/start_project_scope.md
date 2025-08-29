# START Project Scoping Document v3.0 (2025)

## 1. Overview

This document outlines the scope for an integrated platform focused on early ASD detection in children. The system is implemented as a modern web application with secure API services, supporting both clinical and research needs.

## 2. Aims

### 2.1. Assessment Platform

To provide a scalable, secure browser based platform that can be used for direct assessment to quantify ASD related dimension.

### 2.2. Secure Pipeline

To establish a secure pipeline for:

- Systematic data collection
- Clinical analysis
- Research insights
- Data protection and privacy

### 2.3. Solution Integration

- User-friendly for non-specialist health workers
- Deployable in naturalistic environments (home or routine health-care settings)
- Secure for sensitive medical data
- Compliant with healthcare standards
- Focused on usability, acceptability, and utility

## 3. Technical Requirements

### 3.1. Frontend Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive Web App capabilities
- Responsive design for various devices
- Landscape orientation only
- Optimized for tablet and desktop views
- Offline-first architecture

### 3.2. API Requirements

- RESTful API design
- JWT-based authentication
- Role-based access control
- Rate limiting and security measures

### 3.3. Language Support

- API Documentation: English
- User Interface: Multi-language support
- Data Storage: Unicode compliant

### 3.4. Security Requirements

- End-to-end encryption for sensitive data
- Token-based authentication
- Role-based access control
- Audit logging

## 4. System Architecture

### 4.1. **Full-Stack Next.js Application**

- App Router for server/client components
- API Routes (/api/v1/\*)
  - Built-in API routing
  - Server-side endpoints
  - Middleware support
- Progressive Web App capabilities
- Responsive design system with Tailwind CSS
- Server Components for improved performance
- Client Components for interactive features

### 4.2. **Backend Services**

- Next.js API Routes for server-side logic
- MongoDB database for data persistence
- Amazon S3 for file storage
  - Secure file uploads
  - CDN distribution
  - Versioning support
- JWT-based authentication service
- Server-side rendering (SSR) capabilities

### 4.3. **Integration Layer**

- Next.js Edge Runtime
- Vercel deployment platform
- Token management with HTTP-only cookies
- Rate limiting on API routes
- Response caching strategies
  - Static page caching
  - Incremental Static Regeneration (ISR)
  - Dynamic API response caching

### 4.4. System Integration Flow

```mermaid
flowchart TD
    B(["Browser"])
    LS["Local Storage"]
    API{"Next.js Server API"}
    Auth{"JWT Check"}
    Role{"Role Check"}
    DB[(Database)]
    S3["File Storage"]

    %% Client-side Flow
    B--store offline data--> LS
    B--API requests--> API

    %% Auth and Role Flow
    API--verify token--> Auth
    Auth--invalid--> B
    Auth--valid--> Role
    Role--unauthorized--> B

    %% Authorized Operations
    Role-- observer uploads --> S3
    Role-- admin/org download --> S3
    Role-- authorized user --> DB

    %% Data Return
    S3--file URL--> API
    DB--data--> API
    API--response--> B
```

## Database Hierarchy

```

```

## 6. Role Hierarchy and Permissions

### 6.1. System Administrator (Admin)

- **Access Level**: Full system access
- **Capabilities**:
  - Organisation management
  - System configuration
  - User management
  - Data oversight
- **API Access**: All endpoints
- **Special Privileges**: Bypass authentication for emergency access

### 6.2. Organisation Manager (Organisation)

- **Access Level**: Organisation-wide access
- **Capabilities**:
  - Observer management
  - Data access within organisation
  - Report generation
  - File management
- **API Access**:
  ```
  ├── /organisation/*
  ├── /observer/*
  ├── /files/*
  └── /child/* (read-only)
  ```

### 6.3. Observer (Observer)

- **Access Level**: Assigned children only
- **Capabilities**:
  - Child profile management
  - Assessment data collection
  - File uploads
  - Personal profile management
- **API Access**:
  ```
  ├── /child/create
  ├── /child/list
  ├── /files/upload
  └── /files/list
  ```

### 6.4. Public Access

- **Access Level**: Public endpoints only
- **Capabilities**:
  - System health check
  - Documentation access
- **API Access**:
  ```
  └── /health
  ```

## 7. Data Flow and Access Control

### 7.1. Authentication Flow

```mermaid
graph TD
    A[User] -->|Login| B[Auth Service]
    B -->|Issue Tokens| C[Access Token]
    B -->|Issue Tokens| D[Refresh Token]
    C -->|Access API| E[Protected Endpoints]
    D -->|Refresh| B
```

### 7.2. Data Access Hierarchy

```mermaid
graph LR
    A(Admin) -->|Manages| B[Organisations]
    B -->|Manages| C[Observers]
    C -->|Manages| D[Child]
    D -->|Contains| E[Assessments]
    E -->|Includes| F[Files]
```

### 7.3. Permission Matrix

| Resource Type | Admin | Organisation | Observer | Public |
| ------------- | ----- | ------------ | -------- | ------ |
| System Config | ✓     | ✗            | ✗        | ✗      |
| Organisation  | ✓     | Read Only    | ✗        | ✗      |
| Observer      | ✓     | ✓            | Self     | ✗      |
| Child         | ✓     | ✓            | Assigned | ✗      |
| Files         | ✓     | Own Org      | Own      | ✗      |
| Health Check  | ✓     | ✓            | ✓        | ✓      |

### 7.4 Observer App Interaction Flow

```mermaid
graph TD
    %% --- Main & Login Flow ---
    observer("Observer") --> login["Login Page"];
    login --> checkChild{"Child Session Active?"};
    login --> restorePass["Restore Password"];
    restorePass --> emailVerification["Email Verification"];

    %% --- Main Navigation Hub (Dashboard) ---
    dashboard["Dashboard / Page Navigation"];
    dashboard --> analytics["Analytics"];
    dashboard --> settingsPage["Settings"];
    dashboard --> surveyPage["Survey Page"];
    dashboard --> uploadFiles["Upload Files Page"];
    dashboard --> childManagement["Child Management Page"];

    %% --- Post-Login Routing ---
    checkChild -- Yes --> dashboard;
    checkChild -- No --> childManagement;

    %% --- Survey Page Flow ---
    surveyPage --> testSelection["Select from available tasks"];
    testSelection --> sampleTask["Instructions & Sample"];
    sampleTask --> mainTask["Main Task"];
    mainTask --> videoRecord{"Video Recorded?"};
    videoRecord -- Yes --> processVideo[Process Video];
    videoRecord -- No --> popUp[Save Data Pop-up];
    processVideo --> popUp;
    popUp -- "Saves Data" --> newTask{"Start Another Task?"};
    newTask -- Yes --> sampleTask;
    newTask -- No --> surveyPage;
    surveyPage --> downloadSurveyData;

    %% --- Upload Files Flow ---
    uploadFiles --> uploadedFromDownload["From Downloaded Files"];
    uploadFiles --> uploadFromRecordedData["From Recorded Data"];

    %% --- Child Management Flow ---
    childManagement -- "Search by ID" --> childAdded;
    childManagement -- "Add Manually" --> childAdded;

    childAdded{"Child Added / Selected"} --> removeChild[Remove Child];
    childAdded --> downloadSurveyData;
    childAdded --> dashboard;

    removeChild --> popUp1{"Unsaved Data Alert!"};
    popUp1 -- "Upload Data & Remove" --> uploadFiles;
    popUp1 -- "Discard & Remove" --> childManagement;
    popUp1 --> downloadSurveyData;

    %% --- Shared Utility Node ---
    downloadSurveyData["Download Survey Data"];

    %% --- Styling ---
    style downloadSurveyData fill:#cc0000,stroke:#600,stroke-width:2px,color:#fff;
```

### 7.5 Organisation App Interaction Flow
```mermaid
graph LR
    %% --- Entry & Authentication Flow ---
    orgUser["Organisation User"] --> login["Login Page"]
    login --> authCheck{"Authentication Check"}
    authCheck -->|Invalid/No Token| login
    authCheck -->|Valid Organisation Role| orgLayout["Organisation Layout"]

    %% --- Organisation Layout & Sidebar Navigation ---
    orgLayout --> sidebar["Sidebar Navigation"]
    sidebar --> dashboard["Dashboard"]
    sidebar --> observer["Observer Management"]
    sidebar --> files["File Manager"]
    sidebar --> home["Home (Exit to Main App)"]

    %% --- Dashboard Overview ---
    dashboard --> dashboardStats["View Organisation Statistics"]
    dashboardStats --> activeSurveys["Active Surveys Count"]
    dashboardStats --> uploadedFiles["Total Files Count"]
    dashboardStats --> storageUsed["Storage Usage"]
    dashboardStats --> orgMetrics["Organisation Performance Metrics"]

    %% --- Observer Management Flow ---
    observer --> observerList["List All Observers"]
    observerList --> observerSearch["Search & Filter Observers"]
    observerList --> observerCreate["Create New Observer"]
    observerList --> observerEdit["Edit Observer Details"]
    observerList --> observerDelete["Delete Observer"]

    %% --- Observer CRUD Operations ---
    observerCreate --> createObserverForm["Observer Creation Form"]
    createObserverForm --> obsName["Name Input"]
    createObserverForm --> obsEmail["Email Input"]
    createObserverForm --> obsAddress["Address Input"]
    createObserverForm --> obsPassword["Password Setup"]
    createObserverForm --> submitObserver["Submit & Save"]

    observerEdit --> editObserverForm["Observer Edit Form"]
    editObserverForm --> updateObserverFields["Update Observer Fields"]
    editObserverForm --> saveObserverChanges["Save Changes"]

    observerDelete --> deleteObserverConfirm["Delete Confirmation"]
    deleteObserverConfirm --> removeObserver["Remove from Database"]

    %% --- File Management Flow ---
    files --> fileList["List Organisation Files"]
    fileList --> fileFilters["Apply Advanced Filters"]
    fileFilters --> filterByObserver["Filter by Observer"]
    fileFilters --> filterByChild["Filter by Child"]
    fileFilters --> filterByTask["Filter by Task Type"]
    fileFilters --> filterByDate["Filter by Date Range"]
    fileFilters --> filterByFileType["Filter by File Type"]

    fileList --> fileActions["File Actions"]
    fileActions --> downloadFile["Download Individual File"]
    fileActions --> downloadAllFiles["Download All Files"]
    fileActions --> viewFileDetails["View File Metadata"]
    fileActions --> deleteFile["Delete File"]
    fileActions --> fileAnalytics["File Analytics & Reports"]

    %% --- Data Analytics & Reporting ---
    dashboardStats --> dataAnalytics["Data Analytics"]
    dataAnalytics --> surveyReports["Survey Reports"]
    dataAnalytics --> observerPerformance["Observer Performance Metrics"]
    dataAnalytics --> childProgress["Child Progress Tracking"]
    dataAnalytics --> exportReports["Export Reports"]

    %% --- API Integration Points ---
    dashboardStats --> apiOrgStats["API: /api/v1/organisation/*"]
    observerList --> apiObserverList["API: /api/v1/observer/list"]
    observerCreate --> apiObserverCreate["API: /api/v1/observer/create"]
    observerEdit --> apiObserverUpdate["API: /api/v1/observer/update"]
    observerDelete --> apiObserverDelete["API: /api/v1/observer/delete"]

    fileList --> apiFileList["API: /api/v1/files/list"]
    downloadFile --> apiFileDownload["API: /api/v1/files/download"]

    %% --- Error Handling & Validation ---
    authCheck -->|Role Mismatch| redirectLogin["Redirect to Login"]
    submitObserver -->|Validation Error| showObserverErrors["Display Form Errors"]
    apiOrgStats -->|API Error| handleApiError["Handle API Errors"]

    %% --- Styling for different action types ---
    classDef criticalAction fill:#ff9999,stroke:#cc0000,stroke-width:2px
    classDef normalAction fill:#ffffff,stroke:#333333,stroke-width:1px
    classDef analyticsAction fill:#99ccff,stroke:#0066cc,stroke-width:1px

    class downloadAllFiles criticalAction
    class observerDelete,deleteFile,observerCreate,dashboard,observerList,fileList normalAction
    class dataAnalytics,surveyReports,observerPerformance,childProgress,exportReports analyticsAction
```

### 7.6 Admin App Interaction Flow

```mermaid
graph LR
    %% --- Entry & Authentication Flow ---
    adminUser["Admin User"] --> login["Login Page"]
    login --> authCheck{"Authentication Check"}
    authCheck -->|Invalid/No Token| login
    authCheck -->|Valid Admin Role| adminLayout["Admin Layout"]

    %% --- Admin Layout & Sidebar Navigation ---
    adminLayout --> sidebar["Sidebar Navigation"]
    sidebar --> dashboard["Dashboard"]
    sidebar --> organisation["Organisation Management"]
    sidebar --> observer["Observer Management"]
    sidebar --> files["File Management"]
    sidebar --> home["Home (Exit to Main App)"]

    %% --- Dashboard Overview ---
    dashboard --> dashboardStats["View System Statistics"]
    dashboardStats --> activeSurveys["Active Surveys Count"]
    dashboardStats --> uploadedFiles["Total Files Count"]
    dashboardStats --> storageUsed["Storage Usage"]

    %% --- Organisation Management Flow ---
    organisation --> orgList["List All Organisations"]
    organisation --> orgConfig["Organisation Configuration"]
    orgList --> orgSearch["Search by Organisation ID"]
    orgList --> orgCreate["Create New Organisation"]
    orgList --> orgEdit["Edit Organisation Details"]
    orgList --> orgDelete["Delete Organisation"]

    %% --- Organisation Configuration Section ---
    orgConfig --> orgSettings["Organisation Settings"]
    orgConfig --> orgPermissions["Permission Management"]
    orgConfig --> orgIntegrations["Third-party Integrations"]
    orgConfig --> orgCustomization["Custom Fields & Branding"]

    %% --- Organisation CRUD Operations ---
    orgCreate --> createOrgForm["Organisation Creation Form"]
    createOrgForm --> orgName["Name Input"]
    createOrgForm --> orgEmail["Email Input"]
    createOrgForm --> orgAddress["Address Input"]
    createOrgForm --> submitOrg["Submit & Save"]

    orgEdit --> editOrgForm["Organisation Edit Form"]
    editOrgForm --> updateOrgFields["Update Fields"]
    editOrgForm --> saveOrgChanges["Save Changes"]

    orgDelete --> deleteConfirm["Delete Confirmation"]
    deleteConfirm --> removeOrg["Remove from Database"]

    %% --- Observer Management Flow ---
    observer --> observerList["List All Observers"]
    observerList --> observerCreate["Create New Observer"]
    observerList --> observerEdit["Edit Observer Details"]
    observerList --> observerDelete["Delete Observer"]

    %% --- Observer CRUD Operations ---
    observerCreate --> createObserverForm["Observer Creation Form"]
    createObserverForm --> obsName["Name Input"]
    createObserverForm --> obsEmail["Email Input"]
    createObserverForm --> obsAddress["Address Input"]
    createObserverForm --> obsOrgId["Organisation Assignment"]
    createObserverForm --> obsPassword["Password Setup"]
    createObserverForm --> submitObserver["Submit & Save"]

    observerEdit --> editObserverForm["Observer Edit Form"]
    editObserverForm --> updateObserverFields["Update Observer Fields"]
    editObserverForm --> saveObserverChanges["Save Changes"]

    observerDelete --> deleteObserverConfirm["Delete Confirmation"]
    deleteObserverConfirm --> removeObserver["Remove from Database"]

    %% --- File Management Flow ---
    files --> fileList["List All Files"]
    fileList --> fileFilters["Apply Filters"]
    fileFilters --> filterByOrg["Filter by Organisation"]
    fileFilters --> filterByObserver["Filter by Observer"]
    fileFilters --> filterByTask["Filter by Task Type"]
    fileFilters --> filterByDate["Filter by Date Range"]

    fileList --> fileActions["File Actions"]
    fileActions --> downloadFile["Download File"]
    fileActions --> downloadAllFiles["Download All Files"]
    fileActions --> viewFileDetails["View File Metadata"]
    fileActions --> deleteFile["Delete File"]

    %% --- API Integration Points ---
    dashboardStats --> apiStats["API: /api/v1/admin/*"]
    orgList --> apiOrgList["API: /api/v1/organisation/list"]
    orgCreate --> apiOrgCreate["API: /api/v1/organisation/create"]
    orgEdit --> apiOrgUpdate["API: /api/v1/organisation/update"]
    orgDelete --> apiOrgDelete["API: /api/v1/organisation/delete"]

    observerList --> apiObserverList["API: /api/v1/observer/list"]
    observerCreate --> apiObserverCreate["API: /api/v1/observer/create"]
    observerEdit --> apiObserverUpdate["API: /api/v1/observer/update"]
    observerDelete --> apiObserverDelete["API: /api/v1/observer/delete"]

    fileList --> apiFileList["API: /api/v1/files/list"]
    downloadFile --> apiFileDownload["API: /api/v1/files/download"]

    %% --- Error Handling & Validation ---
    authCheck -->|Role Mismatch| redirectLogin["Redirect to Login"]
    submitOrg -->|Validation Error| showOrgErrors["Display Form Errors"]
    submitObserver -->|Validation Error| showObserverErrors["Display Form Errors"]
    apiStats -->|API Error| handleApiError["Handle API Errors"]

    %% --- Styling for different action types ---
    classDef criticalAction fill:#ff9999,stroke:#cc0000,stroke-width:2px
    classDef normalAction fill:#ffffff,stroke:#333333,stroke-width:1px

    class downloadAllFiles criticalAction
    class orgDelete,observerDelete,deleteFile,orgCreate,observerCreate,dashboard,orgList,observerList,fileList,orgConfig,orgSettings,orgPermissions,orgIntegrations,orgCustomization normalAction
```

## 8. Security Measures

### 8.1. Authentication

- JWT-based token system
- Refresh token rotation
- Session management
- Brute force protection

### 8.2. Authorization

- Role-based access control
- Resource-level permissions
- Organization-based data isolation

### 8.3. **Data Protection**

- End-to-end encryption for sensitive data
- Secure file storage and serving:
  - HTTPS-only file access
  - Time-limited pre-signed URLs
  - Content-Security-Policy headers
  - Cross-Origin Resource Sharing (CORS) restrictions
  - SSL/TLS encryption for all file transfers
  - Request signing for S3 operations
- Audit logging:
  - File access tracking
  - Download/upload timestamps
  - User and role identification
- Data retention policies:
  - Automated file expiration
  - Versioning control
  - Backup management
