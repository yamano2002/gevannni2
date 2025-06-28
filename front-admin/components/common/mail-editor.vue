<template>
  <v-dialog
    v-model="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar
        dark
        fixed
        color="primary">
        <v-btn
          icon
          dark
          @click="$emit('change', false)">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <slot name="title"/>
        </v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <slot name="toolbar-items"/>
        </v-toolbar-items>
      </v-toolbar>

      <v-container
        grid-list-md
        style="margin-top: 65px;">
        <form>
          <v-layout wrap>
            <v-flex 
              xs12 
              md7>
              <v-text-field
                v-model="input.from_address_name"
                label="差出人名"/>
            </v-flex>
            <v-flex
              xs12
              md5>
              <v-text-field
                v-model="input.from_address_local_part"
                :suffix="'@'+mailDomain"
                label="差出人アドレス"/>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="input.reply_to"
                type="email"
                label="返信先アドレス"/>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="input.subject"
                label="件名"/>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="input.body"
                box
                auto-grow
                label="本文"
              />
            </v-flex>
          </v-layout>
        </form>

        <MailVariableList :variables="variables"/>

        <slot/>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import MailVariableList from './mail-variable-list';

export default {
  name: 'MailEditorComponent',
  components: { MailVariableList },
  model: {
    prop: 'open',
    event: 'change'
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    input: {
      type: Object,
      required: true
    },
    variables: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('sendMailSetting', ['mailDomain'])
  }
};
</script>

<style scoped>
</style>
