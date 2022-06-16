# Basic discord music bot using discord js and discord-player

After you have cloned the repo make sure to create a `.env` file with the `TOKEN` and `CLIENT_ID` specified for example

```
TOKEN=xxx
CLIENT_ID=xxx
```

# Running with docker

`docker run -e TOKEN=<your_token_here> -e CLIENT_ID=<your_client_id_here> -d pabolo02345/discord-js-music-bot`

# Commands

- play
  - song {url}       - plays the song from the youtube url
  - search {keyword} - searches for the keyword on youtube and plays the first result
  - playlist {url}   - plays the playlist from url

- skip   - Skips the current song
- queue  - Displays the first 10 songs in the queue
- pause  - pauses the current song
- resume - resumes playing the current song
- exit   - kicks the bot from the voice channel
