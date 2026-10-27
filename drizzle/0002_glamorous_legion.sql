CREATE TABLE `media_assets` (
	`key` text PRIMARY KEY NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`data` blob NOT NULL,
	`created_at` integer NOT NULL
);
