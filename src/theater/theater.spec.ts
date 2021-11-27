import { invoices } from './invoices'
import { statement } from './statement'

const plays = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  as_like: { name: 'As You Like It', type: 'comedy' },
  othello: { name: 'Othello', type: 'tragedy' },
}

const result = `청구 내역 (고객명: BigCo)
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
`

describe('Statement', () => {
  const targetInvoice = invoices[0]

  it('should be same invoice content & format', () => {
    expect(statement(targetInvoice, plays)).toBe(result)
  })
})
