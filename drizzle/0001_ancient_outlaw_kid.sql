CREATE TYPE "public"."payment_provider" AS ENUM('stripe', 'paystack', 'flutterwave', 'monnify');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('deposit', 'withdrawal');--> statement-breakpoint
ALTER TYPE "public"."wallet_transaction_type" ADD VALUE 'hold';--> statement-breakpoint
ALTER TYPE "public"."wallet_transaction_type" ADD VALUE 'top_up';--> statement-breakpoint
ALTER TYPE "public"."wallet_transaction_type" ADD VALUE 'release';--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount_cents" bigint NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"type" "payment_type" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"reference" text,
	"external_id" text,
	"metadata" text DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "available_balance_cents" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "frozen_balance_cents" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_payment_tx_user" ON "payment_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payment_tx_ref" ON "payment_transactions" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "idx_payment_tx_status" ON "payment_transactions" USING btree ("status");--> statement-breakpoint
ALTER TABLE "wallets" DROP COLUMN "balance_cents";