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
      attendees: {
        Row: {
          created_at: string
          id: number
          jamaat: string | null
          name: string | null
          region: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          jamaat?: string | null
          name?: string | null
          region?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          jamaat?: string | null
          name?: string | null
          region?: string | null
        }
        Relationships: []
      }
      meals: {
        Row: {
          attendee_id: number
          created_at: string
          date: string
          meal: string
        }
        Insert: {
          attendee_id: number
          created_at?: string
          date: string
          meal: string
        }
        Update: {
          attendee_id?: number
          created_at?: string
          date?: string
          meal?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "attendees"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
