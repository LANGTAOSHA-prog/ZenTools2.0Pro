const DB_NAME = "zentools-ultra";
const STORE = "cache";

function openDB(){

  return new Promise((resolve, reject)=>{

    const req =
      indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = e => {

      const db = e.target.result;

      db.createObjectStore(STORE);

    };

    req.onsuccess = e =>
      resolve(e.target.result);

    req.onerror = reject;

  });

}

async function setCache(key, value){

  const db = await openDB();

  const tx =
    db.transaction(STORE,"readwrite");

  tx.objectStore(STORE)
    .put(value, key);

}

async function getCache(key){

  const db = await openDB();

  return new Promise(resolve=>{

    const tx =
      db.transaction(STORE,"readonly");

    const req =
      tx.objectStore(STORE).get(key);

    req.onsuccess =
      () => resolve(req.result);

  });

}
