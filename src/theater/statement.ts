export const statement = (invoice: IInvoice, plays: IPlays): string => {
  return renderPlainText(invoice, plays)
}

function renderPlainText (invoice, plays): string {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`
  for (const perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`
  }
  result += `총액: ${usd(totalAmount())}\n`
  result += `적립 포인트: ${totalVolumeCredits()}점\n`
  return result

  function totalAmount (): number {
    let result = 0
    for (const perf of invoice.performances) {
      result += amountFor(perf)
    }
    return result
  }
  function totalVolumeCredits (): number {
    let result = 0
    for (const perf of invoice.performances) {
      result += volumeCreditsFor(perf)
    }
    return result
  }
  function usd (number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(number / 100)
  }
  function volumeCreditsFor (perf): number {
    let result = 0
    result += Math.max(perf.audience - 30, 0)
    if (playFor(perf).type === 'comedy') result += Math.floor(perf.audience / 5)
    return result
  }
  function playFor (performance): IPlayType {
    return plays[performance.playID]
  }
  function amountFor (performance): number {
    let result = 0
    const play = playFor(performance)

    switch (play.type) {
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
      throw new Error(`알 수 없는 장르: ${play.type}`)
    }

    return result
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
