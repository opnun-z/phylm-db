<img width="1000" alt="phylm" src="https://github.com/opnun-z/phylm-db/assets/90743072/ecdd0ca3-b113-4ed6-acec-103e46e42760">


# About
Phylm db aims to be a consistent interface with which to interact with all of your sql / nosql databases. Most of the time just getting a key value database up and running with greater that 1 GB of storage is way more expensive or time intensive than it should be. By adding a redis like wrapper around any database of your choosing (inclusing local JSON files) you can forget about the specific database used and just focus on the project at hand. 

Obviously as your side projects grow you will need to take advantage of the features relational/document databases provide which is why the phylm wrapper does offer access to the real database under the hood. For most weekend projects you shouldn't need to explore that far though.

Currently the interface is implemented for the upstash redis client and locally. Plans to add the interface for Firebase, Casandra and PlanetScale's fetch api. 

Please post a PR for the implementations you would like or contact me and I will be sure to get back to you.

# Setup
To test locally with phylm db all that is required is installing the package with
```
npm i phylm
```
```js
import { create } from "phylm";

const IS_DEVELOPMENT = true;
const handler = async (req, res) => {
  const db = await create("", "", IS_DEVELOPMENT);

  // db.get db.set etc...
};
```
Once you are ready to deploy your application you can sign up for https://upstash.com/ and get the environmental variables seen below by creating a redis database and copying the url and token from the dashboard provided.

<img width="1000" alt="Screenshot 2023-07-06 at 2 11 48 AM" src="https://github.com/opnun-z/phylm-db/assets/90743072/fd9b81ff-c7aa-4168-a97b-0f5ad99eb8bf">

```js
import { create } from "phylm";

const REDIS_URL = process.env.REDIS_URL; // https://awake-***-41915.upstash.io
const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN; // ********
const IS_DEVELOPMENT = process.env.LOCAL === "true";

const handler = async (req, res) => {
  const db = await create(REDIS_URL, UPSTASH_TOKEN, IS_DEVELOPMENT);

   // db.get db.set etc...
};

```

# Phylm interface
## GET
### db.get(key)
```db.get(key)``` fetches and returns a given value for a key. If no value exists it will return null.
```js
const handler = async (req, res) => {
  const db = await create(REDIS_URL, UPSTASH_TOKEN, IS_DEVELOPMENT);
  await db.set("item", "value");

  const data = await db.get("item"); // "value"
  const nonExistentData = await db.get("item1"); // null
};
```
### db.mget(keys)
```db.mget(keys)``` fetches and returns given values for an array of keys. If no value exists for a given key index it will return null at that index.
```js
const handler = async (req, res) => {
  const db = await create(REDIS_URL, UPSTASH_TOKEN, IS_DEVELOPMENT);
  await db.set("item", "value");
  await db.set("item1", "value1");

  const data = await db.mget(["item"]); // ["value"]
  const multiData = await db.mget(["item", "item1"); // ["value", "value1"]
  const partiallyMissingData = await db.mget(["item", "item2"]); // ["value", null]
  const fullyMissingData = await db.mget(["item2", "item3"]); // [null, null]
};
```
## SET
### db.set(key, value)
```db.set(key, value)``` Sets the value of a given key
```js
const handler = async (req, res) => {
  const db = await create(REDIS_URL, UPSTASH_TOKEN, IS_DEVELOPMENT);
  const set = await db.set("item", "value"); // "value"

  const data = await db.get("item"); // "value"
};
```
### db.mset(keys, values)
```db.mset(keys, values)``` Sets the value of keys[0], keys[1]... keys[n] to values[0], values[1] ... values[n]
```js
const handler = async (req, res) => {
  const db = await create(REDIS_URL, UPSTASH_TOKEN, IS_DEVELOPMENT);

  const set = await db.mset(["item"], "value"); // ["value"]
  await db.get("item"); // "value"

  const setMultiple = await db.mset(["item", "item1", "item2"], ["value", "value1", "value2"]); // ["value", "value1", "value2"]
  await db.get("item1"); // "value1"
};
```
## DELETE
### db.delete(key)
```db.delete(key)``` Deletes the value at provided key
```js
const handler = async (req, res) => {
  const db = await create(REDIS_URL, UPSTASH_TOKEN, IS_DEVELOPMENT);

  const setMultiple = await db.mset(["item", "item1", "item2"], ["value", "value1", "value2"]); // ["value", "value1", "value2"]
  await db.get("item1"); // "value1"

  await db.delete("item1"); // true
  await db.get("item1"); // null
};
```
### db.mdelete(keys)
```db.mdeletes(key)``` Deletes the values of multiple provided keys
```js
const handler = async (req, res) => {
  const db = await create(REDIS_URL, UPSTASH_TOKEN, IS_DEVELOPMENT);

  const setMultiple = await db.mset(["item", "item1", "item2"], ["value", "value1", "value2"]); // ["value", "value1", "value2"]
  await db.get("item1"); // "value1"

  await db.mdelete("item1", "item"); // true
  await db.get("item1"); // null
  await db.get("item"); // null
};
```
## SCAN
### db.scan(cursor)
```db.scan(cursor)``` Provides a list of the keys in your database in a paginated cursor format.

With a fictionally small pagination of 2 keys per scan 
```js
const handler = async (req, res) => {
  const db = await create(REDIS_URL, UPSTASH_TOKEN, IS_DEVELOPMENT);

  const setMultiple = await db.mset(["item", "item1", "item2"], ["value", "value1", "value2"]); // ["value", "value1", "value2"]

  await db.scan(null); // { keys : ["item", "item1"], cursor : 2}
  await db.scan(2); // { keys : ["item2"], cursor : null}

  // Deleting items does remove them from the list of keys when scanning
  await db.delete("item"); // true
  await db.scan(null) // { keys : ["item1", "item2"], cursor : null}
  
};
```

2023 Opnun-Z
