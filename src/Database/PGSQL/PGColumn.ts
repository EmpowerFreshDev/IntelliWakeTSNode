import {PGEnum} from './PGEnum'
import {IsOn, ToArray} from '@empowerfresh/intelliwake'

export interface IPGColumn {
	column_name: string
	ordinal_position: number
	column_default: string | number | boolean | null | undefined
	is_nullable: 'YES' | 'NO'
	udt_name: string | PGEnum
	character_maximum_length: number | null
	character_octet_length: number | null
	/** Total number of digits */
	numeric_precision: number | null
	/** Number of digits after the decimal point */
	numeric_scale: number | null
	datetime_precision: number | null
	is_identity: 'YES' | 'NO'
	is_self_referencing: 'YES' | 'NO'
	identity_generation: 'BY DEFAULT' | null
	array_dimensions: (number | null)[]
	check: string | null
	checkStringValues: string[]
	generatedAlwaysAs: string | null
	/** Comment on column, except for within {}'s
	 * {} can contain comma separated values
	 * {enum: EDeclaration: default_value} or {enum: EDeclaration.default_value} or {enum: EDeclaration}
	 * {interface: IDeclaration} or {interface: IDeclaration.initialDeclaration} */
	column_comment: string
	isAutoIncrement: boolean
}

export class PGColumn implements IPGColumn {
	public column_name = ''
	public ordinal_position = 0
	public column_default: string | number | boolean | null | undefined = null
	public is_nullable: 'YES' | 'NO' = 'YES'
	public udt_name: string | PGEnum = ''
	public character_maximum_length: number | null = null
	public character_octet_length: number | null = null
	/** Total number of digits */
	public numeric_precision: number | null = null
	/** Number of digits after the decimal point */
	public numeric_scale: number | null = null
	public datetime_precision: number | null = null
	public is_identity: 'YES' | 'NO' = 'NO'
	public is_self_referencing: 'YES' | 'NO' = 'NO'
	public identity_generation: 'BY DEFAULT' | null = null
	public array_dimensions: (number | null)[] = []
	public check: string | null = null
	public checkStringValues: string[] = []
	public generatedAlwaysAs: string | null = null

	/** Comment on column, except for within {}'s
	 * {} can contain comma separated values
	 * {enum: EDeclaration: default_value} or {enum: EDeclaration.default_value} or {enum: EDeclaration}
	 * {interface: IDeclaration} or {interface: IDeclaration.initialDeclaration} */
	public column_comment: string = ''
	public isAutoIncrement = true

	static readonly TYPE_BOOLEAN = 'bool' // Changed from boolean
	static readonly TYPE_NUMERIC = 'numeric'
	static readonly TYPE_FLOAT8 = 'float8'
	static readonly TYPE_POINT = 'point'

	static readonly TYPE_SMALLINT = 'smallint'
	static readonly TYPE_INTEGER = 'integer'
	static readonly TYPE_BIGINT = 'bigint'

	static readonly TYPE_VARCHAR = 'varchar'
	static readonly TYPE_TEXT = 'text'

	static readonly TYPE_JSON = 'json'
	static readonly TYPE_JSONB = 'jsonb'

	static readonly TYPE_DATE = 'date'
	static readonly TYPE_TIME = 'time'
	static readonly TYPE_TIMETZ = 'timetz'
	static readonly TYPE_TIMESTAMP = 'timestamp'
	static readonly TYPE_TIMESTAMPTZ = 'timestamptz'

	static readonly TYPE_BYTEA = 'bytea'

	static readonly TYPE_UUID = 'uuid'

	static readonly TYPES_ALL = [
		PGColumn.TYPE_BOOLEAN,
		PGColumn.TYPE_NUMERIC,
		PGColumn.TYPE_FLOAT8,
		PGColumn.TYPE_POINT,
		PGColumn.TYPE_SMALLINT,
		PGColumn.TYPE_INTEGER,
		PGColumn.TYPE_BIGINT,
		PGColumn.TYPE_VARCHAR,
		PGColumn.TYPE_TEXT,
		PGColumn.TYPE_JSON,
		PGColumn.TYPE_JSONB,
		PGColumn.TYPE_BYTEA,
		PGColumn.TYPE_DATE,
		PGColumn.TYPE_TIME,
		PGColumn.TYPE_TIMETZ,
		PGColumn.TYPE_TIMESTAMP,
		PGColumn.TYPE_TIMESTAMPTZ,
		PGColumn.TYPE_UUID
	]

