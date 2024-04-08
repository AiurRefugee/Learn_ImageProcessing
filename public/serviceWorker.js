if ('serviceWorker' in window.navigator) {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(function (reg) {
        console.log('success', reg);
      })
      .catch(function (err) {
        console.log('fail', err);
      });
  }
  