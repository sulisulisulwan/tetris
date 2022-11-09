import { scoringDataIF } from "../../../interfaces";

export abstract class Award {
  public abstract calculateScore(currentScore: number, scoringData: scoringDataIF): number
}