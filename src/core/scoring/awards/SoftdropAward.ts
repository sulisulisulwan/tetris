import { scoringDataIF } from "../../../interfaces";

export class SoftdropAward {
  public calculateScore(currentScore: number, scoringData: scoringDataIF): number {
    return currentScore + 1
  }
}