# PHP Service

## Database Schema

The service uses a simple SQLite database with two tables: `User` and `Word`.

### User

-  id: integer, primary key
-  username: string
-  words: relation → all vocabulary items belonging to this user

### Word

-  id: integer, primary key
-  userId: integer → references User.id
-  word: string
-  meaning: string
-  learned: boolean (default: false)
-  progress: integer (default: 0)
