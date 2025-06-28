<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">
          CSV取り込み
        </span>
      </v-card-title>
      <v-card-text>
        <v-flex class="text-xs-center">
          <div 
            @dragover.prevent="onDrag"
            @dragleave.prevent="leaveDrag"
            @drop.prevent="checkFile($event)">
            <v-sheet
              :color="sheetcolor"
              height="150px"
              class="pa-5"
              
            >
              {{ message }}
            </v-sheet>
          </div>
          <v-btn
            color="blue"
            flat
            @click="downloadSampleCsv"
          >
            CSVファイルフォーマットサンプルをダウンロード
          </v-btn>
        </v-flex>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          @click="isOpen = false"
        >キャンセル
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>    
</template>
<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import { saveAs } from 'file-saver';
import { parse } from 'papaparse';
export default {
  name: 'AddCsvModal',
  data() {
    return {
      isDragging: false,
      isReading: false,
      readingRow: 0,
      requiredFields: ['name', 'charge_person_name', 'mail', 'tel'],
      passedRows: []
    };
  },
  computed: {
    ...mapState('group/register', ['addedGroups']),
    ...mapGetters('buildings', ['getBuildingById']),
    isOpen: {
      get() {
        return this.$store.state.group.register.addCsvModalOpen;
      },
      set(value) {
        this.SWITCH_OPEN({ modal: 'add-csv', value: value });
      }
    },
    sheetcolor() {
      return this.isDragging === true ? 'grey' : 'grey lighten-3';
    },
    message() {
      return this.isReading === false
        ? 'ここにCSVファイルをドロップしてください'
        : '取り込み処理中...';
    }
  },
  methods: {
    ...mapMutations('group/register', ['SWITCH_OPEN', 'ADD_ARRAY_TO_GROUPS']),
    async downloadSampleCsv() {
      const res = await this.$axios.get('/group/download_csv');
      const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'group_register_csv_sample.csv');
    },
    onDrag() {
      if (!this.isDragging) {
        this.isDragging = true;
      }
    },
    leaveDrag() {
      this.isDragging = false;
    },
    throwError(errObj) {
      this.$store.dispatch('notification/push', {
        text:
          errObj.row +
          '行目の' +
          errObj.field +
          ' ' +
          errObj.value +
          ' ' +
          errObj.message,
        type: 'error'
      });
    },
    checkFile(event) {
      this.isDragging = false;

      let filename = event.dataTransfer.files[0].name;
      parse(event.dataTransfer.files[0], {
        header: true,
        comments: '#',
        skipEmptyLines: true,
        transform: (value, header) => {
          if (header === 'BuildingId') {
            return Number(value);
          }
          return value;
        },

        step: (result, parser) => {
          //check each row
          let eachData = result.data[0];
          this.readingRow++;
          for (let key of this.requiredFields) {
            if (!eachData[key]) {
              this.throwError({
                row: this.readingRow,
                field: key,
                value: eachData[key],
                message: 'は必須項目です。'
              });
              parser.abort(); //stop reading
              return;
            }
          }

          if (
            eachData['BuildingId'] &&
            !this.getBuildingById(Number(eachData['BuildingId']))
          ) {
            this.throwError({
              row: this.readingRow,
              field: 'BuildingId',
              value: eachData['BuildingId'],
              message: 'は有効な番号ではありません。'
            });
            parser.abort();
            return;
          }
          if (
            eachData['name_kana'] &&
            !/^[ァ-ー]+$/.test(eachData['name_kana'])
          ) {
            this.throwError({
              row: this.readingRow,
              field: 'name_kana',
              value: eachData['name_kana'],
              message: 'は全角カタカナのみで入力してください。'
            });
            parser.abort();
            return;
          }
          if (!/^[0-9]+$/.test(eachData['tel'])) {
            this.throwError({
              row: this.readingRow,
              field: 'tel',
              value: eachData['tel'],
              message: 'は数字のみで入力してください。'
            });
            parser.abort();
            return;
          }
          if (!/^.+@.+$/.test(eachData['mail'])) {
            this.throwError({
              row: this.readingRow,
              field: 'mail',
              value: eachData['mail'],
              message: 'はメールアドレスの形式で入力してください。'
            });
            parser.abort();
            return;
          }
          this.passedRows.push(result.data[0]); //add one data if passed
        },

        complete: results => {
          if (Object.keys(results.meta).length === 0) {
            //check whether aborted
            this.isOpen = false;
            this.ADD_ARRAY_TO_GROUPS(this.passedRows);
          }
          this.isReading = false;
          this.readingRow = 0;
          this.passedRows = [];
        },
        error: err => {
          console.log(err);
        }
      });

      if (filename.split('.')[1] !== 'csv') {
        this.$store.dispatch('notification/push', {
          text: 'csvファイルのみドロップしてください。',
          type: 'error'
        });
        return;
      }
      this.isReading = true;
    }
  }
};
</script>
<style scoped>
</style>
