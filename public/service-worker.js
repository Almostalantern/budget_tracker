const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/db.js",
  "/index.js",
  "/favicon.ico",
  "/manifest.webmanifest",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches 
      .open(CACHE_NAME)
      .then(cache => { console.log(cache)
        return cache.addAll(FILES_TO_CACHE)
      })
  );
});


self.addEventListener("fetch", event => {
  // non GET requests are not cached and requests to other origins are not cached
  if (event.request.url.includes("/api/")) {
    event.respondWith(caches.open(DATA_CACHE_NAME).then(cache => {
      return fetch(event.request).then(response =>{
        if (response.status === 200){
          cache.put(event.request.url, response.clone())
        }
        return response
      }).catch(error=> {
        console.log(error);
        return cache.match(event.request)
        
      });
    }).catch(error=>{
      console.log(error)
    })
    );
    return;
  }

 

  // use cache first for all other requests for performance
  event.respondWith(
    fetch(event.request).catch(function (){
      return caches.match(event.request).then(response =>{
        if(response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")){
          return caches.match("/");
        }
      })
    })
  );
});




  