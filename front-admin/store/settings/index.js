import manageUsersModule from './manage-users';

const settingsModule = {
  namespaced: true,
  modules: {
    manageUsers: manageUsersModule
  }
};

export default settingsModule;
