import { createStatementData } from './createStatementData'

export const statement = (invoice: IInvoice, plays: IPlays): string => {
  return renderPlainText(createStatementData(invoice, plays))
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
