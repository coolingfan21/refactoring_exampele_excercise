export const statement = (invoice: IInvoice, plays: IPlays): string => {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `청구 내역 (고객명: ${invoice.customer})\n`
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format

  const amountFor = (perf, play): number => {
    let thisAmount = 0

    switch (play.type) {
    case 'tragedy':
      thisAmount = 40000
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30)
      }
      break
    case 'comedy':
      thisAmount = 30000
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20)
      }
      thisAmount += 300 * perf.audience
      break
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`)
    }

    return thisAmount
  }

  for (const perf of invoice.performances) {
    const play = plays[perf.playID]
    const thisAmount = amountFor(perf, play)

    volumeCredits += Math.max(perf.audience - 30, 0)
    if (play.type === 'comedy') volumeCredits += Math.floor(perf.audience / 5)

    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`
    totalAmount += thisAmount
  }
  result += `총액: ${format(totalAmount / 100)}\n`
  result += `적립 포인트: ${volumeCredits}점\n`
  return result
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
