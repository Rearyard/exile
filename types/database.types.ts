export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      character: {
        Row: {
          created_at: string
          created_by: string | null
          fandom_id: number | null
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          fandom_id?: number | null
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          fandom_id?: number | null
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_fandom_id_fkey"
            columns: ["fandom_id"]
            isOneToOne: false
            referencedRelation: "fandom"
            referencedColumns: ["id"]
          },
        ]
      }
      chat: {
        Row: {
          content: Json
          created_at: string
          from_user_id: string | null
          id: number
          is_read: boolean
          seq_id: number
          to_user_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string
          from_user_id?: string | null
          id?: number
          is_read?: boolean
          seq_id: number
          to_user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          from_user_id?: string | null
          id?: number
          is_read?: boolean
          seq_id?: number
          to_user_id?: string | null
        }
        Relationships: []
      }
      fandom: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          is_nsfw: boolean
          is_official_managed: boolean
          is_rps: boolean
          is_user_original: boolean
          name: string
          tag_visibility: number
          updated_at: string
          visibility: number
          works_creation_level: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          is_nsfw?: boolean
          is_official_managed?: boolean
          is_rps?: boolean
          is_user_original?: boolean
          name: string
          tag_visibility?: number
          updated_at?: string
          visibility?: number
          works_creation_level?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          is_nsfw?: boolean
          is_official_managed?: boolean
          is_rps?: boolean
          is_user_original?: boolean
          name?: string
          tag_visibility?: number
          updated_at?: string
          visibility?: number
          works_creation_level?: number
        }
        Relationships: []
      }
      fandom_subscription: {
        Row: {
          created_at: string
          fandom_id: number
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          fandom_id?: number
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          fandom_id?: number
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fandom_subscription_fandom_id_fkey"
            columns: ["fandom_id"]
            isOneToOne: false
            referencedRelation: "fandom"
            referencedColumns: ["id"]
          },
        ]
      }
      follow: {
        Row: {
          created_at: string
          follower_id: string | null
          following_id: string | null
          id: number
        }
        Insert: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
          id?: number
        }
        Relationships: []
      }
      invitation_code: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          expires_at: string
          id: number
          updated_at: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: number
          updated_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: number
          updated_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      platform_kv: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      register_request: {
        Row: {
          additional_info: Json | null
          created_at: string
          email: string
          finished_at: string | null
          finished_by: string | null
          id: string
          question: Json
          request_ip: unknown
          request_user_agent: string
          status: Database["public"]["Enums"]["register_request_status"]
        }
        Insert: {
          additional_info?: Json | null
          created_at?: string
          email: string
          finished_at?: string | null
          finished_by?: string | null
          id?: string
          question: Json
          request_ip: unknown
          request_user_agent: string
          status?: Database["public"]["Enums"]["register_request_status"]
        }
        Update: {
          additional_info?: Json | null
          created_at?: string
          email?: string
          finished_at?: string | null
          finished_by?: string | null
          id?: string
          question?: Json
          request_ip?: unknown
          request_user_agent?: string
          status?: Database["public"]["Enums"]["register_request_status"]
        }
        Relationships: []
      }
      relation: {
        Row: {
          characters: number[]
          created_at: string
          created_by: string | null
          fandom_ids: number[]
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          characters: number[]
          created_at?: string
          created_by?: string | null
          fandom_ids: number[]
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          characters?: number[]
          created_at?: string
          created_by?: string | null
          fandom_ids?: number[]
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_basic: {
        Row: {
          avatar: string | null
          created_at: string
          id: number
          nickname: string
          signature: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id?: number
          nickname: string
          signature?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: number
          nickname?: string
          signature?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      register_request_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      register_request_status: ["pending", "approved", "rejected"],
    },
  },
} as const

