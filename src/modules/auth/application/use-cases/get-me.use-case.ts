import { UserNotFoundError } from '@modules/users/domain/entities/user';
import type { IUserRepository } from '@modules/users/domain/repositories/user';
import type { IGetMeApplicationInput } from '../dtos/i-get-me-input.dto';
import type { IGetMeApplicationOutput } from '../dtos/i-get-me-output.dto';

export class GetMeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: IGetMeApplicationInput): Promise<IGetMeApplicationOutput> {
    const user = await this.userRepository.findPublicById(input.userId);
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }
    return user;
  }
}
