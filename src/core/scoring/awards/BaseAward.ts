import { genericObjectIF } from "../../../interfaces";

export abstract class BaseAward {
  public abstract calculateScore(currentScore: number, scoringData: genericObjectIF): number
}