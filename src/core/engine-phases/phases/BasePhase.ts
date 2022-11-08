import { SharedScope } from "../../SharedScope.js"
import { sharedHandlersIF } from "../interfaces/SharedHandlers.js"

export default abstract class BasePhase extends SharedScope {
  
  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  public abstract execute(): void

}