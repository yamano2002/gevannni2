import PHASE from '../assets/group-register/phase';
import PHASE_PAGE_PATH from '../assets/group-register/phase-pahe-path';

export default function({ store, route, redirect }) {
  if (route.name === 'login') {
    return;
  }

  const requestPath = route.path;
  const currentPhase = store.state.groupRegister.phase;
  const correctPath = PHASE_PAGE_PATH[currentPhase];
  if (!correctPath || route.path.indexOf(correctPath) !== 0) {
    store.commit('groupRegister/SET_PHASE', PHASE.STAND_BY);
    if (requestPath !== '/') {
      return redirect('/');
    }
  }
}
