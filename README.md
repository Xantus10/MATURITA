# Task

Create a web application for students, with the purpose of selling used books.


## Main functionalities
After logging in, student can create a post about selling their book  
After logging in, student can view, order and filter the posts


## Detailed instructions
- Application log in will be handled with SSO (Single Sign On), using their Office 365 account, through OAuth 2.0
- The post will contain a title, date of creation, 3 photos of the book, information about the subject/s the book is used for, the year/s in which the student needs the book, the book's condition and finally a price. The price will either be a single value or a range from-to (min-max)
- The student can browse the posts, as well as order them using "Most recent" or "The cheapest"
- The student can also filter the posts based on subject, year, condition, and price range (For posts that use a price range: The lower end will be compared with max price and the higher end with their min price)
- The student can delete their own posts (e.g. because they already sold the book), the posts should be automatically deleted after one month (default) or user supplied range (can be limited)
- Users should be able to delete their own account, auto deletion should also be enabled for accounts, that have not logged in for the past 15 months
- The system should feature an admin, admin will have their own view, where they can delete any post as well as delete all posts by a given user. He can also delete the whole user profile and blacklist it. Blacklisted user will not be permitted back on the platform. The admin can also remove people from the blacklist
- Finally the admin has the option to add/remove any subjects


# Solution


## Used technologies - tech stack

### MongoDB
As a NoSQL database, mongoDB provides us with certain functionalities, which would be hard to implement otherwise (be it the data types array and object or functionalities like TTL index). Aside from that, it will allow us to avoid long and expensive JOINs using MongoDB's rule "embed before reference", i.e. let's avoid referencing when possible. The database schema reflects this approach.

### Express.js
Basic framework for creating backend API.

### React.js
The most popular frontend framework for creating flexible UIs.

### Node.js
Javascript runtime engine that we will be using.

### nginx
Reverse proxy, that will hide our other servers.

### Docker
A tool for containerizing and application, using this we can run the application in any environment.

### Mantine
A library for react to simplify the UI creation

### Typescript
A language based on javascript, it adds type safety in development. We will be using it on both frontend and backend

### PostCSS
A CSS transformation tool, allows us to write more readable CSS and adds features such as modules, imports or nesting

### Git
A popular version control system
