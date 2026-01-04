/**
 * Supabase Database Types
 *
 * This file contains TypeScript types for the Supabase database.
 * These types should be generated using the Supabase CLI:
 *   pnpm supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 *
 * For now, we provide a placeholder structure that matches Supabase's expected format.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Database type definition
 *
 * This is a placeholder that should be replaced with generated types
 * from your actual Supabase project.
 */
export interface Database {
  public: {
    Tables: {
      /**
       * Subscriptions table
       * Stores Stripe subscription data for each organization
       */
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          stripe_price_id: string;
          stripe_product_id: string;
          status:
            | 'active'
            | 'trialing'
            | 'past_due'
            | 'canceled'
            | 'unpaid'
            | 'incomplete';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          trial_start: string | null;
          trial_end: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          stripe_price_id: string;
          stripe_product_id: string;
          status:
            | 'active'
            | 'trialing'
            | 'past_due'
            | 'canceled'
            | 'unpaid'
            | 'incomplete';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          stripe_price_id?: string;
          stripe_product_id?: string;
          status?:
            | 'active'
            | 'trialing'
            | 'past_due'
            | 'canceled'
            | 'unpaid'
            | 'incomplete';
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          metadata?: Json | null;
          updated_at?: string;
        };
      };

      /**
       * Invoices table
       * Stores invoice/payment history for subscriptions
       */
      invoices: {
        Row: {
          id: string;
          organization_id: string;
          subscription_id: string;
          stripe_invoice_id: string;
          amount_paid: number;
          currency: string;
          status: 'paid' | 'open' | 'void' | 'uncollectible' | 'deleted';
          invoice_pdf: string | null;
          hosted_invoice_url: string | null;
          due_date: string | null;
          paid_at: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          subscription_id: string;
          stripe_invoice_id: string;
          amount_paid: number;
          currency: string;
          status: 'paid' | 'open' | 'void' | 'uncollectible' | 'deleted';
          invoice_pdf?: string | null;
          hosted_invoice_url?: string | null;
          due_date?: string | null;
          paid_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          subscription_id?: string;
          stripe_invoice_id?: string;
          amount_paid?: number;
          currency?: string;
          status?: 'paid' | 'open' | 'void' | 'uncollectible' | 'deleted';
          invoice_pdf?: string | null;
          hosted_invoice_url?: string | null;
          due_date?: string | null;
          paid_at?: string | null;
          metadata?: Json | null;
        };
      };

      /**
       * Organizations table (extended)
       * Original organizations table with Stripe customer ID
       */
      organizations: {
        Row: {
          id: string;
          clerk_id: string;
          name: string;
          slug: string;
          image_url: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          name: string;
          slug: string;
          image_url?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      // Placeholder for view definitions
    };
    Functions: {
      // Placeholder for function definitions
    };
    Enums: {
      // Placeholder for enum definitions
    };
    CompositeTypes: {
      // Placeholder for composite type definitions
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          id: string;
          name: string;
          owner: string | null;
          created_at: string | null;
          updated_at: string | null;
          public: boolean | null;
        };
        Insert: {
          id?: string;
          name: string;
          owner?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          public?: boolean | null;
        };
        Update: {
          id?: string;
          name?: string;
          owner?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          public?: boolean | null;
        };
      };
      objects: {
        Row: {
          id: string;
          bucket_id: string | null;
          name: string | null;
          owner: string | null;
          created_at: string | null;
          updated_at: string | null;
          last_accessed_at: string | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          bucket_id?: string | null;
          name?: string | null;
          owner?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          last_accessed_at?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          bucket_id?: string | null;
          name?: string | null;
          owner?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          last_accessed_at?: string | null;
          metadata?: Json | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
