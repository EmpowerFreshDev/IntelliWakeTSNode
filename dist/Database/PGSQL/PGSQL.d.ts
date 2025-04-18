import { IPaginatorRequest, IPaginatorResponse, ISortColumn } from '@empowerfresh/intelliwake';
import { PGTable } from './PGTable';
import { PGParams } from './PGParams';
import { PGEnum } from './PGEnum';
import { QueryResult, PoolClient, QueryResultRow, Pool, Client } from 'pg';
/**
 * `transact` function executes a database transaction using a provided function and returns a promise.
 * The function encapsulates the pattern of acquiring a client from the connection pool, starting a transaction,
 * performing work, committing the transaction, and finally releasing the client back to the pool.
 *
 * @param {function} fn - Async function representing transactional operation. From the client pool, this function receives a PostgreSQL client (PoolClient), and returns a promise.
 *
 * @returns {Promise<TResult>} - A promise that when resolved returns the result of the transaction operation.
 *
 * @remarks
 * - Transactions in PostgreSQL are ACID compliant. If the function `fn` throws an error, changes in that transaction will be rolled back.
 * - Handle any Promise rejections for error handling.
 *
 * @example
 *
 *  transact(async client => {
 *      const users = await client.query('SELECT * FROM users');
 *      return users.rows;
 *  })
 *  .then(users => console.log('Users:', users))
 *  .catch(err => console.error('An error occurred:', err));
 *
 */
declare function transact<TResult>(fn: (client: PoolClient) => Promise<TResult>): Promise<TResult>;
/**
 * `transact` function executes a Promise-returning function within a database transaction and triggers a callback function upon completion.
 *
 * @param {function} fn - An asynchronous function to be run within the transaction. Receives a database client (PoolClient) as argument and returns a Promise.
 * @param {function} cb - Callback function triggered after the transaction completes. Accepts two arguments: an 'error' (null if not present) and an optional transaction 'result'.
 *
 * @returns {void} - This function does not have a return value.
 *
 * @remarks
 * - Transaction function `fn` should ensure database operations are correctly formulated and handle client related errors.
 * - Callback function `cb` must handle error and result scenarios appropriately, providing meaningful feedback to users.
 *
 * @example
 *
 *  transact(
 *    async client => {
 *      const res = await client.query('SELECT * FROM users');
 *      return res.rows;
 *    },
 *    (error, result) => {
 *      if (error) {
 *        console.log('Transaction failed:', error);
 *      } else {
 *        console.log('Transaction successful. Result:', result);
 *      }
 *    }
 *  );
 *
 */
declare function transact<TResult>(fn: (client: PoolClient) => Promise<TResult>, cb: (error: Error | null, result?: TResult) => void): void;
/**
 * `TConnection` represents a flexible type declaration for a database connection object with PostgreSQL.
 * This includes standard PostgreSQL connections (Pool, PoolClient, Client), as well as custom connection objects
 * with added properties. It is designed to represent PostgreSQL connection objects in all possible configurations.
 *
 * @typedef {Pool | PoolClient | Client | CustomConnection} TConnection
 *
 * @property {boolean=} inTransaction - Optional. If present, indicates whether a transaction is currently active.
 *
 * @returns {TConnection | Promise<TConnection>} Directly returns a `TConnection` object, or if it's obtained asynchronously, a Promise of it.
 *
 * @example
 *
 *   // Using Pool
 *   const poolConnection : TConnection = new Pool(config);
 *
 *   // Using PoolClient
 *   const clientConnection : TConnection = pool.client();
 *
 *   // Using Client
 *   const simpleClient : TConnection = new Client(config);
 *
 *   // Using custom object with additional properties
 *   const customConnection : TConnection =
 *     {
 *       pool: new Pool(),
 *       Client: new Client(),
 *       customProperty: { query: anyFunction, pool: anyPool }
 *     };
 *
 * @remarks
 * - Connect functionality should be properly configured on the connection object.
 * - Transaction scope is managed by `inTransaction` property, if present, and should be handled appropriately.
 */
