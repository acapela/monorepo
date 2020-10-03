jest.mock("firebase-admin", () => {
  class FakeFirebase {
    public readonly credential: FakeFirebaseCredential;
    public savedSettings: Record<string, unknown> | undefined;
    private readonly fakeAuth: FakeFirebaseAuth;

    constructor() {
      this.credential = new FakeFirebaseCredential();
      this.fakeAuth = new FakeFirebaseAuth();
    }

    auth() {
      return this.fakeAuth;
    }

    initializeApp(settings: Record<string, unknown>) {
      this.savedSettings = settings;
    }
  }

  class FakeFirebaseCredential {
    applicationDefault() {
      return "fake-credentials";
    }
  }

  class FakeFirebaseAuth {
    private readonly claims: Map<string, Record<string, unknown>>;
    private readonly userTokens: Map<string, string[]>;

    constructor() {
      this.claims = new Map();
      this.userTokens = new Map();
    }

    // mocks
    async setCustomUserClaims(uid: string, claims: Record<string, unknown>) {
      const existingClaims = this.claims.get(uid) || {};
      Object.assign(existingClaims, claims);
      this.claims.set(uid, existingClaims);
    }

    async verifyIdToken(token: string) {
      const [user] = Array.from(this.userTokens.entries()).find((entry) => entry[1].includes(token)) || [];
      if (!user) {
        throw new Error("invalid test token");
      }
      const claims = this.claims.get(user);
      if (!claims) {
        throw new Error("invalid test token");
      }
      return claims;
    }

    // test support methods
    addFakeUserToken(uid: string, token: string) {
      const existingTokens = this.userTokens.get("uid") || [];
      existingTokens.push(token);
      this.userTokens.set(uid, existingTokens);
      return this;
    }

    setFakeUserClaims(uid: string, claims: Record<string, unknown>) {
      this.claims.set(uid, claims);
      return this;
    }

    getFakeUserClaims(uid: string): Record<string, unknown> | undefined {
      return this.claims.get(uid);
    }
  }

  return new FakeFirebase();
});
