import { Client, Account, TablesDB, Query, ID } from 'appwrite';
import { environment } from '../../../environments/environment';

const client = new Client()
    .setEndpoint(environment.appwrite.endpoint)
    .setProject(environment.appwrite.projectId);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export { Query, ID };