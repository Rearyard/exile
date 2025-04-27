import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('UserStore', () => {
  const supabase = useSupabaseClient();

  const _user = useSupabaseUser();

  const user = computed(() => _user.value);

  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session);
  })

  return {
    user,
  }
})
