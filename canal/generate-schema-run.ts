import { getAuthTables } from "better-auth/db";
import { auth } from "./generate-schema.js";

async function run() {
  const tables = getAuthTables(auth.options);
  
  for (const [key, value] of Object.entries(tables)) {
    console.log(`CREATE TABLE IF NOT EXISTS "${value.modelName}" (`);
    const cols = [];
    for (const [fKey, fValue] of Object.entries(value.fields)) {
      let type = "TEXT";
      if (fValue.type === "boolean" || fValue.type === "number") type = "INTEGER";
      let col = `  "${fValue.fieldName || fKey}" ${type}`;
      if (!fValue.isOptional) col += " NOT NULL";
      if (fValue.isPrimaryKey) col += " PRIMARY KEY";
      if (fValue.isUnique) col += " UNIQUE";
      if (fValue.references) {
         col += ` REFERENCES "${fValue.references.model}"("${fValue.references.field}") ON DELETE CASCADE`;
      }
      cols.push(col);
    }
    console.log(cols.join(",\n"));
    console.log(");\n");
  }
}
run();
