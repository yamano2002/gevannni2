<template>
  <v-data-table
    :items="sendMailSettings"
    hide-headers
    hide-actions
    class="elevation-1"
  >
    <template
      slot="items"
      slot-scope="props">
      <td class="no-wrap">
        {{ props.item.name }}
        <v-tooltip top>
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
          <span>{{ props.item.description }}</span>
        </v-tooltip>
      </td>
      <td :class="isMultiLine(props.item.form_type)">
        <v-edit-dialog
          :return-value.sync="props.item.value"
          :id="'send-mail-setting-edit-dialog-'+props.item.tag"
          large
          lazy
          save-text="保存"
          cancel-text="キャンセル"
          @save="save(props.item.tag)"
        >
          <span v-if="props.item.value">{{ props.item.value }}</span>
          <span 
            v-else 
            class="grey--text">未設定</span>
          <v-textarea
            v-if="props.item.form_type === 'textarea'"
            slot="input"
            v-model="props.item.value"
            :label="props.item.name"
            :rows="9"
            autofocus
            class="mt-4"
            style="width: 350px;"
          />
          <v-text-field
            v-else
            slot="input"
            :type="props.item.form_type"
            v-model="props.item.value"
            :label="props.item.name"
            single-line
            autofocus
          />
        </v-edit-dialog>
      </td>
      <td>
        <v-icon
          small
          class="mr-2"
          @click="openEditor(props.item.tag)"
        >
          edit
        </v-icon>
        <v-icon
          small
          @click="clear(props.item.tag)"
        >
          delete
        </v-icon>
      </td>
    </template>
    <template slot="no-data">
      設定が存在しません
    </template>
  </v-data-table>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SendMailSettingListComponent',
  computed: {
    ...mapState('sendMailSetting', ['sendMailSettings'])
  },
  methods: {
    ...mapActions('sendMailSetting', ['initEditor', 'save', 'clear']),
    isMultiLine(formType) {
      return {
        multiline: formType === 'textarea'
      };
    },
    openEditor(tag) {
      document
        .querySelector(
          `#send-mail-setting-edit-dialog-${tag} .v-menu__activator`
        )
        .click();
    }
  }
};
</script>

<style scoped>
.multiline {
  white-space: pre;
  padding-top: 13px !important;
  padding-bottom: 13px !important;
}
</style>
