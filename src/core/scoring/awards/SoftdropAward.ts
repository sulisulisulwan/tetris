import { genericObjectIF } from "../../../interfaces";

export class SoftdropAward {
  public calculateScore(currentScore: number, scoringData: genericObjectIF): number {
    return currentScore + 1
  }
}