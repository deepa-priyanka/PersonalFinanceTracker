const express = require('express')  ;
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const app = express();
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');

// Set up body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Set the folder where your static files are located (e.g., HTML, CSS, JS files)
app.use(express.static(path.join(__dirname, 'static')));

// Configure Express.js to use EJS as the view engine
app.set('view engine', 'ejs');
// Set the folder where your views are located
app.set('views', path.join(__dirname, 'views'));

// // Set up session middleware
// app.use(
//     session({
//       secret: 'your-secret-key', // Replace with a secret key for session encryption
//       resave: false,
//       saveUninitialized: true
//     })
//   );

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'deepa',
    password: '123', 
    database: 'deepa' 
  });

    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected!');

        // Create a table
        const sql = `CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
            )`;

            connection.query(sql, (err) => {
                if (err) throw err;
                console.log('Table created!');
            }); 

                        // Create income table
            const sql2 = `CREATE TABLE IF NOT EXISTS income (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                source VARCHAR(255) NOT NULL,
                amount INT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )`;
            
            connection.query(sql2, (err) => {
                if (err) throw err;
                console.log('Income Table created!');
            });
            
            
            // Create expense table
            const sql3 = `CREATE TABLE IF NOT EXISTS expense (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                balance INT DEFAULT 0,
                purpose VARCHAR(255) NOT NULL,
                amount INT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )`;
            
            connection.query(sql3, (err) => {
                if (err) throw err;
                console.log('Expense Table created!');
            });
  
            // Create Money table
            const sql4 = `CREATE TABLE IF NOT EXISTS money (
                name VARCHAR(255) NOT NULL,
                balance INT DEFAULT 0,
                PRIMARY KEY (name)
            )`;
            
            connection.query(sql4, (err) => {
                if (err) throw err;
                console.log('Money Table created!');
            });

            // Insert a record
            // Handle the '/signupData' endpoint
            app.post('/signupData', (req, res) => {
              const { username, password } = req.body;
            
              // Insert the data into the 'users' table
              const sql = `INSERT INTO users (name, password) VALUES (?, ?)`;
              // Insert data into money table
              const sqll = `INSERT INTO money (name) VALUES (?)`;
            
              connection.query(sql, [username, password], (err, result) => {
                if (err) {
                  console.error(err.message);
                  res.status(500).send('Error inserting data into the database');
                } else {
                  connection.query(sqll, [username], (err, result) => {
                    if (err) {
                      console.error(err.message);
                      res.status(500).send('Error inserting data into the database money table');
                    } else {
                      res.redirect('/');
                    }
                  });
                }
              });
            });
            

            // Handle the '/loginData' endpoint
app.post('/loginData', (req, res) => {
    const { username, password } = req.body;
  
    // Check if the user data exists in the 'users' table
    const sql = `SELECT * FROM users WHERE name = ? AND password = ?`;
    connection.query(sql, [username, password], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error retrieving data from the database');
      } else {
        if (result.length > 0) {
          // Redirect to the transactions page and pass the username as a query parameter
          res.redirect(`/transactions?username=${encodeURIComponent(username)}`);
        } else {
          res.status(401).send('Invalid username or password');
        }
      }
    });
  });
  

  app.post('/addTransaction', (req, res) => {
    const { purpose, amount, timestamp, username } = req.body;

    // Get the most recent transaction for the user
    const getBalanceQuery = `SELECT balance FROM money WHERE name = ?`;
    connection.query(getBalanceQuery, [username], (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving balance from the database');
        } else {
            let balance = 0;

            if (result.length > 0) {
                balance = result[0].balance - amount; // Calculate the new balance
            }

            // Insert the transaction into the 'expense' table
            const insertQuery = `INSERT INTO expense (name, balance, purpose, amount, timestamp) VALUES (?, ?, ?, ?, ?)`;
            const updateQuery = `UPDATE money SET balance = ? WHERE name = ?`;
            connection.query(insertQuery, [username, balance, purpose, amount, timestamp], (err, result) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error adding transaction to the database');
                } else {
                    // Execute the update query to update the balance in the 'money' table
                    connection.query(updateQuery, [balance, username], (err, result) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send('Error updating balance in the database');
                        } else {
                            // Both queries executed successfully, render the /transactions page
                            res.redirect(`/transactions?username=${encodeURIComponent(username)}`);
                        }
                    });
                }
            });
        }
    });
});

  
app.post('/editTransaction', (req, res) => {
  const { username, transactionId, purpose, amount } = req.body;

  // Step 1: Obtain the money balance from the 'money' table using the username
  const getMoneyBalanceQuery = `SELECT balance FROM money WHERE name = ?`;
  connection.query(getMoneyBalanceQuery, [username], (err, moneyResult) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving money balance from the database');
      return;
    }

    const moneyBalance = moneyResult[0].balance;

    // Step 2: Obtain the expense balance from the 'expense' table using the transactionId
    const getExpenseBalanceQuery = `SELECT amount FROM expense WHERE id = ?`;
    connection.query(getExpenseBalanceQuery, [transactionId], (err, expenseResult) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error retrieving expense balance from the database');
        return;
      }

      const expenseBalance = expenseResult[0].amount;

      // Step 3: Calculate the new balance
      const newBalance = moneyBalance + expenseBalance - amount;

      // Step 4: Update the balance of the 'money' table with the new balance
      const updateMoneyBalanceQuery = `UPDATE money SET balance = ? WHERE name = ?`;
      connection.query(updateMoneyBalanceQuery, [newBalance, username], (err, moneyUpdateResult) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Error updating money balance in the database');
          return;
        }

        // Step 5: Update the balance, purpose, amount, and timestamp of the 'expense' table
        const updateExpenseQuery = `UPDATE expense SET balance = ?, purpose = ?, amount = ?, timestamp = NOW() WHERE id = ?`;
        connection.query(updateExpenseQuery, [newBalance, purpose, amount, transactionId], (err, expenseUpdateResult) => {
          if (err) {
            console.error(err.message);
            res.status(500).send('Error updating expense details in the database');
            return;
          }

          res.redirect(`/transactions?username=${encodeURIComponent(username)}`);
        });
      });
    });
  });
});


