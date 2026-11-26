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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      actualizaciones_contrato: {
        Row: {
          contrato_id: string
          created_at: string
          fecha_aplicacion: string
          id: string
          indice_usado: Database["public"]["Enums"]["contrato_indice"]
          valor_anterior: number
          valor_nuevo: number
          variacion_pct: number
        }
        Insert: {
          contrato_id: string
          created_at?: string
          fecha_aplicacion: string
          id?: string
          indice_usado: Database["public"]["Enums"]["contrato_indice"]
          valor_anterior: number
          valor_nuevo: number
          variacion_pct: number
        }
        Update: {
          contrato_id?: string
          created_at?: string
          fecha_aplicacion?: string
          id?: string
          indice_usado?: Database["public"]["Enums"]["contrato_indice"]
          valor_anterior?: number
          valor_nuevo?: number
          variacion_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "actualizaciones_contrato_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      comprobantes: {
        Row: {
          cae: string | null
          cae_vencimiento: string | null
          created_at: string
          estado: Database["public"]["Enums"]["comprobante_estado"]
          id: string
          movimiento_id: string
          numero: number | null
          payload: Json | null
          punto_venta: number | null
          tipo_comprobante: Database["public"]["Enums"]["comprobante_tipo"]
          updated_at: string
        }
        Insert: {
          cae?: string | null
          cae_vencimiento?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["comprobante_estado"]
          id?: string
          movimiento_id: string
          numero?: number | null
          payload?: Json | null
          punto_venta?: number | null
          tipo_comprobante?: Database["public"]["Enums"]["comprobante_tipo"]
          updated_at?: string
        }
        Update: {
          cae?: string | null
          cae_vencimiento?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["comprobante_estado"]
          id?: string
          movimiento_id?: string
          numero?: number | null
          payload?: Json | null
          punto_venta?: number | null
          tipo_comprobante?: Database["public"]["Enums"]["comprobante_tipo"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comprobantes_movimiento_id_fkey"
            columns: ["movimiento_id"]
            isOneToOne: false
            referencedRelation: "movimientos"
            referencedColumns: ["id"]
          },
        ]
      }
      contrato_garantes: {
        Row: {
          contrato_id: string
          garante_id: string
        }
        Insert: {
          contrato_id: string
          garante_id: string
        }
        Update: {
          contrato_id?: string
          garante_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrato_garantes_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrato_garantes_garante_id_fkey"
            columns: ["garante_id"]
            isOneToOne: false
            referencedRelation: "garantes"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          carpeta: string | null
          codigo: string | null
          comision_porcentaje: number
          created_at: string
          dia_vencimiento_pago: number
          estado: Database["public"]["Enums"]["contrato_estado"]
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          indice_actualizacion: Database["public"]["Enums"]["contrato_indice"]
          inmueble_id: string
          inquilino_id: string
          moneda: string
          monto_actual: number
          monto_inicial: number
          notas: string | null
          periodicidad_meses: number
          propietario_id: string
          proxima_actualizacion: string | null
          updated_at: string
          valor_indice_referencia: number | null
        }
        Insert: {
          carpeta?: string | null
          codigo?: string | null
          comision_porcentaje?: number
          created_at?: string
          dia_vencimiento_pago?: number
          estado?: Database["public"]["Enums"]["contrato_estado"]
          fecha_fin?: string | null
          fecha_inicio: string
          id?: string
          indice_actualizacion?: Database["public"]["Enums"]["contrato_indice"]
          inmueble_id: string
          inquilino_id: string
          moneda?: string
          monto_actual: number
          monto_inicial: number
          notas?: string | null
          periodicidad_meses?: number
          propietario_id: string
          proxima_actualizacion?: string | null
          updated_at?: string
          valor_indice_referencia?: number | null
        }
        Update: {
          carpeta?: string | null
          codigo?: string | null
          comision_porcentaje?: number
          created_at?: string
          dia_vencimiento_pago?: number
          estado?: Database["public"]["Enums"]["contrato_estado"]
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          indice_actualizacion?: Database["public"]["Enums"]["contrato_indice"]
          inmueble_id?: string
          inquilino_id?: string
          moneda?: string
          monto_actual?: number
          monto_inicial?: number
          notas?: string | null
          periodicidad_meses?: number
          propietario_id?: string
          proxima_actualizacion?: string | null
          updated_at?: string
          valor_indice_referencia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_inmueble_id_fkey"
            columns: ["inmueble_id"]
            isOneToOne: false
            referencedRelation: "inmuebles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_inquilino_id_fkey"
            columns: ["inquilino_id"]
            isOneToOne: false
            referencedRelation: "inquilinos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_propietario_id_fkey"
            columns: ["propietario_id"]
            isOneToOne: false
            referencedRelation: "propietarios"
            referencedColumns: ["id"]
          },
        ]
      }
      garantes: {
        Row: {
          created_at: string
          cuit_dni: string | null
          direccion: string | null
          id: string
          nombre: string
          notas: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cuit_dni?: string | null
          direccion?: string | null
          id?: string
          nombre: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cuit_dni?: string | null
          direccion?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      indices_referencia: {
        Row: {
          created_at: string
          fecha: string
          id: string
          tipo_indice: Database["public"]["Enums"]["contrato_indice"]
          valor: number
        }
        Insert: {
          created_at?: string
          fecha: string
          id?: string
          tipo_indice: Database["public"]["Enums"]["contrato_indice"]
          valor: number
        }
        Update: {
          created_at?: string
          fecha?: string
          id?: string
          tipo_indice?: Database["public"]["Enums"]["contrato_indice"]
          valor?: number
        }
        Relationships: []
      }
      inmueble_fotos: {
        Row: {
          created_at: string
          id: string
          inmueble_id: string
          orden: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          inmueble_id: string
          orden?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          inmueble_id?: string
          orden?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "inmueble_fotos_inmueble_id_fkey"
            columns: ["inmueble_id"]
            isOneToOne: false
            referencedRelation: "inmuebles"
            referencedColumns: ["id"]
          },
        ]
      }
      inmuebles: {
        Row: {
          ambientes: number | null
          created_at: string
          descripcion: string | null
          direccion: string
          estado: Database["public"]["Enums"]["inmueble_estado"]
          id: string
          localidad: string | null
          notas: string | null
          precio: number | null
          propietario_id: string | null
          publicado: boolean
          superficie: number | null
          tipo: string | null
          updated_at: string
        }
        Insert: {
          ambientes?: number | null
          created_at?: string
          descripcion?: string | null
          direccion: string
          estado?: Database["public"]["Enums"]["inmueble_estado"]
          id?: string
          localidad?: string | null
          notas?: string | null
          precio?: number | null
          propietario_id?: string | null
          publicado?: boolean
          superficie?: number | null
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          ambientes?: number | null
          created_at?: string
          descripcion?: string | null
          direccion?: string
          estado?: Database["public"]["Enums"]["inmueble_estado"]
          id?: string
          localidad?: string | null
          notas?: string | null
          precio?: number | null
          propietario_id?: string | null
          publicado?: boolean
          superficie?: number | null
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inmuebles_propietario_id_fkey"
            columns: ["propietario_id"]
            isOneToOne: false
            referencedRelation: "propietarios"
            referencedColumns: ["id"]
          },
        ]
      }
      inquilinos: {
        Row: {
          created_at: string
          cuit_dni: string | null
          direccion: string | null
          email: string | null
          id: string
          nombre: string
          notas: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cuit_dni?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cuit_dni?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      movimientos: {
        Row: {
          contrato_id: string
          created_at: string
          estado: Database["public"]["Enums"]["movimiento_estado"]
          fecha: string
          id: string
          medio_pago: string | null
          monto: number
          notas: string | null
          tipo: Database["public"]["Enums"]["movimiento_tipo"]
          updated_at: string
        }
        Insert: {
          contrato_id: string
          created_at?: string
          estado?: Database["public"]["Enums"]["movimiento_estado"]
          fecha?: string
          id?: string
          medio_pago?: string | null
          monto: number
          notas?: string | null
          tipo: Database["public"]["Enums"]["movimiento_tipo"]
          updated_at?: string
        }
        Update: {
          contrato_id?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["movimiento_estado"]
          fecha?: string
          id?: string
          medio_pago?: string | null
          monto?: number
          notas?: string | null
          tipo?: Database["public"]["Enums"]["movimiento_tipo"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          created_at: string
          id: string
          nombre: string | null
          rol: Database["public"]["Enums"]["perfil_rol"]
        }
        Insert: {
          created_at?: string
          id: string
          nombre?: string | null
          rol?: Database["public"]["Enums"]["perfil_rol"]
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string | null
          rol?: Database["public"]["Enums"]["perfil_rol"]
        }
        Relationships: []
      }
      propietarios: {
        Row: {
          alias_cbu: string | null
          cbu: string | null
          created_at: string
          cuit: string | null
          direccion: string | null
          email: string | null
          id: string
          nombre: string
          notas: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          alias_cbu?: string | null
          cbu?: string | null
          created_at?: string
          cuit?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          alias_cbu?: string | null
          cbu?: string | null
          created_at?: string
          cuit?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aplicar_actualizaciones_indices: { Args: never; Returns: undefined }
    }
    Enums: {
      comprobante_estado:
        | "pendiente_credenciales"
        | "pendiente"
        | "emitido"
        | "error"
      comprobante_tipo: "factura_c" | "recibo"
      contrato_estado: "activo" | "finalizado" | "rescindido"
      contrato_indice: "ICL" | "IPC" | "CASA_PROPIA" | "FIJO" | "OTRO"
      inmueble_estado: "disponible" | "alquilado" | "reservado" | "inactivo"
      movimiento_estado: "pendiente" | "pagado"
      movimiento_tipo:
        | "cobro_inquilino"
        | "pago_propietario"
        | "comision"
        | "gasto"
      perfil_rol: "admin" | "operador"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      comprobante_estado: [
        "pendiente_credenciales",
        "pendiente",
        "emitido",
        "error",
      ],
      comprobante_tipo: ["factura_c", "recibo"],
      contrato_estado: ["activo", "finalizado", "rescindido"],
      contrato_indice: ["ICL", "IPC", "CASA_PROPIA", "FIJO", "OTRO"],
      inmueble_estado: ["disponible", "alquilado", "reservado", "inactivo"],
      movimiento_estado: ["pendiente", "pagado"],
      movimiento_tipo: [
        "cobro_inquilino",
        "pago_propietario",
        "comision",
        "gasto",
      ],
      perfil_rol: ["admin", "operador"],
    },
  },
} as const
