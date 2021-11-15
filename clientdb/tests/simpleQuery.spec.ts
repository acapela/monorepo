import { createTestDb } from "./utils";

describe("clientdb query", () => {
  async function getTestDb() {
    const db = await createTestDb();

    const adam = db.owner.create({ name: "Adam" });
    const omar = db.owner.create({ name: "Omar" });

    const adams_rex = db.dog.create({ name: "rex", owner_id: adam.id });
    const adams_teddy = db.dog.create({ name: "teddy", owner_id: adam.id });

    const omars_rudy = db.dog.create({ name: "rudy", owner_id: omar.id });
    const omars_rex = db.dog.create({ name: "rex", owner_id: omar.id });

    return [db, { owners: { adam, omar }, dogs: { adams_rex, adams_teddy, omars_rudy, omars_rex } }] as const;
  }

  it("performs simple query", async () => {
    const [db, data] = await getTestDb();

    const query = db.owner.query({ name: "Adam" });

    expect(query.all.length).toBe(1);
    expect(query.all[0]).toBe(data.owners.adam);

    db.destroy();
  });

  it("narrows down simple query", async () => {
    const [db, data] = await getTestDb();

    const adamsRex = db.dog.query({ owner_id: data.owners.adam.id }).query({ name: "rex" });
    const allRex = db.dog.query({ name: "rex" }).query({ name: "rex" });

    expect(adamsRex.all.length).toBe(1);
    expect(allRex.all.length).toBe(2);
    expect(adamsRex.all[0]).toBe(data.dogs.adams_rex);

    db.destroy();
  });
});
