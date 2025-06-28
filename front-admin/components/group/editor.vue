<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ FormOptions().title }}
        </span>
      </v-card-title>

      <v-card-text>
        <EditorForm :form-options="FormOptions()"/>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="blue darken-1"
          flat
          @click="isOpen = false">キャンセル</v-btn>
        <v-btn

          color="blue darken-1"
          flat
          @click="checkTypeandsetValues(FormOptions().formType)">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EditorForm from './editor-form';

export default {
  name: 'GroupEditorComponent',
  components: { EditorForm },
  props: {
    FormOptions: { type: Function, default: null }
  },
  computed: {
    isOpen: {
      get() {
        return this.FormOptions().methods.getOpenMethod;
      },
      set(value) {
        this.FormOptions().methods.setOpenMethod(
          this.FormOptions().formType,
          value
        );
      }
    }
  },
  methods: {
    checkTypeandsetValues(formType) {
      this.FormOptions().methods.setValues(formType);
    }
  }
};
</script>

<style scoped>
</style>
