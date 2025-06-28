<template>
  <div>
    <div class="mb-4">
      以下の入力内容をお確かめください。
    </div>

    <div class="inputs">
      <div class="item">
        <div class="label">団体名</div>
        <div class="value">{{ inputs.name }}</div>
      </div>
      <div class="item">
        <div class="label">団体名カナ</div>
        <div class="value">{{ inputs.name_kana }}</div>
      </div>
      <div class="item">
        <div class="label">部室のある建物</div>
        <div class="value">{{ buildingName }}</div>
      </div>
      <div class="item">
        <div class="label">担当者氏名</div>
        <div class="value">{{ inputs.charge_person_name }}</div>
      </div>
      <div class="item">
        <div class="label">担当者電話番号</div>
        <div class="value">{{ inputs.tel }}</div>
      </div>
      <div class="item">
        <div class="label">担当者メールアドレス</div>
        <div class="value">{{ inputs.mail }}</div>
      </div>
    </div>

    <div>
      問題がなければ「登録」を、修正する場合は「戻る」を押してください。
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ConfirmModalContentComponent',
  computed: {
    ...mapState('groupRegister/form', ['form']),
    ...mapGetters('buildings', ['getBuildingById']),
    inputs() {
      return this.form.values;
    },
    buildingName() {
      return this.getBuildingById(this.inputs.BuildingId).name;
    }
  }
};
</script>

<style scoped lang="stylus">
.inputs
  .item
    @extend .mb-4
    .label
      @extend .font-weight-bold
      font-size 1.2em
    .value
      @extend .px-3
      @extend .py-2
      @extend .my-2
      background-color rgb(243, 238, 230)
      border-radius 7px
      font-size 1.1em
</style>
