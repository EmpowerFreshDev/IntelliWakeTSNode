import { IPaginatorRequest, IPaginatorResponse, ISortColumn } from '@solidbasisventures/intelliwaketsfoundation';
import { PGTable } from './PGTable';
import { PGParams } from './PGParams';
import { PGEnum } from './PGEnum';
import { Client, Pool, PoolClient, QueryResultRow } from 'pg';
import type { QueryResult } from 'pg';
declare function transact<TResult>(fn: (client: PoolClient) => Promise<TResult>): Promise<TResult>;
declare function transact<TResult>(fn: (client: PoolClient) => Promise<TResult>, cb: (error: Error | null, result?: TResult) => void): void;
export type TConnection = Pool | PoolClient | Client | {
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
}>;
export declare namespace PGSQL {
    interface IOffsetAndCount {
        offset: number;
        countPerPage: number;
    }
    const SetDBMSAlert: (milliseconds?: number) => void;
    type TQueryResults<T extends QueryResultRow> = QueryResult<T>;
    const query: <T extends QueryResultRow>(connection: TConnection, sql: string, values?: any) => Promise<TQueryResults<T>>;
    const timeout: (ms: number) => Promise<unknown>;
    const TableRowCount: (connection: TConnection, table: string, schema?: string) => Promise<number>;
    const CurrentSchema: (schema?: string) => string;
    const TableExists: (connection: TConnection, table: string, schema?: string) => Promise<boolean>;
    const TableColumnExists: (connection: TConnection, table: string, column: string, schema?: string) => Promise<boolean>;
    const TriggerExists: (connection: TConnection, trigger: string, schema?: string) => Promise<boolean>;
    const TableResetIncrement: (connection: TConnection, table: string, column: string, toID?: number) => Promise<QueryResult<any>>;
    const ConstraintExists: (connection: TConnection, constraint: string, schema?: string) => Promise<boolean>;
    interface IConstraints {
        table_name: string;
        constraint_name: string;
    }
    const FKConstraints: (connection: TConnection, schema?: string) => Promise<IConstraints[]>;
    const Functions: (connection: TConnection, schema?: string) => Promise<string[]>;
    const IndexExists: (connection: TConnection, tablename: string, indexName: string, schema?: string) => Promise<boolean>;
    const GetByID: <T extends QueryResultRow>(connection: TConnection, table: string, id: number | null) => Promise<T | null>;
    /**
     * Returns a number from the sql who's only column returned is "count"
     *
     * @param connection
     * @param sql
     * @param values
     * @constructor
     */
    const GetCountSQL: (connection: TConnection, sql: string, values?: any) => Promise<number>;
    const FetchOne: <T extends QueryResultRow>(connection: TConnection, sql: string, values?: any) => Promise<T | null>;
    const FetchOneValue: <T>(connection: TConnection, sql: string, values?: any) => Promise<T | null>;
    const FetchMany: <T extends QueryResultRow>(connection: TConnection, sql: string, values?: any) => Promise<T[]>;
    const FetchArray: <T>(connection: TConnection, sql: string, values?: any) => Promise<T[]>;
    /**
     * Pass a SQL command with a "SELECT 1 FROM..." and it will check if it exists
     *
     * @param connection
     * @param sql
     * @param values
     * @constructor
     */
    const FetchExists: (connection: TConnection, sql: string, values?: any) => Promise<boolean>;
    const InsertAndGetReturning: (connection: TConnection, table: string, values: any) => Promise<any | null>;
    const InsertAndGetID: (connection: TConnection, table: string, values: any) => Promise<number>;
    const InsertBulk: (connection: TConnection, table: string, values: any) => Promise<void>;
    const UpdateAndGetReturning: (connection: TConnection, table: string, whereValues: any, updateValues: any) => Promise<any | null>;
    const BuildWhereComponents: (whereValues: any, params: PGParams) => string;
    const BuildSetComponents: (setValues: any, params: PGParams) => string;
    const Save: (connection: TConnection, table: string, values: any) => Promise<any | null>;
    const Delete: (connection: TConnection, table: string, whereValues: any) => Promise<void>;
    const ExecuteRaw: (connection: TConnection, sql: string) => Promise<QueryResult<any>>;
    const Execute: (connection: TConnection, sql: string, values?: any) => Promise<QueryResult<any>>;
    const TruncateAllTables: (connection: TConnection, exceptions?: string[], includeCascade?: boolean) => Promise<boolean>;
    const TruncateTables: (connection: TConnection, tables: string[], includeCascade?: boolean) => Promise<void>;
    const TablesArray: (connection: TConnection, schema?: string) => Promise<string[]>;
    const ViewsArray: (connection: TConnection, schema?: string) => Promise<string[]>;
    const ViewsMatArray: (connection: TConnection, schema?: string) => Promise<string[]>;
    const TypesArray: (connection: TConnection) => Promise<string[]>;
    const FunctionsArray: (connection: TConnection, schema?: string) => Promise<string[]>;
    const FunctionsOIDArray: (connection: TConnection, schema?: string) => Promise<any[]>;
    const ExtensionsArray: (connection: TConnection) => Promise<string[]>;
    const TableData: (connection: TConnection, table: string, schema?: string) => Promise<any>;
    const TableColumnsData: (connection: TConnection, table: string, schema?: string) => Promise<any[]>;
    const TableFKsData: (connection: TConnection, table: string, schema?: string) => Promise<any[]>;
    const TableIndexesData: (connection: TConnection, table: string, schema?: string) => Promise<any[]>;
    const ViewData: (connection: TConnection, view: string) => Promise<string | null>;
    const ViewsMatData: (connection: TConnection, viewMat: string) => Promise<any>;
    const FunctionData: (connection: TConnection, func: string) => Promise<any>;
    const TypeData: (connection: TConnection, type: string) => Promise<string[]>;
    const SortColumnSort: <T = Record<string, any>>(sortColumn: ISortColumn<T>) => string;
    const PaginatorOrderBy: (paginatorRequest: IPaginatorRequest) => string;
    const LimitOffset: (limit: number, offset: number) => string;
    const PaginatorLimitOffset: (paginatorResponse: IPaginatorResponse) => string;
    const CalcOffsetFromPage: (page: number, pageSize: number, totalRecords: number) => number;
    const CalcPageCount: (pageSize: number, totalRecords: number) => number;
    const ResetIDs: (connection: TConnection) => Promise<void>;
    const GetTypes: (connection: TConnection) => Promise<PGEnum[]>;
    const TableColumnComments: (connection: TConnection, table: string, schema?: string) => Promise<{
        column_name: string;
        column_comment: string | null;
    }[]>;
    const GetPGTable: (connection: TConnection, table: string, schema?: string) => Promise<PGTable>;
    const CleanSQL: (sql: string) => string;
}
export {};
