let _instance = null

export function setToastInstance(instance) {
  _instance = instance
}

export function useToast() {
  function show(options) {
    if (_instance) _instance.add(options)
  }

  return {
    success: (message) => show({ type: 'success', message }),
    error:   (message) => show({ type: 'error',   message }),
    info:    (message) => show({ type: 'info',     message }),
    warning: (message) => show({ type: 'warning',  message }),
  }
}