	public jsType = (): string => {
		if (typeof this.udt_name !== 'string') {
			return (this.udt_name as any).enumName
		} else if (this.jsonType()) {
			return 'any'
		} else if (this.booleanType()) {
			return 'boolean'
		} else if (this.integerFloatType()) {
			return 'number'
		} else if (this.udt_name === PGColumn.TYPE_BYTEA) {
			return 'ArrayBuffer'
		} else if (this.udt_name === PGColumn.TYPE_POINT) {
			return '[number, number]'
		} else if (this.udt_name.startsWith('e_')) {
			return PGEnum.TypeName(this.udt_name)
		} else {
			return 'string' // Date or String or Enum
		}
	}

	public isArray = (): boolean => {
		if (!!ToArray(this.array_dimensions)[0] ||
			!!this.array_dimensions.length ||
			((this.column_default ?? '')?.toString()?.includes('{}') && !this.jsonType()) ||
			(this.column_default ?? '')?.toString()?.includes('[]'))
			return true

		if (!this.jsonType()) return false

		const regex = /\{.*\[.*\].*\}/
		return regex.test(this.column_comment ?? '')
	}

	public isNullable = (): boolean => IsOn(this.is_nullable)

	public enumType = (): boolean => {
		return typeof this.udt_name !== 'string'
	}

	public integerType = (): boolean => {
		return (typeof this.udt_name === 'string') && (this.udt_name.toLowerCase().startsWith('int') || [PGColumn.TYPE_SMALLINT, PGColumn.TYPE_INTEGER, PGColumn.TYPE_BIGINT].includes(this.udt_name.toLowerCase()))
	}

	public floatType = (): boolean => {
		return (typeof this.udt_name === 'string') && [PGColumn.TYPE_NUMERIC, PGColumn.TYPE_FLOAT8].includes(this.udt_name.toLowerCase())
	}

	public integerFloatType = (): boolean => {
		return this.integerType() || this.floatType()
	}

	public booleanType = (): boolean => {
		return (typeof this.udt_name === 'string') && [PGColumn.TYPE_BOOLEAN].includes(this.udt_name.toLowerCase())
	}

	public jsonType = (): boolean => {
		return (typeof this.udt_name === 'string') && [PGColumn.TYPE_JSON, PGColumn.TYPE_JSONB].includes(this.udt_name.toLowerCase())
	}

	public generalStringType = (): boolean => {
		return (typeof this.udt_name !== 'string') || [PGColumn.TYPE_VARCHAR].includes(this.udt_name.toLowerCase())
	}

	public dateType = (): boolean => {
		return (typeof this.udt_name === 'string') && [
			PGColumn.TYPE_DATE,
			PGColumn.TYPE_TIME,
			PGColumn.TYPE_TIMETZ,
			PGColumn.TYPE_TIMESTAMP,
			PGColumn.TYPE_TIMESTAMPTZ
		].includes(this.udt_name.toLowerCase())
	}

	public dateOnlyType = (): boolean => {
		return (typeof this.udt_name === 'string') && [
			PGColumn.TYPE_DATE
		].includes(this.udt_name.toLowerCase())
	}

	public timeOnlyType = (): boolean => {
		return (typeof this.udt_name === 'string') && [
			PGColumn.TYPE_TIME,
			PGColumn.TYPE_TIMETZ
		].includes(this.udt_name.toLowerCase())
	}

	public dateTimeOnlyType = (): boolean => {
		return (typeof this.udt_name === 'string') && [
			PGColumn.TYPE_TIMESTAMP,
			PGColumn.TYPE_TIMESTAMPTZ
		].includes(this.udt_name.toLowerCase())
	}

	public blobType = (): boolean => {
		return (typeof this.udt_name === 'string') && [PGColumn.TYPE_TEXT].includes(this.udt_name.toLowerCase())
	}

	public otherType = (): boolean => {
		return (
			!this.integerFloatType && !this.booleanType && !this.dateType() && !this.generalStringType() && !this.blobType()
		)
	}

