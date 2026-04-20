import Barba from '@barba/core'
import { BarbaView } from '/core/Barba'

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

export default new BarbaView('index', {
  beforeEnter: function ({ next }) {},

  afterEnter: function ({ next }) {
    const headers = Array.from(next.container.querySelectorAll('table thead td span'))
    const rows = Array.from(next.container.querySelectorAll('table tbody tr'))

    for (const row of rows) {
      const href = row.dataset.href
      if (href) row.addEventListener('click', () => Barba.go(href))
    }

    for (const header of headers) {
      const index = headers.indexOf(header)

      header.addEventListener('click', () => {
        // Update headers
        for (const h of headers) if (h !== header) delete h.parentNode.dataset.sort
        header.parentNode.dataset.sort = header.parentNode.dataset.sort === 'ASC' ? 'DESC' : 'ASC'

        // Sort rows
        const sorted = rows.sort((a, b) => {
          const val = el => {
            const cell = el.querySelector(`td:nth-child(${index + 1})`)
            return cell && (
              cell.dataset['value' + capitalize(header.parentNode.dataset.sort)] ??
              cell.dataset.value ??
              cell.textContent
            ).toLowerCase()
          }

          return header.parentNode.dataset.sort === 'ASC'
            ? val(a).localeCompare(val(b), undefined, { numeric: true })
            : val(b).localeCompare(val(a), undefined, { numeric: true })
        })

        // Update order
        for (const row of sorted) row.parentNode.append(row)
      })
    }
  },

  beforeLeave: function () {},
  afterLeave: function () {}
})
