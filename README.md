# Personal Finance Tracker

This is a personal finance tracker web application built with HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

## Description

The Personal Finance Tracker allows users to track and manage their personal finances with ease. It provides features for creating and managing financial transactions, categorizing expenses, generating reports, and more.

![Screenshot 2023-06-05 202302](https://github.com/deepa-priyanka/PersonalFinanceTracker/assets/113755332/5d7cb1f5-5178-4f53-95d9-038cb9c2cfb3)
## Features

- User authentication: Sign up and log in to access personal finance data.
- Dashboard: Overview of financial summary, recent transactions, and tables.
- Transaction Management: Add, edit, and delete financial transactions.
- Categories: Categorize transactions to better organize expenses.
- Income: Manipulate Income insightfully.
- Expenses: Organise expense transactions.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL

## Getting Started

### Prerequisites

- XAMPP server with MySQL installed.
- Node.js and npm (Node Package Manager) installed.

### Database Setup

1. Start the XAMPP server and ensure MySQL is running.
2. Create a new database in PHPMyAdmin or any MySQL client of your choice. Note down the database name ,user account name, password for later useage of them in the index.js file at line 26 onwards.

### Installation

1. Clone the repository: git clone https://github.com/your-username/personal-finance-tracker.git
2.  Navigate to the project directory: cd personal-finance-tracker
3. Install the dependencies: npm install
4. Open the `index.js` file in a text editor.

5. Update the database configuration in the `index.js` file (lines 26 onwards):
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database-name',
});
Replace 'your-username', 'your-password', and 'your-database-name' with your MySQL database credentials.

6.Start the server: node index.js

7.Open a web browser and visit http://localhost:5000 to access the Personal Finance Tracker






