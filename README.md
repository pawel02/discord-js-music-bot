# Basic discord music bot using discord js and discord-player

After you have cloned the repo make sure to create a `.env` file with the `TOKEN` and `CLIENT_ID` specified for example

```
TOKEN=xxx
CLIENT_ID=xxx
```

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
