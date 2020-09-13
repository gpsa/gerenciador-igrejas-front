export default {
  pageTitle: state => state.pageTitle,
  parseDate: (state) => (date) => {
    if (!date || date.length === 0) {
      return null
    }

    const [day, month, year] = date.substring(0, 10).split(date.indexOf('-') >= 0 ? '-' : '/')

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  },
  formatDate: (state) => (date) => {
    if (!date) {
      return null
    }

    const [year, month, day] = date.substring(0, 10).split(date.indexOf('-') >= 0 ? '-' : '/')

    let newDate = `${day}/${month}/${year}`

    return newDate.length === 10 ? newDate : null
  },
  parseNumber: (state) => (number) => {
    if (!number) {
      return null
    }

    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(number)
  },
  formatNumber: (state) => (number) => {
    if (!number) {
      return null
    } else if (!isNaN(parseFloat(number))) {
      return number
    }

    return number.replace(/[^0-9,]/g, '').replace(',', '.')
  }
}
