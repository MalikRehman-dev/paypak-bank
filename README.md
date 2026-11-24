# PayPak Digital Banking Dashboard

A mobile wallet style (JazzCash / Easypaisa like) banking app built with React.js. Users can register, login, deposit, withdraw, transfer money and see their transaction history.

## Setup
1. Extract the zip and open the project folder in terminal
2. npm install
3. npm run dev
4. Open the link shown in the terminal (usually http://localhost:5173)

## Sample Users (password 123456)
- ali@paypak.com (account PK10000001)
- sara@paypak.com (account PK10000002)
- usman@paypak.com (account PK10000003)

Sample transactions are added on the first run so the history is not empty. To reset everything, clear the site data of the page in browser (or delete pp_users, pp_transactions and pp_session from localStorage) and refresh.

## Features
- Register and login with validation, duplicate email check, logout
- Dashboard with balance (hide or show), total deposited, withdrawn and transferred, recent transactions and users list
- Deposit and withdraw with quick amount buttons
- Transfer by typing any account number (the account holder name is shown before sending) or by choosing a user, with a confirmation popup
- Transaction history with filters (type, status), search (reference or name), sorting (date, amount), pagination and green or red indicators
- Account settings to see account details and edit name and phone
- Responsive: sidebar on desktop, bottom navigation bar and card style transaction list on mobile

## Technology
- React 18 with functional components and Hooks
- React Router v6
- Context API for state management
- localStorage for data
- Vite

## Folders
- src/pages: all pages
- src/components: reusable Field, AmountForm, Modal, StatCard, Toast, TransactionTable, Sidebar, Layout
- src/context: BankContext (all banking logic)
- src/css: global.css, layout.css, pages.css
- src/utils: format and validation helpers

## How Edge Cases Are Handled
- A transfer is one operation: both balances and both transaction records are saved together, and if saving fails the old data is restored
- Double click is blocked using a lock and a disabled button
- Every operation reads the latest data from localStorage first, so balances stay correct
- Insufficient balance attempts are saved as Failed transactions
- Transfers to a missing account or to your own account are rejected
- Data stays after page refresh

## Assumptions
- Currency is Pakistani Rupee
- Both sender and receiver get the same transaction reference for a transfer
- Transfer is done using account number only (phone numbers of other users are not shown for privacy)

## Known Limitations
- localStorage is not secure: passwords are stored as plain text and anyone can edit the data from browser dev tools
- Data stays only in one browser, there is no real server or database
- A real project needs a backend with server side validation, password hashing and database transactions
