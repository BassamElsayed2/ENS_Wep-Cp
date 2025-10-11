// Supabase client stub - needs to be configured
// TODO: Configure Supabase client properly with actual credentials

type SupabaseError = { message: string } | null;

const supabase = {
  storage: {
    from: (bucket: string) => ({
      upload: async (
        fileName: string,
        file: File
      ): Promise<{ error: SupabaseError; data?: any }> => ({
        error: null,
        data: { path: fileName },
      }),
      remove: async (
        files: string[]
      ): Promise<{ error: SupabaseError; data?: any }> => ({
        error: null,
        data: null,
      }),
      getPublicUrl: (fileName: string) => ({
        data: { publicUrl: `https://placeholder.com/${fileName}` },
      }),
    }),
  },
  from: (table: string) => ({
    select: () => ({
      data: [],
      error: null as SupabaseError,
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data, error: null as SupabaseError }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data, error: null as SupabaseError }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) =>
        Promise.resolve({ error: null as SupabaseError }),
    }),
  }),
};

export default supabase;