app.post('/deleteTransaction', (req, res) => {
  const { username, transactionId } = req.body;

  // Step 1: Obtain the money balance from the 'money' table using the username
  const getMoneyBalanceQuery = `SELECT balance FROM money WHERE name = ?`;
  connection.query(getMoneyBalanceQuery, [username], (err, moneyResult) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving money balance from the database');
      return;
    }

    const moneyBalance = moneyResult[0].balance;
    console.log(moneyBalance);
    // Step 2: Obtain the amount from the 'expense' table using the transactionId
    const getExpenseAmountQuery = `SELECT amount FROM expense WHERE id = ?`;
    connection.query(getExpenseAmountQuery, [transactionId], (err, expenseResult) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error retrieving expense amount from the database');
        return;
      }

      const expenseAmount = expenseResult[0].amount;
      console.log(expenseAmount);
      // Step 3: Calculate the new balance
      const newBalance = moneyBalance + expenseAmount;
      console.log(newBalance);
      // Step 4: Update the balance of the 'money' table with the new balance
      const updateMoneyBalanceQuery = `UPDATE money SET balance = ? WHERE name = ?`;
      connection.query(updateMoneyBalanceQuery, [newBalance, username], (err, moneyUpdateResult) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Error updating money balance in the database');
          return;
        }

        // Step 5: Delete the record from the 'expense' table
        const deleteExpenseQuery = `DELETE FROM expense WHERE id = ?`;
        connection.query(deleteExpenseQuery, [transactionId], (err, expenseDeleteResult) => {
          if (err) {
            console.error(err.message);
            res.status(500).send('Error deleting transaction from the database');
            return;
          }

          res.redirect(`/transactions?username=${encodeURIComponent(username)}`);
        });
      });
    });
  });
});

app.post('/addIncome', (req, res) => {
  const { username, source, amount, timestamp} = req.body;
  console.log(amount);
  // Get the most recent transaction for the user
  const getBalanceQuery = `SELECT balance FROM money WHERE name = ?`;
  connection.query(getBalanceQuery, [username], (err, result) => {
      if (err) {
          console.error(err.message);
          res.status(500).send('Error retrieving balance from the database');
      } else {
          let balance = 0;

          if (result.length > 0) {
            balance = Number(result[0].balance) + Number(amount); // Convert to numbers and calculate the new balance
            console.log(balance);
          }
          

          // Insert the transaction into the 'expense' table
          const insertQuery = `INSERT INTO income (name, source, amount, timestamp) VALUES (?, ?, ?, ?)`;
          const updateQuery = `UPDATE money SET balance = ? WHERE name = ?`;
          connection.query(insertQuery, [username, source,  amount, timestamp], (err, result) => {
              if (err) {
                  console.error(err.message);
                  res.status(500).send('Error adding transaction to the database');
              } else {
                  // Execute the update query to update the balance in the 'money' table
                  connection.query(updateQuery, [balance, username], (err, result) => {
                      if (err) {
                          console.error(err.message);
                          res.status(500).send('Error updating balance in the database');
                      } else {
                          // Both queries executed successfully, render the /transactions page
                          res.redirect(`/manageIncome/${encodeURIComponent(username)}`);
                      }
                  });
              }
          });
      }
  });
});

