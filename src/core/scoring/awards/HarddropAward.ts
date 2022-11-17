import { genericObjectIF } from "../../../interfaces";
import { BaseAward } from "./BaseAward";

export class HarddropAward extends BaseAward {
  public calculateScore(currentScore: number, scoringData: genericObjectIF): number {
    const { linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }
}