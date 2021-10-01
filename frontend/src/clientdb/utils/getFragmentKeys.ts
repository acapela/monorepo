import { DocumentNode } from "graphql";

import { assert } from "~shared/assert";

export function getFragmentKeys<FragmentType = Record<string, unknown>>(
  fragment: DocumentNode
): Array<keyof FragmentType> {
  assert(fragment.definitions.length === 1, "There can only be one definition of fragment");

  const [fragmentNode] = fragment.definitions;

  assert(fragmentNode.kind === "FragmentDefinition", "Provided node does not include fragment");

  const fragmentFields = fragmentNode.selectionSet.selections;

  const fragmentKeysList: Array<keyof FragmentType> = [];

  for (const fragmentField of fragmentFields) {
    // TODO: Add ...FragmentSpread support that would read fields from referenced fragment as well.
    assert(fragmentField.kind === "Field", "Only inline fields are supported. No ...FragmentSpreads are allowed");

    // Add support for field alias eg fragment Foo on bar { superUser: user } <-- in this case 'name' is 'user' and alias is 'superUser'.
    // Let's use alias first
    const fieldName = fragmentField.alias?.value ?? fragmentField.name.value;

    fragmentKeysList.push(fieldName as keyof FragmentType);
  }

  return fragmentKeysList;
}
