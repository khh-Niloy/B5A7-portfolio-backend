import { User } from "../modules/auth/user.model";
import { envVars } from "../config/envVars";
import { jwtServices } from "./jwt";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

    if (isAdminExist) {
      console.log("admin already exist")
      return;
    }

    const adminInfo = {
      email: envVars.SUPER_ADMIN_EMAIL,
      password: (await jwtServices.generateHashedPass(
        envVars.SUPER_ADMIN_PASSWORD
      )) as string,
    };

    const createAdmin = await User.create(adminInfo);

    console.log(createAdmin);
  } catch (error) {
    console.log(error);
  }
};
