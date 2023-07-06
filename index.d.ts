interface db {
  /**
   * Get item from db via key {key}
   */
  get: (key: string) => Promise<string | null>;
  /**
   * Set item in db at key {key} with value {value}
   */
  set: (key: string, value: string) => Promise<string | null>;
  /**
   * Get multiple keys from db via {keys}
   */
  mget: (keys: string[]) => Promise<(string | null)[] | null>;
  /**
   * Set multiple keys in db via {keys} {values}
   */
  mset: (keys: string[], values: string[]) => Promise<(string | null)[]>;
  /**
   * Delete key/value from db
   */
  delete: (key: string) => Promise<bool>;
  /**
   *  Delete multiple keys from db
   */
  mdelete: (keys: string[]) => Promise<bool>;
  /**
   * Scan db for all keys with pagination
   */
  scan: (cursor: number | null) => Promise<{ cursor: number; keys: string[] }>;
}

/**
 * @param {string} url
 * @param {string} token
 * @param {string} local
 * @returns {db}
 */
export async function create(
  url: string,
  token: string,
  local: boolean
): Promise<db>;
