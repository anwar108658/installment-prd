import { Service } from '@angular/core';
import {computed, signal } from '@angular/core';
import { account, tablesDB } from '../../appwrite/appwrite.client';
import { environment } from '../../../../environments/environment';

export type Role = 'admin' | 'employee';

export interface AppUser {
id: string;
email: string;
name: string;
role: Role;
profile?: Record<string, any>;
}

const CACHE_KEY = 'qist_user';
@Service()
export class AuthService {
private _user = signal<AppUser | null>(this.readCache());
readonly user = this._user.asReadonly();
readonly isLoggedIn = computed(() => !!this._user());
readonly isAdmin = computed(() => this._user()?.role === 'admin');

/** Call once at app start (APP_INITIALIZER) or from the guard. */
async init(): Promise<void> {
    try {
    await this.loadCurrentUser();
    } catch (e: any) {
    // 401 = no valid session -> logged out. Anything else (offline) -> keep cached user.
    if (e?.code === 401) this.clear();
    }
}

async login({email, password}:any): Promise<void> {
    try {
        await account.createEmailPasswordSession({email, password});
    } catch (e:any) {
        if (e?.type === 'user_session_already_exists') {
        try { await account.deleteSession({sessionId:'current'}); } catch {}
        await account.createEmailPasswordSession({email, password});
    } else {
        throw e;
    }
    }
    await this.loadCurrentUser();
}

async logout(): Promise<void> {
    try { await account.deleteSession({sessionId:'current'}); } catch {}
    this.clear();
}

private async loadCurrentUser(): Promise<void> {
    const acc = await account.get();
    const role: Role = acc.labels?.includes('admin') ? 'admin' : 'employee';

    // Assumes the profile row ID equals the Appwrite user ID.
    let profile: Record<string, any> | undefined;
    try {
    profile = await tablesDB.getRow({
        databaseId: environment.appwrite.databaseId,
        tableId: environment.appwrite.profilesTableId,
        rowId: acc.$id,
    });
    } catch {}

    const user: AppUser = { id: acc.$id, email: acc.email, name: acc.name, role, profile };
    this._user.set(user);
    localStorage.setItem(CACHE_KEY, JSON.stringify(user));
}

private clear() {
    this._user.set(null);
    localStorage.removeItem(CACHE_KEY);
}

private readCache(): AppUser | null {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); }
    catch { return null; }
}
}