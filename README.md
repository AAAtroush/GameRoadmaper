# Game Roadmaps

This project was made initially in a 7 days deadline, This project is part of ITI CS50 summmer track for 2025. 

New games face the challenge of having no guides existing.  
People are of 2 types, those who like to explore each bit an pixel of the game, and those who like to have a simple idea on where to go next.  
This project solves this problem, through a community based on findings, Where you can report a finding.  
And the users can either Upvote, Downvote, bookmark any post.  
The project was built using HTML, CSS, JavaScript and used a noSql databases (I had to learn Firestore and Firebase auth in 3 days)  

## Features
- Login/Signup using firebase auth  
- Posting reports involves a collection on fire store that stores Title, Author, Game, Description, Upvotes, Downvotes, Voters array that have the user id  
- Voting system makes the posts more real as the project currently is community-driven  
- Bookmark system where each person has his own bookmarks which marks the second collection on fire store that have Bio, Email, Username, Bookmarks array  
- Search bar (Currently only searches in contents or titles alone, not games)  

## Note
*note: when trying to run the html directly the website will fail due to the Auth system, Appearantly Firebase Auth system has to have a certified domain and "files://" isn't one of those. So, either run the project using liveserver (aka "localhost" domain cuz it's actually certified somehow) or use the GitHub pages link.*
