const { LocalFileSystem } = require("./local-file-system");

const writeAsync = async (dir, fileName, content) => {
  try {
    await LocalFileSystem.writeAsync("cache")(dir, fileName, content, (content) => JSON.stringify(content));
    return {
      status: true,
    };
  } catch (e) {
    return {
      status: false,
    };
  }
};

const readAsync = async (dir, fileName) => {
  try {
    const res = await LocalFileSystem.readAsync("cache")(dir, fileName, (content) => JSON.parse(content));
    return res;
  } catch (e) {
    return {
      status: false,
      message: e.message,
    };
  }
};

const deleteAsync = async (dir, fileName) => {
  try {
    await LocalFileSystem.deleteAsync("cache")(dir, fileName);
    return {
      status: true,
    };
  } catch (e) {
    return {
      status: false,
      message: e.message,
    };
  }
};

const readDirAsync = async (dir) => {
  return LocalFileSystem.readDirAsync("cache")(dir);
};

const deleteAllAsync = async () => {
  try {
    const dirs = await readDirAsync();
    for (let dir of dirs) {
      await deleteAsync("", dir);
    }
  } catch (e) {
    return {
      status: false,
      message: e.message,
    };
  }
};

export const CacheStorage = {
  writeAsync,
  readAsync,
  deleteAsync,
  readDirAsync,
  deleteAllAsync,
};
