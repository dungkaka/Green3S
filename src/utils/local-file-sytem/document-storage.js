const { LocalFileSystem } = require("./local-file-system");

const writeAsync = async (dir, fileName, content) => {
  try {
    await LocalFileSystem.writeAsync("document")(dir, fileName, content, (content) => JSON.stringify(content));
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
    const res = await LocalFileSystem.readAsync("document")(dir, fileName, (content) => JSON.parse(content));
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
    await LocalFileSystem.deleteAsync("document")(dir, fileName);
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
  try {
    const res = await LocalFileSystem.readDirAsync("document")(dir);
    return res;
  } catch (e) {
    return {
      status: false,
      message: e.message,
    };
  }
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

export const DocumentStorage = {
  writeAsync,
  readAsync,
  deleteAsync,
  readDirAsync,
  deleteAllAsync,
};
