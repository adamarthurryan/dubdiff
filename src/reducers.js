

export function textInput (state, action ) {
  switch (action.type) {
    case 'UPDATE_ORIGINAL_INPUT':
      return Object.assign({}, state, {original:action.data})
    default:
      return state || {original:"", final:""}
  }
}


export function locationInput (state, action) {
  switch (action.type) {
    case 'UPDATE_LOCATION_INPUT':
      return Object.assign({}, state, action.data)
    default:
      return state || {latitude:"0", longitude:"0"}  
  }
}

export function dateInput (state, action) {
  switch (action.type) {
    case 'UPDATE_DATE_INPUT':
      return action.data
    default:
      return state || "Jun 21"
  }
}

export function view (state, action) {
  switch (action.type) {
    case 'VIEW_DATE':
      return 'DATE'
    case 'VIEW_MONTHLY':
      return 'MONTHLY'
    default:
      return state || 'MONTHLY'
  }
}