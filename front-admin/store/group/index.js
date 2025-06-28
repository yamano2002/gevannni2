import groupListModule from './group-list';
import editorModule from './editor';
import deleteModule from './delete';
import registerModule from './register';

const groupModule = {
  namespaced: true,
  modules: {
    groupList: groupListModule,
    editor: editorModule,
    delete: deleteModule,
    register: registerModule
  }
};

export default groupModule;
