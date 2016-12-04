let stateName = (suffix) => 'state'+(suffix?suffix:"")

export const get = (suffix) => JSON.parse(localStorage.getItem(stateName(suffix))) || undefined;

export function set (state, props, suffix) {
  let toSave = {}
  props.forEach(p => toSave[p] = state[p])
  localStorage.setItem(stateName(suffix), JSON.stringify(toSave))
}

