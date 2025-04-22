import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('UserStore', () => {
  const supabase = useSupabaseClient();

  const _user = ref<User | null>(null);

  const user = computed(() => _user.value);

  function syncUser() {
    return supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error(error);
      } else {
        _user.value = data.user;
      }
    })
  }

  return {
    user,
    syncUser,
  }
})
