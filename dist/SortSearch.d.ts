import { IPaginatorRequest, IPaginatorResponse } from '@empowerfresh/intelliwake';
/**
 * Creates a paginated response from a request count.
 *
 * @param {IPaginatorRequest} paginatorRequest - The paginator request object.
 * @param {number} rowCount - The total number of rows in the result set.
 * @returns {PaginatorReturnRowCount} - The paginated response.
 */
export declare const PaginatorResponseFromRequestCount: <SORT = Record<string, any>, FILTER = Record<string, any>>(paginatorRequest: IPaginatorRequest<SORT, FILTER>, rowCount: number) => IPaginatorResponse<SORT>;
export declare const PaginatorInitializeResponseFromRequest: <SORT = Record<string, any>, FILTER = Record<string, any>, RES = Record<string, any>>(paginatorRequest: IPaginatorRequest<SORT, FILTER>) => IPaginatorResponse<RES>;
/**
 * Applies row count to a paginator response.
 *
 * @param {IPaginatorResponse<T>} paginatorResponse - The paginator response object.
 * @param {number} rowCount - The row count to be applied.
 * @template T - The type of the records in the paginator response.
 */
export declare const PaginatorApplyRowCount: <T = Record<string, any>>(paginatorResponse: IPaginatorResponse<T>, rowCount: number) => void;
/**
 * Updates the row count and calculates the page count and current offset
 * for a given paginator response.
 *
 * @param {IPaginatorResponse<T>} paginatorResponse - The paginator response object.
 * @param {number} rowCount - The total number of rows.
 * @returns {IPaginatorResponse<T>} - The updated paginator response object.
 */
export declare const PaginatorReturnRowCount: <T = Record<string, any>>(paginatorResponse: IPaginatorResponse<T>, rowCount: number) => IPaginatorResponse<T>;
