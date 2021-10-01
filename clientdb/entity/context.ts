export interface DbContextInstance<T> {
  value: T;
  context: DbContext<T>;
}

export interface DbContext<T> {
  create(value: T): DbContextInstance<T>;
}

export function createDbContext<T>(): DbContext<T> {
  const dbContext: DbContext<T> = {
    create(value) {
      return { value, context: dbContext };
    },
  };

  return dbContext;
}