	constructor(instanceData?: Partial<IPGColumn>) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: Partial<IPGColumn>) {
		const keys = Object.keys(this)

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key) && typeof (instanceData as any) !== 'function') {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}

	public clean() {
		//		if (this.dateType()) {
		//			if (IsEmpty(this.DATETIME_PRECISION) || this.DATETIME_PRECISION < 3 || this.DATETIME_PRECISION > 6) {
		//				this.DATETIME_PRECISION = 6;
		//			}
		//		}
	}

	public ddlDefinition(): string {
		let ddl = '"' + this.column_name + '" '

		ddl += (typeof this.udt_name === 'string') ? this.udt_name : this.udt_name.columnName

		if (this.array_dimensions.length > 0) {
			ddl += `[${this.array_dimensions
			               .map((array_dimension) => (!!array_dimension ? array_dimension.toString() : ''))
			               .join('],[')}] `
		} else {
			if (this.udt_name !== PGColumn.TYPE_POINT) {
				if (this.floatType() && this.udt_name !== PGColumn.TYPE_FLOAT8) {
					ddl += '(' + this.numeric_precision + ',' + (this.numeric_scale ?? 0) + ') '
				} else if (this.dateType()) {
					if (!!this.datetime_precision) {
						ddl += '(' + this.datetime_precision + ') '
					} else {
						ddl += ' '
					}
				} else if (this.generalStringType()) {
					if (!this.blobType() && (typeof this.udt_name === 'string')) {
						ddl += '(' + (this.character_maximum_length ?? 255) + ') '
					} else {
						ddl += ' '
					}
				} else {
					ddl += ' '
				}
			} else {
				ddl += ' '
			}
		}

		if (!IsOn(this.is_nullable)) {
			ddl += 'NOT NULL '
		}
		if (!!this.generatedAlwaysAs) {
			ddl += `GENERATED ALWAYS AS (${PGColumn.CleanComment(this.generatedAlwaysAs)}) STORED `
		} else {
			if (typeof this.column_default === 'string' && this.column_default.toLowerCase().includes('null')) {
				this.column_default = null
			}

			if ((this.column_default !== undefined && this.column_default !== null) || this.is_identity || this.isAutoIncrement) {
				if (!(this.dateType() && (!this.column_default || (this.column_default ?? '').toString().toUpperCase().includes('NULL')))) {
					if (this.isArray()) {
						if (IsOn(this.is_nullable)) {
							ddl += `DEFAULT ${this.column_default ?? 'NULL'} `
						} else {
							ddl += `DEFAULT ${this.column_default ?? ((typeof this.udt_name === 'string') ? '\'{}\'' : this.udt_name.defaultValue ?? '\'{}')} `
						}
					} else {
						if (!this.blobType()) {
							if (IsOn(this.is_identity)) {
								if (this.isAutoIncrement) {
									if (!!this.identity_generation) {
										ddl += `GENERATED ${this.identity_generation} AS IDENTITY `
									} else {
										ddl += `GENERATED BY DEFAULT AS IDENTITY `
									}
								}
							} else if (this.booleanType()) {
								if (IsOn(this.is_nullable) || this.column_default === null) {
									ddl += `DEFAULT NULL `
								} else {
									ddl += `DEFAULT ${IsOn(this.column_default) ? 'true' : 'false'} `
								}
							} else if (!this.column_default && (typeof this.udt_name !== 'string') && !!this.udt_name.defaultValue) {
								ddl += `DEFAULT '${this.udt_name.defaultValue}' `
							} else {
								if (!!this.column_default) {
									if (this.integerFloatType() || this.dateType() || (this.column_default ?? '').toString().includes('::') || (this.column_default ?? '').toString().includes('()')) {
										ddl += `DEFAULT ${this.column_default} `
									} else {
										ddl += `DEFAULT '${this.column_default}' `
									}
								} else if (IsOn(this.is_nullable)) {
									ddl += `DEFAULT NULL `
								} else {
									if (this.integerFloatType()) {
										ddl += `DEFAULT 0 `
									} else if (this.dateType()) {
										ddl += `DEFAULT now() `
										// if (!!this.datetime_precision) {
										// 	ddl += `(${this.datetime_precision} `;
										// } else {
										// 	ddl += ` `;
										// }
									} else {
										ddl += `DEFAULT '' `
									}
								}
							}
						}
					}
				}
			}

			if (!!this.check) {
				ddl += `CHECK (${this.check}) `
			} else if (this.checkStringValues.length > 0) {
				ddl += `CHECK (${IsOn(this.is_nullable) ? this.column_name + ' IS NULL OR ' : ''}${this.column_name} IN ('${this.checkStringValues.join('\', \'')}')) `
			}
		}

		return ddl.trim()
	}

	public static CleanComment(comment: string): string {
		if (!comment) {
			return comment
		}

		return comment.replace(/[\n\r]/g, ' ')
	}
}
