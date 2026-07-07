# 🎵 TTMLLIB — The Open TTML Lyrics Library

TTMLLIB is a premium, open-source Next.js application and API designed to parse, store, and display synchronized lyrics in **TTML (Timed Text Markup Language)** format. It features an Apple Music-style scrolling lyrics interface synchronized in real-time with YouTube stream events, as well as a robust caching API proxying LRCLIB.

---

## ✨ Features

- **Apple Music-Style Scrolling**: Highlights and scrolls lyrics lines smoothly as the audio progresses.
- **YouTube Iframe Player API Integration**: Integrates directly with YouTube Topic channels or lyric streams for audio playback.
- **Multi-Format Parsing**:
  - Rich word-level highlighting using **TTML XML**.
  - Fallback parsing for bracketed **LRC timestamps** (e.g., `[00:10.50]`).
  - Plain text fallback formatting.
- **High-Performance API Proxy**:
  - Automatically queries and caches lyrics from LRCLIB if not found locally.
  - REST API endpoints for search, retrieval, and batch downloads.
- **Distributor Ingestion Gate**: Includes a secure POST endpoint allowing authorized distributors (e.g., SudoAPP) to ingest new lyrics records.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styles**: Tailwind CSS v4 (Deep Dark & Indigo Cyber theme)
- **Database**: MySQL (relational indexing for songs and API authentication)

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Jetomit-Bio/TTML-Liabrary.git
cd TTML-Liabrary
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Schema Configuration
Set up your MySQL database and execute the following SQL schema to create the tracks and API keys tables:

```sql
-- Create tracks table
CREATE TABLE IF NOT EXISTS `tracks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `artist` VARCHAR(255) NOT NULL,
  `album` VARCHAR(255) NULL,
  `duration` VARCHAR(50) NOT NULL,
  `type` ENUM('Plain', 'Synced') NOT NULL,
  `lyrics` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `distributor` VARCHAR(255) NULL,
  `duration_seconds` INT DEFAULT 0,
  `youtube_id` VARCHAR(255) NULL,
  `lyrics_ttml` TEXT NULL
);

-- Create api_keys table for distributor authentication
CREATE TABLE IF NOT EXISTS `api_keys` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `api_key` VARCHAR(255) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Environment Variables
Create a `.env.local` file in the root of the project directory and configure your database parameters:

```env
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_NAME="your_db_name"
```

### 5. Run the application
```bash
# Development mode
npm run dev

# Production Build
npm run build
npm run start
```

---

## 📡 API Reference

All requests must be made to the base URL (e.g. `http://localhost:3000`).

### 1. Get lyrics by track signature
`GET /api/get`  
Finds the best matching lyrics for a track. If not found in the local database, it queries LRCLIB, caches the result locally, and returns it.

**Query Parameters:**
- `track_name` (required, string)
- `artist_name` (required, string)
- `album_name` (required, string)
- `duration` (required, number, track duration in seconds, accepts ±2s)

---

### 2. Get cached lyrics
`GET /api/get-cached`  
Same query parameters as `/api/get`, but only searches the local database (never queries external sources).

---

### 3. Get lyrics by ID
`GET /api/get/[id]`  
Retrieves a specific lyric record by its unique database ID.

---

### 4. Search tracks
`GET /api/search`  
Search for lyrics using keywords.

**Query Parameters (at least one of `q` or `track_name` is required):**
- `q` (string): Fulltext search across title, artist, and album.
- `track_name` (string): Filter by track title.
- `artist_name` (optional, string): Filter by artist name.
- `album_name` (optional, string): Filter by album name.

---

### 5. Ingest new track (Authorized Upload)
`POST /api/upload`  
Pushes a new lyric record into the database. Requires authorization.

**Headers:**
- `x-api-key` (required, your distributor API key)

**Body JSON Structure:**
```json
{
  "distributor": "SudoAPP",
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "duration_seconds": 222,
  "youtube_id": "rI1lFh5xZM8",
  "lyrics_plain": "Plain text lyrics...",
  "lyrics_ttml": "<tt>...</tt>"
}
```

---

## 📄 License
This project is licensed under a custom **Non-Commercial Use Only** license. See the [LICENSE](LICENSE) file for the full terms and restrictions.
