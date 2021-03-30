<template>
      <div class="container">
        <Catalog></Catalog>
      </div>

</template>
<script>
import css from "./assets/css/style.css";
import Catalog from './views/Catalog.vue'
import { func } from './components/mixins/func'

export default {
  mixins:[ func ],
  name: 'App',
  components: {
    Catalog
  }
}
</script>
