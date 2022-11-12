import { scoringDataIF } from "../../../interfaces";

export abstract class BaseAward {
  public abstract calculateScore(currentScore: number, scoringData: scoringDataIF): number
}