## iCapital Engineering Challenge

A simple web app that allows a partner user to enter investor information and upload at least one document. Investor data is stored in a SQLite database and uploaded files are saved on the server.

## Tech Stack

**Frontend**: React (Vite) \
**Backend**: Node.js, Express, Multer \
**Database**: SQLite (`investors.db`) \
**Storage**: Local filesystem (`server/uploads/`)

## Running the App
### Backend
```
cd server
npm install
npm run dev
```

Express defaults to http://localhost:3000

### Frontend
```
cd client
npm install
npm run dev
```
Vite defaults to http://localhost:5173

### Viewing the Database

From the `server` folder:

```
sqlite3 investors.db
.tables
SELECT * FROM investors;
SELECT * FROM documents;
```

### Completed:
- Frontend form
- File upload handling
- Files saved to filesystem
- SQLite tables and inserts
- Basic validation
- Success/error messages
- Setup instructions

### With more time:
- Stronger validation (ZIP/state/phone)
- Investor list/detail views
- Edit/update flow
- Tests
- Docker support
- UI polish