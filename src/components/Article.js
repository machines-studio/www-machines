export const selector = 'article.article'

export function hydrate (element) {
  // Move cards into the previous block so that they can be positioned
  for (const card of element.querySelectorAll('.card')) {
    const container = card.previousElementSibling ?? card.parentNode.previousElementSibling
    container.appendChild(card)
  }
}
