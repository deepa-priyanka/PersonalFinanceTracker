# Personal Finance Tracker

This is a personal finance tracker web application built with HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

## Description

The Personal Finance Tracker allows users to track and manage their personal finances with ease. In a world where financial well-being plays a pivotal role in our lives, managing personal finances can often be a daunting task. The challenges of tracking income, monitoring expenses, and working towards financial goals are universal. It's this very complexity that inspired the creation of our Personal Finance Tracker – a powerful tool designed to simplify the intricacies of financial management and empower individuals to take control of their monetary journey.


<img src="https://github.com/deepa-priyanka/PersonalFinanceTracker/assets/113755332/5d7cb1f5-5178-4f53-95d9-038cb9c2cfb3" alt="Screenshot" width="550" height="300" />

## Features

- User authentication: Sign up and log in to access personal finance data.
- Transaction Management: Add, edit, and delete financial transactions.
- Categories: Categorize transactions to better organize expenses.
- Income: Manipulate Income insightfully.
- Expenses: Organise expense transactions.

<img src="https://github.com/deepa-priyanka/PersonalFinanceTracker/assets/113755332/60872ccb-617c-46be-ad23-54ab964c01aa" alt="Screenshot" width="550" height="300" />

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
2. Create a new database in PHPMyAdmin or any MySQL client of your choice. Note down the database name ,user account name, password for later usage of them in the index.js file at line 26 onwards.

### Installation

1. Clone the repository: git clone https://github.com/deepa-priyanka/PersonalFinanceTracker
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

<div style="display: flex;">
  <img src="https://github.com/deepa-priyanka/PersonalFinanceTracker/assets/113755332/a4ac1415-c0fa-48f0-8ebc-4dab7976c2f0" alt="Image 1" style="width: 400px; height: 350px; margin-right: 10px;">
  <img src="https://github.com/deepa-priyanka/PersonalFinanceTracker/assets/113755332/fafbc647-7a83-4dfe-ab3e-1d65305c1fdf" alt="Image 2" style="width: 400px; height: 350px; margin-left:100px;">
</div>




