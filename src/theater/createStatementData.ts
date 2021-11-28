export const createStatementData: any = (invoice, plays) => {
  const result: any = {}
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)

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
  return result
}

interface IPlayType {
  name: string
  type: string
}
