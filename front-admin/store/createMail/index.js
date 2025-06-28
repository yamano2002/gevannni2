import editor from './editor';
import destination from './destination/';

const createMailModule = {
  namespaced: true,
  modules: {
    editor,
    destination
  }
};

export default createMailModule;
