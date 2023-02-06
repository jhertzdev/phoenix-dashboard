<template>
  <q-page class="flex column flex-center">
    <div class="q-pa-md" style="width: 80%">
      <h3>
          Perfil , del usuario {{ user_data.name }}
      </h3>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          
          label="Your name *"
          hint="Name and surname"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          filled
          type="number"
         
          label="Your age *"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Please type your age',
            val => val > 0 && val < 100 || 'Please type a real age'
          ]"
        />

        <q-toggle label="I accept the license and terms" />

        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>

      </div>
  </q-page>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { api,ApiRest } from 'src/boot/axios';
export default{
  data(){
    return{
      user_id:useRoute().params.id,
      user_data:{},
      options:[]
    }
  },
  mounted(){
    this.cargar();
  },
  methods: {
    cargar() {
      //cargar user
      ApiRest('user/'+this.user_id,{}).then(m=>{
        this.user_data=m;
      }).catch(e=>{

      });
      //cargar roles
      ApiRest('roles?selected=1',{}).then(m=>{
        this.options=m.map(d=>{
          return {
            value:d.id,
            label:d.name
          }
        });
      }).catch(e=>{

      });
    },
    onSubmit(){

    },
    onReset(){
      
    }
  },
}
</script>
