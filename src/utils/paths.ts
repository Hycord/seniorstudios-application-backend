import "module-alias/register";
import { addAliases } from "module-alias";

addAliases({
  "~controllers": `${__dirname}/../controllers`,
  "~schemas": `${__dirname}/../schemas`,
  "~middleware": `${__dirname}/../middleware`,
  "~routes": `${__dirname}/../routes`,
  "~services": `${__dirname}/../services`,
  "~utils": `${__dirname}/../utils`,
});
