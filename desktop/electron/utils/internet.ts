import dns from "dns";

/**
 * https://stackoverflow.com/questions/15270902/check-for-internet-connectivity-in-nodejs
 */

export async function checkAccessToInternet(domainToCheckAccess = "www.google.com") {
  return new Promise<boolean>((resolve) => {
    dns.resolve(domainToCheckAccess, (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
