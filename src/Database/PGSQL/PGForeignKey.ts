import {PGTable} from './PGTable'
import {GreaterNumber} from '@empowerfresh/intelliwake'

export class PGForeignKey {
	public columnNames: string[] = []
	public primaryTable = ''
	public primaryColumns: string[] = []

	public onDelete = 'RESTRICT'
	public onUpdate = 'RESTRICT'

	constructor(instanceData?: Partial<PGForeignKey>) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: Partial<PGForeignKey>) {
		const keys = Object.keys(this)

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}

	public fkName(pgTable: PGTable) {
		return pgTable.name + '_' + this.columnNames.map(column => column.substring(GreaterNumber(column.length-25, 0))).join('_') + '_fkey'
	}

	public ddlConstraintDefinition(pgTable: PGTable): string {
		return `
		DO $$
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${this.fkName(pgTable)}') THEN
				ALTER TABLE "${pgTable.name}"
					ADD CONSTRAINT "${this.fkName(pgTable)}"
					FOREIGN KEY ("${this.columnNames.join('","')}") REFERENCES "${this.primaryTable}"("${this.primaryColumns.join(
			'","'
		)}") DEFERRABLE INITIALLY DEFERRED;
			END IF;
		END;
		$$;` // was INITIALLY IMMEDIATE
	}
}
