
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            analyses: {
                Row: {
                    id: string
                    created_at: string
                    domain: string
                    score: number
                    report_data: Json
                    user_id: string | null
                    meta_hash: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    domain: string
                    score: number
                    report_data: Json
                    user_id?: string | null
                    meta_hash?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    domain?: string
                    score?: number
                    report_data?: Json
                    user_id?: string | null
                    meta_hash?: string | null
                }
            }
            user_profiles: {
                Row: {
                    id: string
                    created_at: string
                    credits: number
                    tier: 'free' | 'pro' | 'agency'
                    last_audit_at: string | null
                }
                Insert: {
                    id: string
                    created_at?: string
                    credits?: number
                    tier?: 'free' | 'pro' | 'agency'
                    last_audit_at?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    credits?: number
                    tier?: 'free' | 'pro' | 'agency'
                    last_audit_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            decrement_credits: {
                Args: {
                    user_id: string
                }
                Returns: void
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
