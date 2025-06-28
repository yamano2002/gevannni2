<template>
  <v-expansion-panel>
    <v-expansion-panel-content
      v-for="template in mailTemplates"
      :key="template.tag"
    >
      <div slot="header">
        {{ template.name }}
        <v-tooltip right>
          <v-btn
            slot="activator"
            small
            icon
            class="ma-0">
            <v-icon
              small
              color="blue accent-2"
            >
              fa-question-circle
            </v-icon>
          </v-btn>
          <span>{{ template.description }}</span>
        </v-tooltip>
      </div>
      <ListItem :template="template" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex';
import ListItem from './list-item';

export default {
  name: 'MailTemplateListComponent',
  components: { ListItem },
  computed: {
    ...mapState('mailTemplate', ['mailTemplates'])
  }
};
</script>

<style scoped>
</style>
