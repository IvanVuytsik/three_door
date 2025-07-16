import { GUI } from 'lil-gui'

export function createGUI(params: any, onChange: () => void): GUI {
  const gui = new GUI()
  gui.add(params, 'width', 0.5, 2).onChange(onChange)
  gui.add(params, 'height', 1, 4).onChange(onChange)
  return gui
}
