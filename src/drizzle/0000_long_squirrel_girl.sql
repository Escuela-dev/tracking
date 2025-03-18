CREATE TABLE `clients` (
	`client_id` text PRIMARY KEY NOT NULL,
	`toggl_tag` text NOT NULL,
	`total_hours_paid` real DEFAULT 0 NOT NULL,
	`last_paid_date` text NOT NULL
);
