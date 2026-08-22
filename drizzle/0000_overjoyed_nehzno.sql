CREATE TABLE `asset_interests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int,
	`asset_id` int NOT NULL,
	`client_name` varchar(128) NOT NULL,
	`client_email` varchar(320) NOT NULL,
	`client_phone` varchar(32) NOT NULL,
	`interest_type` varchar(64) NOT NULL DEFAULT 'Investimento Direto',
	`message` text,
	`status` varchar(64) NOT NULL DEFAULT 'Novo Contato',
	`responsible` varchar(128) DEFAULT 'José Constantino',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `asset_interests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `asset_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`owner_name` varchar(128) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`whatsapp` varchar(32),
	`email` varchar(320) NOT NULL,
	`asset_type` varchar(64) NOT NULL,
	`location` text NOT NULL,
	`area` varchar(64),
	`target_value` varchar(64),
	`description` text NOT NULL,
	`documentation_available` text,
	`photos` json,
	`observations` text,
	`status` varchar(64) NOT NULL DEFAULT 'Novo Envio',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `asset_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`title` text NOT NULL,
	`category` varchar(64) NOT NULL,
	`type` varchar(64) NOT NULL,
	`location` text NOT NULL,
	`municipality` varchar(128) NOT NULL,
	`state` varchar(2) NOT NULL,
	`area` varchar(64) NOT NULL,
	`value` varchar(64) NOT NULL,
	`numeric_value` int,
	`description` text NOT NULL,
	`characteristics` json,
	`images` json,
	`videos` json,
	`documents` json,
	`status` enum('CAPTADO','EM_PRE_ANALISE','DOCUMENTACAO_SOLICITADA','EM_DUE_DILIGENCE','APROVADO','PUBLICADO','EM_NEGOCIACAO','RESERVADO','VENDIDO','REPROVADO','ARQUIVADO','SUSPENSO') NOT NULL DEFAULT 'CAPTADO',
	`availability` varchar(64) DEFAULT 'Disponível',
	`purpose` varchar(64) NOT NULL,
	`investment_profile` varchar(128),
	`origin` varchar(64) DEFAULT 'Captação Direta',
	`responsible` varchar(128) DEFAULT 'José Constantino',
	`partner_id` int,
	`due_diligence_status` enum('Nao iniciada','Em andamento','Documentação pendente','Concluída','Com ressalvas','Não aprovado') NOT NULL DEFAULT 'Nao iniciada',
	`due_diligence_details` json,
	`is_publicly_visible` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `assets_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`whatsapp` varchar(32),
	`profile_type` varchar(64) NOT NULL,
	`purpose` varchar(64),
	`desired_location` text,
	`investment_range` varchar(64),
	`preferences` text,
	`origin` varchar(64) DEFAULT 'Site Público',
	`responsible` varchar(128) DEFAULT 'José Constantino',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`client_id` int NOT NULL,
	`category` varchar(64) NOT NULL,
	`location` text NOT NULL,
	`purpose` varchar(64) NOT NULL,
	`area_range` varchar(64),
	`investment_range` varchar(64),
	`observations` text,
	`status` varchar(64) NOT NULL DEFAULT 'Ativa',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `demands_id` PRIMARY KEY(`id`),
	CONSTRAINT `demands_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `partner_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`creci_or_cnpj` varchar(64) NOT NULL,
	`region` varchar(128) NOT NULL,
	`specialty` varchar(128) NOT NULL,
	`experience` text NOT NULL,
	`status` varchar(64) NOT NULL DEFAULT 'Em Análise',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin','partner') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
