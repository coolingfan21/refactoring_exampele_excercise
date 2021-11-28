export const createStatementData: any = (invoice, plays) => {
  const result: any = {}
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)

  function enrichPerformance (performance): any {
    const calculator = new PerformanceCalculator(performance, playFor(performance))
    const result = Object.assign({}, performance)
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }
  function playFor (performance): IPlayType {
    return plays[performance.playID]
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

class PerformanceCalculator {
  performance: any
  play: any
  constructor (performance, play) {
    this.performance = performance
    this.play = play
  }

  get amount (): number {
    let result = 0

    switch (this.play.type) {
    case 'tragedy':
      result = 40000
      if (this.performance.audience > 30) {
        result += 1000 * (this.performance.audience - 30)
      }
      break
    case 'comedy':
      result = 30000
      if (this.performance.audience > 20) {
        result += 10000 + 500 * (this.performance.audience - 20)
      }
      result += 300 * this.performance.audience
      break
    default:
      throw new Error(`알 수 없는 장르: ${this.play.type}`)
    }
    return result
  }
}

interface IPlayType {
  name: string
  type: string
}
