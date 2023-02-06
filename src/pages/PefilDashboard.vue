<template>
  <q-page class="flex column flex-center">
    <div>
        {{ user_data }}
    </div>
  </q-page>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { api } from 'src/boot/axios';
export default{
  data(){
    return{
      user_id:useRoute().params.id,
      user_data:ref({})
    }
  },
  async mounted () {
      // const response = await api.get('/user/'+this.user_id).then(m=>{
      //   console.log('paso')
      //   this.user_data=response.data.name;
        
      // }).catch(e=>{

      // });

  },
}
</script>
