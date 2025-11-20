# PHP Service

This is a minimal PHP service. It uses SQLite and exposes simple endpoints to manage users and words. This service is NOT Laravel — it is simple PHP with a tiny custom router, a PDO SQLite helper, and handcrafted controllers.

## Start

```
cd php-service
```

Export PHP

```
export PATH="/c/xampp/php:$PATH"
php -v
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

POST /words/{username}

-  Create a word for the user (use username). Body: `{ "word": "door", "meaning": "an entrance" }`.

GET /words/{username}

-  Get all words for a user (by username).

GET /words/{username}/{wordId}

-  Get a single word.

PUT /words/{username}/{wordId}

-  Update `learned` (boolean) and/or `progress` (0-100).

## Examples

Create user:

```
curl -X POST http://127.0.0.1:8000/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: supersecret" \
  -d '{"username":"bob"}'
```

Create a word (by username):

```
curl -X POST http://127.0.0.1:8000/words/<username> \
  -H "Content-Type: application/json" \
  -H "x-api-key: supersecret" \
  -d '{"word":"door","meaning":"an entrance"}'
```

Get words (by username):

```
curl -X GET http://127.0.0.1:8000/words/<username> -H "x-api-key: supersecret"
```

Update learned/progress (by username):

```
curl -X PUT http://127.0.0.1:8000/words/<username>/<wordId> \
  -H "Content-Type: application/json" \
  -H "x-api-key: supersecret" \
  -d '{"learned":true,"progress":80}'
```

Dump all data (users + words):

```
curl -X GET http://127.0.0.1:8000/dump -H "x-api-key: supersecret"
```

Run the basic integration test (requires PHP CLI):

```
php tests/integration.php
```

Reset / clear DB (seeder recreates DB file):

```
php artisan seed
```

Notes on security / sanitization

-  SQL injection: all DB operations use prepared statements with bound parameters. That protects against SQL injection.
-  HTML sanitization: textual fields (`username`, `word`, `meaning`) are sanitized with `htmlspecialchars` before storing/returning to prevent stored XSS when data is viewed in an HTML context.

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
