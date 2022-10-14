export default class BasePhase {
  
  constructor() {

    this.status = 'off'
  }

  setStatus(status) {
    const validateStatus = {
      off: true,
      inProgress: true
    }

    if (!validateStatus[status]) {
      throw new Error('Invalid status assigned to Phase class')
    }
    this.status = status
  
  }


  
}