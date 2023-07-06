const { safeString, db } = require("./common/types");
const { create_local } = require("./local");

/**
 * @param {string} url
 * @param {string} token
 * @returns {Promise<db>}
 */
const create = async (url, token, local = false) => {
  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({
    url,
    token,
  });

  if (local) return create_local();

  /**
   * @type {db}
   */
  const current = {
    get: async (key) => {
      key = safeString(key);
      return await redis.get(key);
    },
    set: async (key, value) => {
      key = safeString(key);
      value = safeString(value);
      await redis.set(key, value);
      return value;
    },
    delete: async (key) => {
      key = safeString(key);
      await redis.del(key);
      return true;
    },
    mget: async (keys) => {
      keys = keys.map(safeString);
      return await redis.mget(...keys);
    },
    mset: async (keys, values) => {
      const data = {};
      keys.forEach((key, i) => {
        key = safeString(key);
        data[key] = safeString(values[i]);
      });
      await redis.mset(data);
      return values;
    },
    mdelete: async (keys) => {
      await redis.del(...keys.map(safeString));
      return true;
    },
    scan: async (cursor = null) => {
      if (!cursor) cursor = 0;
      const res = await redis.scan(cursor);
      return {
        cursor: res[0],
        keys: res[1],
      };
    },
    complete: redis,
  };

  return current;
};

module.exports.create = create;
