const fs = require('fs').promises;
/*
All of your functions must return a promise!
*/

/* 
Every function should be logged with a timestamp.
If the function logs data, then put that data into the log
ex after running get('user.json', 'email'):
  sroberts@talentpath.com 1563221866619

If the function just completes an operation, then mention that
ex after running delete('user.json'):
  user.json succesfully delete 1563221866619

Errors should also be logged (preferably in a human-readable format)
*/
/**
 * logs all requests in log.txt
 * @param {string} value
 */
function log(action, file = '', value = '') {
  return fs.appendFile(
    'log.txt',
    `${action} ${value} in ${file} at ${Date.now()}\n`
  );
}

/**
 * Logs out the value of object[key]
 * @param {string} file
 * @param {string} key
 */
// function get (file, key){
// readfile
// fs.readfile(`./${file}`)
// handle promise and get back data
// parse data from string into JSON
// use key to get value
// append the log file with the above value
// }
// using promises
function get(file, key) {
  return fs
    .readFile(file, 'utf-8')
    .then(data => {
      const parsed = JSON.parse(data);
      // bracket notation because if using dot notation.
      // it looks for the key called "key"
      const value = parsed[key];
      if (!value) return log(`ERROR no "${key}" key on ${file}`);
      return log('got', file, value);
    })
    .catch(err => log(`ERROR no such file or directory ${file}`));
}
// using async
// is underlined because apparently not used?
async function getAsync(file, key) {
  try {
    // 1. read file
    // 2. handle data
    const data = await fs.readFile(file, 'utf8');
    // 3. parse data from string --> JSON
    const parsed = JSON.parse(data);
    // 4. use the key to get the value at object[key]
    const value = parsed[key];
    if (!value) return log(`ERROR no "${key}" key on ${file}`);
    // 5. append the log file with the value
    return log('got', file, value);
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
function set(file, key, value) {
  return (
    fs
      // reads
      .readFile(file, 'utf8')
      .then(data => {
        // parse
        const parsed = JSON.parse(data);
        // adds property the converts back to JSON format
        parsed[key] = value;
        const newObj = JSON.stringify(parsed);
        return fs.writeFile(file, newObj);
      })
      // TODO: adjust log function
      .then(() => log(`${key}: ${value} set in ${file}`))
      .catch(() => log(`ERROR no such file or directory ${file}`))
  );
}

/**
 * Deletes key from object and rewrites object to file
 * @param {string} file
 * @param {string} key
 */
// ESLint has a convert to async function?
function remove(file, key) {
  return fs
    .readFile(file, 'utf8')
    .then(data => {
      const parsed = JSON.parse(data);
      // not sure if needed error handle
      if (!parsed[key]) return log(`ERROR no "${key}" key on ${file}`);
      delete parsed[key];
      const newObj = JSON.stringify(parsed);
      fs.writeFile(file, newObj);
      return log('removed', file, key);
    })
    .catch(err => log(`ERROR no such file or directory ${file}`));
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
function deleteFile(file) {
  return (
    fs
      // TODO: Figure out why it will not log
      // Most likely asynchonicity?
      // take return log out and but it in a then?
      // maybe fixed
      .unlink(file)
      .then(() => {
        log(`${file} was delete`);
      })
      .catch(() => log('file does not exist'))
  );
}
/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
function createFile(file) {
  return fs
    .access(`${file}`)
    .then(() => log(`Cannot create file, ${file}, already exists`))
    .catch(() => fs.writeFile(`${file}`, '{}')
    .then(() => log('Succefully created ${file}'));
  // return fs.writeFile(file, JSON.stringify({}));
}

/**
 * Merges all data into a mega object and logs it.
 * Each object key should be the filename (without the .json) and the value should be the contents
 * ex:
 *  {
 *  user: {
 *      "firstname": "Scott",
 *      "lastname": "Roberts",
 *      "email": "sroberts@talentpath.com",
 *      "username": "scoot"
 *    },
 *  post: {
 *      "title": "Async/Await lesson",
 *      "description": "How to write asynchronous JavaScript",
 *      "date": "July 15, 2019"
 *    }
 * }
 */
function mergeData() {
  
}

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
function union(fileA, fileB) {}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
function intersect(fileA, fileB) {}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
function difference(fileA, fileB) {}

module.exports = {
  get,
  getAsync,
  set,
  remove,
  deleteFile,
  deleteFileAsync,
  createFile,
  mergeData,
  union,
  intersect,
  difference,
};
