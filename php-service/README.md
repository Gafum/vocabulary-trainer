# PHP Service

This is a minimal Laravel-PHP service. It uses SQLite and exposes simple endpoints to manage users and words.

## Start

```
cd php-service
```

Create the database and seed data

```
php artisan seed
```

Start the server

```
php artisan serve 127.0.0.1:8000
```

## API Key

API Key

-  Set in `.env`: `API_KEY=supersecret`
-  All requests must include header: `x-api-key: supersecret`

## Endpoints

POST /users

-  Create a new user. Body: `{ "username": "bob" }`.

POST /words/{userId}

-  Create a word for the user. Body: `{ "word": "door", "meaning": "an entrance" }`.

GET /words/{userId}

-  Get all words for a user.

GET /words/{userId}/{wordId}

-  Get a single word.

PUT /words/{userId}/{wordId}

-  Update `learned` (boolean) and/or `progress` (0-100).


## Examples

Create user:

```
curl -X POST http://127.0.0.1:8000/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: supersecret" \
  -d '{"username":"bob"}'
```

Create a word:

```
curl -X POST http://127.0.0.1:8000/words/<userId> \
  -H "Content-Type: application/json" \
  -H "x-api-key: supersecret" \
  -d '{"word":"door","meaning":"an entrance"}'
```

Get words:

```
curl -X GET http://127.0.0.1:8000/words/<userId> -H "x-api-key: supersecret"
```

Update learned/progress:

```
curl -X PUT http://127.0.0.1:8000/words/<userId>/<wordId> \
  -H "Content-Type: application/json" \
  -H "x-api-key: supersecret" \
  -d '{"learned":true,"progress":80}'
```

### Database Schema

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
