const deleteModule = {
  namespaced: true,
  actions: {
    async deleteGroup({ rootGetters, dispatch }, targetGroupId) {
      const targetGroup = rootGetters['group/groupList/findGroupById'](
        targetGroupId
      );
      const list = rootGetters['group/groupList/targetList'];

      const conf = confirm(
        `${list.name} から団体「${
          targetGroup.name
        }」を削除しますか？\n(この操作は取り消せません)`
      );
      if (!conf) {
        return;
      }

      await this.$axios.delete(`/group/${targetGroupId}`);
      dispatch(
        'notification/push',
        {
          text: `${list.name} から団体「${targetGroup.name}」を削除しました`,
          type: 'success'
        },
        {
          root: true
        }
      );
      await dispatch('group/groupList/reloadGroupList', {}, { root: true });
    }
  }
};

export default deleteModule;
