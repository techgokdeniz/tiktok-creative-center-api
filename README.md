
# Tiktok Discovery (Creative - Center Request) API

Tiktok Creative - Center is a library that is used for data retrieval. The details of encryption processes are contained within the library.



## Features

- Listing all popular hashtags on Tiktok (in 71 countries)
- Listing all popular songs on Tiktok (in 71 countries)
- Listing all popular video creators on Tiktok (in 71 countries)
- Listing all popular videos on Tiktok (in 71 countries)
## Usage/Examples

Listing all popular videos
```javascript

async function Main() {
  // get trending videos from turkey page 1 limit 20 period 7 days
  const trending = await TiktokDiscovery.getTrendingVideos("TR", 1, 20, 7);

  console.log(trending);
}

Main();
```

Listing all popular hashtags
```javascript

async function Main() {
  // get trending hastags from turkey page 1 limit 20 period 7 days
  const trending = await TiktokDiscovery.getTrendingHastag("TR", 1, 20, 7);

  console.log(trending);
}

Main();
```

  
## Installation

benim-projem'i npm kullanarak yükleyin

```bash 
  npm i tiktok-discovery-api
```
    