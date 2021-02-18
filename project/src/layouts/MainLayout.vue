<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Qualificacions App
        </q-toolbar-title>

        <div>Hui es: {{ dataActual }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Login',
    caption: 'Anar al login',
    icon: 'school',
    link: '#/Login'
  },
  {
    title: 'About',
    caption: 'Anar a informació de la app',
    icon: 'school',
    link: '#/About'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    dataActual () {
      var dateAct = new Date()
      var strDia
      var strMes
      switch (dateAct.getDay()) {
        case 1:
          strDia = 'Dilluns'
          break
        case 2:
          strDia = 'Dimarts'
          break
        case 3:
          strDia = 'Dimecres'
          break
        case 4:
          strDia = 'Dijous'
          break
        case 5:
          strDia = 'Divendres'
          break
        case 6:
          strDia = 'Dissabte'
          break
        case 7:
          strDia = 'Diumenge'
          break
      }
      switch (dateAct.getMonth()) {
        case 1:
          strMes = 'de Gener'
          break
        case 2:
          strMes = 'de Febrer'
          break
        case 3:
          strMes = 'de Març'
          break
        case 4:
          strMes = 'd\'Abril'
          break
        case 5:
          strMes = 'de Maig'
          break
        case 6:
          strMes = 'de Juny'
          break
        case 7:
          strMes = 'Dilluns'
          break
        case 8:
          strMes = 'd\'Agost'
          break
        case 9:
          strMes = 'de Septembre'
          break
        case 10:
          strMes = 'd\'Octubre'
          break
        case 11:
          strMes = 'de Novembre'
          break
        case 12:
          strMes = 'de Desembre'
          break
      }
      return strDia + ' ' + dateAct.getDate() + ' ' + strMes + ' del ' + dateAct.getFullYear()
    }
  }
}
</script>
