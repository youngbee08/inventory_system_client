# ElectraFlow: Electrical Inventory & Deployment Management System

## Overview

ElectraFlow is a system designed to help businesses efficiently manage their electrical inventory and streamline material deployments. It tackles the common challenges of manual tracking by offering a centralized digital platform for comprehensive stock oversight and smooth coordination with field teams.

## Description

This project provides a robust solution for tracking electrical materials from storage to deployment. It enables administrative oversight of inventory levels, material movement, and employee assignments, while also empowering field employees to manage their specific tasks and material statuses. Whether you're an administrator needing a full overview or an employee managing daily deployments, ElectraFlow helps keep operations running smoothly and materials accounted for.

## Usage

Once you've got the application running, you'll land on the login page.

### Login

You can log in as either an **Administrator** or an **Employee**. The system uses role-based access, so what you see and can do after logging in depends on your role.

- **Admin Login**: Use your admin credentials to access the full administrative dashboard.
- **Employee Login**: Use your employee credentials to access your personalized employee dashboard.

### Admin Dashboard

As an admin, you have full control over the system:

- **Overview**: Get a snapshot of total materials, low stock alerts, and deployment summaries. You'll see recent activities and deployments right here.
- **Materials**: Manage your electrical inventory. You can:
  - **Add New Material**: Create new stock items, specifying their name, quantity, location, unit, and reorder threshold.
  - **View Details**: See comprehensive information for any material.
  - **Edit Material**: Update existing material details, including adding more quantity to stock.
  - **Toggle Status**: Activate or deactivate materials, controlling their availability.
- **Deployments**: Oversee all material dispatches. You can:
  - **Create Deployment**: Set up new deployments, assign them to employees, specify destinations, and allocate materials with specific quantities.
  - **View Details**: Access a dedicated page for each deployment to see its full status, assigned employee, and individual material statuses.
  - **Edit Deployment**: Modify deployment details like title, destination, and assigned employee (if not completed or cancelled).
  - **Cancel Deployment**: Stop a deployment that's in progress.
  - **Update Material Status (within Deployment)**: For each material within a deployment, you can update its status (e.g., from `allocated` to `in_transit`, then `used`).
- **Employees**: Manage employee accounts.
  - **Add Employee**: Create new user accounts for your field team, complete with name, email, and password.
  - **View Employees**: See a list of all registered employees and their details.
- **Reports**: Access detailed reports on inventory health, material usage, and deployment performance.
- **Activity Log**: View a chronological record of all system activities and user actions.
- **Settings**: Review your profile information.

### Employee Dashboard

As an employee, your dashboard is tailored to your assignments:

- **Overview**: See a summary of your assigned deployments, completed deployments, and materials awaiting action or in transit. Your recent activities are also displayed here.
- **Assigned Deployments**: View a list of all deployments assigned to you.
  - **View Details**: Navigate to a specific deployment's page to review its destination, allocated materials, and update the status of individual materials as they move through the process (e.g., from `allocated` to `in_transit`, then `used`).
- **Activity Log**: Monitor your personal activity within the system.
- **Notifications**: Stay informed about important updates related to your tasks.
- **Settings**: Review your profile information.

## Features

- **Role-Based Access Control**: Differentiates functionalities for administrators and employees.
- **Comprehensive Dashboards**: Tailored overviews for both admin and employee roles, summarizing key metrics.
- **Material Management**: Full CRUD (Create, Read, Update, Deactivate/Activate) operations for inventory items, including quantity tracking, location, and reorder thresholds.
- **Deployment Management**: Create, edit, cancel, and track deployments, assigning them to specific employees and destinations.
- **Granular Material Tracking**: Update individual material statuses within a deployment (e.g., allocated, in transit, used).
- **Employee Management**: Admin can add and view employee accounts with associated roles.
- **Activity Logging**: Centralized log of all system and user actions for audit and transparency.
- **Dynamic Reports**: Insights into inventory health, material allocation, and deployment performance for administrators.
- **Responsive User Interface**: Optimized for various screen sizes, from desktop to mobile.
- **Global Search**: Quickly find pages, deployments, materials, or employees across the dashboard.
- **Interactive Modals**: Streamlined workflows for creating, editing, and confirming actions.
- **Pagination**: Efficiently navigate through long lists of data.

## Technologies Used

| Category     | Technology    | Description                                      |
| :----------- | :------------ | :----------------------------------------------- |
| **Frontend** | React         | UI library for building dynamic user interfaces. |
|              | TypeScript    | Type-safe JavaScript for robust code.            |
|              | Tailwind CSS  | Utility-first CSS framework for rapid styling.   |
|              | Vite          | Fast frontend development build tool.            |
|              | Framer Motion | Library for animations and gestures.             |
|              | React Router  | Declarative routing for React applications.      |
|              | Axios         | Promise-based HTTP client for API requests.      |
|              | Sonner        | Opinionated toast component for notifications.   |
|              | Formik        | Library for building forms in React.             |
|              | Yup           | Schema validation library for forms.             |
|              | React Icons   | Collection of popular SVG icons.                 |

## License

This project is open-source and available under the MIT License.

## Author Info

**Zenith Dev**

- Email: [hello@zenithdevtech.name.ng](mailto:hello@zenithdevtech.name.ng)
- Website: [Zenith Dev Tech](https://zenithdevtech.name.ng)
- GitHub: [youngbeeh08](https://github.com/youngbeeh08)
- LinkedIn: [Bamitale Abdulazeem I.](https://www.linkedin.com/in/bamitale-abdulazeem-i-214026333/)

---
