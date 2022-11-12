import { scoringDataIF } from "../../../interfaces";
import { BaseAward } from "./BaseAward";

export class HarddropAward extends BaseAward {
  public calculateScore(currentScore: number, scoringData: scoringDataIF): number {
    const { linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }
}