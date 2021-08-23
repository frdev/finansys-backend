import { injectable, inject } from "tsyringe";
import IEntriesRepository from "../repositories/IEntriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import AppError from "@shared/errors/AppError";

interface IRequest {
  entry_id: string;
  user_id: string;
}

@injectable()
class DeleteEntryService {
  constructor(
    @inject("EntriesRepository")
    private entriesRepository: IEntriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id, entry_id }: IRequest): Promise<void> {
    const entry = await this.entriesRepository.findById(entry_id);

    if (!entry || entry.user_id !== user_id)
      throw new AppError("Categoria inexistente.", 400);

    await this.entriesRepository.delete(entry_id);

    const year = new Date(entry.date).getFullYear();
    const month = new Date(entry.date).getMonth();

    await this.cacheProvider.invalidate(
      `list-entries:${user_id}:${year}-${month}`
    );
  }
}

export default DeleteEntryService;
