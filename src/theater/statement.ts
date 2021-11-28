import { createStatementData } from './createStatementData'

export const statement = (invoice: IInvoice, plays: IPlays): string => {
  return renderPlainText(createStatementData(invoice, plays))
}

export const htmlStatement = (invoice: IInvoice, plays: IPlays): string => {
  return renderHtml(createStatementData(invoice, plays))
}

function renderPlainText (data): string {
  let result = `청구 내역 (고객명: ${data.customer})\n`
  for (const perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`
  }
  result += `총액: ${usd(data.totalAmount)}\n`
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`
  return result
}

function renderHtml (data): string {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`
  result += '<table>\n'
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>'
  for (const perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`
    result += `<td>${usd(perf.amount)}</td>\n`
  }
  result += '</table>\n'
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`
  return result
}

function usd (number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(number / 100)
}

interface IInvoice {
  customer: string
  performances: IPerformance[]
}

interface IPerformance {
  playID: string
  audience: number
}

interface IPlays {
  hamlet: IPlayType
  as_like: IPlayType
  othello: IPlayType
}

interface IPlayType {
  name: string
  type: string
}
