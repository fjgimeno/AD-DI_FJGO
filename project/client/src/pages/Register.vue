<template>
  <q-page class="bg-light-gray window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-gray q-my-md">Registra't</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="dni" type="" label="DNI" />
              <q-input square filled clearable v-model="nom" type="" label="Nom" />
              <q-input square filled clearable v-model="usuari" type="email" label="Usuari" />
              <q-input square filled clearable v-model="contrasenya" type="password" label="Contrasenya" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="primary" size="lg" class="full-width" label="Registrar-se" @click="register()" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none q-px-md">
            <p class="text-grey-6">Ja tens un compte? <a href="#/">Inicia sesió</a></p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import { api } from 'boot/axios'
export default {
  name: 'Login',
  data () {
    return {
      nom: '',
      dni: '',
      usuari: '',
      contrasenya: ''
    }
  },
  actions: {
    register ({ commit }, form) {
      return api.post('/register', form)
        .then(response => {
          const Authorization = 'Authorization'
          api.defaults.headers.common[Authorization] = 'Bearer ' + response.data.token
          commit('login', { token: response.data.token, user: response.data.user })
        })
    }
  }
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
