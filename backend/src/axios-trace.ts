import axios from "axios";
import axiosBetterStacktrace from "axios-better-stacktrace";

// Axios stack traces do not include originating source location, so we use this library to add them
axiosBetterStacktrace(axios);
