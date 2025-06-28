import sleep from '../../services/asyncSleepService';

export default async function({ store, route, redirect }) {
  while (!store.state.initialized) {
    await sleep(200);
  }

  let isAuthed = store.state.auth.isAuthenticated;
  if (isAuthed) {
    try {
      await store.dispatch('auth/checkAccessToken', {});
    } catch (e) {
      isAuthed = false;
    }
  }

  if (!isAuthed && route.name !== 'login') {
    return redirect('/login');
  } else if (isAuthed && route.name === 'login') {
    return redirect('/');
  }
}