export type TConnection = (Pool | PoolClient | Client | {
    pool: Pool;
    Client: Client;
    query: Pool['query'];
    connect: Pool['connect'];
    transact: typeof transact;
} & Record<string, {
    pool: Pool;
    Client: Client;
    query: Pool['query'];
    connect: Pool['connect'];
    transact: typeof transact;
}>) & {
    inTransaction?: boolean;
} | Promise<(Pool | PoolClient | Client | {
    pool: Pool;
    Client: Client;
    query: Pool['query'];
    connect: Pool['connect'];
    transact: typeof transact;
} & Record<string, {
    pool: Pool;
    Client: Client;
    query: Pool['query'];
    connect: Pool['connect'];
    transact: typeof transact;
}>) & {
    inTransaction?: boolean;
}>;
export declare namespace PGSQL {
    /**
     * `IOffsetAndCount` interface defines an object structure for pagination purposes in requests. It includes 'offset' and 'countPerPage' properties.
     *
     * @interface IOffsetAndCount
     * @property {number} offset - The starting index from which data should be fetched.
     * @property {number} countPerPage - The maximum number of data instances to fetch.
     *
     * @remarks
     * - The `offset` value is usually a multiple of `countPerPage` and represents a page number when divided by `countPerPage`.
     *
     */
    interface IOffsetAndCount {
        offset: number;
        countPerPage: number;
    }
    const IgnoreDBMSAlert = "/*NO_DBMS_ALERT*/";
    /**
     * `SetDBMSAlert` function manipulates the 'DB_MS_ALERT' environment variable.
     *
     * @param {number} [milliseconds] - The new value for 'DB_MS_ALERT' as the alert threshold in milliseconds.
     * If unspecified or falsy, 'DB_MS_ALERT' is removed from the environment variables.
     *
     * @remarks
     * - 'DB_MS_ALERT' environment variable is typically used to set a performance alert threshold in MS for database transactions.
     * - If the transaction time exceeds this value, an alert could potentially be triggered.
     *
     * @example
     *
     *  // Set DB_MS_ALERT to 3000ms
     *  SetDBMSAlert(3000);
     *
     *  // Delete DB_MS_ALERT from environment variables
     *  SetDBMSAlert();
     *
     */
    const SetDBMSAlert: (milliseconds?: number) => void;
    type TQueryResults<T extends QueryResultRow> = QueryResult<T>;
    /**
     * `query` function executes an SQL query using a given database connection.
     *
     * @template T extends QueryResultRow
     * @param {TConnection} connection - Contains details necessary to connect to the database.
     * @param {string} sql - The SQL statement to execute.
     * @param {any} [values] - Optional. Values for SQL parametrization.
     * @returns {Promise<TQueryResults<T>>} - Returns a promise that resolves with the query results.
     *
     * @remarks
     * - The promise is logged and then re-thrown in the event of an error.
     * - If 'DB_MS_ALERT' is set in the environment variables, long running queries will be logged.
     *
     * @example
     *  // Execute a SELECT query
     *  query(dbConnection, "SELECT * FROM users WHERE age > $1", [21])
     *      .then(res => console.log(res))
     *      .catch(err => console.log(err));
     */
    const query: <T extends QueryResultRow>(connection: TConnection, sql: string, values?: any) => Promise<TQueryResults<T>>;
    /**
     * `timeout` function returns a Promise that resolves after the specified duration in milliseconds.
     *
     * @function timeout
     * @param {number} ms - Delay in milliseconds before Promise resolves.
     * @returns {Promise<void>} - Promise that resolves after 'ms' milliseconds.
     *
     * @remarks
     * - Useful for creating artificial delay in promise chains or async functions.
     * - Be mindful of adding delays as they can slow down application execution.
     *
     * @example
     * // Delay execution for 2 seconds
     * timeout(2000).then(() => console.log("2 seconds have passed"));
     *
     * // Can be used with async/await as well
     * await timeout(2000);
     * console.log("2 seconds have passed");
     */
    const timeout: (ms: number) => Promise<unknown>;
    /**
     * `TableRowCount` asynchronously retrieves the count of rows in a specific database table.
     *
     * @param {TConnection} connection - Object containing DB connection details.
     * @param {string} table - The name of the target database table.
     * @param {string} [schema] - Optional. The name of the schema where the table resides.
     * @returns {Promise<number>} - Returns a promise that resolves with number of rows in the table.
     *
     * @remarks
     * - Make sure that the provided connection object is valid and authorized to read the specified table.
     *
     * @example
     *  // Fetch row count from the 'users' table in default schema
     *  TableRowCount(dbConnection, 'users')
     *      .then(count => console.log('Number of users: ', count))
     *      .catch(err => console.log(err));
     *
     *  // Fetch row count from the 'orders' table in 'sales' schema
     *  TableRowCount(dbConnection, 'orders', 'sales')
     *      .then(count => console.log('Number of orders: ', count))
     *      .catch(err => console.log(err));
     *
     */
    const TableRowCount: (connection: TConnection, table: string, schema?: string) => Promise<number>;
    /**
     * `CurrentSchema` function defaults to string 'public' if no schema name provided.
     *
     * @function CurrentSchema
     * @param {string} [schema] - Optional. Name of the database schema.
     * @returns {string} - The provided schema name, or 'public' if no schema is given.
     *
     * @example
     * // Returns: 'public'
     * let activeSchema = CurrentSchema();
     * console.log("Active schema is:", activeSchema);
     *
     * // Returns: 'users'
     * activeSchema = CurrentSchema('users');
     * console.log("Active schema is:", activeSchema);
     */
    const CurrentSchema: (schema?: string) => string;
    /**
     * `CurrentSchema` function returns database schema name, defaults to 'public' if none provided.
     *
     * @param {TConnection} connection - The connection object to the database. All SQL queries will be executed over this connection.
     * @param {string} table - The name of the table for which the existence check is performed.
     * @param {string} [schema] - Optional. Name of the database schema.
     * @returns {string} - Provided schema name or 'public' if no schema is given.
     *
     * @remarks
     * - This function is handy when you want to ensure a schema name is available.
     *
     * @example
     * // Returns: 'public'
     * console.log(CurrentSchema());
     *
     * // Returns: 'users'
     * console.log(CurrentSchema('users'));
     *
     */
    const TableExists: (connection: TConnection, table: string, schema?: string) => Promise<boolean>;
    /**
     * `TableColumnExists` function checks if a specific column exists in a database table.
     *
     * @param {TConnection} connection - Database connection details.
     * @param {string} table - The target table name.
     * @param {string} column - The target column name.
     * @param {string} [schema] - Optional. The schema where the table resides.
     * @returns {Promise<boolean>} - Returns a promise that resolves with a boolean. 'true' if column exists, 'false' otherwise.
     *
     * @example
     *  // Check if 'email' column exists in 'users' table located in default schema
     *  TableColumnExists(dbConnection, 'users', 'email')
     *      .then(exists => console.log("'email' column in 'users' table exists: ", exists))
     *      .catch(err => console.log(err));
     *
     *  // Check if 'price' column exists in 'products' table located in 'sales' schema
     *  TableColumnExists(dbConnection, 'products', 'price', 'sales')
     *      .then(exists => console.log("'price' column in 'sales.products' table exists: ", exists))
     *      .catch(err => console.log(err));
     */
    const TableColumnExists: (connection: TConnection, table: string, column: string, schema?: string) => Promise<boolean>;
    /**
     * `TriggerExists` function checks the existence of a specific trigger in the database schema.
     *
     * @param {TConnection} connection - Object holding DB connection details.
     * @param {string} trigger - Name of the trigger.
     * @param {string} [schema] - Optional. The name of the schema where the trigger resides.
     * @returns {Promise<boolean>} - Promise that resolves with boolean indication of trigger's presence.
     *
     * @example
     * // Check existence of 'user_audit' trigger in the default schema
     * TriggerExists(dbConnection, 'user_audit')
     *      .then(exists => console.log("Trigger 'user_audit' exists: ", exists))
     *      .catch(err => console.log(err));
     *
     * // Check existence of 'sales_audit' trigger in the 'sales' schema
     * TriggerExists(dbConnection, 'sales_audit', 'sales')
     *     .then(exists => console.log("Trigger 'sales.sales_audit' exists: ", exists))
     *     .catch(err => console.log(err));
     */
    const TriggerExists: (connection: TConnection, trigger: string, schema?: string) => Promise<boolean>;
    /**
     * `TableResetIncrement` function resets the auto-increment value of a specific column in a table.
     *
     * @param {TConnection} connection - Database connection details.
     * @param {string} table - The table to reset auto-increment.
     * @param {string} column - The column where auto-increment needs to be reset.
     * @param {number} [toID] - Optional. The value to reset auto-increment to. If not provided, sets to max usage.
     * @returns {Promise<void>} - Returns a promise which resolves when operation is complete.
     *
     * @example
     * // Reset auto-increment of "id" column in "users" table to highest used value
     * TableResetIncrement(dbConnection, 'users', 'id')
     *    .then(() => console.log("'users.id' increment reset to max used value."))
     *    .catch(err => console.log(err));
     *
     * // Reset auto-increment of "id" column in "products" table to 1000
     * TableResetIncrement(dbConnection, 'products', 'id', 1000)
     *    .then(() => console.log("'products.id' increment reset to 1000."))
     *    .catch(err => console.log(err));
     */
    const TableResetIncrement: (connection: TConnection, table: string, column: string, toID?: number) => Promise<QueryResult<any>>;
    /**
     * `ConstraintExists` function verifies the existence of a particular constraint.
     *
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} constraint - The name of the constraint to check.
     * @param {string} [schema] - Optional. The name of the schema where constraint resides.
     * @returns {Promise<boolean>} - Promise that resolves to boolean indicating the existence of constraint.
     *
     * @example
     * // Verify the existence of constraint 'fk_user' in the default schema
     * ConstraintExists(dbConnection, 'fk_user')
     *    .then(exists => console.log("'fk_user' exists: ", exists))
     *    .catch(err => console.log(err));
     *
     * // Verify the existence of constraint 'fk_order' in the 'sales' schema
     * ConstraintExists(dbConnection, 'fk_order', 'sales')
     *    .then(exists => console.log("'sales.fk_order' exists: ", exists))
     *    .catch(err => console.log(err));
     */
    const ConstraintExists: (connection: TConnection, constraint: string, schema?: string) => Promise<boolean>;
    /**
     * Interface representing constraints for a table.
     *
     * @interface IConstraints
     */
    interface IConstraints {
        table_name: string;
        constraint_name: string;
    }
    /**
     * `FKConstraints` function fetches foreign key constraints from a particular schema in a database.
     *
     * @param {TConnection} connection - Database connection details.
     * @param {string} [schema] - Optional. The schema to fetch constraints from.
     * @returns {Promise<IConstraints[]>} - Promise resolving to an array of foreign key constraints.
     *
     * @example
     * // Fetch foreign key constraints from the default schema
     * FKConstraints(dbConnection)
     *    .then(constraints => console.log("FK Constraints in default schema:", constraints))
     *    .catch(err => console.log(err));
     *
     * // Fetch foreign key constraints from the 'sales' schema
     * FKConstraints(dbConnection, 'sales')
     *    .then(constraints => console.log("FK Constraints in 'sales' schema:", constraints))
     *    .catch(err => console.log(err));
     */
    const FKConstraints: (connection: TConnection, schema?: string) => Promise<IConstraints[]>;
    /**
     * `Functions` function fetches a list of function names from a specific schema in a database.
     *
     * @param {TConnection} connection - Database connection details.
     * @param {string} [schema] - Optional. The schema to fetch functions from.
     * @returns {Promise<string[]>} - Promise resolving to an array of function names.
     *
     * @example
     * // Fetch function names from the default schema
     * Functions(dbConnection)
     *    .then(functions => console.log("Functions in default schema:", functions))
     *    .catch(err => console.log(err));
     *
     * // Fetch function names from the 'users' schema
     * Functions(dbConnection, 'users')
     *    .then(functions => console.log("Functions in 'users' schema:", functions))
     *    .catch(err => console.log(err));
     */
    const Functions: (connection: TConnection, schema?: string) => Promise<string[]>;
    /**
     * `IndexExists` function verifies the existence of a specific index in a particular table.
     *
     * @param {TConnection} connection - Database connection details.
     * @param {string} tablename - Name of the table to inspect.
     * @param {string} indexName - Name of the index to verify.
     * @param {string} [schema] - Optional. The schema where the table resides.
     * @returns {Promise<boolean>} - Promise resolving to boolean, `true` if index exists, else `false`.
     *
     * @example
     * // Check if 'idx_name' exists in the 'users' table of default schema
     * IndexExists(dbConnection, 'users', 'idx_name')
     *    .then(exists => console.log("Index 'idx_name' in 'users': ", exists))
     *    .catch(err => console.log(err));
     *
     * // Check if 'idx_userId' exists in the 'orders' table of 'sales' schema
     * IndexExists(dbConnection, 'orders', 'idx_userId', 'sales')
     *    .then(exists => console.log("Index 'idx_userId' in 'sales.orders': ", exists))
     *    .catch(err => console.log(err));
     */
    const IndexExists: (connection: TConnection, tablename: string, indexName: string, schema?: string) => Promise<boolean>;
    /**
     * `GetByID` function retrieves a row from a specific table based on row ID.
     *
     * @template T - The type of the row to retrieve.
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} table - The table to fetch the row from.
     * @param {number | null} id - The ID of the row to retrieve, null to return null.
     * @returns {Promise<T | null>} - Promise that resolves to the retrieved row, or null if not found.
     *
     * @example
     * // Get a user with ID 5 from the 'users' table
     * GetByID(dbConnection, 'users', 5)
     *    .then(user => console.log("User with ID 5:", user))
     *    .catch(err => console.log(err));
     *
     * // Attempt to get a user with null ID (returns null)
     * GetByID(dbConnection, 'users', null)
     *    .then(user => console.log("User with null ID:", user)) // Will log "User with null ID: null"
     *    .catch(err => console.log(err));
     */
    const GetByID: <T extends QueryResultRow>(connection: TConnection, table: string, id: number | null) => Promise<T | null>;
    /**
     * `GetCountSQL` function executes a SQL query and returns the count.
     *
     * @param {TConnection} connection - Database connection details.
     * @param {string} sql - The SQL query to execute ("SELECT COUNT(*) ...").
     * @param {any} [values] - Optional. Values for SQL query parameters.
     * @returns {Promise<number>} - Promise resolving to the count as a number.
     *
     * @example
     * // Get count of users from 'users' table
     * const sql = "SELECT COUNT(*) FROM users";
     * GetCountSQL(dbConnection, sql)
     *    .then(count => console.log("Number of users:", count))
     *    .catch(err => console.log(err));
     *
     * // Get count of users older than 30 from 'users' table
     * const sqlWithParams = "SELECT COUNT(*) FROM users WHERE age > $1";
     * const values = [30];
     * GetCountSQL(dbConnection, sqlWithParams, values)
     *    .then(count => console.log("Number of users older than 30:", count))
     *    .catch(err => console.log(err));
     */
    const GetCountSQL: (connection: TConnection, sql: string, values?: any) => Promise<number>;
    /**
     * `FetchOne` function fetches a single row from the database using a SQL query and parameter values.
     *
     * @template T - The type of the row to retrieve.
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} sql - The SQL query to execute.
     * @param {any} [values] - Optional. Values for sql query parameters.
     * @returns {Promise<T | null>} - Promise resolving to fetched row or null if no row is found.
     *
     * @example
     * // Fetch a user who is exactly age 30 from 'users' table
     * const sql = "SELECT * FROM users WHERE age = $1 LIMIT 1";
     * const values = [30];
     * FetchOne(dbConnection, sql, values)
     *    .then(user => console.log("User of age 30:", user))
     *    .catch(err => console.log(err));
     *
     * // Fetch first user from 'users' table
     * const sqlFirstUser = "SELECT * FROM users LIMIT 1";
     * FetchOne(dbConnection, sqlFirstUser)
     *    .then(user => console.log("First user: ", user))
     *    .catch(err => console.log(err));
     */
    const FetchOne: <T extends QueryResultRow>(connection: TConnection, sql: string, values?: any) => Promise<T | null>;
    /**
     * `FetchOneValue` function fetches the first value from the result set of a database query.
     *
     * @template T - The type of the value to retrieve.
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} sql - The SQL query to execute.
     * @param {any} [values] - Optional. Values for SQL query parameters.
     * @returns {Promise<T | null>} - Promise resolving to the first fetched value or null if none is found.
     *
     * @example
     * // Fetch the age of first user from 'users' table
     * const sqlCommand = "SELECT age FROM users LIMIT 1";
     * FetchOneValue(dbConnection, sqlCommand)
     *    .then(age => console.log("Age of first user: ", age))
     *    .catch(err => console.log(err));
     *
     * // Fetch the name of a user who is ID 5 in 'users' table
     * const sqlWithParams = "SELECT name FROM users WHERE id = $1";
     * const paramValues = [5];
     * FetchOneValue(dbConnection, sqlWithParams, paramValues)
     *    .then(name => console.log("Name of user with ID 5: ", name))
     *    .catch(err => console.log(err));
     */
    const FetchOneValue: <T>(connection: TConnection, sql: string, values?: any) => Promise<T | null>;
    /**
     * `FetchMany` function executes SQL query and fetches an array of rows from the database.
     *
     * @template T - The type of the rows to retrieve.
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} sql - The SQL query to execute.
     * @param {any} [values] - Optional. Values for SQL query parameters.
     * @returns {Promise<Array<T>>} - Promise resolving to an array of rows or empty array if none is found.
     *
     * @example
     * // Fetch all users from 'users' table
     * const allUsersSql = "SELECT * FROM users";
     * FetchMany(dbConnection, allUsersSql)
     *    .then(users => console.log("All users: ", users))
     *    .catch(err => console.log(err));
     *
     * // Fetch users older than 30 from 'users' table
     * const sqlWithParams = "SELECT * FROM users WHERE age > $1";
     * const paramValues = [30];
     * FetchMany(dbConnection, sqlWithParams, paramValues)
     *    .then(users => console.log("Users older than 30: ", users))
     *    .catch(err => console.log(err));
     */
    const FetchMany: <T extends QueryResultRow>(connection: TConnection, sql: string, values?: any) => Promise<Array<T>>;
    /**
     * `FetchArray` function fetches data from the database and transforms into an array.
     *
     * @template T - The type of the values to retrieve.
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} sql - The SQL query to execute.
     * @param {any} [values] - Optional. Values for SQL query parameters.
     * @returns {Promise<Array<T>>} - Promise resolving to an array of values.
     *
     * @example
     * // Fetch array of user names from 'users' table
     * const usernameSql = "SELECT username FROM users";
     * FetchArray(dbConnection, usernameSql)
     *    .then(names => console.log("Usernames: ", names))
     *    .catch(err => console.log(err));
     *
     * // Fetch array of names of users above age 30
     * const sqlWithParams = "SELECT name FROM users WHERE age > $1";
     * const paramValues = [30];
     * FetchArray(dbConnection, sqlWithParams, paramValues)
     *    .then(names => console.log("Names of users older than 30: ", names))
     *    .catch(err => console.log(err));
     */
    const FetchArray: <T>(connection: TConnection, sql: string, values?: any) => Promise<Array<T>>;
    /**
     * The `FetchExists` function checks if certain entities exist in the database by running a "SELECT 1 FROM..." SQL query.
     *
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} sql - The SQL query to execute. Should follow the "SELECT 1 FROM ..." pattern.
     * @param {any} [values] - Optional. Values for SQL query parameters.
     * @returns {Promise<boolean>} - Promise resolving to boolean indicating if entities satisfying the SQL query exist.
     *
     * @example
     * // Check if 'users' table exists
     * const sqlTableExists = "SELECT 1 FROM information_schema.tables WHERE table_name = $1";
     * FetchExists(dbConnection, sqlTableExists, ["users"])
     *    .then(exists => console.log("'users' table exists: ", exists))
     *    .catch(err => console.log(err));
     *
     * //Check if a specific user exists
     * const sqlUserExists = "SELECT 1 FROM users WHERE username = $1";
     * FetchExists(dbConnection, sqlUserExists, ["johndoe"])
     *    .then(exists => console.log("User 'johndoe' exists: ", exists))
     *    .catch(err => console.log(err));
     */
    const FetchExists: (connection: TConnection, sql: string, values?: any) => Promise<boolean>;
    /**
     * The `InsertAndGetReturning` function inserts a new row into a database table and returns the inserted row.
     *
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} table - The name of the table to perform the insertion.
     * @param {any} values - The row data to insert into the table.
     * @returns {Promise<any | null>} - Promise resolving to inserted row data or null if an error occurs.
     *
     * @example
     * // Insert a new user into 'users' table
     * const user = { username: 'johndoe', age: 30 };
     * InsertAndGetReturning(dbConnection, "users", user)
     *    .then(newUser => console.log("New user inserted: ", newUser))
     *    .catch(err => console.log(err));
     */
    const InsertAndGetReturning: (connection: TConnection, table: string, values: any) => Promise<any | null>;
    /**
     * The `InsertAndGetID` function inserts a new row into a database table and returns the generated ID.
     *
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} table - The name of the table to perform the insertion.
     * @param {object} values - The row data to insert.
     * @returns {Promise<number>} - Promise resolving to generated ID of the inserted row.
     * @throws {Error} - Throws an error if the ID could not be loaded.
     *
     * @example
     * // Insert a new user into 'users' table and get the ID
     * const user = {username: 'johndoe', age: 30};
     * InsertAndGetID(dbConnection, "users", user)
     *    .then(id => console.log("New user ID: ", id))
     *    .catch(err => console.log(err));
     */
    const InsertAndGetID: (connection: TConnection, table: string, values: any) => Promise<number>;
    /**
     * The `InsertBulk` function inserts multiple rows of data into a database table.
     *
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} table - The name of the table to perform the insert operation.
     * @param {any} values - An array of row data objects to be inserted into the table.
     * @returns {Promise<void>} - Promise resolving when the data has been inserted.
     * @throws {Error} - Throws an error if an insertion error occurs.
     *
     * @example
     * // Insert multiple users into 'users' table
     * const users = [{username: 'johndoe', age: 30}, {username: 'janedoe', age: 25}];
     * InsertBulk(dbConnection, "users", users)
     *    .then(() => console.log("Users inserted successfully"))
     *    .catch(err => console.log(err));
     */
    const InsertBulk: (connection: TConnection, table: string, values: any) => Promise<void>;
    /**
     * The `UpdateAndGetReturning` function updates a row in a database table with provided values and returns the updated row.
     *
     * @param {TConnection} connection - Holds database connection details.
     * @param {string} table - The name of the table to perform the update operation.
     * @param {object} whereValues - The conditions for selecting the row to update.
     * @param {object} updateValues - The new values to update the selected row with.
     * @returns {Promise<any | null>} - Promise resolving to the updated row data or null if no row was updated.
     *
     * @example
     * // Update a user in 'users' table
     * const whereValues = {username: 'johndoe'};
     * const updateValues = {age: 31};
     * UpdateAndGetReturning(dbConnection, "users", whereValues, updateValues)
     *    .then(updatedUser => console.log("Updated user: ", updatedUser))
     *    .catch(err => console.log(err));
     */
    const UpdateAndGetReturning: (connection: TConnection, table: string, whereValues: any, updateValues: any) => Promise<any | null>;
    /**
     * Constructs a WHERE clause for a PostgreSQL query based on the given 'whereValues' object. Also adds the required parameters to the 'params' object for parameterized queries.
     *
     * @param {Object} whereValues - An object representing the values used in the WHERE clause. Each property in the object represents a column and its corresponding value. For example, { column1: 'value1', column2: 'value2' } would translate to "WHERE column1='value1' AND column2='value2'" in SQL.
     * @param {PGParams} params - The PostgreSQL parameters object for parameterized queries. This helps to prevent SQL injection by securely inserting the 'whereValues' into the SQL query string.
     * @returns {string} The complete WHERE clause as a string, ready to be appended to a SQL query.
     * @remarks
     * Each key-value pair in the 'whereValues' object will create a condition string in the format of 'key=value'. If a value is explicitly set to 'undefined' or 'null', the condition string will instead be 'key IS NULL'.
     *
     * All condition strings generated are then joined with an ' AND ' delimiter to form the complete WHERE clause.
     * @example
     * // Create a WHERE clause
     * const whereValues = {name: 'John', age: null};
     * const params = new PGParams();
     * const whereClause = BuildWhereComponents(whereValues, params);
     * console.log(whereClause);
     * // Output: "name"=$1 AND "age" IS NULL
     */
    const BuildWhereComponents: (whereValues: any, params: PGParams) => string;
    /**
     * Constructs a SET clause for a SQL  query based on the given 'setValues' object.
     * Also populates the 'params' object with values for parameterized queries.
     *
     * @param {Object} setValues - An object representing the new values to use in the SET clause. Each key-value pair represents a column and its respective new value. For example, { column1: 'new value1', column2: 'new value2' } translates to 'SET "column1" = $1, "column2" = $2' in a SQL query.
     * @param {PGParams} params - An instance of the PGParams class that represents the parameters to be used in a PostgreSQL query. The values from 'setValues' are added to this object for use in parameterized queries as a security measure to prevent SQL injections.
     * @returns {string} A string representing the SET clause in an SQL update query, excluding the 'SET' keyword itself. For instance, if 'setValues' is { column1: 'new value1', column2: 'new value2' }, the returning string would be: '"column1" = $1, "column2" = $2'.
     * @remarks
     * 	This function iterates over each key-value pair in the 'setValues' object,
     * 	creating an array of strings in the format '"key" = $n',
     * 	where 'key' is the column name and 'n' is the index at which the value is stored in 'params'.
     *
     * 	It then joins these strings with commas to form a SET clause that can be used in a SQL update query.
     * 	@example
     * // Create a SET clause
     * const setValues = {name: 'John', age: 30};
     * const params = new PGParams();
     * const setClause = BuildSetComponents(setValues, params);
     * console.log(setClause);
     * // Output: "name"=$1,"age"=$2
     */
    const BuildSetComponents: (setValues: any, params: PGParams) => string;
    /**
     * Saves data to a specific database table. It performs either an INSERT or an UPDATE operation based on the presence of an 'id' property in the 'values' object.
     *
     * @param {TConnection} connection - The connection object to the database. All SQL queries will be executed over this connection.
     * @param {string} table - The name of the table to save the data into.
     * @param {object} values - A key-value object of the data to be saved. Each key represents a column in the table and the value is the data to be saved in that column. The 'id' property, if present, is used to identify the record to update.
     *
     *
     * @returns {Promise<any | null>} - A Promise that is resolved with the object that was saved. Returns null if no record was saved. Be aware that this function can return any type, so consider the structure of your table and handle the return value accordingly.
     *
     * @remarks
     * If 'values' has an 'id' property, the function performs an UPDATE operation on the record with this 'id'.
     * If 'values' does not have an 'id' property, the method does an INSERT operation.
     *
     * @example
     * // Save (insert or update) a user in 'users' table
     * const user = {id: 1, username: 'johndoe', age: 30};
     * Save(dbConnection, "users", user)
     *    .then(savedUser => console.log("Saved user: ", savedUser))
     *    .catch(err => console.log(err));
     */
    const Save: (connection: TConnection, table: string, values: any) => Promise<any | null>;
    /**
     * Executes a DELETE SQL operation on a specified table in the connected database.
     *
     * @param {TConnection} connection - The connection instance pointing to the active database. This connection is where the SQL DELETE operation will be executed.
     * @param {string} table - The name of the table in the database from which to delete data. By SQL syntax, this should be the exact name of the table, case sensitive.
     *
     * @param {object} whereValues - An object consisting of key-value pairs that define the conditional deletion. Each key-value pair represents a column-name-value pair in the WHERE clause of the SQL DELETE statement. For example, {first_name: 'John', last_name: 'Doe'} would translate to "WHERE first_name = 'John' AND last_name = 'Doe'" in SQL language.
     *
     * @returns {Promise<void>} A Promise representing the completion of the DELETE operation. No value gets returned upon completion (as per the void result type), but if a technical problem occurs during the deletion, the Promise will be rejected with the error that caused the failure.
     * @example
     *
     * const tableName = 'customers';
     * const conditions = { email: 'johndoe@gmail.com' };
     * await Delete(dbConnection, tableName, conditions);
     *
     * This would delete the customer entry whose email is 'johndoe@gmail.com' from the 'customers' table.
     */
    const Delete: (connection: TConnection, table: string, whereValues: any) => Promise<void>;
    /**
     * ExecuteRaw function is used to execute a raw SQL query on a given database connection.
     *
     * @param {TConnection} connection - The connection object representing the database connection.
     * @param {string} sql - The raw SQL query to be executed.
     * @returns {Promise<any>} - Returns a Promise that resolves with the result of the `Execute(connection, sql)` function.
     * @throws {Error} - If the query execution encounters any error.
     * @remarks
     * This function `ExecuteRaw(connection, sql)` sends an SQL query string to the `Execute` function, which is then executed against the database.
     * The `ExecuteRaw` function returns the full response object from the SQL query execution.
     * Always ensure that the SQL query string is properly formatted and safe to prevent possible SQL injection attacks.
     *
     * @example
     *
     * const sqlQuery = 'UPDATE Books SET title = "Updated Title" WHERE id = 1';
     *
     * ExecuteRaw(dbConnection, sqlQuery)
     *    .then(() => console.log('Update operation completed successfully!'))
     *    .catch((error) => console.error('An Error occurred while executing the query:', error));
     *
     */
    const ExecuteRaw: (connection: TConnection, sql: string) => Promise<QueryResult<any>>;
    /**
     * Executes a SQL query using the provided database connection.
     *
     * @remarks
     * This function `Execute(connection, sql, values)` executes an SQL query `sql`
     * on a provided database connection object `connection`. An array of `values`
     * is an optional parameter that can be used for parameter binding in the SQL query.
     *
     * The function asynchronously returns the result of the SQL query execution
     * wrapped in a Promise. The structure of the returned object depends on the
     * executed SQL command.
     *
     * A runtime environment variable `DB_MS_ALERT` is used to set a threshold (in milliseconds)
     * for query execution time. If the query execution time exceeds this threshold,
     * the query details are logged in the console.
     *
     * @example
     *
     * const sql = 'UPDATE users SET name = $1 WHERE id = $2';
     * const values = ['John', 1];
     *
     * Execute(dbConnection, sql, values)
     *   .then(res => console.log('Update successful', res))
     *   .catch(e => console.error('Error:', e.message));
     *
     *
     * @param {TConnection} connection - The connection to the database on which
     * the SQL query will be executed.
     * @param {string} sql - The SQL query to execute. Can contain placeholders
     * for parameter binding if `values` is provided.
     * @param {any} [values] - Optional array of values to bind to the placeholders
     * in the SQL query.
     * @returns {Promise<any>} A Promise that resolves with the response from
     * the database based on the executed SQL query.
     *
     * @throws {Error} If an error occurs during the execution of the SQL query,
     * an error is thrown with the message from the caught error.
     */
    const Execute: (connection: TConnection, sql: string, values?: any) => Promise<QueryResult<any>>;
    /**
     * Executes an SQL query against a given database connection. Unlike the `Execute` function, this does not log anything to the console.
     *
     * @remarks
     * The `ExecuteNoConsole` function takes in an SQL statement along with an
     * optional array of values for placeholder substitution (parameter binding) within
     * the SQL query, and executes the SQL command against the provided database
     * connection.
     *
     *
     * @example
     *
     * const userId = 1;
     * const nameUpdated = "John Doe";
     *
     * const query = 'UPDATE users SET name = $1 WHERE id = $2';
     * const values = [nameUpdated, userId];
     *
     * await ExecuteNoConsole(dbConnection, query, values);
     * console.log(`User with id ${userId} was successfully updated.`);
     *
     * @param {TConnection} connection - The database connection to execute the query.
     * @param {string} sql - The SQL query string to execute.
     * @param {any} [values] - Optional: Array of values to be used in the query.
     * @returns {Promise<any>} A Promise that resolves with the executed query result.
     */
    const ExecuteNoConsole: (connection: TConnection, sql: string, values?: any) => Promise<QueryResult<any>>;
    /**
     * Executes a function within a database transaction.
     *
     * @template T The expected return type of the transaction function.
     *
     * @param {TConnection} connection - The connection object to be used for the transaction
     * @param {(Client | Poolclient) => Promise<T>} func The function to execute within the transaction, which should return a Promise.
     *
     * @returns {Promise<T>} Returns a Promise that resolves with the result of the transaction function or
     * rejects with an error if an error occurred during the transaction.
     *
     * @remarks
     * The function initiates a transaction by utilizing two internal database commands: 'START TRANSACTION' and
     * 'SET CONSTRAINTS ALL DEFERRED'. If the transaction succeeds, it is finalized with 'COMMIT'.
     * In the event of an error, the transaction is rolled back using 'ROLLBACK', and an Error is thrown.
     * After the transaction is complete, if the Pool is in use, it is released automatically.
     * If Client or PoolClient then it must be release manually outside the function.
     *
     * @example
     *
     *   const result = await Transaction<number>(dbConnection, (transactionClient) => {
     *     //...some database operations that return a Promise
     *   });
     *
     * @throws If an invalid connection object is provided or if an error occurs during the transaction
     */
    const Transaction: <T>(connection: TConnection, func: (transactionClient: Client | PoolClient) => Promise<T>) => Promise<T>;
    /**
     * Truncates all tables in a database, optionally excluding specified tables, and optionally cascading the truncation.
     *
     * @template TConnection Type of database connection.
     *
     * @param {TConnection} connection The database connection to use for truncation.
     * @param {string[]} [exceptions=[]] An array of table names to exclude from truncation.
     * @param {boolean} [includeCascade=false] If true, cascading truncation will be used.
     *
     * @returns {Promise<boolean>} Returns a Promise that resolves with true if truncation succeeds or
     * false if an error occurs during truncation.
     *
     *
     * @remarks
     * This function starts a transaction and sets all constraints to deferred. Then it goes through
     * each table in the database, and if the table is not in the exceptions list, it truncates the table.
     * If the `includeCascade` option is true, it also cascades the truncation. If any part of the operation fails,
     * it rolls back the transaction and returns false. If all operations succeed, it commits the transaction and returns true.
     *
     * @example
     *
     *   // Truncate all tables, except the `users` and `accounts` tables, with cascading.
     *   await TruncateAllTables(dbConnection, ['users', 'accounts'], true);
     *
     *
     * @throws This function does not throw errors. Instead, it catches errors and rolls back the transaction,
     * returning false to indicate the error.
     */
    const TruncateAllTables: (connection: TConnection, exceptions?: string[], includeCascade?: boolean) => Promise<boolean>;
    /**
     * The `TruncateTables` method is used to wipe all the records from the specified tables in the connected database, while leaving the table schema (columns, data types, constraints, etc.) intact.
     *
     * @param {TConnection} connection - An object representing the active database connection. This connection is used to perform the truncation operations on the specified tables.
     *
     * @param {string[]} tables - An array of string values representing the names of the tables to be truncated. The method will iterate over this array and execute the TRUNCATE SQL statement on each table.
     *
     * @param {boolean} [includeCascade=false] - An optional boolean value indicating whether the CASCADE option should be included in the truncation operation. By including CASCADE option, the rows from the referenced tables will also be removed if a foreign key relationship exists. If not provided, the parameter defaults to false.
     *
     * @returns {Promise<void>} - A Promise object that resolves when the truncation operation on all specified tables is successfully completed. No value is provided when the Promise resolves, but the resolution of the Promise indicates the successful execution of the operation.
     *
     * @throws {Error} - Throws an Error object if any exceptions occur during the truncation process. This might be due to issues like invalid connection, permission errors, non-existent table names, etc.
     *
     * @example
     *  const tablesToTruncate = ['table1', 'table2'];
     *  const cascade = true;
     *
     *  try {
     *    await TruncateTables(dbConnection, tablesToTruncate, cascade);
     *    console.log(`All tables [${tablesToTruncate.join(', ')}] have been successfully truncated.`);
     *  } catch (error) {
     *    console.error(`An error occurred while attempting to truncate tables: ${error}`);
     *  }
     *
     * @remarks
     * Be cautious about the use of CASCADE, because it removes the rows from referenced tables. Make sure to keep backups, if needed, before executing this operation.
     * Also remember that TRUNCATE operations cannot be performed if the table is referenced by a FOREIGN KEY, unless CASCADE is provided.
     */
    const TruncateTables: (connection: TConnection, tables: string[], includeCascade?: boolean) => Promise<void>;
    /**
     * The `TablesArray` method is an async function that fetches an array containing the names of all tables from a particular database schema using the provided database connection.
     *
     * @param {TConnection} connection - An instance of the database connection. It acts as an interface with the database, making it possible to fetch the table names directly.
     *
     * @param {string} [schema] - An optional parameter indicating the name of the schema from which table names are to be retrieved. If not provided, the function defaults to the current schema in use.
     *
     * @returns {Promise<string[]>} - A Promise that resolves with an array of strings, where each string is the name of a base table present in the specified schema.
     *
     * @example
     *  // Fetch table names from the 'public' schema
     *  const tables = await TablesArray(dbConnection, 'public');
     *  console.log(tables);  // Outputs: [ 'table1', 'table2', 'table3' ]
     *
     *  // Fetch table names from the currently set schema
     *  const tables = await TablesArray(dbConnection);
     *  console.log(tables);  // Outputs: [ 'table4', 'table5', 'table6' ]
     *
     * @remarks
     * The function uses the 'information_schema.tables' view to fetch the table names. This view contains one row for each table in the database. Note that only 'BASE TABLE' types are considered, excluding views.
     *
     */
    const TablesArray: (connection: TConnection, schema?: string) => Promise<string[]>;
    /**
     * The `ViewsArray` method fetches an array of names of all the views found in a particular schema in the database. It uses the provided database connection to perform this task.
     *
     * @async
     * @param {TConnection} connection - An instance of the database connection. It establishes an interface with the database, enabling the procedure to fetch the view names.
     *
     * @param {string} [schema] - An optional parameter designating the schema from which to retrieve view names. If it is not provided, the function uses the currently active database schema.
     *
     * @returns {Promise<string[]>} - A Promise that resolves to an array of strings. Each string is the name of a view in the specified schema. The function will only consider 'VIEW' types, keeping table names out of the result.
     *
     * @example
     *  const connection = new Connection();
     *  // Fetch view names from the 'public' schema
     *  const views = await ViewsArray(dbConnection, 'public');
     *  console.log(views);  // Outputs: [ 'view1', 'view2', 'view3' ]
     *
     *  // Fetch view names from the currently set schema
     *  const views = await ViewsArray(dbConnection);
     *  console.log(views);  // Outputs: [ 'view4', 'view5', 'view6' ]
     *
     * @remarks
     * The function uses the 'information_schema.tables' table to extract the names of the views. This table contains one row for each table and view that exist in the database. Although the name suggests 'tables', this information schema view contains information about both tables and views in the database.
     * Also, note that system and temporary views may not appear, depending on the user's privilege level on the database.
     *
     */
    const ViewsArray: (connection: TConnection, schema?: string) => Promise<string[]>;
    /**
     * The `ViewsMatArray` method is an async function that fetches an array of the names of all materialized views from a specific schema within a PostgreSQL database, using the provided database connection.
     *
     * @param {TConnection} connection - An instance of the database connection. It establishes an interface with the database, enabling the procedure to fetch the materialized view names.
     *
     * @param {string} [schema] - An optional parameter that represents the schema from which to retrieve the materialized view names. If it is not provided, the current schema set in your PostgreSQL connection will be used.
     *
     * @returns {Promise<string[]>} - A Promise that resolves to an array of strings, where each string is the name of a materialized view in the specified schema.
     *
     * @example
     *  const connection = new Connection();
     *  // Fetch materialized view names from the 'public' schema
     *  const matViews = await ViewsMatArray(dbConnection, 'public');
     *  console.log(matViews);  // Outputs: [ 'matView1', 'matView2', 'matView3' ]
     *
     *  // Fetch materialized view names from the currently set schema
     *  const matViews = await ViewsMatArray(dbConnection);
     *  console.log(matViews);  // Outputs: [ 'matView4', 'matView5', 'matView6' ]
     *
     * @remarks
     * This function queries the 'pg_matviews' system catalog table, which contains one row for each materialized view in the PostgreSQL database. It extracts only the names (`matviewname`) of the materialized views (`WHERE schemaname = '<schema>'`). Please note that the visibility of these materialized views in the catalog table depends on the user's access permission levels in the PostgreSQL database.
     */
    const ViewsMatArray: (connection: TConnection, schema?: string) => Promise<string[]>;
    /**
     * The `TypesArray` method is an async function that fetches an array of names of all enumeration (enum) types from PostgreSQL database.
     * Enum is a user-defined data type in PostgreSQL, which consists of static, ordered set of values.
     *
     * @async
     * @param {TConnection} connection - An instance of the database connection. It establishes an interface with the database, enabling the procedure to fetch the enum type names.
     *
     * @returns {Promise<string[]>} - A Promise that resolves to an array of strings, where each string is the name of an enum type.
     *
     * @example
     *  // Fetch enum type names from the database
     *  const types = await TypesArray(dbConnection);
     *  console.log(types);  // Outputs: [ 'enum_type1', 'enum_type2', 'enum_type3' ]

     * @remarks
     * The function queries the 'pg_type' system catalog table, which contains one row for each data type in the PostgreSQL database. It extracts the names (`typname`) of those whose category (`typcategory`) is 'E', which stands for enums.
     * Please note, the visibility of these enumeration types depend on the user's access privilege level on the PostgreSQL database.
     * So for example, only superusers can see some restricted types.
     */
    const TypesArray: (connection: TConnection) => Promise<string[]>;
    /**
     * The `FunctionsArray` function fetches an array of PostgreSQL function names from the given database connection matching specific condition. This function specifically finds all functions that start with 'func_'.
     *
     * @param {TConnection} connection - A database connection object. This allows interaction with the PostgreSQL database.
     *
     * @param {string} [schema] - (Optional) The name of the schema to look for functions in. If not provided, the function will default to the current schema.
     *
     * @returns {Promise<string[]>} - A Promise which resolves to an array of strings. Each string is the name of a function found within the specified or default schema starting with 'func_'.
     *
     * @example
     * const schema = 'public';
     * // Fetch and log function names from the target schema
     * const functions = await FunctionsArray(dbConnection, schema);
     * console.log(functions); // Outputs: ['func_example', 'func_hello_world', ...]
     *
     * @remarks
     * The function constructs a SQL string that queries the 'pg_proc' system catalog table, which contains data about functions in the PostgreSQL system.
     * Specifically, it joins the 'pg_proc' and 'pg_namespace' tables to relate functions to their respective schemas by the namespace OIDs,
     * and then limits the results to those functions whose name begins with 'func_'.
     * The function name check is case-insensitive ('ILIKE' is used).
     */
    const FunctionsArray: (connection: TConnection, schema?: string) => Promise<string[]>;
    /**
     * The `FunctionsOIDArray` method is an async function that fetches an array of PostgreSQL function Object Identifiers (OIDs) in a given database connection that follow a specific pattern in their names. This function specifically finds OIDs of all functions that start with 'func_'.
     *
     * @param {TConnection} connection - A database connection object representing the interface to interact with the PostgreSQL database.
     *
     * @param {string} [schema] - (Optional) The name of the schema within which to look for functions. If not provided, the default schema of the database will be used.
     *
     * @returns {Promise<any[]>} - A Promise that when resolves, returns an array of OIDs. Each OID corresponds to a function found within the specified or default schema and starts with 'func_'.
     *
     * @example
     * const schema = 'public';
     * // Fetch function OIDs and log them
     * const functionOids = await FunctionsOIDArray(dbConnection, schema);
     * console.log(functionOids); // Outputs: [<oid_value1>, <oid_value2>, ...]
     *
     * @remarks
     * The SQL query constructed in this function targets the `pg_proc` system catalog table, which contains data about functions in the PostgreSQL system. The query also joins 'pg_proc' and 'pg_namespace' tables to link functions to their respective schema via the namespace OIDs (pronamespace), and filters results to functions starting with 'func_' (case-insensitive due to the use of 'ILIKE').
     *
     * Please note that, OID changes with every new function and isn’t a reliable way to reference objects if functions are regularly added or dropped. In recent PostgreSQL versions, OIDs are not included as a default, unless specifically stated during table creation.
     */
    const FunctionsOIDArray: (connection: TConnection, schema?: string) => Promise<any[]>;
    /**
     * The `ExtensionsArray` function is a utility function that fetches the names of all loaded PostgreSQL extensions installed on the PostgreSQL database, excluding the 'plpgsql' extension.
     *
     * @param {TConnection} connection - A connection object that interfaces with the PostgreSQL database. It is used to execute the SQL query against the database.
     *
     * @returns {Promise<string[]>} - The function returns a Promise that resolves to an array of strings. Each string is the name of a loaded extension on the PostgreSQL database (excluding 'plpgsql').
     *
     * @example
     * // Fetch and log extension names
     * const extensions = await ExtensionsArray(dbConnection);
     * console.log(extensions); // Outputs: ['hstore', 'postgis', ...]
     *
     * @remarks
     * This function works by querying the `pg_extension` system catalog table in the PostgreSQL database, which contains data about installed extensions. The SQL query specifically selects the 'extname' field (which holds the name of the extension) from this table, and it excludes 'plpgsql' in the WHERE clause.
     */
    const ExtensionsArray: (connection: TConnection) => Promise<string[]>;
    /**
     * The `TableData` function fetches the metadata for a specific table from the PostgreSQL database. This function retrieves detailed information about the given table's schema like table_catalog, table_type, self_referencing_column_name etc.
     *
     * @param {TConnection} connection - A connection object that interfaces with your PostgreSQL database. This is used to execute the SQL query against the database.
     *
     * @param {string} table - The name of the table for which data needs to be fetched.
     *
     * @param {string} [schema] - (Optional) The schema in which the table is defined. If not provided, the default schema set will be used.
     *
     * @returns {Promise<any>} - The function returns a Promise that gets resolved with the fetched table data. The data includes the table's detailed metadata.
     *
     * @example
     * const tableName = 'example';
     * const schemaName = 'public';
     * // Fetch metadata of 'example' table from 'public' schema
     * const tableData = await TableData(dbConnection, tableName, schemaName);
     * console.log(tableData);
     *
     * @remarks
     * The function uses a SQL query to select all data from the 'information_schema.tables' catalog table that matches the provided input criteria including table name, table type (BASE TABLE indicates that the table is a standard, heap-organized table), and schema name.
     */
    const TableData: (connection: TConnection, table: string, schema?: string) => Promise<any>;
    /**
     * The `TableColumnsData` function fetches the metadata for all the columns of a specified table from the PostgreSQL database. This function retrieves details about all columns in the provided table, such as data type, character length, whether null-able, and much more.
     *
     * @param {TConnection} connection - A connection object encompassing the details required to connect to your PostgreSQL database. It is utilized to execute the SQL query against your database.
     *
     * @param {string} table - The name of the table on which column information needs to be fetched.
     *
     * @param {string} [schema] - (Optional) The schema in which the desired table resides. If omitted, the default schema is used.
     *
     * @returns {Promise<any[]>} - The function returns a Promise that is resolved with an array of objects, each representing a column in the specified table.
     *
     * @example
     * const tableName = 'users';
     * const schemaName = 'public';
     * // Fetch and log column metadata of 'users' table from 'public' schema
     * const columnData = await TableColumnsData(dbConnection, tableName, schemaName);
     * console.log(columnData);
     *
     * @remarks
     * This function fires a SQL query that selects all entries from the 'information_schema.columns' catalog for the specified table and schema. It sorts the results by 'ordinal_position' to ensure they are in the order they are defined in the table.
     */
    const TableColumnsData: (connection: TConnection, table: string, schema?: string) => Promise<any[]>;
    /**
     * The `TableFKsData` function fetches the metadata of all foreign keys in a specific table from the PostgreSQL database. This function retrieves comprehensive information about these relationships for the specified table, including all columns involved in the foreign key constraint, the target (primary) table and columns, and whether the foreign key constraint is enforced.
     *
     * @param {TConnection} connection - A connection object used to connect to your PostgreSQL database. This is utilized to execute the SQL query against your database.
     *
     * @param {string} table - The name of the table for which foreign key information needs to be fetched.
     *
     * @param {string} [schema] - (Optional) The schema in which the desired table resides. If omitted, the function uses the default schema.
     *
     * @returns {Promise<any[]>} The function returns a Promise that is resolved with an array of objects, each representing a foreign key constraint in the specified table.
     *
     * @example
     * const tableName = 'orders';
     * const schemaName = 'public';
     * // Fetch and log foreign key information of 'orders' table from 'public' schema
     * const fkData = await TableFKsData(dbConnection, tableName, schemaName);
     * console.log(fkData);
     *
     * @remarks
     * The function performs a SQL query that retrieves data from multiple system catalog tables and views (`information_schema.table_constraints`, `information_schema.key_column_usage`, `information_schema.constraint_column_usage`) since foreign key metadata resides across these. Constraints are filtered by table name, constraint type (FOREIGN KEY), and optionally schema. The results are then grouped by the target schema, constraint name, and table name.
     */
    const TableFKsData: (connection: TConnection, table: string, schema?: string) => Promise<any[]>;
    /**
     * The `TableIndexesData` function retrieves the metadata for all indexes associated with a specific table in the PostgreSQL database. This function fetches the index details like index name, index creation command, and the methods used to store and retrieve data, from the `pg_indexes` system catalog view.
     *
     *
     * @param {TConnection} connection - A connection object to establish a connection with the PostgreSQL database. This object is used to execute the SQL query over the database.
     *
     * @param {string} table - The name of the table from which index data needs to be fetched.
     *
     * @param {string=} schema - (Optional) The schema where the specified table is located. If not provided, the function uses the default schema.
     *
     * @returns {Promise<any[]>} - The function returns a Promise that is resolved with an array of objects. Each object represents an index associated with the specified table in your database.
     *
     * @example
     * const tableName = '_users';
     * const schemaName = 'public';
     * // Fetch and log index data of '_users' table from 'public' schema
     * const indexData = await TableIndexesData(dbConnection, tableName, schemaName);
     * console.log(indexData);
     *
     * @remarks
     * This function runs a SQL query that selects all entries from the 'pg_indexes' catalog view that correspond to the specified table and optional schema. The query specifically excludes primary key indexes that are not composite (do not include multiple columns). It uses the ILIKE operator to perform a case-insensitive search on the 'indexname' and 'indexdef' columns, to filter out such indexes.
     */
    const TableIndexesData: (connection: TConnection, table: string, schema?: string) => Promise<any[]>;
    /**
     * The `ViewData` function retrieves the SQL command that was used to create a specific view in the PostgreSQL database. This function fetches the SQL definition (the `SELECT` statement) of a specified view from the database using the `pg_get_viewdef` system function.
     *
     * @param {TConnection} connection - A connection object for connecting to the PostgreSQL database. It is used to execute the SQL query on the database.
     *
     * @param {string} view - The name of the view whose definition needs to be fetched.
     *
     * @returns {Promise<string | null>} - The function returns a Promise that gets resolved with a string representing the SQL definition of the view. If the view is not found, it returns null.
     *
     * @example
     * const viewName = 'user_summary';
     * // Fetch and log the definition of view 'user_summary'
     * const viewDefinition = await ViewData(dbConnection, viewName);
     * console.log(viewDefinition);
     *
     * @remarks
     * This function executes a SQL query using the `pg_get_viewdef` system function, which returns the query string that was used to create the view. If the view does not exist in the database, the function will return null. Be aware that this function doesn't verify whether the provided view name exists or not. Make sure the view name exists before using this function to avoid unexpected null values.
     */
    const ViewData: (connection: TConnection, view: string) => Promise<string | null>;
    /**
     * The ViewsMatData function retrieves the SQL code used to define a Materialized View in a PostgreSQL database. This function fetches the SQL definition (effectively the `SELECT` statement) of the specified Materialized View.
     *
     * @param {TConnection} connection - A Connection object representing the active connection to the PostgreSQL database. It's used to execute the SQL statement.
     *
     * @param {string} viewMat - The name of the Materialized View whose SQL definition is to be fetched.
     *
     * @returns {Promise<any>} - Returns a Promise that resolves with a string if the definition is found, representing the SQL query that defines the Materialized View. If not found, it resolves with null.
     *
     * @example
     * // Specify materialized view name
     * const materializedViewName = 'materialized_view_summary';
     * // Fetch and log the definition of materialized view
     * const definition = await ViewsMatData(dbConnection, materializedViewName);
     * console.log(definition);
     *
     * @remarks
     * This function constructs and executes a SQL query using the 'pg_get_viewdef' system function, which returns the original SQL code used to create the Materialized View. It will return null if the Materialized View with the specified name doesn't exist, making it important to ensure that the Materialized View name is correct. Also note that while regular Views can be updated with some restrictions, Materialized Views are read-only.
     */
    const ViewsMatData: (connection: TConnection, viewMat: string) => Promise<any>;
    /**
     * The FunctionData function retrieves the definition of a specific PostgreSQL function from the database. It leverages PostgreSQL's system function `pg_get_functiondef` which helps to fetch the SQL definition of a function available in the database.
     *
     * @param {TConnection} connection - A Connection object representing the active connection to the PostgreSQL database. It's used to execute the SQL statement to fetch the function's definition.
     *
     * @param {string} func - The name of the function whose SQL definition is to be fetched.  Ensure the name provided matches exactly with the function name in the database.
     *
     * @returns {Promise<any>} - Returns a Promise that resolves with a string if the definition is found, representing the SQL query that defines the function. If not found, the promise will resolve with null.
     *
     * @example
     * // Specify function name
     * const functionName = 'my_function';
     * // Fetch and log the definition of the function
     * const definition = await FunctionData(dbConnection, functionName);
     * console.log(definition);
     *
     * @remarks
     * Make sure the function's name provided is correct, because PostgreSQL is case-sensitive. If the function does not exist, or the wrong name is provided, the promise will resolve with null. It's also noteworthy that this function only fetches the SQL definition, it does not provide details on the function's use or invocation.
     */
    const FunctionData: (connection: TConnection, func: string) => Promise<any>;
    /**
     * The TypeData function asynchronously retrieves all elements of a specified PostgreSQL ENUM type
     * and returns them as an array of string values.
     *
     * @async
     *
     * @param {TConnection} connection - The Connection object representing the active connection to the PostgreSQL
     * database. It's used to execute the SQL statement and fetch the ENUM values.
     *
     * @param {string} type - The name of the ENUM type whose values are to be fetched. Make sure the ENUM type exists
     * in the database, and the name matches exactly.
     *
     * @returns {Promise<string[]>} - Returns a Promise that resolves with an array of strings, each string representing a
     * value of the specified ENUM type.
     *
     * @example
     * // Specify ENUM type
     * const typeName = 'color';
     * // Fetch, log the array of ENUM values
     * const enumValues = await TypeData(dbConnection, typeName);
     * console.log(enumValues);
     *
     * @remarks
     * Be sure to provide an existing ENUM type name; any spelling mistakes or nonexistent ENUM types will result in
     * an error. The ENUM type name is case-sensitive, so make sure to match the case when providing the `type` value.
     * This function doesn't check for the ENUM type's existence before making the query, so ensure the ENUM type exists
     * to prevent unnecessary errors.
     */
    const TypeData: (connection: TConnection, type: string) => Promise<string[]>;
    /**
     * The `SortColumnSort` function generates an SQL ORDER BY clause according to the provided sorting preferences
     * encapsulated in a given sort column object.
     *
     * The function takes a sort column object which specifies how sorting should take place, including primary
     * and secondary sort columns, sort orders and null handling instructions. It then generates and returns
     * the corresponding SQL ORDER BY clause which can then be added to SQL queries to perform the desired sorting.
     *
     * @param {Object} sortColumn - An object representing sort column data. This object should include properties
     * like `primarySort`, `primaryAscending`, `primaryEmptyToBottom`, `secondarySort`, `secondaryAscending`,
     * and `secondaryEmptyToBottom`.
     *
     * @returns {string} The generated SQL ORDER BY clause, which can be directly added to an SQL query.
     *
     * @example
     * //Define the sort column preference object
     * const sortColumn = {
     *   primarySort: "lastName",
     *   primaryAscending: true,
     *   primaryEmptyToBottom: 'string',
     *   secondarySort: "firstName",
     *   secondaryAscending: false,
     *   secondaryEmptyToBottom: 'string'
     * };
     *
     * // Generate the SQL sorting clause
     * const orderClause = SortColumnSort(sortColumn);
     *
     * console.log(orderClause);
     * // Outputs: "ORDER BY NULLIF(lastName, '') NULLS LAST, firstName DESC NULLS LAST"
     *
     * @remarks
     * The `sortColumn` object's properties (`primarySort`, `secondarySort`, etc.) should match the actual
     * column names in the database table that you intend to use the generated SQL ORDER BY clause with.
     * If not, it could lead to SQL error due to nonexistent columns. The generated SQL clause does not include
     * any input sanitization or SQL injection protection. Thus, make sure to use safe values for sorting preferences.
     */
    const SortColumnSort: <T = Record<string, any>>(sortColumn: ISortColumn<T>) => string;
    /**
     * PaginatorOrderBy is a utility function to generate the SQL order clause based on the paginated request.
     *
     * @param {IPaginatorRequest} paginatorRequest - The incoming `IPaginatorRequest` containing the page number (req.page),
     *              the number of records per page (req.countPerPage),
     *              a potential search query (req.search),
     *              the sorting details (req.sortColumns),
     *              active status (req.active),
     *              and the filters (req.filterValues).
     *
     * The function specifically uses the 'sortColumns' property from the `IPaginatorRequest` to generate the SQL "ORDER BY" clause.
     * Other properties in the `IPaginatorRequest` interface:
     * - 'page' current page.
     * - 'countPerPage' determines the number of items to show per page.
     * - 'search' tells the server how to sort the data.
     * - 'active' tells the server whether to find active, inactive or all items
     * - 'filterValues' Other filter data (of type T) to pass to the structure to limit result sets (e.g. customer_id = 1 for all items that match customer 1)
     *
     * @returns A SQL clause as a string.
     *
     * @example
     *   const paginatorRequest = {
     *     page: 1,
     *     countPerPage: 20,
     *     search: "John Doe",
     *     sortColumns: {
     *       primarySort: "lastName",
     *       primaryAscending: true,
     *       primaryEmptyToBottom: 'string',
     *       secondarySort: "firstName",
     *       secondaryAscending: false,
     *       secondaryEmptyToBottom: 'string'
     *     },
     *     active: true,
     *     filterValues: {
     *       department: 'HR',
     *       location: 'New York'
     *     }
     *   };
     *
     *   const orderClause = PaginatorOrderBy(paginatorRequest);
     *
     *   console.log(orderClause); // Outputs: "ORDER BY NULLIF(lastName, '') NULLS LAST, firstName DESC NULLS LAST"
     */
    const PaginatorOrderBy: (paginatorRequest: IPaginatorRequest) => string;
    /**
     * The `LimitOffset` function is used to generate a LIMIT and OFFSET clause
     * as part of a SQL query, which aids in paginating through large datasets.
     * It helps in fetching a specific portion of the results.
     *
     * @param {number} limit - Specifies the maximum count of records the SQL query should return.
     *                         This should ideally be the count of records one would like to display per page.
     *
     * @param {number} offset - Determines the number of retrieved records to skip before starting to return records.
     *                          This should typically be calculated as (pageNumber - 1) * limit.
     *
     * @returns {string} Returns a string representing the LIMIT and OFFSET clause in a SQL query, structured as 'LIMIT {limit} OFFSET {offset}'.
     *
     * @remarks
     * This function is crucial when handling large datasets - ensuring that the entire dataset does not need to be loaded into memory at once.
     * It can significantly improve the performance of your application by retrieving only a portion of the records at a time.
     *
     * @example
     * Example usage when creating a paged query:
     *
     * const recordsPerPage = 20;  // Number of records per page
     * const currentPage = 3;  // Current page number
     * const offset = (currentPage - 1) * recordsPerPage;  // Number of records to skip
     *
     * const limitOffsetClause = LimitOffset(recordsPerPage, offset);
     * console.log(limitOffsetClause);  // Outputs: "LIMIT 20 OFFSET 40"
     *
     */
    const LimitOffset: (limit: number, offset: number) => string;
    /**
     * `PaginatorLimitOffset` is a utility function that generates a SQL LIMIT and OFFSET clause from the supplied paginator response object.
     * This function is pivotal for implementing pagination in SQL databases as it controls the quantity of records returned
     * by a SQL query and determines the initial point in the dataset.
     *
     * @param {IPaginatorResponse} paginatorResponse - An object encapsulating details of the pagination.
     * `page` The actual page returned, which may be different from the page requested if fewer pages exist than the page that was requested.
     * `pageCount`, The total number of pages there would be based on the count of rows found.
     * `rowCount`, The total number of rows found.
     * `countPerPage`, How many rows make up a page.
     * `currentOffset`, More used by the database, but this would be the offset (e.g. 51 on the second page of a set that had CountPerPage = 50 and RowCount > 50).
     * Lastly, it includes `rows`, an array that holds the actual data belonging to the current page.
     *
     * @returns {string} - Yields a string with the assembled LIMIT and OFFSET clause ready to be used in SQL queries.
     * The standard format is `'LIMIT ' + limit + ' OFFSET ' + offset`.
     *
     * @remarks
     * Pagination is of utmost importance when dealing with voluminous datasets. It assists in efficiently managing memory by loading
     * only specified partitions of data. It bolsters performance and user experience by displaying a finite set of records at a given instance.
     *
     * @example
     * // Suppose the paginatorResponse object is as follows:
     * const paginatorResponse: IPaginatorResponse = {
     *    page: 3,
     *    pageCount: 20,
     *    rowCount: 500,
     *    countPerPage: 25,
     *    currentOffset: 50,
     *    rows: [ ... ] // An array of actual data
     * };
     *
     * // Invoking the function with the paginatorResponse would look like this:
     * const limitOffsetClause = PaginatorLimitOffset(paginatorResponse);
     *
     * // The function will return the corresponding SQL LIMIT and OFFSET clause:
     * console.log(limitOffsetClause); // Outputs: "LIMIT 25 OFFSET 50"
     */
    const PaginatorLimitOffset: (paginatorResponse: IPaginatorResponse) => string;
    /**
     * The `CalcOffsetFromPage` function calculates the offset (the starting point) from the first record on a specific page.
     * Each page starts with an offset and ends with an offset plus the page size.
     *
     * @param {number} page - The current page number, with the first page being 1.
     * @param {number} pageSize - Specifies the number of records that each page can contain.
     * @param {number} totalRecords - Total number of records across all pages, effectively marking the length of the book.
     * @returns {number} Returns the offset from the first record on the specific page, giving us the starting point to read from on our current page.
     *
     * @remarks - You would use this function timing to calculate the starting point in a paginated dataset. For example, it can set the OFFSET value in a SQL query.
     *
     * @example
     *  // If you are on the third page, and there are 10 records on each page, and total number of records is 1000.
     *  const offset = CalcOffsetFromPage(3, 10, 1000);  // Returns: 20, indicating that the reading on page three starts at the 21st record.
     *
     *  // If the page number or page size is not valid (less than 1), it defaults to the first page.
     *  const offsetErr = CalcOffsetFromPage(0, -5, 1000); // Returns: 0, indicating that the reading starts at the beginning.
     *
     *  // If there are no records, the function also defaults to the first page.
     *  const offsetNone = CalcOffsetFromPage(5, 10, 0); // Returns: 0, there are no records, thus the count starts and stays at 0.
     */
    const CalcOffsetFromPage: (page: number, pageSize: number, totalRecords: number) => number;
    /**
     * The `CalcPageCount` function computes the total number of pages required to
     * display all records, given a number of records to be displayed per page and a total count of records.
     *
     * This function comes into play when dealing with paginated data structures where the data has to be partitioned into pages of a specific size.
     *
     * @param {number} pageSize - Specifies the number of records that each page is intended to hold.
     * @param {number} totalRecords - Denotes the overall quantity of records to be paginated.
     * @returns {number} - Gives us the necessary total number of pages that can carry all the records.
     *                     If total records is zero or less, returns 0 as there are no pages to display.
     *
     * @remarks - The function doesn't just divide totalRecords by pageSize due to how integer division works. Adding (pageSize - 1)
     *            to the numerator before division ensures that any leftover records that would have formed part of an additional page
     *            aren't lost. This function can be key in setting up navigation for paginated views or setting LIMITs in SQL queries.
     *
     * @example
     *  // If there are 100 records with 10 records per page, the function will return 10 pages.
     *  const pages = CalcPageCount(10, 100);  // Returns: 10
     *
     *  // If there are 102 records with 10 records per page, the function will return 11 pages (2 records on the last page).
     *  const pagesWithLeftover = CalcPageCount(10, 102); // Returns: 11
     *
     *  // If the total records is 0 or less, the function will return 0 pages.
     *  const noRecords = CalcPageCount(10, 0); // Returns: 0
     */
    const CalcPageCount: (pageSize: number, totalRecords: number) => number;
    /**
     * The `ResetIDs` function resets the ID sequences of all tables in the connected PostgreSQL database.
     * In database systems, an ID sequence generates unique incremental numbers for record identification,
     * the `ResetIDs` function ensures all sequences start from their initial value.
     *
     * This function comes in handy in scenarios where the database is being rebuilt, and there's a need to
     * reset all auto-increment fields to start afresh, or when the ID sequence is off track due to manual
     * insertion or deletion of records.
     *
     * @param {TConnection} connection - A PostgreSQL database connection object.
     * @returns {Promise<void>} - A Promise that signifies successful completion when the ID sequence has been
     * reset for all applicable tables in the PostgreSQL database.
     *
     * @remarks
     * - This function should only be used cautiously, especially in production environments, due to the
     * potential of ID conflicts in active databases.
     * - This function works only with tables having a column named 'id' as it is often used as primary key
     * in PostgreSQL databases.
     *
     * @example
     * //Reset IDs in all tables of the connected database
     * ResetIDs(dbConnection).then(() => {
     *    console.log('ID sequences for all tables have been reset');
     * }).catch((error) => {
     *    console.log('An error occurred: ', error);
     * });
     */
    const ResetIDs: (connection: TConnection) => Promise<void>;
    /**
     * `GetTypes()` is a function that retrieves a list of PostgreSQL enum types from the provided database connection.
     *
     * @param {TConnection} connection - This parameter is a PostgreSQL database connection object.
     *
     * @returns {Promise<PGEnum[]>} - After successful execution of the function,
     * a Promise is returned which resolves to an array of PGEnum objects.
     * Each PGEnum object represents a unique enumerated type in the PostgreSQL database,
     * containing information such as its name and corresponding values.
     *
     * @remarks
     * - Use this function only when you need to retrieve PostgreSQL enumerated types. Unnecessary calls can increase load on your database.
     *
     * @example
     * // get enum types
     * GetTypes(dbConnection)
     *    .then(enums => {
     *        console.log('The retrieved PostgreSQL enum types are: ', enums);
     *    })
     *    .catch(err => {
     *        console.error('An error occurred when retrieving PostgreSQL enum types: ', err);
     *    });
     *
     */
    const GetTypes: (connection: TConnection) => Promise<PGEnum[]>;
    /**
     * The `TableComments` function fetches any comments associated with a specified table in a PostgreSQL database.
     *
     * @param {TConnection} connection - The parameter represents a PostgreSQL database connection.
     * @param {string}  table - This parameter takes in the name of the table as a string from which comments are to be retrieved.
     * @param {string}  schema - This optional parameter takes the name of the schema that the table belongs to. If your database
     *        uses schemas to organize tables, you should provide this parameter. If not provided it assumes the default schema.
     *
     * @returns {Promise<string | null>} - After successful execution, the function returns a Promise
     *        that resolves to a string containing the comment associated with the table or null, if there is no such comment available.
     *
     * @remarks
     * - The returned Promise should be handled to catch and deal with any potential errors.
     *
     * @example
     * // get comments of the specified table
     * TableComments(dbConnection, 'myTable', 'mySchema')
     *    .then(comment => {
     *       console.log('The retrieved table comment is: ', comment);
     *    })
     *    .catch(err => {
     *       console.error('An error occurred when retrieving table comment: ', err);
     *    });
     */
    const TableComments: (connection: TConnection, table: string, schema?: string) => Promise<string | null>;
    /**
     * `TableColumnComments` fetches the comments associated with each column of a specified table in a PostgreSQL database.
     *
     * @param {TConnection} connection - PostgreSQL database connection object.
     * @param {string} table - Name of the table for which column comments are to be retrieved.
     * @param {string} [schema] - Name of the schema, optional. If not specified, defaults to the current schema.
     *
     * @returns {Promise<Array<{ column_name: string, column_comment: string | null }>>} -
     *          Returns a promise that, when resolves, contains an array of objects where
     *          each object represents a column and its corresponding comment.
     *
     * @remarks
     * - Ensure the database connection is valid and connected before invoking.
     * - Verify that the table and the schema (if given) exist in the database.
     *
     * @example
     *  TableColumnComments(dbConnection, 'users', 'mySchema')
     *    .then(columnComments => {
     *        console.log(columnComments)
     *    })
     *    .catch(err => {
     *        console.error(err)
     *    });
     *
     */
    const TableColumnComments: (connection: TConnection, table: string, schema?: string) => Promise<{
        column_name: string;
        column_comment: string | null;
    }[]>;
    /**
     * `GetPGTable` function asynchronously retrieves a detailed metadata of a PostgreSQL table.
     * This metadata includes table comments, column data with comments, foreign keys, indexes etc.
     *
     * @param {TConnection} connection - An established connection to a PostgreSQL database.
     * @param {string} table - Name of the PostgreSQL table.
     * @param {string} [schema] - Optional name of the schema. Defaults to current schema if not provided.
     *
     * @returns {Promise<PGTable>} - A Promise that upon resolution gives a PGTable object, representing table metadata.
     *
     * @remarks
     * - Ensure `connection` is valid and connected to the database.
     * - Verify existence of `table` and `schema` (if provided) in the database before invoking.
     * - Catch and handle any errors that might occur during asynchronous execution.
     *
     * @example
     * GetPGTable(dbConnection, 'users')
     *   .then(pgTableMetadata => {
     *       console.log(pgTableMetadata);
     *   })
     *   .catch(err => {
     *       console.error('Error occurred while fetching table metadata:', err);
     *   });
     *
     */
    const GetPGTable: (connection: TConnection, table: string, schema?: string) => Promise<PGTable>;
    /**
     * `CleanSQL` function sanitizes an SQL query by removing all semicolon (`;`) characters.
     * This can be useful to avoid SQL injection or execute complex queries containing multiple statements.
     *
     * @param {string} sql - Raw SQL string that needs to be sanitized.
     *
     * @returns {string} - The sanitized SQL string with all semicolons (`;`) removed.
     *
     * @remarks
     * - Consider the impact of removing semicolons on your SQL queries before using this function.
     *   This can potentially lead to unintended consequences if not used properly.
     *
     * @example
     *
     * const rawSQL = 'SELECT * FROM users; DROP TABLE users;'
     * const cleanSQL = CleanSQL(rawSQL);
     * console.log(cleanSQL); // Prints: 'SELECT * FROM users DROP TABLE users'
     *
     */
    const CleanSQL: (sql: string) => string;
}
/**
 * Checks if a given value is a valid PostgreSQL integer.
 * @param value - The value to check.
 * @param unsigned - Optional flag to check for an unsigned integer. Default is false (signed).
 * @returns true if the value is a valid PostgreSQL integer, false otherwise.
 */
export declare function IsValidPostgresInteger(value: any, unsigned?: boolean): boolean;
export {};
