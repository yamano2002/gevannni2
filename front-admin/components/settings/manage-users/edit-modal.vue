<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px">
    <v-card>
      <form @submit.prevent="save">
        <v-card-title>
          <span class="headline">
            利用者側ユーザ
            <span v-if="isAdd">追加</span>
            <span v-else>編集</span>
          </span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex 
                xs12 
                sm6>
                <v-text-field 
                  v-model="values.name"
                  required
                  label="ユーザ名"/>
              </v-flex>
              <v-flex 
                xs12 
                sm6>
                <v-text-field 
                  v-model="values.password"
                  :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                  :type="passwordShow ? 'text' : 'password'"
                  required
                  label="パスワード"
                  @click:append="passwordShow = !passwordShow"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn 
            :disabled="editor.saving"
            color="blue darken-1"
            flat 
            @click="isOpen = false">キャンセル</v-btn>
          <v-btn 
            :loading="editor.saving"
            color="blue darken-1"
            type="submit"
            flat>保存</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'SettingsManageUserEditModalComponent',
  data() {
    return {
      passwordShow: false
    };
  },
  computed: {
    ...mapState('settings/manageUsers', ['editor']),
    ...mapGetters('settings/manageUsers', ['isAdd']),
    isOpen: {
      get() {
        return this.editor.modalOpen;
      },
      set(value) {
        this.SWITCH_EDITOR_OPEN(value);
      }
    },
    values: {
      get() {
        return this.editor.values;
      },
      set(values) {
        this.UPDATE_VALUES_FROM_EDITOR(values);
      }
    }
  },
  methods: {
    ...mapMutations('settings/manageUsers', [
      'SWITCH_EDITOR_OPEN',
      'UPDATE_VALUES_FROM_EDITOR'
    ]),
    ...mapActions('settings/manageUsers', ['save'])
  }
};
</script>

<style scoped>
</style>
