import UpdateAvatarUserService from "@modules/users/services/UpdateAvatarUserService";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarUserService = container.resolve(UpdateAvatarUserService);

    const user = await updateAvatarUserService.execute({
      user_id: request.user.id,
      filename: request.file ? request.file.filename : "",
    });

    return response.json(user);
  }
}
