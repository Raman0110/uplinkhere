import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";


export class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async findOrCreateByClerkId(clerkId: string, email: string) {
    let user = await this.userRepo.findOne({ where: { clerkId } });

    if (!user) {
      user = this.userRepo.create({ clerkId, email });
      await this.userRepo.save(user);
    }

    return user;
  }

  async getUserByClerkId(clerkId: string) {
    return await this.userRepo.findOne({ where: { clerkId } });
  }
}

