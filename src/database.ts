import * as mongodb from 'mongodb';
import { Employee } from './employee';
import { employeeSchema } from './schema'; // Import schema

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {};

// Kết nối đến cơ sở dữ liệu
export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackProject");
    await applySchemaValidation(db);

    const employeesConnection = db.collection<Employee>('employees');
    collections.employees = employeesConnection;
}

// Áp dụng schema validation
async function applySchemaValidation(db: mongodb.Db) {
    await db.command({
        collMod: 'employees',
        validator: employeeSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("employees", { validator: employeeSchema });
        }
    });
}