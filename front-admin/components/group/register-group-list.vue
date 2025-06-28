<template>
  <v-data-table
    :headers="tableheaders"
    :items="addedGroups"
  >
    <template 
      slot="items"
      slot-scope="props">
      <td>#{{ props.index + 1 }}</td>
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.name_kana }}</td>
      <td>
        <span v-if="props.item.BuildingId">{{ buildings[props.item.BuildingId].name }}</span>
        <span v-else>なし</span>
      </td>
      <td>{{ props.item.charge_person_name }}</td>
      <td>{{ props.item.mail }}</td>
      <td>{{ props.item.tel }}</td>
      <td class="layout">
        <v-icon
          small
          class="mr-2"
          @click="editGroup(addedGroups.indexOf(props.item))"
        >edit
        </v-icon>
        <v-icon
          small
          @click="deleteGroup(addedGroups.indexOf(props.item))"
        >delete</v-icon>

      </td>
    </template>
  </v-data-table>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'RegisterGroupList',
  data() {
    return {
      tableheaders: [
        {
          text: '#',
          value: 'index'
        },
        {
          text: '団体名',
          value: 'name'
        },
        {
          text: '団体名(カナ)',
          value: 'name_kana'
        },
        {
          text: '部室',
          value: 'BuildingId'
        },
        {
          text: '担当者氏名',
          value: 'charge_person_name'
        },
        {
          text: 'メールアドレス',
          value: 'mail'
        },
        {
          text: '電話番号',
          value: 'tel'
        },
        {
          text: '操作',
          value: 'control'
        }
      ]
    };
  },
  computed: {
    ...mapState('buildings', ['buildings']),
    ...mapState('group/register', ['addedGroups'])
  },
  methods: {
    ...mapMutations('group/register', ['OMIT_ONE_GROUP', 'CHANGE_MODIFY']),
    ...mapActions('group/register', ['openModal']),
    deleteGroup(index) {
      this.OMIT_ONE_GROUP(index);
    },
    editGroup(index) {
      this.CHANGE_MODIFY({ values: this.addedGroups[index], index: index });
      this.openModal('modify');
    }
  }
};
</script>
<style scoped>
</style>
