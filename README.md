# Lab Automation & Tracking System

This project automates the process of tracking and managing labs. It has two primary branches:
	1.	Automated Server: A backend server that handles data processing and automation, including interaction with APIs and databases.
	2.	Electron Application: A desktop application built with Electron to provide a GUI for interacting with the system.

## Overview

This system is designed to streamline lab tracking for students and instructors by automatically capturing submission details, managing students’ progress, and providing an easy-to-use interface for administrators.

## Prerequisites

Ensure the following dependencies are installed:
	•	Node.js (v14 or higher)
	•	NPM (for package management)
	•	MySQL (for the database)
	•	Electron (for the desktop application)
	•	Google Sheets API (if using for lab tracking)
	•	Setup the .env variables, you have an .env.example.


 ## Installation

 ### Automated Server

 1. Switch to the automated server branch.
```
git chekout automatedLab-Tracker
```
2. Install dependencies
```
npm install
```
3. Set up the .env file.
```
APP_ID= // Your app id
ORG= // the organization or username
SPREADSHEET_ID= //your spreadsheet id
INSTALLATION_ID= //the id of the app instalation
PRIVATE_KEY= // your generated private key
```
4. Start the server
```
node serverIO.js
```

### Electron Application
 1. Install dependencies
```
npm install
```
2. Set up the .env file.
```
APP_ID= // Your app id
ORG= // the organization or username
SPREADSHEET_ID= //your spreadsheet id
INSTALLATION_ID= //the id of the app instalation
PRIVATE_KEY= // your generated private key
```
3. Start the electron app
```
npm run start
```

## Features
•	Automated Lab Tracking: Automatically records submission times, student names, and completion statuses.
•	Student Progress: Allows instructors to track student submissions and completion of labs in real-time.
•	Google Sheets Integration: Syncs with Google Sheets to keep records updated.
•	Desktop GUI: Electron-based interface for easy access to lab tracking and automation features.

## Usage
### Automated Server
The server will handle automatic tracking of student submissions, pulling data from the API or database and managing lab progress.
### Electron
The Electron application provides a graphical user interface for users who prefer to interact with the system without needing to use the terminal. 

## License
This project is licensed under the GPL-2.0 License - see the LICENSE file for details.
