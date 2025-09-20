function stringTable(table, name, length = 255){
	return table.string(name, length).collate('utf8_polish_ci');
}

function references(table, tableName, columnName, notNullable = true){
	const definition = table
		.integer(columnName)
		.unsigned()
		.references('id')
		.inTable(tableName)
		.onDelete('cascade');
		if(notNullable){
			definition.notNullable();
		}

		return definition;
}
module.exports = {
	stringTable,
	references
}