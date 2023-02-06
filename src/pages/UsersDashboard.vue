<template>
  <q-page class="flex column" style="padding:1em">
    <section style="width:90%">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>ID</th>
              <th>ID</th>
              <th>ID</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                  {{ user.id }}
              </td>
              <td>
                  {{ user.name }}
              </td>
            </tr>
          </tbody>
        </table>
    </section>
  </q-page>
</template>

<style>
.user-avatar{
  color: var(--q-secondary);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 5rem;
}
</style>

<script>

import { useAuthStore } from 'src/stores/auth.store';
import { api, ApiRest } from 'src/boot/axios';
import { useQuasar } from 'quasar';
const $q = useQuasar()
const authStore = useAuthStore()
export default{
  data(){
    return{
      users:[],
      page:0,
      totalPage:0
    }
  },
  mounted(){
    this.cargar()
  },
  methods:{
    cargar(){
      ApiRest('users?page='+this.page,{}).then(m=>{
        console.log(m)
        this.users=m.data;
        this.totalPage=m.pagination.lastPage
      }).catch(e=>{

      });
    }
  }
}
</script>
