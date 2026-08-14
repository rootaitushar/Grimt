export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      placement_admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      placement_applications: {
        Row: {
          applied_at: string
          id: string
          job_id: string
          status: string
          student_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          id?: string
          job_id: string
          status?: string
          student_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string
          id?: string
          job_id?: string
          status?: string
          student_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      placement_jobs: {
        Row: {
          application_deadline: string | null
          company_name: string
          created_at: string
          created_by: string
          description: string
          employment_type: string | null
          id: string
          is_published: boolean
          location: string | null
          salary_package: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          company_name: string
          created_at?: string
          created_by: string
          description: string
          employment_type?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          salary_package?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          company_name?: string
          created_at?: string
          created_by?: string
          description?: string
          employment_type?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          salary_package?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      placement_students: {
        Row: {
          address: string
          aadhaar_number: string | null
          average_percentage: number | null
          backlogs: number
          branch: string | null
          contact_number: string
          created_at: string
          email: string
          father_name: string
          father_phone: string | null
          id: string
          local_address: string | null
          mother_name: string | null
          mother_phone: string | null
          remarks: string | null
          result_status: string | null
          roll_number: string
          semester: string | null
          semester_1_status: string | null
          semester_1_marks: number | null
          semester_1_reappears: number
          semester_2_status: string | null
          semester_2_marks: number | null
          semester_2_reappears: number
          semester_3_status: string | null
          semester_3_marks: number | null
          semester_3_reappears: number
          semester_4_status: string | null
          semester_4_marks: number | null
          semester_4_reappears: number
          semester_5_status: string | null
          semester_5_marks: number | null
          semester_5_reappears: number
          semester_6_status: string | null
          semester_6_marks: number | null
          semester_6_reappears: number
          semester_7_status: string | null
          semester_7_marks: number | null
          semester_7_reappears: number
          student_name: string
          tenth_percentage: number | null
          total_reappears: number
          twelfth_percentage: number | null
          updated_at: string
          user_id: string | null
          wants_campus_placement: boolean
          placement_opt_out_reason: string | null
        }
        Insert: {
          address: string
          aadhaar_number: string
          average_percentage?: number | null
          backlogs?: number
          branch: string
          contact_number: string
          created_at?: string
          email: string
          father_name: string
          father_phone?: string | null
          id?: string
          local_address?: string | null
          mother_name?: string | null
          mother_phone?: string | null
          remarks?: string | null
          result_status?: string | null
          roll_number: string
          semester?: string | null
          semester_1_status?: string | null
          semester_1_marks?: number | null
          semester_1_reappears?: number
          semester_2_status?: string | null
          semester_2_marks?: number | null
          semester_2_reappears?: number
          semester_3_status?: string | null
          semester_3_marks?: number | null
          semester_3_reappears?: number
          semester_4_status?: string | null
          semester_4_marks?: number | null
          semester_4_reappears?: number
          semester_5_status?: string | null
          semester_5_marks?: number | null
          semester_5_reappears?: number
          semester_6_status?: string | null
          semester_6_marks?: number | null
          semester_6_reappears?: number
          semester_7_status?: string | null
          semester_7_marks?: number | null
          semester_7_reappears?: number
          student_name: string
          tenth_percentage?: number | null
          total_reappears?: number
          twelfth_percentage?: number | null
          updated_at?: string
          user_id?: string | null
          wants_campus_placement?: boolean
          placement_opt_out_reason?: string | null
        }
        Update: {
          address?: string
          aadhaar_number?: string | null
          average_percentage?: number | null
          backlogs?: number
          branch?: string
          contact_number?: string
          created_at?: string
          email?: string
          father_name?: string
          father_phone?: string | null
          id?: string
          local_address?: string | null
          mother_name?: string | null
          mother_phone?: string | null
          remarks?: string | null
          result_status?: string
          roll_number?: string
          semester?: string
          semester_1_status?: string | null
          semester_1_marks?: number | null
          semester_1_reappears?: number
          semester_2_status?: string | null
          semester_2_marks?: number | null
          semester_2_reappears?: number
          semester_3_status?: string | null
          semester_3_marks?: number | null
          semester_3_reappears?: number
          semester_4_status?: string | null
          semester_4_marks?: number | null
          semester_4_reappears?: number
          semester_5_status?: string | null
          semester_5_marks?: number | null
          semester_5_reappears?: number
          semester_6_status?: string | null
          semester_6_marks?: number | null
          semester_6_reappears?: number
          semester_7_status?: string | null
          semester_7_marks?: number | null
          semester_7_reappears?: number
          student_name?: string
          tenth_percentage?: number | null
          total_reappears?: number
          twelfth_percentage?: number | null
          updated_at?: string
          user_id?: string | null
          wants_campus_placement?: boolean
          placement_opt_out_reason?: string | null
        }
        Relationships: []
      }
      student_notifications: {
        Row: {
          created_at: string
          id: string
          job_id: string | null
          message: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id?: string | null
          message: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string | null
          message?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      link_student_profile: { Args: Record<PropertyKey, never>; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
