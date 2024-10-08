export const control = (command: any, data?: any) => {
  window.dispatchEvent(
    new CustomEvent("reader-control", { detail: {
      command: command,
      data: data
    }})
  )
}