<template>
  <div>
    <div v-if="!targetListId">リストを選択してください。</div>
    <div v-else>
      <v-card>
        <v-card-title>
          <span class="grey--text">テーブルの横幅がはみ出す場合は横にスクロールできます。</span>
          <v-spacer/>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="検索"
            single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :headers="tableHeaders"
          :items="filteredGroups"
          :rows-per-page-items="rows"
          :pagination.sync="pagination"
          no-data-text="登録団体は 0 件です"
          class="no-wrap"
        >
          <template 
            slot="items" 
            slot-scope="props">
            <td>{{ props.item.fullIdPub }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.name_kana }}</td>
            <td>
              <span v-if="props.item.Building">{{ props.item.Building.name }}</span>
              <span v-else>なし</span>
            </td>
            <td v-if="hasPrivScope">{{ props.item.charge_person_name }}</td>
            <td v-if="hasPrivScope">{{ props.item.mail }}</td>
            <td v-if="hasPrivScope">{{ props.item.tel }}</td>
            <td>{{ formatDatetime(props.item.firstRegisteredAt) }}</td>
            <td>{{ formatDatetime(props.item.updatedAt) }}</td>
            <td 
              v-if="hasPrivScope" 
              class="layout">
              <v-icon
                small
                class="mr-2"
                @click="openEditor(props.item.id)"
              >
                edit
              </v-icon>
              <v-icon
                small
                @click="deleteGroup(props.item.id)"
              >
                delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
import SCOPE from '../../../enums/adminScopes';
import { mapState, mapGetters, mapActions } from 'vuex';
import { filterGroups } from '../../assets/groupFilter';

export default {
  name: 'GroupListComponent',
  data() {
    return {
      search: '',
      rows: [
        25,
        50,
        100,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ],
      pagination: {
        descending: true,
        sortBy: 'updatedAt'
      }
    };
  },
  computed: {
    ...mapState('group/groupList', ['groups', 'targetListId']),
    ...mapGetters('group/groupList', ['targetList']),
    ...mapGetters('auth', ['hasScope']),
    hasPrivScope() {
      return this.hasScope(SCOPE.GROUP);
    },
    tableHeaders() {
      let headers = [
        {
          text: '団体ID',
          value: 'fullIdPub'
        },
        {
          text: '団体名',
          value: 'name'
        },
        {
          text: '団体名 (カナ)',
          value: 'name_kana'
        },
        {
          text: '部室',
          value: 'BuildingId'
        }
      ];

      if (this.hasPrivScope) {
        headers = headers.concat([
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
          }
        ]);
      }

      headers = headers.concat([
        {
          text: '登録',
          value: 'firstRegisteredAt'
        },
        {
          text: '更新',
          value: 'updatedAt'
        }
      ]);

      if (this.hasPrivScope) {
        headers = headers.concat([
          {
            text: '操作',
            sortable: false
          }
        ]);
      }

      return headers;
    },
    filteredGroups() {
      const search = this.search;
      if (!search) {
        return this.groups;
      }

      return filterGroups(this.groups, this.search);
    }
  },
  methods: {
    ...mapActions('group/editor', ['openEditor']),
    ...mapActions('group/delete', ['deleteGroup']),
    formatDatetime(str) {
      return this.$moment(str).format('lll');
    }
  }
};
</script>

<style scoped>
</style>
