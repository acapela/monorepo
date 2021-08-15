import { EntityClient } from "./client";
import { EntityDefinition } from "./definition";

export interface EntitiesConnectionsConfig {
  getEntityClientByDefinition<Data, Connections>(
    definition: EntityDefinition<Data, Connections>
  ): EntityClient<Data, Connections>;
}
