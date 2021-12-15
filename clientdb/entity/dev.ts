import { spy } from "mobx";

spy((event) => {
  const { type } = event;

  // console.log(type);
});
