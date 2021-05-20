export function slugify(text: string) {
  const from = "ąàáäâèęéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;";
  const __to = "aaaaaeeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------";
  const specialCharsRegexp = new RegExp(from.split("").join("|"), "g");

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(specialCharsRegexp, (char) => __to.charAt(from.indexOf(char))) // Replace special chars
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
