import { PGColumn } from './PGColumn';
import { PGIndex } from './PGIndex';
import { PGForeignKey } from './PGForeignKey';
export interface ICTableRelativePaths {
    /** @Common/Tables */
    initials?: string;
    /** ../Database */
    tTables?: string;
    responseContext?: string;
    responseContextName?: string;
    responseContextClass?: string;
}
export interface IFixedWidthMapOptions {
    startColumnName?: string;
    startPosition: number;
    lastColumnName?: string;
    stopBeforeColumnName?: string;
}
export interface IFixedWidthMap<T> {
    column_name: keyof T;
    startPosition: number;
    positionWidth: number;
}
export declare const initialFixedWidthMapOptions: IFixedWidthMapOptions;
export declare class PGTable {
    name: string;
    description: string;
    check: string | string[] | null;
    inherits: string[];
    columns: PGColumn[];
    indexes: PGIndex[];
    foreignKeys: PGForeignKey[];
    constructor(instanceData?: Partial<PGTable>);
    protected deserialize(instanceData: Partial<PGTable>): void;
    indexOfColumn(columnName: string): number;
    indexesOfForeignKeyByColumn(columnName: string): number[];
    getForeignKeysByColumn(columnName: string): PGForeignKey[];
    removeForeignKeysByColumn(columnName: string): void;
    renameForeignKeysByColumn(fromName: string, toName: string, pgTables?: PGTable[]): void;
    removeIndexsByColumn(columnName: string): void;
    renameIndexsByColumn(fromName: string, toName: string): void;
    addForeignKey(pgForeignKey: PGForeignKey): void;
    getColumn(columnName: string): PGColumn | null;
    removeColumn(columnName: string): void;
    renameColumn(fromName: string, toName: string, pgTables?: PGTable[]): void;
    addColumn(pgColumn: Partial<PGColumn>): void;
    reOrderColumns(): void;
    addIndex(pgIndex: PGIndex): void;
    tableHeaderText(forTableText: string): string;
    tsText(): string;
    static TSTables(tables: string[]): string;
    tsTextTable(relativePaths?: ICTableRelativePaths): string;
    ddlPrimaryKey(): string | null;
    ddlCreateTableText(createForeignKeys: boolean, createIndexes: boolean, dropFirst?: boolean): string;
    ddlCreateIndexes(): string;
    ddlCreateForeignKeysText(): string;
    static CleanComment(comment: string, stripBrackets?: boolean): string;
    fixedWidthMap<T>(options?: Partial<IFixedWidthMapOptions>): IFixedWidthMap<T>[];
}
