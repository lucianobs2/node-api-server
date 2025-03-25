import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

@Injectable()
export class ValidateBankAccountOwnershipService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async validate(userId: string, categoryId: string) {
    const isOwner = await this.bankAccountRepository.findFirst({
      where: { id: categoryId, userId },
    });

    if (!isOwner) {
      throw new NotFoundException('Bank account not found.');
    }
  }
}
