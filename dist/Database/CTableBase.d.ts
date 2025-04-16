import { TObjectConstraint, TObjectFromFormDataOptions } from '@empowerfresh/intelliwake';
import { TConnection } from './PGSQL/PGSQL';
export type TLoadOptions<RECORD extends Record<string, any>> = {
    sortPrimary?: keyof RECORD;
    ascendingPrimary?: boolean;
    sortSecondary?: keyof RECORD;
    ascendingSecondary?: boolean;
    ignoreCustomerCheck?: boolean;
};
export declare abstract class CTableBase<RECORD extends Record<string, any>, TABLES extends string> {
    record: RECORD;
    readonly recordDefault: RECORD;
    recordBaseline: RECORD;
    updateID: (keyof RECORD) | (keyof RECORD)[];
    abstract readonly table: TABLES;
    protected nullIfFalsey: (keyof RECORD)[];
    protected arrayFormDataItems: (keyof RECORD)[];
    protected excludeColumnsSave: (keyof RECORD)[];
    protected excludeColumnsInsert: (keyof RECORD)[];
    protected excludeColumnsUpdate: (keyof RECORD)[];
    protected constraint: TObjectConstraint<RECORD> | null;
    connection: TConnection;
    readerConnection: TConnection | null | undefined;
    defaultImportColumns: (keyof RECORD)[] | null;
    defaultImportExcludeColumns: (keyof RECORD)[] | null;
    ignoreCustomerCheck: boolean;
    protected constructor(connection: TConnection, defaultValues: RECORD, options?: {
        constraint?: TObjectConstraint<RECORD> | null;
        nullIfFalsey?: (keyof RECORD)[];
        arrayFormDataItems?: (keyof RECORD)[];
        excludeColumnsSave?: (keyof RECORD)[];
        excludeColumnsInsert?: (keyof RECORD)[];
        excludeColumnsUpdate?: (keyof RECORD)[];
        ignoreCustomerCheck?: boolean;
        readerConnection?: TConnection | null;
    });
    /**
     * Applies the given constraint to the record, forcing it to conform to most database constraints
     *
     * @return {this} The current object, after applying the constraint to the record.
     */
    constrainRecord(): this;
    /**
     * Updates the record object with the provided values.
     *
     * @param {Partial<RECORD>} values - The partial values to update the record with.
     * @return {this} - Returns the instance of the object that called the method.
     */
    setFromAny(values: Partial<RECORD>): this;
    /**
     * Sets the values of the record object from the provided formData object.
     *
     * @param {FormData} formData - The FormData object containing the data to set on the record.
     * @param {TObjectFromFormDataOptions<RECORD>} [options] - Optional options for converting the data.
     * @returns {this} - Returns the current instance of the class.
     */
    setFromFormData(formData: FormData, options?: TObjectFromFormDataOptions<RECORD>): this;
    /**
     * Inserts a record into the database table.
     *
     * @returns {Promise<this>} A Promise that resolves to the current instance of the object.
     * @throws {Error} Throws an error if the object cannot be created for insertion.
     */
    insert(): Promise<this>;
    /**
     * Updates the record in the database.
     *
     * @returns {Promise<this>} - A Promise that resolves to this object after the update is complete.
     * @throws {Error} - Throws an error if the object to update could not be created.
     */
    update(): Promise<this>;
    /**
     * Checks if the record is saved.
     *
     * @returns {Promise<boolean>} A Promise that resolves to true if the record is saved, or false otherwise.
     */
    isSaved(): Promise<boolean>;
    /**
     * Saves the record with either an insert or update, as appropriate.
     *
     * @returns {Promise<this>} A promise that resolves to the current instance of the class after saving the record.
     * @throws {Error} If the record could not be saved.
     */
    save(): Promise<this>;
    /**
     * Deletes the record from the database table.
     *
     * @returns {Promise<this>} A Promise that resolves with the current instance after the deletion is successful.
     */
    delete(): Promise<this>;
    /**
     * Loads a record by ID and sets changes.
     *
     * @param {Partial<RECORD>} values - The values to set for the record.
     * @param ignoreCustomerCheck
     * @returns {Promise<this>} - A promise that resolves with the current instance of the record.
     */
    loadByIDAndSetChanges(values: Partial<RECORD>, ignoreCustomerCheck?: boolean): Promise<this>;
    /**
     * Loads a record by ID and sets it as the current record.  If invalid value, throws an error.
     *
     * @param {number | string | null | undefined} id - The ID of the record to load.
     *
     * @param ignoreCustomerCheck
     * @returns {Promise<this>} - A promise that resolves with the current instance of the method's class.
     *
     * @throws {Error} Throws an error if no ID is specified.
     * @throws {Error} Throws an error if the record is not found.
     */
    loadID(id: number | string | null | undefined, ignoreCustomerCheck?: boolean): Promise<this>;
    /**
     * Load an item by its ID.  If no id exists, returns null.
     *
     * @param {number | string | null | undefined} id - The ID of the item to load.
     * @param ignoreCustomerCheck
     * @returns {Promise<this | null>} A Promise that resolves to the loaded item if successful, otherwise null.
     */
    loadByID(id: number | string | null | undefined, ignoreCustomerCheck?: boolean): Promise<this | null>;
    /**
     * Reloads the current record by calling the loadByID method.
     *
     * @returns {Promise} A Promise that resolves after the record is reloaded.
     */
    reload(): Promise<void>;
    /**
     * Loads the values from the database based on the provided options.
     *
     * @param {Partial<RECORD>} values - The values used to filter the records.
     * @param {object} [options] - The options for sorting and filtering the records.
     * @param {keyof RECORD} [options.sortPrimary] - The primary field used for sorting the records.
     * @param {boolean} [options.ascendingPrimary=true] - Indicates whether to sort the records in ascending order based on the primary field. Defaults to true.
     * @param {keyof RECORD} [options.sortSecondary] - The secondary field used for sorting the records.
     * @param {boolean} [options.ascendingSecondary=true] - Indicates whether to sort the records in ascending order based on the secondary field. Defaults to true.
     * @param {boolean} [options.ignoreCustomerCheck=false] - Indicates whether to ignore customer check while fetching the records. Defaults to false.
     *
     * @returns {Promise<this>} - A Promise that resolves with the updated object.
     * @throws {Error} If the item could not be fetched from the database.
     */
    loadValues(values: Partial<RECORD>, options?: {
        sortPrimary?: keyof RECORD;
        ascendingPrimary?: boolean;
        sortSecondary?: keyof RECORD;
        ascendingSecondary?: boolean;
        ignoreCustomerCheck?: boolean;
    }): Promise<this>;
    /**
     * Loads records by their matching values.
     *
     * @param {Partial<RECORD>} values - The values to match against the records.
     * @param {TLoadOptions<RECORD>} [options] - The options for loading the records.
     * @returns {Promise<this | null>} A Promise that resolves to this object or `null` if an error occurs.
     */
    loadByValues(values: Partial<RECORD>, options?: TLoadOptions<RECORD>): Promise<this | null>;
    /**
     * Checks if the given values exist.
     *
     * @param {Partial<RECORD>} values - The values to check for existence.
     *
     * @param ignoreCustomerCheck
     * @return {Promise<boolean>} - A promise that resolves to a boolean value indicating if the values exist.
     */
    existsValues(values: Partial<RECORD>, ignoreCustomerCheck?: boolean): Promise<boolean>;
    /**
     * Loads the specified values into the object or initializes it if no values are provided.
     *
     * @param {Partial<RECORD>} values - The values to load into the object.
     * @param {Object} [options] - The options for sorting the primary and secondary keys.
     * @param {keyof RECORD} [options.sortPrimary] - The primary key to sort by.
     * @param {boolean} [options.ascendingPrimary] - Specifies whether the primary key should be sorted in ascending order.
     * @param {keyof RECORD} [options.sortSecondary] - The secondary key to sort by.
     * @param {boolean} [options.ascendingSecondary] - Specifies whether the secondary key should be sorted in ascending order.
     *
     * @return {Promise<this>} - The object after loading the values or initializing it.
     */
    loadValuesOrInitial(values: Partial<RECORD>, options?: {
        sortPrimary?: keyof RECORD;
        ascendingPrimary?: boolean;
        sortSecondary?: keyof RECORD;
        ascendingSecondary?: boolean;
        ignoreCustomerCheck?: boolean;
    }): Promise<this>;
    /**
     * Loads the ID or initializes the object.
     *
     * @param {number | string | null | undefined} id - The ID to load or null/undefined to initialize the object.
     * @param ignoreCustomerCheck
     * @return {Promise<this>} - A promise that resolves to the current object.
     */
    loadIDOrInitial(id: number | string | null | undefined, ignoreCustomerCheck?: boolean): Promise<this>;
    /**
     * Loads values or sets initial values for the record.
     *
     * @param {Partial<RECORD>} values - The values to be loaded or set.
     * @param {Object} [options] - Optional parameters for sorting the primary and secondary keys.
     * @param {keyof RECORD} [options.sortPrimary] - The primary key to sort the values by.
     * @param {boolean} [options.ascendingPrimary] - Indicates whether to sort the primary key in ascending order.
     * @param {keyof RECORD} [options.sortSecondary] - The secondary key to sort the values by.
     * @param {boolean} [options.ascendingSecondary] - Indicates whether to sort the secondary key in ascending order.
     * @returns {Promise<this>} - A Promise that resolves to the current object.
     */
    loadValuesOrInitialSet(values: Partial<RECORD>, options?: {
        sortPrimary?: keyof RECORD;
        ascendingPrimary?: boolean;
        sortSecondary?: keyof RECORD;
        ascendingSecondary?: boolean;
        ignoreCustomerCheck?: boolean;
    }): Promise<this>;
    /**
     * Retrieves a list of records based on the specified IDs.
     *
     * @param {number[] | null} ids - An array of record IDs to retrieve. If not provided or is empty, an empty array will be returned.
     * @returns {Promise<RECORD[]>} - A promise that resolves to an array of record objects.
     */
    listRecordsByIDs(ids?: number[] | null): Promise<RECORD[]>;
    /**
     * Returns a list of records based on the provided values and options.
     *
     * @param {Partial<RECORD>} whereValues - The values to filter the records by.
     * @param {Object} options - The options to customize the query.
     * @param {keyof RECORD} options.sortPrimary - The primary field to sort the records by.
     * @param {boolean} options.ascendingPrimary - Specifies whether to sort the records in ascending order by the primary field.
     * @param {keyof RECORD} options.sortSecondary - The secondary field to sort the records by.
     * @param {boolean} options.ascendingSecondary - Specifies whether to sort the records in ascending order by the secondary field.
     * @param {boolean} options.ignoreCustomerCheck - Specifies whether to ignore customer checks in the query.
     *
     * @returns {Promise<RECORD[]>} The list of records that match the provided values and options.
     */
    listRecordsByValues(whereValues?: Partial<RECORD>, options?: {
        sortPrimary?: keyof RECORD;
        ascendingPrimary?: boolean;
        sortSecondary?: keyof RECORD;
        ascendingSecondary?: boolean;
    }): Promise<RECORD[]>;
    /**
     * Lists the IDs of records based on the specified values, and sorts the results.
     *
     * @param {Partial<RECORD>} whereValues - Specifies the values to filter the records.
     * @param {keyof RECORD} sortPrimary - Specifies the primary field to sort the records by.
     * @param {boolean} ascendingPrimary - Indicates whether the primary field should be sorted in ascending order (true) or descending order (false). Default is true.
     * @param {keyof RECORD} sortSecondary - Specifies the secondary field to sort the records by.
     * @param {boolean} ascendingSecondary - Indicates whether the secondary field should be sorted in ascending order (true) or descending order (false). Default is true.
     * @return {Promise<number[]>} A promise that resolves with an array of IDs of the filtered and sorted records.
     */
    listIDsByValues(whereValues?: Partial<RECORD>, sortPrimary?: keyof RECORD, ascendingPrimary?: boolean, sortSecondary?: keyof RECORD, ascendingSecondary?: boolean): Promise<number[]>;
    /**
     * Retrieves a record from the database table based on the given values.
     *
     * @param {Partial<RECORD>} whereValues - An object containing the values used to filter the records.
     * @param {Object} options - An optional object specifying sorting options.
     * @param {keyof RECORD} options.sortPrimary - The primary sort column.
     * @param {boolean} options.ascendingPrimary - Specifies whether to sort the primary column in ascending order. Default is true.
     * @param {keyof RECORD} options.sortSecondary - The secondary sort column.
     * @param {boolean} options.ascendingSecondary - Specifies whether to sort the secondary column in ascending order. Default is true.
     *
     * @return {Promise<RECORD | null>} - A promise that resolves to the retrieved record or null if no record is found.
     */
    getRecordByValues(whereValues?: Partial<RECORD>, options?: {
        sortPrimary?: keyof RECORD;
        ascendingPrimary?: boolean;
        sortSecondary?: keyof RECORD;
        ascendingSecondary?: boolean;
    }): Promise<RECORD | null>;
    /**
     * Retrieves a record from the database by its ID.
     *
     * @param {number} id - The ID of the record to retrieve.
     * @return {Promise<RECORD>} A promise resolving to the retrieved record.
     * @throws {Error} If the record could not be found.
     */
    getRecordByID(id: number): Promise<RECORD>;
    /**
     * Supporting functions
     */
    /**
     * Performs pre-ID check.
     *
     * @returns {Promise<void>} A promise that resolves with no value.
     */
    preIDCheck(): Promise<void>;
    /**
     * This method is called before saving a record, either insert or update
     *
     * @returns {Promise<void>} - A promise that resolves when the pre-save operations are complete.
     */
    preSave(): Promise<void>;
    /**
     * Performs pre-insert operations before inserting data into the database.
     * This method is asynchronous.
     *
     * @returns {Promise<void>} A promise that resolves with no value when the pre-insert operations are completed.
     */
    preInsert(): Promise<void>;
    /**
     * This method is called before updating a record.
     * It can be overridden in child classes to perform custom logic or validation.
     *
     * @return {Promise<void>} - A promise that resolves when the pre-update process is complete.
     */
    preUpdate(): Promise<void>;
    /**
     * Performs actions before deletion.
     *
     * @return {Promise<void>} A promise that resolves when the pre-delete actions are completed or rejects with an error.
     */
    preDelete(): Promise<void>;
    /**
     * Performs actions after save (insert or update).
     *
     * @return {Promise<void>} A promise that resolves when the save operation is complete.
     */
    postSave(): Promise<void>;
    /**
     * Performs the operations after inserting a record.
     * Calls the 'postSave' method to handle the post-save operations.
     *
     * @return {Promise<void>} A promise that resolves after the post-insert operations are completed.
     */
    postInsert(): Promise<void>;
    /**
     * Updates the post by calling the postSave method asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the update is complete.
     */
    postUpdate(): Promise<void>;
    /**
     * Deletes a post.
     *
     * @returns {Promise<void>} A Promise that resolves when the post is deleted.
     */
    postDelete(): Promise<void>;
    /**
     * Executes the postSelect method.
     *
     * @returns {Promise} A promise that resolves once the postSelect method is executed.
     */
    postSelect(): Promise<void>;
    /**
     * Returns the object to be saved.
     *
     * @protected
     * @returns {any} - The object to be saved, or the original record if no modifications are required.
     */
    protected objectToSave(): any;
    /**
     * Returns the object to be inserted into the database.
     *
     * @protected
     * @returns {any} The object to be inserted.
     */
    protected objectToInsert(): any;
    /**
     * Returns the object to be updated by removing the excluded columns from the object to be saved.
     *
     * @protected
     * @returns {any} The updated object, or null if the object to be saved is null.
     */
    protected objectToUpdate(): any;
    /**
     * Sets the baseline for the current object.
     *
     * @protected
     * @returns {this} The current object with the baseline set.
     */
    protected setBaseline(): this;
    /**
     * Checks if the baseline has changed for the specified column(s) or all columns.
     *
     * @param {keyof RECORD | (keyof RECORD)[]} [forColumn] - The column(s) to check for changes.
     * If not provided, all columns will be checked.
     * @return {boolean} - Returns true if the baseline has changed for the specified column(s)
     * or all columns, false otherwise.
     */
    hasBaselineChanged(forColumn?: keyof RECORD | (keyof RECORD)[]): boolean;
    reportDiffs(comparedTo: any): any;
    /**
     * Sets whether or not to ignore customer check for this instance.
     *
     * @param {boolean} ignore - Indicates whether to ignore customer check or not.
     * @return {this} - Returns the current instance.
     */
    setIgnoreCustomerCheck(ignore?: boolean): this;
    /**
     * Ignores or resets the reader connection by setting it to undefined.
     *
     * @return {this} The instance of the class on which the method was called.
     */
    ignoreReaderConnection(): this;
    /**
     * Pipes a CSV stream into the database table.
     *
     * @param {Transform} pipeStream - The CSV stream to pipe into the database.
     * @param {IStreamInCSVOptions<RECORD>} [options] - Optional options for the CSV import.
     * @returns {void}
     */
    /**
     * Converts the data into a format suitable for saving.  Designed for encrypting data.
     *
     * @protected
     * @returns {Promise} A promise that resolves when the conversion is complete.
     */
    protected convertToSave(): Promise<void>;
    /**
     * Converts data after it has been loaded.  Designed for de-crypting data.
     *
     * @protected
     * @return {Promise<void>} A promise that resolves when the data has been converted.
     */
    protected convertAfterLoad(): Promise<void>;
}
