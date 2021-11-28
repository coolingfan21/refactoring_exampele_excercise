export const statement = (invoice: IInvoice, plays: IPlays): string => {
  const statementData: any = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)

  function enrichPerformance (performance): any {
    const result = Object.assign({}, performance)
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }
  function playFor (performance): IPlayType {
    return plays[performance.playID]
  }
  function amountFor (performance): number {
    let result = 0

    switch (performance.play.type) {
    case 'tragedy':
      result = 40000
      if (performance.audience > 30) {
        result += 1000 * (performance.audience - 30)
      }
      break
    case 'comedy':
      result = 30000
      if (performance.audience > 20) {
        result += 10000 + 500 * (performance.audience - 20)
      }
      result += 300 * performance.audience
      break
    default:
      throw new Error(`알 수 없는 장르: ${performance.play.type}`)
    }

    return result
  }
  function volumeCreditsFor (perf): number {
    let result = 0
    result += Math.max(perf.audience - 30, 0)
    if (perf.play.type === 'comedy') result += Math.floor(perf.audience / 5)
    return result
  }
  function totalAmount (data): number {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }
  function totalVolumeCredits (data): number {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }
  return renderPlainText(statementData)
}

function renderPlainText (data): string {
  let result = `청구 내역 (고객명: ${data.customer})\n`
  for (const perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`
  }
  result += `총액: ${usd(data.totalAmount)}\n`
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`
  return result
  function usd (number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(number / 100)
  }
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
