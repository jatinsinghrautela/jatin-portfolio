import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const publishedContent=sqliteTable('published_content',{id:integer('id').primaryKey(),version:integer('version').notNull(),body:text('body').notNull(),updatedAt:integer('updated_at').notNull()});
export const contentRevisions=sqliteTable('content_revisions',{version:integer('version').primaryKey(),body:text('body').notNull(),createdAt:integer('created_at').notNull()});
export const ownerSessions=sqliteTable('owner_sessions',{tokenHash:text('token_hash').primaryKey(),expiresAt:integer('expires_at').notNull()});
export const requestLimits=sqliteTable('request_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull()});

export const ownerSettings=sqliteTable('owner_settings',{id:integer('id').primaryKey(),passwordHash:text('password_hash').notNull(),updatedAt:integer('updated_at').notNull()});
