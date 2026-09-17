import { getMe, updateMe } from "./userController.js";

export { getMe, updateMe as syncUser };
export default { getMe, syncUser: updateMe };
