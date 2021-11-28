import { invoices } from './invoices'
import { htmlStatement, statement } from './statement';

const plays = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  as_like: { name: 'As You Like It', type: 'comedy' },
  othello: { name: 'Othello', type: 'tragedy' },
}

const textResult = `청구 내역 (고객명: BigCo)
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
`

const htmlResult = `<h1>청구 내역 (고객명: BigCo)</h1>
<table>
<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr> <tr><td>Hamlet</td><td>(55석)</td><td>$650.00</td>
 <tr><td>As You Like It</td><td>(35석)</td><td>$580.00</td>
 <tr><td>Othello</td><td>(40석)</td><td>$500.00</td>
</table>
<p>총액: <em>$1,730.00</em></p>
<p>적립 포인트: <em>47</em>점</p>
`

describe('Statement', () => {
  const targetInvoice = invoices[0]

  it('Plant Text : should be same invoice content & format', () => {
    expect(statement(targetInvoice, plays)).toBe(textResult)
  })

  it('HTML : should be same invoice content & format', () => {
    expect(htmlStatement(targetInvoice, plays)).toBe(htmlResult)
  })
})