app.post('/editIncome', (req, res) => {
  const { username, transactionId, source, amount } = req.body;

  // Step 1: Obtain the money balance from the 'money' table using the username
  const getMoneyBalanceQuery = `SELECT balance FROM money WHERE name = ?`;
  connection.query(getMoneyBalanceQuery, [username], (err, moneyResult) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving money balance from the database');
      return;
    }

    const moneyBalance = Number(moneyResult[0].balance);
    console.log(moneyBalance);
    // Step 2: Obtain the income amount from the 'income' table using the transactionId
    const getIncomeAmountQuery = `SELECT amount FROM income WHERE id = ?`;
    connection.query(getIncomeAmountQuery, [transactionId], (err, incomeResult) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error retrieving income amount from the database');
        return;
      }

      const incomeAmount = Number(incomeResult[0].amount);
      console.log(incomeAmount);
      // Step 3: Calculate the new balance
      const newBalance = moneyBalance - incomeAmount + Number(amount);
      console.log(newBalance);
      // Step 4: Update the balance of the 'money' table with the new balance
      const updateMoneyBalanceQuery = `UPDATE money SET balance = ? WHERE name = ?`;
      connection.query(updateMoneyBalanceQuery, [newBalance, username], (err, moneyUpdateResult) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Error updating money balance in the database');
          return;
        }

        // Step 5: Update the source, amount, and timestamp of the 'income' table
        const updateIncomeQuery = `UPDATE income SET source = ?, amount = ?, timestamp = NOW() WHERE id = ?`;
        connection.query(updateIncomeQuery, [source, amount, transactionId], (err, incomeUpdateResult) => {
          if (err) {
            console.error(err.message);
            res.status(500).send('Error updating income details in the database');
            return;
          }

          res.redirect(`/manageIncome/${encodeURIComponent(username)}`);
        });
      });
    });
  });
});

app.post('/deleteIncome', (req, res) => {
  const { username, transactionId } = req.body;

  // Step 1: Obtain the money balance from the 'money' table using the username
  const getMoneyBalanceQuery = `SELECT balance FROM money WHERE name = ?`;
  connection.query(getMoneyBalanceQuery, [username], (err, moneyResult) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving money balance from the database');
      return;
    }

    const moneyBalance = moneyResult[0].balance;
    console.log(moneyBalance);
    // Step 2: Obtain the amount from the 'expense' table using the transactionId
    const getExpenseAmountQuery = `SELECT amount FROM income WHERE id = ?`;
    connection.query(getExpenseAmountQuery, [transactionId], (err, expenseResult) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error retrieving expense amount from the database');
        return;
      }

      const expenseAmount = expenseResult[0].amount;
      console.log(expenseAmount);
      // Step 3: Calculate the new balance
      const newBalance = moneyBalance - expenseAmount;
      console.log(newBalance);
      // Step 4: Update the balance of the 'money' table with the new balance
      const updateMoneyBalanceQuery = `UPDATE money SET balance = ? WHERE name = ?`;
      connection.query(updateMoneyBalanceQuery, [newBalance, username], (err, moneyUpdateResult) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Error updating money balance in the database');
          return;
        }

        // Step 5: Delete the record from the 'expense' table
        const deleteExpenseQuery = `DELETE FROM income WHERE id = ?`;
        connection.query(deleteExpenseQuery, [transactionId], (err, expenseDeleteResult) => {
          if (err) {
            console.error(err.message);
            res.status(500).send('Error deleting transaction from the database');
            return;
          }

          res.redirect(`/manageIncome/${encodeURIComponent(username)}`);
        });
      });
    });
  });
});
            
      });

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login.html', (req, res) => {
    res.render('login');
}); 

app.get('/signup.html', (req, res) => {
    res.render('signup');
}); 

app.get('/transactions', (req, res) => {
    const username = req.query.username;

    // Fetch the recent transactions data from the expense table in the database
    const sql = `SELECT * FROM expense WHERE name = ? ORDER BY timestamp DESC`;
    const m = `SELECT * FROM money WHERE name = ?`;

    connection.query(sql, [username], (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
          const transactions = result.map((transaction) => {
            // Convert the timestamp to a valid Date object
            const timestamp = new Date(transaction.timestamp);
            const formattedTimestamp = timestamp.toLocaleString();
            return { ...transaction, timestamp, formattedTimestamp };
        });
        

            connection.query(m, [username], (err, result) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error retrieving data from the money table');
                } else {
                    const moneyData = result[0];
                    // Render the transactions page, passing the username, transactions data, and money data
                    res.render('transactions', { username, transactions, m: moneyData });
                }
            });
        }
    });
});

app.get('/manageIncome/:username', (req, res) => {
  const username = req.params.username;
  console.log(username);
  // Fetch the recent transactions data from the expense table in the database
  const sql = `SELECT * FROM income WHERE name = ? ORDER BY timestamp DESC`;
  const m = `SELECT * FROM money WHERE name = ?`;

  connection.query(sql, [username], (err, result) => {
      if (err) {
          console.error(err.message);
          res.status(500).send('Error retrieving data from the database');
      } else {
        const transactions = result.map((transaction) => {
          // Convert the timestamp to a valid Date object
          const timestamp = new Date(transaction.timestamp);
          const formattedTimestamp = timestamp.toLocaleString();
          return { ...transaction, timestamp, formattedTimestamp };
      });
      

          connection.query(m, [username], (err, result) => {
              if (err) {
                  console.error(err.message);
                  res.status(500).send('Error retrieving data from the money table');
              } else {
                  const moneyData = result[0];
                  // Render the transactions page, passing the username, transactions data, and money data
                  res.render('income', { username, transactions, m: moneyData });
              }
          });
      }
  });
});  

const port = 5000; // Define the desired port number
app.listen(port, () => {
    console.log(`Server is running at port  ${port}`);
});