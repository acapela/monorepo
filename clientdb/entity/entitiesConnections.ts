import { EntityClient } from "./client";
import { DbContext } from "./context";
import { EntityDefinition } from "./definition";

export interface DatabaseUtilities {
  getEntity<Data, Connections>(definition: EntityDefinition<Data, Connections>): EntityClient<Data, Connections>;
  getContextValue<D>(context: DbContext<D>): D;
}
