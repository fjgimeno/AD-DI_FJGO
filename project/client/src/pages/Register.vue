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
              <q-input
              lazy-rules
              :rules="[ val => val && val.length > 0 && isValidDni && val.length <= 9 || 'Format incorrecte']"
              square filled clearable v-model="dni" type="" label="DNI" />
              <q-input
              lazy-rules
              :rules="[isValidNom || 'Format incorrecte']"
              square filled clearable v-model="nom" type="" label="Nom" />
              <q-input
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Aquest camp no pot estar buit']"
              square filled clearable v-model="usuari" type="email" label="Usuari" />
              <q-input
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Aquest camp no pot estar buit']"
              square filled clearable v-model="contrasenya1" type="password" label="Contrasenya" />
              <q-input
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Aquest camp no pot estar buit']"
              square filled clearable v-model="contrasenya2" type="password" label="Escriu de nou la contrasenya" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="primary" size="lg" class="full-width" label="Iniciar sesió" />
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
export default {
  name: 'Login',
  data () {
    return {
      nom: '',
      dni: '',
      usuari: '',
      contrasenya1: '',
      contrasenya2: ''
    }
  },
  computed: {
    isValidDni () {
      const refExp = new RegExp('[0-9]{8,8}[A-Za-z]{1}')
      return refExp.test(this.dni)
    },
    isValidNom () {
      const noms = this.nom.slice(' ')
      if (noms.length >= 3) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
