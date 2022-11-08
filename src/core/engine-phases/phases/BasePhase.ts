import { SharedScope } from "../../SharedScope.js"
import { sharedHandlersIF } from "../../../interfaces/index.js"

export default abstract class BasePhase extends SharedScope {
  
  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  public abstract execute(): void

}